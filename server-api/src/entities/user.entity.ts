/**
 * User entity class
 */

import { Column, Entity, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { Token } from "./token.entity";
import { Invoice } from "./invoice.entity";

@Entity("users")
export class User extends Base {

    @Column("varchar", { length: 100, name: "first_name"})
    firstName: string

    @Column("varchar", { length: 150, name: "last_name"})
    lastName: string

    @Column("varchar", { length: 320, unique: true})
    email: string

    @Column("varchar", { length: 100, unique: true })
    pin: string

    @Column("varchar", { length: 150, nullable: true })
    address: string | null

    @Column("varchar", { length: 100, nullable: true })
    city: string | null

    @Column("varchar", { length: 11, name: "vat_number"})
    vatNumber: string

    @OneToMany(() => Token, (token) => token.user)
    tokens: Token[]

    @OneToMany(() => Invoice, (invoice) => invoice.user)
    invoices: Invoice[]
}