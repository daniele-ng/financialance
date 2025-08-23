import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { TokensService } from 'src/tokens/tokens.service';
import { AuthDto } from './auth.dto';
import mockUser from 'src/lib/mocks/user-mock';
import { TokenPairType } from 'src/tokens/@types/tokens-type';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Token } from 'src/entities/token.entity';
import { repositoryMockFactory } from 'src/lib/mocks/repository-mock-factory';
import { JwtModule } from '@nestjs/jwt';

// Mock bcrypt compare in the module CheckPassword of the library check-password
jest.mock('bcrypt', () => ({
    compare: jest.fn()
}));

describe('AuthService', () => {

    let service: AuthService
    let usersService: UsersService
    let tokensService: TokensService    

    const validAuthDto: AuthDto = { pin: mockUser.pin }    
    const invalidAuthDto: AuthDto = { pin: "345679" }

    const accessToken = "accesstoken"
    const refreshToken = "refreshtoken"    
    const tokens: TokenPairType = { access_token: accessToken, refresh_token: refreshToken }        

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({

            providers: [
                AuthService, 
                UsersService, 
                TokensService,                
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory
                },
                {
                    provide: getRepositoryToken(Token),
                    useFactory: repositoryMockFactory
                }
            ],
            imports: [
                ConfigModule.forRoot(
                    {
                        envFilePath: "env.test.local"
                    }
                ),
                JwtModule.register({
                    global: true,
                    secret: process.env.JWT_SECRET
                })            
            ]

        }).compile()

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        tokensService = module.get<TokensService>(TokensService);        
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should authenticate a user', async() => {

        jest.spyOn(usersService, "getUser").mockResolvedValue(new Promise( (resolve) => resolve(mockUser) ))
        jest.spyOn(service, "getNewTokens").mockResolvedValueOnce(tokens)        

        const bcrypt = require('bcrypt')
        bcrypt.compare.mockResolvedValue(true)

        expect(await service.signIn(validAuthDto)).toMatchObject(tokens)        

    })

    it('signIn fails due to wrong pin', async() => {

        jest.spyOn(usersService, "getUserByEmail").mockResolvedValue(new Promise( (resolve) => resolve(mockUser) ))
        //jest.spyOn(service, "getNewTokens").mockResolvedValueOnce(tokens)
        
        const bcrypt = require('bcrypt')
        bcrypt.compare.mockResolvedValue(false)
        
        expect(await service.signIn(invalidAuthDto)).toBeNull()

    })

    it('should return a new token pair', async() => {

        jest.spyOn(tokensService, "create").mockResolvedValueOnce(accessToken)
        jest.spyOn(tokensService, "create").mockResolvedValueOnce(refreshToken)
        jest.spyOn(tokensService, "save")

        expect(await service.getNewTokens(mockUser)).toMatchObject(tokens)

    })

});
