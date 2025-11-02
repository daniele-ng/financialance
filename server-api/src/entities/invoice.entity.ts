/**
 * Invoice entity class
 */

import { AfterLoad, AfterRecover, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { IsOptional } from "class-validator";

@Entity("invoices")
export class Invoice extends Base {

    @Column("varchar", { length: 20 })
    code: string

    @Column("date")
    date: Date

    @Column("decimal", { precision: 10, scale: 2 })
    amount: number

    @Column("varchar", { length: 50 })
    company: string

    @Column("integer")
    month: number

    @Column("integer")
    year: number

    @Column("integer", { default: 0 })
    paid: number

    @ManyToOne(() => User, (user) => user.invoices)
    @JoinColumn({ name: "user_id" })
    user: User

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