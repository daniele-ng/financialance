import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InvoicesTable1755275505802 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: "invoices",
                columns: [
                    {
                        name: "id",
                        type: "integer",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "code",
                        type: "string",
                        length: "20",
                        isUnique: true
                    },
                    {
                        name: "date",
                        type: "date"
                    },
                    {
                        name: "amount",
                        type: "integer"                        
                    },
                    {
                        name: "month",
                        type: "integer"
                    },
                    {
                        name: "year",
                        type: "integer"
                    },
                    {
                        name: "paid",
                        type: "integer",
                        default: 0
                    },
                    {
                        name: "user_id",
                        type: "integer"
                    },
                    {
                        name: "created_at",
                        type: "datetime",
                        isNullable: true
                    },
                    {
                        name: "updated_at",
                        type: "datetime",
                        isNullable: true
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropTable("invoices")
    }

}
