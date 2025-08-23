/**
 * Data transfer object definitions
 */

import { IsNotEmpty, Matches } from "class-validator";
import { EntityExists } from "src/validators/entity-exists";
import { Range } from "src/validators/range";

export class CreateTaxRateDto {

    @IsNotEmpty({ message: "Campo obbligatorio" })
    @Range({min: 0, max: 100}, { message: "Il campo deve contenere un valore tra 0 e 100" })
    revenue: number

    @IsNotEmpty({ message: "Campo obbligatorio" })
    @Range({min: 0, max: 100}, { message: "Il campo deve contenere un valore tra 0 e 100" })
    tax: number

    @IsNotEmpty({ message: "Campo obbligatorio" })
    @Range({min: 0, max: 100}, { message: "Il campo deve contenere un valore tra 0 e 100" })
    inps: number
    
    @IsNotEmpty({ message: "Campo obbligatorio" })
    @Range({min: 0, max: 100}, { message: "Il campo deve contenere un valore tra 0 e 100" })
    advanceTaxPayment: number

    @Matches(/^[1-9]{1}[0-9]{3}$/, { message: "Formato anno non valido" })
    year: number
}

export class UpdateTaxRateDto extends CreateTaxRateDto {

    @EntityExists("tax_rates", { message: "Aliquota fiscale non trovata" })
    id: number

}