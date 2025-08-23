/**
 * Composable to deal with axios request
 */
import { ref, type Ref } from 'vue'
import { ajaxRequestWithBearerToken, type AxiosResponseJsonType } from './axios-wrapper'

type ApiResponseType = { success: boolean, message: string, error: string, data?: any }

export function useFetch() {

    const pending: Ref<boolean> = ref(true)

    const apiResponse: Ref<ApiResponseType> = ref({ success: false, message: "", error: "" })

    async function handlerFetch(url: string) {

        const endpoint: string = import.meta.env.VITE_API_SERVER_URL + url

        const response: AxiosResponseJsonType = await ajaxRequestWithBearerToken('get', endpoint)

        if (response.success) {

            apiResponse.value = response.body as ApiResponseType

        }
        else {

            apiResponse.value.error = "Impossibile connettersi alla risorsa"

        }        

        pending.value = false
    }

    return { pending, apiResponse, handlerFetch }
}