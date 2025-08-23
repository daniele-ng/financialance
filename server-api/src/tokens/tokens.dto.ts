/**
 * Data transfer Object definitions
 */

import { User } from "src/entities/user.entity"
import { TokenScopeType } from "./@types/tokens-type"

// Define the required field to save a new token
export class CreateTokenDto {

    // jwt signed token
    token: string    

    // token scope
    scope: TokenScopeType

    // the user to whom the token is issued
    user: User

}