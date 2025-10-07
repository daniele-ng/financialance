/**
 * Define datasource for TypeORM
 */

import { DataSource, DataSourceOptions } from "typeorm";

export const AppDataSourceOptions: DataSourceOptions = {        
    type: "sqlite",
    database: "dist/database/financialance.db",
    synchronize: false,
    entities: ["dist/entities/*.entity.js"],        
    migrationsRun: true,
    migrations: ["dist/database/migrations/*.js"],
    migrationsTableName: "history"
};

const AppDataSource = new DataSource(AppDataSourceOptions);

export default AppDataSource;