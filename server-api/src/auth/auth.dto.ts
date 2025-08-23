/**
 * Data transfer object definitions
 */

import { IsNotEmpty } from "class-validator"

export class AuthDto {

    @IsNotEmpty({ message: "Inserire codice pin" })
    pin: string

}