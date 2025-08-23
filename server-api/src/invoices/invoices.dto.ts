/**
 * Data transfer object definitions
 */

import { IsCurrency, IsNotEmpty, Matches, IsDateString, MaxLength, IsOptional } from "class-validator";
import { User } from "src/entities/user.entity";
import { EntityExists } from "src/validators/entity-exists";

// Define dto for creating a new invoice
export class CreateInvoiceDto {

    @IsNotEmpty({ message: "Campo obbligatorio" })
    @MaxLength(20, { message: "Massimo caratteri consentiti 20" })
    code: string

    @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, { message: "Formato data non valido" })
    @IsDateString({ strict: true }, { message: "Formato data non valido" })
    date: string
    
    @IsCurrency({ allow_negatives: false, require_decimal: true }, { message: "Formato campo non valido" }) 
    amount: number

    @IsNotEmpty({ message: "Campo obbligatorio" })
    @MaxLength(50, { message: "Massimo caratteri consentiti 50" })
    company: string

    @IsOptional()
    user: User
}

// Define dto for editing an existing invoice
export class UpdateInvoiceDto {

    @EntityExists("invoices", { message: "Invoice not found" })
    id: number

    @IsNotEmpty({ message: "Campo obbligatorio" })
    @MaxLength(20, { message: "Massimo caratteri consentiti 20" })
    code: string

    @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, { message: "Formato data non valido" })
    @IsDateString({ strict: true }, { message: "Formato data non valido" })
    date: string

    @IsCurrency({ allow_negatives: false, require_decimal: true }, { message: "Formato campo non valido" }) 
    amount: number

    @IsNotEmpty({ message: "Campo obbligatorio" })
    @MaxLength(50, { message: "Massimo caratteri consentiti 50" })
    company: string
}