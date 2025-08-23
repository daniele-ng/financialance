import { Test, TestingModule } from '@nestjs/testing';
import { FinancialStatementsService } from './financial-statements.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { repositoryMockFactory } from 'src/lib/mocks/repository-mock-factory';
import { Repository } from 'typeorm';

describe('FinancialStatementsService', () => {
    let service: FinancialStatementsService;
    let repository: Repository<Invoice>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FinancialStatementsService,
                {
                    provide: getRepositoryToken(Invoice),
                    useFactory: repositoryMockFactory
                }
            ],
        }).compile();

        service = module.get<FinancialStatementsService>(FinancialStatementsService);
        repository = module.get(getRepositoryToken(Invoice))
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get yearly income', async () => {

        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ income: 20 }),
        };

        jest.spyOn(repository, "createQueryBuilder").mockReturnValue(mockQueryBuilder as any);

        const result = await service.getIncome(2025);
        expect(result).toEqual(20);

    })
});
