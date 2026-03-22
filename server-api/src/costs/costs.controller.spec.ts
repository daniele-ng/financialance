import { Test, TestingModule } from "@nestjs/testing";
import { CostsController } from "./costs.controller"
import { CostsService } from "./costs.service";
import { UsersService } from "src/users/users.service";
import { TokensService } from "src/tokens/tokens.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Cost } from "src/entities/cost.entity";
import { repositoryMockFactory } from "src/lib/mocks/repository-mock-factory";
import { User } from "src/entities/user.entity";
import { Token } from "src/entities/token.entity";
import { APP_GUARD } from "@nestjs/core";
import { MockAuthGuard } from "src/lib/mocks/auth-guard-mock";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { mockCost, mockCreateCostDto, mockUpdateCostDto } from "src/lib/mocks/cost-mock";
import { ApiResponseDataType, ApiResponseType } from "src/@types/api-response-type";

describe('CostController', () => {
    let controller: CostsController;
    let service: CostsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CostsController],
            providers: [
                CostsService, UsersService, TokensService,
                {
                    provide: getRepositoryToken(Cost),
                    useFactory: repositoryMockFactory
                },
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory
                },
                {
                    provide: getRepositoryToken(Token),
                    useFactory: repositoryMockFactory
                },
                {
                    provide: APP_GUARD,
                    useClass: MockAuthGuard
                },
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
        }).compile()

        controller = module.get<CostsController>(CostsController)
        service = module.get<CostsService>(CostsService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined();
    })

    it('should get a list of costs', async () => {
    
        jest.spyOn(service, "getCosts").mockResolvedValueOnce([mockCost])
        const response: ApiResponseDataType = await controller.getCosts()

        expect(response.success).toBe(true)
        expect(response.data).toMatchObject([mockCost])

    })

    it('should show an error when getting items', async () => {

        jest.spyOn(service, "getCosts").mockResolvedValueOnce(new Promise(() => { throw Error }))
        const response: ApiResponseDataType = await controller.getCosts()

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")

    })

    it('should add a new item', async () => {

        jest.spyOn(service, "create").mockResolvedValueOnce(mockCost)
        const response: ApiResponseType = await controller.createCost(mockCreateCostDto)

        expect(response.success).toBe(true)

    })

    it('should show an error when adding a new item', async () => {

        jest.spyOn(service, "create").mockResolvedValueOnce(new Promise(() => { throw Error }))
        const response: ApiResponseType = await controller.createCost(mockCreateCostDto)

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")

    })

    it('should update data', async () => {

        jest.spyOn(service, "update").mockResolvedValueOnce({ raw: "", affected: 1, generatedMaps: [] })
        const response: ApiResponseType = await controller.updateCost(mockUpdateCostDto)

        expect(response.success).toBe(true)

    })

    it('should show an error when updating data', async () => {

        jest.spyOn(service, "update").mockResolvedValueOnce(new Promise(() => { throw Error }))
        const response: ApiResponseType = await controller.updateCost(mockUpdateCostDto)

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")

    })

    it('should delete an item', async () => {

        jest.spyOn(service, "delete").mockResolvedValueOnce({ raw: "", affected: 1 })
        const response: ApiResponseType = await controller.deleteCost({ id: 1 })

        expect(response.success).toBe(true)

    })

    it('should show an error when deleting', async () => {

        jest.spyOn(service, "delete").mockResolvedValueOnce(new Promise(() => { throw Error }))
        const response: ApiResponseType = await controller.deleteCost({ id: 1 })

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")

    })


})