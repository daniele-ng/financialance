// Define mock tax rates for tests

import { TaxRate } from "src/entities/tax-rate.entity"
import { CreateTaxRateDto, UpdateTaxRateDto } from "src/tax-rates/tax-rates.dto"


export const mockTaxRate1: TaxRate = {
    id: 1,
    revenue: 80,
    tax: 5,
    inps: 23.65,
    advanceTaxPayment: 80,
    year: 2025,
    createdAt: new Date(),
    updatedAt: new Date(),
}

export const mockTaxRate2: TaxRate = {
    id: 1,
    revenue: 80,
    tax: 5,
    inps: 23.65,
    advanceTaxPayment: 80,
    year: 2026,
    createdAt: new Date(),
    updatedAt: new Date(),
}

export const mockCreateTaxRateDto: CreateTaxRateDto = {
    revenue: 70,
    tax: 5,
    inps: 25.80,
    advanceTaxPayment: 80,
    year: 2027
}

export const mockUpdateTaxRateDto: UpdateTaxRateDto = {
    id: 1,
    revenue: 70,
    tax: 5,
    inps: 25.80,
    advanceTaxPayment: 80,
    year: 2027
}