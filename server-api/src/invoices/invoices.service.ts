import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateInvoiceDto, UpdateInvoiceDto } from './invoices.dto';

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
    getInvoices(limit?: number): Promise<Invoice[]> {

        return this.invoiceRepository.find({
            order: { date: "DESC" },
            take: limit
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
