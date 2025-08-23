/**
 * Provides methods to manage ajax requests with the Axios package
 */

import axios, { AxiosError, type AxiosResponse } from "axios";
import { Auth } from "./auth";

// Define axios response type
export type AxiosResponseJsonType = {

    // request success
    success: boolean

    // HTTP code
    status: number

    // Response body
    body?: { [key: string]: string } | { [key: string]: any }

    // Response errors
    errors?: { [key: string]: string[] | string }
}

// Define token data object
type TokenData = { access_token: string, refresh_token: string }

// Define response body token data
type TokenResponseBody = { data: TokenData }

// Define common headers
const headers = { "Content-Type": "application/json", "Accept": "application/json" }

/**
 * Response errors object
 * 
 * @param error AxiosError
 * @returns AxiosResponseJsonType
 */
const errorResponse = (error: AxiosError): AxiosResponseJsonType => {

    const response: AxiosResponseJsonType = {
        success: false,
        status: error.status ?? 500,
        errors: {}
    }

    if (error.code == "ERR_NETWORK" || error.code == "ERR_CONNECTION_RESET") {

        response.errors = { server: "Impossibile raggiungere il server" };

    }
    else {

        const data = error.response?.data as { [key: string]: { [key: string]: string } };
        response.errors = data?.errors ?? { server: "Impossibile effettuare la chiamata" };

    }

    return response;

}

/**
 * Success response object
 * 
 * @param result axios response result object
 * @returns AxiosResponseJsonType
 */
const successResponse = (result: AxiosResponse<any, any>): AxiosResponseJsonType => {

    return {
        success: true,
        status: result.status,
        body: result.data
    }

}

/**
 * Perform an ajax request
 * 
 * @param method HTTP method
 * @param endpoint api endpoint
 * @param formData form data
 * @param credentials use bearer token
 * @returns Promise<AxiosResponseJsonType>
 */
export const ajaxRequest = async (method: string, endpoint: string, formData?: FormData, credentials: boolean = false): Promise<AxiosResponseJsonType> => {

    try {

        const response = await axios({
            method: method,
            url: endpoint,
            headers: credentials ? { ...headers , "Authorization": "Bearer " + Auth.getToken('access_token')} : headers,
            data: formData
        })

        return successResponse(response)

    }
    catch(err) {

        return errorResponse(err as AxiosError)

    }
}

/**
 * Perform an ajax request with bearer token.
 * 
 * If the access token is not valid, try recovering a new one by calling the endpoint /api/tokens,
 * then send the request again.
 * 
 * @param method HTTP method
 * @param endpoint API endpoint
 * @param formData form data
 * @returns Promise<AxiosResponseJsonType>
 */
export const ajaxRequestWithBearerToken = async (method: string, endpoint: string, formData?: FormData): Promise<AxiosResponseJsonType> => {

    const response: AxiosResponseJsonType = await ajaxRequest(method, endpoint, formData, true)    

    if (response.status != 403 ) return response

    const tokenResponse = await ajaxRequestTokens()

    if (tokenResponse.status != 200 || !tokenResponse.success) return tokenResponse

    const tokens = ( tokenResponse.body as TokenResponseBody ).data

    Auth.storeTokens([{ access_token: tokens.access_token }, { refresh_token: tokens.refresh_token }])

    return await ajaxRequest(method, endpoint, formData, true)

}

/**
 * Call the endpoint /api/tokens in order to recover new access and refresh tokens
 * 
 * @returns Promise<AxiosResponseJsonType>
 */
const ajaxRequestTokens = async (): Promise<AxiosResponseJsonType> => {

    try {

        const response = await axios({
            method: "get",
            url: import.meta.env.VITE_API_SERVER_URL + "/api/tokens",
            headers: { ...headers, "Authorization": "Bearer " + Auth.getToken('refresh_token') }
        })

        return successResponse(response)

    }
    catch (err) {

        return errorResponse(err as AxiosError)
    }

}