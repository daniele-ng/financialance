import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class TokensTable1755275479808 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: "tokens",
                columns: [
                    {
                        name: "id",
                        type: "integer",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "token",
                        type: "text",
                        isUnique: true
                    },
                    {
                        name: "enabled",
                        type: "int",
                        default: 1
                    },
                    {
                        name: "scope",
                        type: "varchar",
                        length: "10"
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

        await queryRunner.dropTable("tokens")
    }

}
