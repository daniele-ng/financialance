/**
 * Define datasource for TypeORM
 */


import { Invoice } from "src/entities/invoice.entity";
import { TaxRate } from "src/entities/tax-rate.entity";
import { Token } from "src/entities/token.entity";
import { User } from "src/entities/user.entity";
import { DataSource, DataSourceOptions } from "typeorm";

export const AppDataSourceTestOptions: DataSourceOptions = {
    type: "sqlite",
    database: ":memory:",
    synchronize: true,
    entities: [Invoice, User, Token, TaxRate],
    migrationsRun: true,
    migrations: ["./src/database/migrations/*.ts"],
    migrationsTableName: "history",
    logging: false,
    logger: "advanced-console",    
};

const AppDataSourceTest: DataSource = new DataSource(AppDataSourceTestOptions);

export default AppDataSourceTest;