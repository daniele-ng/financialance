/**
 * Composable to deal with form data submitting
 */
import { ref, type Ref } from 'vue'
import { ajaxRequest,  ajaxRequestWithBearerToken,  type AxiosResponseJsonType } from './axios-wrapper'
import router from '@/router'
import { Auth } from './auth'

export function useForm(redirectTo: string, isLogin: boolean = false, credentials: boolean = false) {

    const pending: Ref<boolean> = ref(false)

    const errors: Ref<{ [key:string]: string[] | string } | undefined> = ref({})

    async function handlerOnSubmit(e: Event) {

        e.preventDefault()        

        const form: HTMLFormElement = e.target as HTMLFormElement

        const endpoint: string = import.meta.env.VITE_API_SERVER_URL + form.getAttribute("action")        

        const method: string = form.getAttribute("method") ?? "post"

        const formData = new FormData(form)

        errors.value = {}

        pending.value = true

        const response: AxiosResponseJsonType = credentials ? await ajaxRequestWithBearerToken(method, endpoint, formData) :  await ajaxRequest(method, endpoint, formData)        

        if (response.success) {            
            
            if (response.body?.success === false) {

                errors.value = { server: response.body.error }
            }
            else {

                if (isLogin) {

                    Auth.storeTokens([
                        { access_token: response.body?.data.access_token },
                        { refresh_token: response.body?.data.refresh_token }
                    ])

                }

                router.push({ name: redirectTo })

            }            
        }
        else {

            errors.value = response.errors
        }        
        
        pending.value = false
    }

    return { pending, errors, handlerOnSubmit }
}