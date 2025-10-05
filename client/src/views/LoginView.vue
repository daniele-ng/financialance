<script setup lang="ts">
import ButtonComponent from '@/components/form/ButtonComponent.vue';
import ErrorMessageComponent from '@/components/form/ErrorMessageComponent.vue';
import InputComponent from '@/components/form/InputComponent.vue';
import LabelComponent from '@/components/form/LabelComponent.vue';
import { useForm } from '@/lib/form';
import { loginSchema } from '@/lib/zod/schemas/login.schema';

const { pending, errors, handlerOnSubmit } = useForm("Dashboard", true, false, loginSchema)

</script>

<template>
    <div class="mx-auto mt-12 w-full md:w-[80%] lg:w-[60%] box-border">
        <form action="/api/login" method="post" @submit="handlerOnSubmit">
            <div class="my-4">
                <LabelComponent :for="'pin'" :label="'Codice PIN'" />
            </div>
            <div class="w-full mb-10">
                <InputComponent :id="'pin'" :name="'pin'" :type="'password'" :placeholder="'codice pin'"
                    :required="false" />
                <ErrorMessageComponent :message="typeof errors?.pin !== 'undefined' ? errors.pin : ''" />                
                <ErrorMessageComponent :message="errors?.server?.toString() ?? ''" />
            </div>
            <div class="w-full text-center mb-10">
                <ButtonComponent :type="'submit'" :label="'Entra'" :show-loader="pending"/>
            </div>
            <div>
                <RouterLink to="/new-account" class="text-blue-400">Crea nuovo account</RouterLink>
            </div>
        </form>
    </div>
</template>