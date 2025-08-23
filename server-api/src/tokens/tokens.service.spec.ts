import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenPairType, TokenPayloadType } from './@types/tokens-type';
import mockUser from 'src/lib/mocks/user-mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'src/lib/mocks/repository-mock-factory';
import { ConfigModule } from '@nestjs/config';
import { Token } from 'src/entities/token.entity';

describe('TokensService', () => {

    // services used in the tests
    let service: TokensService;
    let jwtService: JwtService;

    // payload for tokens
    const payloadAccessToken: TokenPayloadType = { sub: mockUser.id.toString(), scope: "access" }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TokensService,
                {
                    provide: getRepositoryToken(Token),
                    useFactory: repositoryMockFactory
                }
            ],
            imports: [
                ConfigModule.forRoot(
                    {
                        envFilePath: ".env.test.local"
                    }                    
                ),
                JwtModule.register({
                    global: true,
                    secret: process.env.JWT_SECRET
                })
            ]
        }).compile();

        service = module.get<TokensService>(TokensService);
        jwtService = module.get<JwtService>(JwtService);

    });

    it('should be defined', () => {        
        expect(service).toBeDefined();
    });

    it('should create a signed token, save it and the validation return true', async() => {

        const token: string = await service.create(payloadAccessToken, "1m")
        expect(typeof token).toBe("string")

        const tokenEntity: Token = await service.save({ token: token, scope: payloadAccessToken.scope, user: mockUser })
        expect(tokenEntity.token).toBe(token)        
        expect(tokenEntity.scope).toBe(payloadAccessToken.scope)
        expect(tokenEntity.user).toMatchObject(mockUser)

        const verify: boolean = await service.verify(token)
        expect(typeof verify).toBe("boolean")

    })

    it('should return payload', async() => {

        const token: string = await service.create(payloadAccessToken, "1m")
        const payload: TokenPayloadType | null = await service.getPayload(token)

        expect(payload?.scope).toBe("access")

    })

    it('should fail verification because token is invalid', async () => {

        const token = "myfaketoken"
        const result: boolean = await service.verify(token)

        expect(result).toBe(false)

        // The token is a valid JWT token but it doesn't exist on the database
        const token1: string = await service.create(payloadAccessToken, "1m")
        const result1: boolean = await service.verify(token1)

        expect(result1).toBe(false)

    })
    
    it('should fail verification because token is expired', async () => {

        // The token is a valid JWT token but it doesn't exist on the database
        const token1: string = await service.create(payloadAccessToken, "0")

        const result1: boolean = await service.verify(token1)

        expect(result1).toBe(false)

    })

    it('should issue new tokens', async() => {

        const access_token = "accesstoken"
        const refresh_token = "refreshtoken"

        jest.spyOn(service, "create").mockReturnValueOnce(new Promise((resolve) => { resolve(access_token) }))
        jest.spyOn(service, "create").mockReturnValueOnce(new Promise((resolve) => { resolve(refresh_token) }))

        const result: TokenPairType = await service.refresh(mockUser)
        expect(result).toMatchObject({ access_token: access_token, refresh_token: refresh_token })

    })

});
