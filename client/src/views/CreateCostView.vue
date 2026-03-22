<script setup lang="ts">

import ButtonComponent from '@/components/form/ButtonComponent.vue';
import ErrorMessageComponent from '@/components/form/ErrorMessageComponent.vue';
import InputComponent from '@/components/form/InputComponent.vue';
import LabelComponent from '@/components/form/LabelComponent.vue';
import { useForm } from '@/lib/form';
import { costSchema } from '@/lib/zod/schemas/cost.schema';


const { pending, errors, handlerOnSubmit } = useForm("Costs", false, true, costSchema)

</script>

<template>
    <div class="py-8 px-16 box-content">
        <h2 class="text-2xl text-blue-400 font-['Oxygen']">Nuova voce di spesa</h2>
        <div class="mx-auto mt-12 w-full md:w-[80%] lg:w-[60%] box-border">
            <form action="/api/cost" method="post" @submit="handlerOnSubmit">
                <div class="my-4">
                    <LabelComponent :for="'title'" :label="'Voce di spesa'" />
                </div>
                <div class="w-full mb-6">
                    <InputComponent :id="'title'" :name="'title'" :type="'text'" :required="false" />
                    <ErrorMessageComponent :message="typeof errors?.title != 'undefined' ? errors.title : ''" />
                </div>
                <div class="my-4">
                    <LabelComponent :for="'date'" :label="'Data'" />
                </div>
                <div class="w-full mb-6">
                    <InputComponent :id="'date'" :name="'date'" :type="'date'" :required="false" :placeholder="'gg/mm/aaaa'" />
                    <ErrorMessageComponent :message="typeof errors?.date != 'undefined' ? errors.date : ''" />
                </div>
                <div class="my-4">
                    <LabelComponent :for="'amount'" :label="'Importo'" />
                </div>
                <div class="w-full mb-6">
                    <InputComponent :id="'amount'" :name="'amount'" :type="'text'" :required="false" :placeholder="'10.00'" />
                    <ErrorMessageComponent :message="typeof errors?.amount != 'undefined' ? errors.amount : ''" />
                </div>
                <div class="my-4">
                    <LabelComponent :for="'note'" :label="'Note'" />
                </div>
                <div class="w-full mb-6">
                    <InputComponent :id="'note'" :name="'note'" :type="'text'" :required="false" />
                    <ErrorMessageComponent :message="typeof errors?.note != 'undefined' ? errors.note : ''" />
                </div>
                <div class="w-full mb-10">
                    <ErrorMessageComponent :message="errors?.server?.toString() ?? ''" />
                </div>
                <div class="w-full text-center mb-10">
                    <ButtonComponent :type="'submit'" :label="'Registra spesa'" :show-loader="pending" />
                </div>
                <div>
                    <RouterLink to="/costs" class="text-blue-400">Torna indietro</RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>