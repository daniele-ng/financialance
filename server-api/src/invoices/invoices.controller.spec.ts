import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { repositoryMockFactory } from 'src/lib/mocks/repository-mock-factory';
import { APP_GUARD } from '@nestjs/core';
import { MockAuthGuard } from 'src/lib/mocks/auth-guard-mock';
import { ConfigModule } from '@nestjs/config';
import { ApiResponseDataType, ApiResponseType } from 'src/@types/api-response-type';
import { mockCreateInvoiceDto, mockInvoice1, mockInvoice2, mockUpdateInvoiceDto } from 'src/lib/mocks/invoice.mock';
import { UsersService } from 'src/users/users.service';
import { TokensService } from 'src/tokens/tokens.service';
import { User } from 'src/entities/user.entity';
import { Token } from 'src/entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import mockUser from 'src/lib/mocks/user-mock';


const mockRequest = () => ({
    user: mockUser,
});

const mockQuery = (limit?: number) => ({
    limit: limit
})

describe('InvoicesController', () => {
    let controller: InvoicesController;
    let service: InvoicesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InvoicesController],
            providers: [
                InvoicesService, UsersService, TokensService,
                {
                    provide: getRepositoryToken(Invoice),
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

        controller = module.get<InvoicesController>(InvoicesController);
        service = module.get<InvoicesService>(InvoicesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should get a list of invoices', async() => {        

        jest.spyOn(service, "getInvoices").mockResolvedValueOnce([mockInvoice1, mockInvoice2])
        const response: ApiResponseDataType = await controller.getInvoices(mockQuery(2))

        expect(response.success).toBe(true)
        expect(response.data).toMatchObject([mockInvoice1, mockInvoice2])

    })

    it('should show an error when getting invoices', async() => {

        jest.spyOn(service, "getInvoices").mockResolvedValueOnce(new Promise (() => { throw Error}))
        const response: ApiResponseDataType = await controller.getInvoices(mockQuery())

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")

    })

    it('should get an invoice data', async() => {

        jest.spyOn(service, "getInvoice").mockResolvedValueOnce(mockInvoice1)
        const response: ApiResponseDataType = await controller.getInvoice({ id: 1 })

        expect(response.success).toBe(true)
        expect(response.data).toMatchObject(mockInvoice1)

    })

    it('should show an error when getting an invoice', async() => {

        jest.spyOn(service, "getInvoice").mockResolvedValueOnce(new Promise (() => { throw Error}))
        const response: ApiResponseDataType = await controller.getInvoice({ id: 0 })

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")

    })

    it('should add a new invoice', async() => {

        const request = mockRequest();

        jest.spyOn(service, "create").mockResolvedValueOnce(mockInvoice2)
        const response: ApiResponseType = await controller.createInvoice(mockCreateInvoiceDto, request)

        expect(response.success).toBe(true)

    })

    it('should show an error when adding a new invoice', async() => {

        const request = mockRequest();

        jest.spyOn(service, "create").mockResolvedValueOnce(new Promise (() => { throw Error }))
        const response: ApiResponseType = await controller.createInvoice(mockCreateInvoiceDto, request)

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")

    })
    
    it('should update invoice data', async() => {

        jest.spyOn(service, "update").mockResolvedValueOnce({ raw: "", affected: 1, generatedMaps: [] })
        const response: ApiResponseType = await controller.updateInvoce(mockUpdateInvoiceDto)

        expect(response.success).toBe(true)        

    })

    it('should show an error when updating an invoice', async() => {

        jest.spyOn(service, "update").mockResolvedValueOnce(new Promise (() => { throw Error }))
        const response: ApiResponseType = await controller.updateInvoce(mockUpdateInvoiceDto)

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")

    })

    it('should set an invoice as paid', async() => {

        jest.spyOn(service, "setAsPaid").mockResolvedValueOnce({ raw: "", affected: 1, generatedMaps: [] })
        const response: ApiResponseType = await controller.setInvoiceAsPaid({ id: 1 })

        expect(response.success).toBe(true)

    })

    it('should show an error when setting invoice as paid', async() => {

        jest.spyOn(service, "setAsPaid").mockResolvedValueOnce(new Promise (() => { throw Error }))
        const response: ApiResponseType = await controller.setInvoiceAsPaid({ id: 1 })

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")

    })

    it('should get a list of invoices for a given year', async() => {        

        jest.spyOn(service, "getAnnualInvoices").mockResolvedValueOnce([mockInvoice1, mockInvoice2])
        const response: ApiResponseDataType = await controller.getAnnualInvoices({ year: 2025 })

        expect(response.success).toBe(true)
        expect(response.data).toMatchObject([mockInvoice1, mockInvoice2])

    })

    it('should show an error when getting invoices for a given year', async() => {

        jest.spyOn(service, "getAnnualInvoices").mockResolvedValueOnce(new Promise (() => { throw Error}))
        const response: ApiResponseDataType = await controller.getAnnualInvoices({ year: 2025 })

        expect(response.success).toBe(false)
        expect(response.error).toContain("Errore server:")

    })
});
