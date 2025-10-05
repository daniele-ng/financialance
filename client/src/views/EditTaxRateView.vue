<script setup lang="ts">
import ButtonComponent from '@/components/form/ButtonComponent.vue';
import ErrorMessageComponent from '@/components/form/ErrorMessageComponent.vue';
import InputComponent from '@/components/form/InputComponent.vue';
import LabelComponent from '@/components/form/LabelComponent.vue';
import { useForm } from '@/lib/form';
import { onMounted, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import type { TaxRateType } from './SettingsView.vue';
import { useFetch } from '@/lib/fetch';

const route = useRoute()

const item: Ref<TaxRateType | undefined> = ref()

const { apiResponse, handlerFetch } = useFetch()

const { pending, errors, handlerOnSubmit } = useForm("Settings", false, true)

onMounted(async() => {

    await handlerFetch("/api/tax-rate/" + route.params.year)

    item.value = apiResponse.value.data as TaxRateType
})

</script>

<template>
    <div class="py-8 px-16 box-content">
        <h2 class="text-2xl text-blue-400 font-['Oxygen']">Modifica dati fiscali</h2>
        <div class="mx-auto mt-12 w-full md:w-[80%] lg:w-[60%] box-border">
            <form action="/api/tax-rate" method="put" @submit="handlerOnSubmit">
                <input type="hidden" name="id" :value="item?.id" />
                <div class="my-4">
                    <LabelComponent :for="'revenue'" :label="'Coefficiente redditività ATECO'" />
                </div>
                <div class="w-full mb-6">
                    <InputComponent :id="'revenue'" :name="'revenue'" :value="item?.revenue" :type="'text'" :required="false" />
                    <ErrorMessageComponent :message="typeof errors?.revenue != 'undefined' ? errors.revenue : ''" />
                </div>
                <div class="my-4">
                    <LabelComponent :for="'tax'" :label="'Imposta sostitutiva'" />
                </div>
                <div class="w-full mb-6">
                    <InputComponent :id="'tax'" :name="'tax'" :value="item?.tax" :type="'text'" :required="false" />
                    <ErrorMessageComponent :message="typeof errors?.tax != 'undefined' ? errors.tax : ''" />
                </div>
                <div class="my-4">
                    <LabelComponent :for="'inps'" :label="'Contributi previdenziali'" />
                </div>
                <div class="w-full mb-6">
                    <InputComponent :id="'inps'" :name="'inps'" :value="item?.inps" :type="'text'" :required="false" />
                    <ErrorMessageComponent :message="typeof errors?.inps != 'undefined' ? errors.inps : ''" />
                </div>
                <div class="my-4">
                    <LabelComponent :for="'advanceTaxPayment'" :label="'Anticipo tasse anno successivo'" />
                </div>
                <div class="w-full mb-6">
                    <InputComponent :id="'advanceTaxPayment'" :name="'advanceTaxPayment'" :value="item?.advanceTaxPayment" :type="'text'"
                        :required="false" />
                    <ErrorMessageComponent
                        :message="typeof errors?.advanceTaxPayment != 'undefined' ? errors.advanceTaxPayment : ''" />
                </div>
                <div class="my-4">
                    <LabelComponent :for="'year'" :label="'Anno'" />
                </div>
                <div class="w-full mb-6">
                    <InputComponent :id="'year'" :name="'year'" :value="item?.year" :type="'text'" :required="false" />
                    <ErrorMessageComponent :message="typeof errors?.year != 'undefined' ? errors.year : ''" />
                </div>
                <div class="w-full mb-10">
                    <ErrorMessageComponent :message="errors?.server?.toString() ?? ''" />
                </div>
                <div class="w-full text-center mb-10">
                    <ButtonComponent :type="'submit'" :label="'Salva modifiche'" :show-loader="pending" />
                </div>
                <div>
                    <RouterLink to="/settings" class="text-blue-400">Torna indietro</RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>