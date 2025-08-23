import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthDto } from './auth.dto';
import mockUser from 'src/lib/mocks/user-mock';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/entities/user.entity';
import { TokenPairType } from 'src/tokens/@types/tokens-type';
import { APP_GUARD } from '@nestjs/core';
import { MockAuthGuard } from 'src/lib/mocks/auth-guard-mock';
import { UsersService } from 'src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'src/lib/mocks/repository-mock-factory';
import { TokensService } from 'src/tokens/tokens.service';
import { Token } from 'src/entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

const validAuthDto: AuthDto = { pin: mockUser.pin }

const mockResponse = (): any => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
}

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
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
            ],
            providers: [
                AuthService,
                UsersService,
                TokensService,                
                {
                    provide: APP_GUARD,
                    useClass: MockAuthGuard
                },
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory
                },
                {
                    provide: getRepositoryToken(Token),
                    useFactory: repositoryMockFactory
                }             
            ]
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('authentication fails', async() => {
        
        jest.spyOn(authService, "signIn").mockResolvedValueOnce(null)

        const result = await controller.login(validAuthDto, mockResponse())        

        expect(result.error).toContain("Codice PIN non valido")

    })

    it('login returns tokens', async() => {
        
        const tokens: TokenPairType = { access_token: "accesstoken", refresh_token: "refreshtoken" }

        jest.spyOn(authService, "signIn").mockResolvedValueOnce(tokens)

        const response = mockResponse()

        const result = await controller.login(validAuthDto, response) 
        
        expect(result.success).toBe(true)
        expect(result.data).toMatchObject(tokens)       

    })

    it('should logout', async() => {

        jest.spyOn(usersService, "getUser").mockResolvedValueOnce(mockUser)
        jest.spyOn(authService, "signOut").mockResolvedValueOnce()

        const result = await controller.logout()
        expect(result.success).toBe(true)

    })

    it('get new token pair', async() => {        

        const tokenPair: TokenPairType = { access_token: "newaccesstoken", refresh_token: "newrefreshtoken" }
        
        jest.spyOn(usersService, "getUser").mockResolvedValueOnce(mockUser)
        jest.spyOn(authService, "getNewTokens").mockResolvedValueOnce(tokenPair)

        const result = await controller.tokens()

        expect(result.success).toBe(true)
        expect(result.data).toMatchObject(tokenPair)

    })

    it('issuing new tokens fails', async() => {             

        jest.spyOn(usersService, "getUser").mockResolvedValueOnce(mockUser)
        jest.spyOn(authService, "getNewTokens").mockResolvedValueOnce(null)

        const result = await controller.tokens()

        expect(result.success).toBe(false)
        expect(result.error).toContain("Errore server")

    })

});
