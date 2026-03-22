/**
 * Data transfer object definitions
 */

import { IsCurrency, IsNotEmpty, Matches, IsDateString, MaxLength, IsOptional, IsEmpty } from "class-validator";
import { Cost } from "src/entities/cost.entity";
import { QueryDto } from "src/lib/query.dto";
import { EntityExists } from "src/validators/entity-exists";

export class CreateCostDto {

    @IsNotEmpty({ message: "Campo obbligatorio" })
    @MaxLength(100, { message: "Massimo caratteri consentiti 100" })
    title: string

    @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, { message: "Formato data non valido" })
    @IsDateString({ strict: true }, { message: "Formato data non valido" })
    date: string
    
    @IsCurrency({ allow_negatives: false, require_decimal: true }, { message: "Formato campo non valido" }) 
    amount: number

    @IsOptional()    
    @MaxLength(255, { message: "Massimo caratteri consentiti 255" })
    note?: string
}

export class UpdateCostDto extends CreateCostDto {

    @EntityExists("costs", { message: "Voce spesa non trovata" })
    id: number
}

// Define query params for results filtering
export class QueryCostDto extends QueryDto<Cost> {

    year?: number
}