/**
 * Cost entity class
 */

import { AfterLoad, Column, Entity } from "typeorm";
import { Base } from "./base.entity";
import { IsOptional } from "class-validator";

@Entity("costs")
export class Cost extends Base {

    @Column("varchar", { length: 100 })
    title: string

    @Column("date")
    date: Date

    @Column("decimal", { precision: 10, scale: 2 })
    amount: number

    @Column("integer")
    month: number

    @Column("integer")
    year: number

    @Column("varchar", { length: 255, nullable: true })
    note: string | null

    @IsOptional()
    amount_it: string

    @AfterLoad()
    localizeAmount() {

        this.amount_it = this.amount.toLocaleString('de-DE', {
            style: "currency",
            currency: "EUR"
        })
    }
}