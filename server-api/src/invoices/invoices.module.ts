import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { UsersModule } from 'src/users/users.module';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
    controllers: [InvoicesController],
    providers: [InvoicesService],
    imports: [
        TypeOrmModule.forFeature([Invoice]),
        UsersModule,
        TokensModule
    ],
})
export class InvoicesModule { }
