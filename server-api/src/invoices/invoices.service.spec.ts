import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { Repository, UpdateResult } from 'typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'src/lib/mocks/repository-mock-factory';
import { ConfigModule } from '@nestjs/config';
import { mockCreateInvoiceDto, mockInvoice1, mockUpdateInvoiceDto } from 'src/lib/mocks/invoice.mock';

describe('InvoicesService', () => {
    let service: InvoicesService;
    let repository: Repository<Invoice>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InvoicesService,
                {
                    provide: getRepositoryToken(Invoice),
                    useFactory: repositoryMockFactory
                }
            ],
            imports:[
                ConfigModule.forRoot(
                    {
                        envFilePath: "env.test.local"
                    }
                )
            ]
        }).compile();

        service = module.get<InvoicesService>(InvoicesService);
        repository = module.get(getRepositoryToken(Invoice));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return a list of invoices', async() => {

        jest.spyOn(repository, "find").mockResolvedValueOnce([mockInvoice1])
        const result: Invoice[] = await service.getInvoices()

        expect(result.length).toBe(1)

    })

    it('should return the details of an invoice', async() => {

        jest.spyOn(repository, "findOneBy").mockResolvedValueOnce(mockInvoice1)
        const result: Invoice | null = await service.getInvoice(mockInvoice1.id)

        expect(result?.id).toBe(1)

    })

    it('should create a new invoice', async() => {

        jest.spyOn(repository, "save").mockResolvedValueOnce(mockInvoice1)
        const result: Invoice = await service.create(mockCreateInvoiceDto)

        expect(result.id).toBe(mockInvoice1.id)

    })

    it('should update an invoice', async() => {

        jest.spyOn(repository, "update").mockResolvedValueOnce({raw: "", affected: 1, generatedMaps: [] })
        const result: UpdateResult = await service.update(mockUpdateInvoiceDto)

        expect(result.affected).toBe(1)

    })

    it('should set an invoice as paid', async() => {

        jest.spyOn(repository, "update").mockResolvedValueOnce({raw: "", affected: 1, generatedMaps: [] })
        const result: UpdateResult = await service.setAsPaid(mockInvoice1.id)

        expect(result.affected).toBe(1)

    })

});
