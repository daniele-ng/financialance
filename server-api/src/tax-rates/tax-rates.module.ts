import { Module } from '@nestjs/common';
import { TaxRatesController } from './tax-rates.controller';
import { TaxRatesService } from './tax-rates.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxRate } from 'src/entities/tax-rate.entity';
import { UsersModule } from 'src/users/users.module';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
    controllers: [TaxRatesController],
    providers: [TaxRatesService],
    imports: [
        TypeOrmModule.forFeature([TaxRate]),
        UsersModule,
        TokensModule
    ],
    exports: [TaxRatesService]
})
export class TaxRatesModule { }
