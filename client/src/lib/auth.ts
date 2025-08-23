/**
 * Auth class designed for authentication management
 */

import { deleteCookie, getCookie, setCookie } from "./cookie-parser";

export type AuthTokensType = { access_token: string, refresh_token: string }

export class Auth {

    /**
     * Check if the user is authenticated
     * 
     * @returns boolean
     */
    static isAuthenticated(): boolean {

        return typeof getCookie("access_token") !== "undefined"

    }

    /**
     * Store authentication tokens in cookies
     * 
     * @param tokens tokens to store as cookies
     */
    static storeTokens(tokens: Array<Record<string, string>>): void {

        for(const type of tokens) {

            for(const [key, value] of Object.entries(type)) {

                setCookie(key, value, import.meta.env.VITE_COOKIE_TOKEN_DURATION)
            }
        }
    }

    /**
     * Get the value of the access or refresh token
     * 
     * @param type access_token | refresh_token
     * @returns string
     */
    static getToken(type: string): string {

        return getCookie(type) ?? ""

    }

    /**
     * Get an object with the values of the access and refresh tokens
     * 
     * @returns AuthTokensType
     */
    static getTokens(): AuthTokensType {

        return { access_token: getCookie("access_token") ?? "", refresh_token: getCookie("refresh_token") ?? "" }

    }

    /**
     * Delete access and refresh tokens
     */
    static deleteTokens(): void {

        deleteCookie("access_token")

        deleteCookie("refresh_token")

    }

}