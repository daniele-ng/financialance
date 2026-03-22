import { Module } from "@nestjs/common";
import { CostsController } from "./costs.controller";
import { CostsService } from "./costs.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cost } from "src/entities/cost.entity";
import { UsersModule } from "src/users/users.module";
import { TokensModule } from "src/tokens/tokens.module";

@Module({
    controllers: [CostsController],
    providers: [CostsService],
    imports: [
        TypeOrmModule.forFeature([Cost]),
        UsersModule,
        TokensModule
    ]
})
export class CostsModule { }