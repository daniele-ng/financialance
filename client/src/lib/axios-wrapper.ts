/**
 * Provides methods to manage ajax requests with the Axios package
 */

import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";

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

// Axios instance
const axiosApi: AxiosInstance = axios.create({
    headers: { "Content-Type": "application/json", 'X-Requested-With': 'XMLHttpRequest' },
    withCredentials: true,
})

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
 * @returns Promise<AxiosResponseJsonType>
 */
const ajaxRequest = async (method: string, endpoint: string, formData?: FormData): Promise<AxiosResponseJsonType> => {

    try {

        const response = await axiosApi({
            method: method,
            url: endpoint,
            data: formData
        })

        return successResponse(response)

    }
    catch(err) {

        return errorResponse(err as AxiosError)

    }
}

/**
 * Call api performing a request with axios
 * 
 * If the access token is not valid, try recovering a new one by calling the endpoint /api/tokens,
 * then send the request again.
 * 
 * @param method HTTP method
 * @param endpoint API endpoint
 * @param formData form data
 * @returns Promise<AxiosResponseJsonType>
 */
export const callApi = async (method: string, endpoint: string, formData?: FormData): Promise<AxiosResponseJsonType> => {

    const response: AxiosResponseJsonType = await ajaxRequest(method, endpoint, formData)    

    if (response.status != 403 ) return response

    const tokenResponse = await ajaxRequest("GET", import.meta.env.VITE_API_SERVER_URL + "/api/tokens")

    if (tokenResponse.status != 200 || !tokenResponse.success) return tokenResponse

    return await ajaxRequest(method, endpoint, formData)

}