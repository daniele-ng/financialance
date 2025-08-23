/**
 * Type definitions for the token issued by the api server
 */

// Define token scope
export type TokenScopeType = "access" | "refresh"

// Define the payload provided to the JWT service to create a new token
export type TokenPayloadType = {

    // token jwt subject
    sub: string,

    // token jwt scope
    scope: "access" | "refresh"

}

// Define the two tokens issued by the api server
export type TokenPairType = {

    // token to access the backend resources
    access_token: string,

    // token to require a new access token
    refresh_token: string

}