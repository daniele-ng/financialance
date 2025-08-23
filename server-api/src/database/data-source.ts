/**
 * Define datasource for TypeORM
 */

import { DataSource, DataSourceOptions } from "typeorm";

export const AppDataSourceOptions: DataSourceOptions = {        
    type: "sqlite",
    database: process.env.DATABASE_NAME ? "./src/database/" +  process.env.DATABASE_NAME : "./src/database/database.db",
    synchronize: process.env.DATABASE_SYNCHRONIZE,
    entities: ["dist/entities/*.entity.js"],        
    migrationsRun: process.env.DATABASE_MIGRATION_AUTO_RUN,
    migrations: ["dist/database/migrations/*.js"],
    migrationsTableName: "history"
};

const AppDataSource = new DataSource(AppDataSourceOptions);

export default AppDataSource;