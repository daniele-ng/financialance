/**
 * TaxRate entity class
 */

import { Column, Entity } from "typeorm";
import { Base } from "./base.entity";

@Entity("tax_rates")
export class TaxRate extends Base {

    @Column("decimal", { precision: 5, scale: 2, name: "revenue_perc" })
    revenue: number

    @Column("decimal", { precision: 5, scale: 2, name: "tax_perc" })
    tax: number

    @Column("decimal", { precision: 5, scale: 2, name: "inps_perc" })
    inps: number

    @Column("decimal", { precision: 5, scale: 2, name: "advance_tax_payment_perc" })
    advanceTaxPayment: number

    @Column("integer")
    year: number
}