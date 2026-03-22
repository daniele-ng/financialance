import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CostsTable1774107422083 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: "costs",
                columns: [
                    {
                        name: "id",
                        type: "integer",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "title",
                        type: "string",
                        length: "100",
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
                        name: "note",
                        type: "string",
                        length: "255",
                        isNullable: true
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

        await queryRunner.dropTable("costs")
    }

}
