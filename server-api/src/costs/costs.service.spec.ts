import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { CostsService } from "./costs.service"
import { Cost } from "src/entities/cost.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { repositoryMockFactory } from "src/lib/mocks/repository-mock-factory";
import { ConfigModule } from "@nestjs/config";
import { mockCost, mockCreateCostDto, mockUpdateCostDto } from "src/lib/mocks/cost-mock";

describe('CostsService', () => {
    let service: CostsService;
    let repository: Repository<Cost>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CostsService,
                {
                    provide: getRepositoryToken(Cost),
                    useFactory: repositoryMockFactory
                }
            ],
            imports: [
                ConfigModule.forRoot(
                    {
                        envFilePath: ".env.test.local"
                    }
                )
            ]
        }).compile()

        service = module.get<CostsService>(CostsService);
        repository = module.get(getRepositoryToken(Cost));
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return a list of costs', async () => {

        jest.spyOn(repository, "find").mockResolvedValueOnce([mockCost])
        const results: Cost[] = await service.getCosts()

        expect(results.length).toBe(1)
    })

    it('should create a new cost', async () => {

        jest.spyOn(repository, "save").mockResolvedValueOnce(mockCost)
        const result: Cost = await service.create(mockCreateCostDto)

        expect(result.id).toBe(mockCost.id)
        expect(result.note).toBeNull()
    })

    it('should update a cost', async () => {

        jest.spyOn(repository, "update").mockResolvedValueOnce({ raw: "", affected: 1, generatedMaps: [] })
        const result: UpdateResult = await service.update(mockUpdateCostDto)

        expect(result.affected).toBe(1)        
    })

    it('should delete a cost', async () => {

        jest.spyOn(repository, "delete").mockResolvedValueOnce({ raw: "", affected: 1 })
        const result: DeleteResult = await service.delete(mockCost.id)

        expect(result.affected).toBe(1)
    })
})