<script setup lang="ts">
import DataLoaderComponent from '@/components/DataLoaderComponent.vue';
import LinkButtonComponent from '@/components/LinkButtonComponent.vue';
import { useFetch } from '@/lib/fetch';
import { onMounted, ref, type Ref } from 'vue';

type TaxRateType = {

    revenue: number
    tax: number
    inps: number
    advanceTaxPayment: number
    year: number

}

const items: Ref<TaxRateType[] | undefined> = ref()

const { pending, apiResponse, handlerFetch } = useFetch()

const headers: string[] = ['Redditività', 'Imposta', 'Quota INPS' , 'Acconto tasse', 'Anno']

onMounted(async () => {

    await handlerFetch("/api/tax-rates")

    items.value = apiResponse.value.data as TaxRateType[]

})

</script>

<template>
    <div class="py-8 px-16 box-content">
        <h2 class="text-3xl text-blue-400 font-['Oxygen']">Dati fiscali</h2>
        <div v-if="pending" class="flex justify-center">
            <DataLoaderComponent :show="pending" />
        </div>
        <div v-else>
            <p v-if="apiResponse.error" class="text-red-500 text-center my-8">{{ apiResponse.error }}</p>
            <div v-if="typeof items !== 'undefined' && items.length == 0" class="text-center my-8">
                <p class="mb-12">Non sono stati ancora registrati i dati fiscali</p>
                <LinkButtonComponent :label="'Registra'" :href="'/new-tax-rate'" />
            </div>
            <div v-if="typeof items !== 'undefined' && items.length > 0" class="my-8">
                <LinkButtonComponent :label="'Nuovi dati'" :href="'/new-tax-rate'" />
                <table class="w-full border border-stone-200 my-12">
                    <thead>
                        <tr>
                            <th class="text-left py-2 px-3 border border-stone-100" v-for="header in headers">{{ header }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in items">
                            <td class="border border-stone-100 py-2 px-3">{{ item.revenue }}</td>
                            <td class="border border-stone-100 py-2 px-3">{{ item.tax }}</td>
                            <td class="border border-stone-100 py-2 px-3">{{ item.inps }}</td>
                            <td class="border border-stone-100 py-2 px-3">{{ item.advanceTaxPayment }}</td>
                            <td class="border border-stone-100 py-2 px-3">{{ item.year }}</td>                          
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>