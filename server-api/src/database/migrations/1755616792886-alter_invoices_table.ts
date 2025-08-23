import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterInvoicesTable1755616792886 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn("invoices", new TableColumn({
            name: "company",
            type: "string",
            length: "50"
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
