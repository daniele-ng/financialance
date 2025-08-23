import { Test, TestingModule } from '@nestjs/testing';
import { TaxRatesService } from './tax-rates.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TaxRate } from 'src/entities/tax-rate.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'src/lib/mocks/repository-mock-factory';
import { ConfigModule } from '@nestjs/config';
import { mockCreateTaxRateDto, mockTaxRate1, mockUpdateTaxRateDto } from 'src/lib/mocks/taxrate-mock';

describe('TaxRatesService', () => {
    let service: TaxRatesService;
    let repository: Repository<TaxRate>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaxRatesService,
                {
                    provide: getRepositoryToken(TaxRate),
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
        }).compile();

        service = module.get<TaxRatesService>(TaxRatesService);
        repository = module.get(getRepositoryToken(TaxRate));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return a list of tax rates', async () => {

        jest.spyOn(repository, "find").mockResolvedValueOnce([mockTaxRate1])
        const result: TaxRate[] = await service.getTaxRates()

        expect(result.length).toBe(1)

    })

    it('should create a new tax rate', async () => {

        jest.spyOn(repository, "save").mockResolvedValueOnce(mockTaxRate1)
        const result: TaxRate = await service.create(mockCreateTaxRateDto)

        expect(result.id).toBe(mockTaxRate1.id)

    })

    it('should update a tax rate', async () => {

        jest.spyOn(repository, "update").mockResolvedValueOnce({ raw: "", affected: 1, generatedMaps: [] })
        const result: UpdateResult = await service.update(mockUpdateTaxRateDto)

        expect(result.affected).toBe(1)

    })

    it('should delete a tax rate', async () => {

        jest.spyOn(repository, "delete").mockResolvedValueOnce({ raw: "", affected: 1 })
        const result: DeleteResult = await service.delete(mockTaxRate1.id)

        expect(result.affected).toBe(1)

    })

});
