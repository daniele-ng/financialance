import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FinancialStatementsModule } from './financial-statements/financial-statements.module';
import { InvoicesModule } from './invoices/invoices.module';
import { TaxRatesModule } from './tax-rates/tax-rates.module';
import { ValidatorsModule } from './validators/validators.module';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'sqlite',
                database: "dist/database/" +  configService.get("DATABASE_NAME"),
                synchronize: configService.get("DATABASE_SYNCHRONIZE"),
                entities: ["dist/entities/*.entity.js"],        
                migrationsRun: configService.get("DATABASE_MIGRATION_AUTO_RUN"),
                migrations: ["dist/database/migrations/*.js"],
                migrationsTableName: "history"
            }),
            inject: [ConfigService]
        }),   
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET
        }),
        ValidatorsModule,
        AuthModule,
        TokensModule,
        UsersModule,
        FinancialStatementsModule,
        InvoicesModule,
        TaxRatesModule
    ]
})
export class AppModule { }
