/**
 * Data transfer object definitions
 */

import { IsEmail, IsNotEmpty, IsOptional, Matches, MaxLength } from "class-validator";
import { EntityExists } from "src/validators/entity-exists";
import { IsUserAlreadyExist } from "src/validators/is-user-already-exist";

// Define common fields
abstract class UserDto {

    @IsNotEmpty({ message: "Campo obbligatorio" })
    @MaxLength(100, { message: "Massimo caratteri consentiti 100" })
    first_name: string

    @IsNotEmpty({ message: "Campo obbligatorio" })
    @MaxLength(150, { message: "Massimo caratteri consentiti 150" })
    last_name: string

    @IsEmail({}, { message: "Campo obbligatorio" })
    @IsUserAlreadyExist({ message: "Indirizzo e-mail già in uso" })
    email: string

    @IsOptional()
    @MaxLength(150, { message: "Massimo caratteri consentiti 150" })
    address?: string

    @IsOptional()
    @MaxLength(100, { message: "Massimo caratteri consentiti 100" })
    city?: string

    @IsNotEmpty({ message: "Campo obbligatorio" })
    @MaxLength(11, { message: "La partita IVA deve contenere 11 caratteri numerici" })
    vat_number: string

}

// Define dto for creating a new user
export class CreateUserDto extends UserDto {
        
    @Matches(/^[0-9]{6}$/, { message: "Il PIN deve essere composto da 6 numeri" })    
    pin: string

}

// Define dto for editing an existing user
export class UpdateUserDto extends UserDto {

    @EntityExists("users", { message: "Utente non trovato" })
    id: number
}

// Define dto for changing pin
export class UpdatePinUserDto {

    @EntityExists("users", { message: "Utente non trovato" })
    id: number

    @IsNotEmpty({ message: "Inserire codice pin" })
    pin: string
}