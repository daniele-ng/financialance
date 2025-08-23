import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaxRate } from 'src/entities/tax-rate.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateTaxRateDto, UpdateTaxRateDto } from './tax-rates.dto';

@Injectable()
export class TaxRatesService {

    constructor(
        @InjectRepository(TaxRate)
        private taxrateRepository: Repository<TaxRate>
    ){}

    /**
     * Return a list of tax rates
     * 
     * @returns Promise<TaxRate[]>
     */
    getTaxRates(): Promise<TaxRate[]> {

        return this.taxrateRepository.find({ order: { year: "ASC" } })

    }

    /**
     * Get tax rate for the year
     * 
     * @param year year
     * @returns Promise<TaxRate | null>
     */
    getTaxRate(year: number): Promise<TaxRate | null> {

        return this.taxrateRepository.findOneBy({ year: year })

    }

    /**
     * Create a new tax rate
     * 
     * @param data dto with fields to create a new tax rate
     * @returns Promise<TaxRate>
     */
    create(data: CreateTaxRateDto): Promise<TaxRate> {

        const taxrateEntity = this.taxrateRepository.create({ ...data })

        return this.taxrateRepository.save(taxrateEntity)

    }

    /**
     * Update an existing tax rate
     * 
     * @param data dto with fields to update an existing tax rate
     * @returns Promise<UpdateResult>
     */
    update(data: UpdateTaxRateDto): Promise<UpdateResult> {

        return this.taxrateRepository.update(
            { id: data.id },
            {
                revenue: data.revenue,
                tax: data.tax,
                inps: data.inps,
                advanceTaxPayment: data.advanceTaxPayment,
                year: data.year
            }
        )
    }

    /**
     * Delete tax rate
     * 
     * @param id tax rate ID
     * @returns Promise<DeleteResult>
     */
    delete(id: number): Promise<DeleteResult> {

        return this.taxrateRepository.delete({ id: id })

    }

}
