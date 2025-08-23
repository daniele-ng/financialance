import { TokenPairType } from "src/tokens/@types/tokens-type"

export type AuthResponseJsonType = {

    // True if the call was successful
    success: boolean

    // New pair token
    tokens: TokenPairType | []

}