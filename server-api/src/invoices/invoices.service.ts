import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { FindOptionsOrder, FindOptionsOrderValue, Repository, UpdateResult } from 'typeorm';
import { CreateInvoiceDto, QueryInvoiceDto, UpdateInvoiceDto } from './invoices.dto';

@Injectable()
export class InvoicesService {

    constructor(
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>
    ){}

    /**
     * Return a list of invoices
     * 
     * @returns Promise<Invoice[]>
     */
    getInvoices(params?: QueryInvoiceDto): Promise<Invoice[]> {

        let sort: FindOptionsOrder<Invoice> = { date: "DESC" }
        let limit: number|undefined = undefined

        if (params !== undefined) {

            if (params?.sort  && params?.sort_direction) {

                sort = { [params.sort] : params.sort_direction }

            }

            if (params?.limit !== undefined) {

                limit = params.limit

            }

        }

        return this.invoiceRepository.find({
            order: sort,
            take: params?.limit
        })
    }

    /**
     * Return a list of invoices for a given year
     * 
     * @param year calendar year
     * @returns Promise<Invioce[]>
     */
    getAnnualInvoices(year: number): Promise<Invoice[]> {

        return this.invoiceRepository.find({
            where: { year: year },
            order: { month: "ASC" }
        })
    } 

    /**
     * Get invoice details
     * 
     * @param id invoice ID
     * @returns Promise<Invoice | null>
     */
    getInvoice(id: number): Promise<Invoice | null> {

        return this.invoiceRepository.findOneBy({ id: id })

    }

    /**
     * Create a new invoice
     * 
     * @param data dto with the fields to create a new invoice
     * @returns Promise<Invoice>
     */
    create(data: CreateInvoiceDto): Promise<Invoice> {

        const dateArray: string[] = data.date.split("-")

        const invoiceEntity: Invoice = this.invoiceRepository.create({
            code: data.code,
            date: data.date,
            amount: data.amount,
            company: data.company,
            month: parseInt(dateArray[1]),
            year: parseInt(dateArray[0]),
            user: data.user
        })

        return this.invoiceRepository.save(invoiceEntity)

    }

    /**
     * Update an invoice
     * 
     * @param data dto with the fields to update an invoice
     * @returns Promise<UpdateResult>
     */
    update(data: UpdateInvoiceDto): Promise<UpdateResult> {

        const dateArray: string[] = data.date.split("-")

        return this.invoiceRepository.update(
            { id: data.id },
            {
                code: data.code,
                date: data.date,
                amount: data.amount,
                company: data.company,
                month: parseInt(dateArray[1]),
                year: parseInt(dateArray[0]),
                paid: data.paid,
            }
        )
    }

    /**
     * Set an invoice as paid
     * 
     * @param id invoice ID
     * @returns Promise<UpdateResult>
     */
    setAsPaid(id: number): Promise<UpdateResult> {

        return this.invoiceRepository.update(
            { id: id },
            {
                paid: 1
            }            
        )
    }

}
