import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class TaxRatesTable1755275517012 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: "tax_rates",
                columns: [
                    {
                        name: "id",
                        type: "integer",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "revenue_perc",
                        type: "decimal"
                    },
                    {
                        name: "tax_perc",
                        type: "decimal"
                    },
                    {
                        name: "inps_perc",
                        type: "decimal"                        
                    },
                    {
                        name: "advance_tax_payment_perc",
                        type: "decimal"
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

        await queryRunner.dropTable("tax_rates")
    }

}
