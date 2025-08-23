import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { repositoryMockFactory } from 'src/lib/mocks/repository-mock-factory';
import { APP_GUARD } from '@nestjs/core';
import { MockAuthGuard } from 'src/lib/mocks/auth-guard-mock';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ApiResponseDataType, ApiResponseType } from 'src/@types/api-response-type';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import mockUser from 'src/lib/mocks/user-mock';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    let dtoUserCreate: CreateUserDto = {            
            first_name: mockUser.firstName,
            last_name: mockUser.lastName,
            email: mockUser.email,      
            pin: mockUser.pin,      
            vat_number: mockUser.vatNumber
        }

    let dtoUserUpdate: UpdateUserDto = {
        id: mockUser.id,
        first_name: mockUser.firstName,
        last_name: mockUser.lastName,
        email: mockUser.email,
        vat_number: mockUser.vatNumber
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory
                },
                {
                    provide: APP_GUARD,
                    useClass: MockAuthGuard
                }
            ],
            imports: [
                ConfigModule.forRoot({
                    envFilePath: ".env.test.local"
                }),
                JwtModule.register({
                    global: true,
                    secret: process.env.JWT_SECRET
                })
            ]
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should get user', async () => {

        jest.spyOn(service, "getUser").mockResolvedValueOnce(mockUser)
        const response: ApiResponseDataType = await controller.getUser()

        expect(response.success).toBe(true)
    })

    it('should show an error when getting user', async () => {

        jest.spyOn(service, "getUser").mockResolvedValueOnce(new Promise((resolve) => { throw new Error }))
        const response: ApiResponseDataType = await controller.getUser()

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")        
    })

    it('should create a new user', async () => {

        jest.spyOn(service, "create").mockResolvedValueOnce(mockUser)
        const response: ApiResponseType = await controller.createUser(dtoUserCreate)

        expect(response.success).toBe(true)
    })

    it('should show error when creating new user', async () => {

        jest.spyOn(service, "create").mockResolvedValueOnce(new Promise((resolve) => { throw new Error }))
        const response: ApiResponseType = await controller.createUser(dtoUserCreate)

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")
    })

    it('should update user', async () => {

        jest.spyOn(service, "update").mockResolvedValueOnce({ raw: "", affected: 1, generatedMaps: [] })
        const response: ApiResponseType = await controller.updateUser(dtoUserUpdate)

        expect(response.success).toBe(true)        
    })

    it('should show error when updating user', async () => {

        jest.spyOn(service, "update").mockResolvedValueOnce(new Promise((resolve) => { throw new Error }))
        const response: ApiResponseType = await controller.updateUser(dtoUserUpdate)

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")
    })

    it('should change pin', async () => {

        jest.spyOn(service, "setNewPin").mockResolvedValueOnce({ raw: "", affected: 1, generatedMaps: [] })
        const response: ApiResponseType = await controller.changePin({ id: 0, pin: "" })

        expect(response.success).toBe(true)
    })

    it('should show error when changing pin', async () => {

        jest.spyOn(service, "setNewPin").mockResolvedValueOnce(new Promise((resolve) => { throw new Error }))
        const response: ApiResponseType = await controller.changePin({ id: 0, pin: "" })

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")

    })
});
