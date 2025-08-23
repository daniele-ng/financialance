import { Module } from '@nestjs/common';
import { FinancialStatementsController } from './financial-statements.controller';
import { FinancialStatementsService } from './financial-statements.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { UsersModule } from 'src/users/users.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { TaxRatesModule } from 'src/tax-rates/tax-rates.module';

@Module({
    controllers: [FinancialStatementsController],
    providers: [FinancialStatementsService],
    imports: [
        TypeOrmModule.forFeature([Invoice]),
        UsersModule,
        TokensModule,
        TaxRatesModule
    ]
})
export class FinancialStatementsModule { }
