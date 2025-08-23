import { Test, TestingModule } from '@nestjs/testing';
import { FinancialStatementsController } from './financial-statements.controller';
import { FinancialStatementsService } from './financial-statements.service';
import { TaxRatesService } from 'src/tax-rates/tax-rates.service';
import { UsersService } from 'src/users/users.service';
import { TokensService } from 'src/tokens/tokens.service';
import { Invoice } from 'src/entities/invoice.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'src/lib/mocks/repository-mock-factory';
import { User } from 'src/entities/user.entity';
import { Token } from 'src/entities/token.entity';
import { APP_GUARD } from '@nestjs/core';
import { MockAuthGuard } from 'src/lib/mocks/auth-guard-mock';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { mockTaxRate1 } from 'src/lib/mocks/taxrate-mock';
import { ApiResponseDataType } from 'src/@types/api-response-type';
import { TaxRate } from 'src/entities/tax-rate.entity';

describe('FinancialStatementsController', () => {
    let controller: FinancialStatementsController;
    let service: FinancialStatementsService;
    let taxtRatesService: TaxRatesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FinancialStatementsController],
            providers: [
                FinancialStatementsService, TaxRatesService, UsersService, TokensService,
                {
                    provide: getRepositoryToken(Invoice),
                    useFactory: repositoryMockFactory
                },
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

        controller = module.get<FinancialStatementsController>(FinancialStatementsController);
        service = module.get<FinancialStatementsService>(FinancialStatementsService);
        taxtRatesService =  module.get<TaxRatesService>(TaxRatesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should get financial statement', async() => {

        jest.spyOn(taxtRatesService, "getTaxRate").mockResolvedValueOnce(mockTaxRate1)
        jest.spyOn(service, "getIncome").mockResolvedValueOnce(20)
        const result: ApiResponseDataType = await controller.getFinancialStatement({year: 2025})
        expect(result.data.income).toBe(20)
        expect(result.data.revenue_perc).toBe(mockTaxRate1.revenue)
    })

    it('should show error when getting financial statement', async() => {

        jest.spyOn(taxtRatesService, "getTaxRate").mockResolvedValueOnce(null)        
        const result: ApiResponseDataType = await controller.getFinancialStatement({year: 2025})
        expect(result.success).toBe(false)
        expect(result.error).toContain("Impostare dati fiscali per l'anno 2025")        

    })
});
