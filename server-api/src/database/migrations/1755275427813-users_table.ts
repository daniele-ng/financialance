import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UsersTable1755275427813 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "integer",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "first_name",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "last_name",
                        type: "varchar",
                        length: "150"
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "320",
                        isUnique: true
                    },
                    {
                        name: "pin",
                        type: "varchar",
                        length: "100",
                        isUnique: true
                    },
                    {
                        name: "address",
                        type: "varchar",
                        length: "150",
                        isNullable: true
                    },
                    {
                        name: "city",
                        type: "varchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "vat_number",
                        type: "varchar",
                        length: "11",
                        isUnique: true
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

        await queryRunner.dropTable("users")
    }

}
