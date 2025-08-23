<script setup lang="ts">
import ButtonComponent from '@/components/form/ButtonComponent.vue';
import ErrorMessageComponent from '@/components/form/ErrorMessageComponent.vue';
import InputComponent from '@/components/form/InputComponent.vue';
import LabelComponent from '@/components/form/LabelComponent.vue';
import { useForm } from '@/lib/form';


const { pending, errors, handlerOnSubmit } = useForm("Login")

</script>

<template>
    <div class="py-8 px-16 box-content">
        <h2 class="text-2xl text-blue-400 font-['Oxygen']">Nuova account</h2>
        <div class="mx-auto mt-12 w-full md:w-[80%] lg:w-[60%] box-border">
            <form action="/api/user" method="post" @submit="handlerOnSubmit">
                <div class="my-4">
                    <LabelComponent :for="'first_name'" :label="'Nome'" />
                </div>
                <div class="w-full mb-6">
                    <InputComponent :id="'first_name'" :name="'first_name'" :type="'text'" :required="false" />
                    <ErrorMessageComponent
                        :message="typeof errors?.first_name != 'undefined' ? errors.first_name[0] : ''" />
                </div>
                <div class="my-4">
                    <LabelComponent :for="'last_name'" :label="'Cognome'" />
                </div>
                <div class="w-full mb-6">
                    <InputComponent :id="'last_name'" :name="'last_name'" :type="'text'" :required="false" />
                    <ErrorMessageComponent
                        :message="typeof errors?.last_name != 'undefined' ? errors.last_name[0] : ''" />
                </div>
                <div class="my-4">
                    <LabelComponent :for="'email'" :label="'Indirizzo e-mail'" />
                </div>
                <div class="w-full mb-6">
                    <InputComponent :id="'email'" :name="'email'" :type="'text'" :required="false" />
                    <ErrorMessageComponent :message="typeof errors?.email != 'undefined' ? errors.email[0] : ''" />
                </div>
                <div class="my-4">
                    <LabelComponent :for="'vat'" :label="'Partita IVA'" />
                </div>
                <div class="w-full mb-6">
                    <InputComponent :id="'vat'" :name="'vat_number'" :type="'text'" :required="false" />
                    <ErrorMessageComponent
                        :message="typeof errors?.vat_number != 'undefined' ? errors.vat_number[0] : ''" />
                </div>
                <div class="my-4">
                    <LabelComponent :for="'pin'" :label="'Codice PIN'" />
                </div>
                <div class="w-full mb-6">
                    <InputComponent :id="'pin'" :name="'pin'" :type="'password'" :required="false" />
                    <ErrorMessageComponent :message="typeof errors?.pin != 'undefined' ? errors.pin[0] : ''" />
                </div>
                <div class="w-full mb-10">
                    <ErrorMessageComponent :message="errors?.server?.toString() ?? ''" />
                </div>
                <div class="w-full text-center mb-10">
                    <ButtonComponent :type="'submit'" :label="'Crea account'" :show-loader="pending" />
                </div>
                <div>
                    <RouterLink to="/" class="text-blue-400">Torna indietro</RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>