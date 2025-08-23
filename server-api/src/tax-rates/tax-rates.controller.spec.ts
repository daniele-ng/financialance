import { Test, TestingModule } from '@nestjs/testing';
import { TaxRatesController } from './tax-rates.controller';
import { TaxRatesService } from './tax-rates.service';
import { UsersService } from 'src/users/users.service';
import { TokensService } from 'src/tokens/tokens.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaxRate } from 'src/entities/tax-rate.entity';
import { repositoryMockFactory } from 'src/lib/mocks/repository-mock-factory';
import { User } from 'src/entities/user.entity';
import { Token } from 'src/entities/token.entity';
import { APP_GUARD } from '@nestjs/core';
import { MockAuthGuard } from 'src/lib/mocks/auth-guard-mock';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ApiResponseDataType, ApiResponseType } from 'src/@types/api-response-type';
import { mockCreateTaxRateDto, mockTaxRate1, mockTaxRate2, mockUpdateTaxRateDto } from 'src/lib/mocks/taxrate-mock';

describe('TaxRatesController', () => {
    let controller: TaxRatesController;
    let service: TaxRatesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TaxRatesController],
            providers: [
                TaxRatesService, UsersService, TokensService,
                {
                    provide: getRepositoryToken(TaxRate),
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

        controller = module.get<TaxRatesController>(TaxRatesController);
        service = module.get<TaxRatesService>(TaxRatesService)
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should get a list of tax rates', async () => {

        jest.spyOn(service, "getTaxRates").mockResolvedValueOnce([mockTaxRate1, mockTaxRate2])
        const response: ApiResponseDataType = await controller.getTaxRates()

        expect(response.success).toBe(true)
        expect(response.data).toMatchObject([mockTaxRate1, mockTaxRate2])

    })

    it('should show an error when getting items', async () => {

        jest.spyOn(service, "getTaxRates").mockResolvedValueOnce(new Promise(() => { throw Error }))
        const response: ApiResponseDataType = await controller.getTaxRates()

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")

    })

    it('should add a new item', async () => {

        jest.spyOn(service, "create").mockResolvedValueOnce(mockTaxRate2)
        const response: ApiResponseType = await controller.createTaxRate(mockCreateTaxRateDto)

        expect(response.success).toBe(true)

    })

    it('should show an error when adding a new item', async () => {

        jest.spyOn(service, "create").mockResolvedValueOnce(new Promise(() => { throw Error }))
        const response: ApiResponseType = await controller.createTaxRate(mockCreateTaxRateDto)

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")

    })

    it('should update data', async () => {

        jest.spyOn(service, "update").mockResolvedValueOnce({ raw: "", affected: 1, generatedMaps: [] })
        const response: ApiResponseType = await controller.updateTaxRate(mockUpdateTaxRateDto)

        expect(response.success).toBe(true)

    })

    it('should show an error when updating data', async () => {

        jest.spyOn(service, "update").mockResolvedValueOnce(new Promise(() => { throw Error }))
        const response: ApiResponseType = await controller.updateTaxRate(mockUpdateTaxRateDto)

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")

    })

    it('should delete an item', async () => {

        jest.spyOn(service, "delete").mockResolvedValueOnce({ raw: "", affected: 1 })
        const response: ApiResponseType = await controller.deleteTaxRate({ id: 1 })

        expect(response.success).toBe(true)

    })

    it('should show an error when deleting', async () => {

        jest.spyOn(service, "delete").mockResolvedValueOnce(new Promise(() => { throw Error }))
        const response: ApiResponseType = await controller.deleteTaxRate({ id: 1 })

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")

    })
});
