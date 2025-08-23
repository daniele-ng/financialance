/**
 * Base entity class. Provides common columns
 */

import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class Base {

    @PrimaryGeneratedColumn('increment', { type: 'integer' })
    id: number

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date
}