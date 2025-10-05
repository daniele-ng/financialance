/**
 * Composable to deal with form data submitting
 */
import { ref, type Ref } from 'vue'
import { ajaxRequest, ajaxRequestWithBearerToken, type AxiosResponseJsonType } from './axios-wrapper'
import router from '@/router'
import { Auth } from './auth'
import { ZodValidation } from './zod/validation'
import type { ZodObject } from 'zod'
import { invoiceSchema } from './zod/schemas/invoice.schema'

export function useForm(redirectTo: string, isLogin: boolean = false, credentials: boolean = false, zodSchema?: ZodObject) {

    const pending: Ref<boolean> = ref(false)

    const errors: Ref<{ [key: string]: string } | undefined> = ref({})

    const zodValidation = new ZodValidation();

    async function handlerOnSubmit(e: Event) {

        e.preventDefault()

        const form: HTMLFormElement = e.target as HTMLFormElement

        const endpoint: string = import.meta.env.VITE_API_SERVER_URL + form.getAttribute("action")

        const method: string = form.getAttribute("method") ?? "post"

        const formData = new FormData(form)

        errors.value = {}

        if (typeof zodSchema !== "undefined") {

            if (zodValidation.validate(formData, zodSchema) === false) {

                errors.value = zodValidation.getErrors()                
            }
        } 

        if (Object.keys(errors.value).length == 0) {

            pending.value = true

            const response: AxiosResponseJsonType = credentials ? await ajaxRequestWithBearerToken(method, endpoint, formData) : await ajaxRequest(method, endpoint, formData)

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

                for (const key in response.errors) {

                    errors.value[key] = Array.isArray(response.errors[key]) ? response.errors[key][0] : response.errors[key]
                }                
            }

            pending.value = false
        }
    }

    return { pending, errors, handlerOnSubmit }
}