import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataFinancialStatement, QueryResultIncome } from 'src/@types/financial-statement-type';
import { Invoice } from 'src/entities/invoice.entity';
import { TaxRate } from 'src/entities/tax-rate.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FinancialStatementsService {

    constructor(
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>        
    ) {}

    /**
     * Get the yearly income
     * 
     * @param year year for which we want to get the income
     * @returns Promise<number>
     */
    async getIncome(year: number): Promise<number> {

        const result: QueryResultIncome | undefined = await this.invoiceRepository
            .createQueryBuilder("invoice")
            .select("SUM(invoice.amount)", "income")
            .where("invoice.year = :year", { year })
            .getRawOne()

        if (typeof result === "undefined") return 0

        if (result.income === null) return 0

        return Number(result.income.toFixed(2))
    }

    /**
     * Get the amount to be paid in advance
     * 
     * @param totalTax amount of tax to be paid
     * @param tax_perc advance tax payment percentage
     * @returns number
     */
    getAdvanceTaxPayment(totalTax: number, tax_perc: number): number {

        return Number((totalTax * (tax_perc / 100)).toFixed(2))

    }

    /**
     * Get the amount of tax to be paid
     * 
     * @param taxableIncome yearly taxable income
     * @param inpsTaxAmount amount to be paid to INPS
     * @param tax_perc tax percentage
     * @returns number
     */
    getTax(taxableIncome: number, inpsTaxAmount: number, tax_perc: number): number {        

        const tax:number = (taxableIncome - inpsTaxAmount) * (tax_perc / 100)

        return Number(tax.toFixed(2))

    }

    /**
     * Get the amount to be paid to inps
     * 
     * @param taxableIncome yearly taxable income
     * @param tax_perc INPS tax percentage
     * @returns number
     */
    getInpsTax(taxableIncome: number, tax_perc: number): number {        

        return Number((taxableIncome * (tax_perc / 100)).toFixed(2))

    }

    /**
     * Get the amount of the taxable income
     * 
     * @param income yearly income
     * @param revenue_perc business revenue percentage
     * @returns number
     */
    getTaxableIncome(income: number, revenue_perc: number): number {        

        return Number((income * (revenue_perc / 100)).toFixed(2))

    }

    /**
     * Get a summary of a yearly financial statement
     * 
     * @param year year for which we want to get a financial statement
     * @param taxRate tax rates to use for calculation
     * @returns Promise<DataFinancialStatement>
     */
    async getSummary(year: number, taxRate: TaxRate): Promise<DataFinancialStatement> {

        const income: number = await this.getIncome(year)
        const taxable_income: number = this.getTaxableIncome(income, taxRate.revenue)
        const inps_tax: number = this.getInpsTax(taxable_income, taxRate.inps)
        const tax: number = this.getTax(taxable_income, inps_tax, taxRate.tax)
        const total_tax: number = inps_tax + tax
        const net_income: number = income - total_tax
        const advance_tax_payment: number = this.getAdvanceTaxPayment(total_tax, taxRate.advanceTaxPayment)

        return {
            revenue_perc: taxRate.revenue.toFixed(2).replace(".", ","),
            tax_perc: taxRate.tax.toFixed(2).replace(".", ","),
            inps_perc: taxRate.inps.toFixed(2).replace(".", ","),
            income: this.convertToLocalCurrency(income),
            net_income: this.convertToLocalCurrency(net_income),
            taxable_income: this.convertToLocalCurrency(taxable_income),
            inps_tax: this.convertToLocalCurrency(inps_tax),
            tax: this.convertToLocalCurrency(tax),
            total_tax: this.convertToLocalCurrency(total_tax),
            advance_tax_payment: this.convertToLocalCurrency(advance_tax_payment)
        }

    }

    /**
     * Format a numeric value using the EU currency format
     * 
     * @param value numeric value
     * @returns string
     */
    private convertToLocalCurrency(value: number): string {

        return value.toLocaleString('de-DE', {
            style: "currency",
            currency: "EUR"
        })
    }
}
