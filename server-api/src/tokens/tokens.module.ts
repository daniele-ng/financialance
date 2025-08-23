import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/entities/token.entity';

@Module({
    providers: [TokensService],
    imports: [TypeOrmModule.forFeature([Token])],
    exports: [TokensService]
})
export class TokensModule { }
