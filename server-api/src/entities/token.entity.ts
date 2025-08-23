/**
 * Token entity class
 */

import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";

@Entity("tokens")
export class Token extends Base {

    @Column("text", { unique: true })
    token: string

    @Column("integer", { default: 1 })
    enabled: number

    @Column("varchar", { default: "access" })
    scope: "access" | "refresh"

    @ManyToOne(() => User, (user) => user.tokens)
    @JoinColumn({ name: "user_id" })
    user: User
}