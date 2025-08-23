import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { repositoryMockFactory } from 'src/lib/mocks/repository-mock-factory';
import { ConfigModule } from '@nestjs/config';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { Repository, UpdateResult } from 'typeorm';
import mockUser from 'src/lib/mocks/user-mock';

describe('UsersService', () => {
    let service: UsersService;
    let repository: Repository<User>;    

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory
                }
            ],
            imports: [
                ConfigModule.forRoot(
                    {
                        envFilePath: "env.test.local"
                    }
                ),
            ]
        }).compile();

        service = module.get<UsersService>(UsersService)
        repository = module.get(getRepositoryToken(User))
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should getUser return null', async() => {
        expect(await service.getUser()).toBeNull()
    })

    it('should getUserByEmail return null', async() => {
        jest.spyOn(repository, "findOne").mockResolvedValueOnce(null)
        const user = await service.getUserByEmail("test@inv.inv")        
        expect(user).toBeNull()
    })

    it('create a new user', async() => {
        const dtoUser: CreateUserDto = {
            first_name: mockUser.firstName,
            last_name: mockUser.lastName,
            email: mockUser.email,
            pin: mockUser.pin,
            vat_number: mockUser.vatNumber
        }

        jest.spyOn(repository, "create").mockReturnValueOnce(mockUser)
        const user: User = await service.create(dtoUser)        

        expect(user.firstName).toBe(mockUser.firstName)
        expect(user.address).toBeNull()
    })

    it('update user', async() => {

        mockUser.vatNumber = "223344556677"

        const dtoUser: UpdateUserDto = {
            id: mockUser.id,
            first_name: mockUser.firstName,
            last_name: mockUser.lastName,
            email: mockUser.email,            
            vat_number: mockUser.vatNumber
        }

        jest.spyOn(repository, "update").mockResolvedValueOnce({raw: "", affected: 1, generatedMaps: [] })
        const result: UpdateResult = await service.update(dtoUser)
        
        expect(result.affected).toBe(1)        
    })

    it('should set a new pin', async() => {

        jest.spyOn(repository, "update").mockResolvedValueOnce({raw: "", affected: 1, generatedMaps: [] })
        const result: UpdateResult = await service.setNewPin({id: mockUser.id, pin: "222333"})

        expect(result.affected).toBe(1)

    })

});
