<script setup lang="ts">
import DataLoaderComponent from '@/components/DataLoaderComponent.vue';
import LinkButtonComponent from '@/components/LinkButtonComponent.vue';
import { useFetch } from '@/lib/fetch';
import { onMounted, ref, type Ref } from 'vue';

export type InvoiceType = {

    code: string
    date: string
    amount: number
    amount_it: string
    company: string
    month: number
    year: number
    paid: number
    user: any

}
const items: Ref<InvoiceType[] | undefined> = ref()

const { pending, apiResponse, handlerFetch } = useFetch()

const headers: string[] = ['Codice', 'Importo', 'Cliente' , 'Data', 'Pagata']

onMounted(async () => {

    await handlerFetch("/api/invoices")

    items.value = apiResponse.value.data as InvoiceType[]

})

</script>

<template>
    <div class="py-8 px-16 box-content">
        <h2 class="text-3xl text-blue-400 font-['Oxygen']">Elenco fatture</h2>
        <div v-if="pending" class="flex justify-center">
            <DataLoaderComponent :show="pending" />
        </div>
        <div v-else>
            <p v-if="apiResponse.error" class="text-red-500 text-center my-8">{{ apiResponse.error }}</p>
            <div v-if="typeof items !== 'undefined' && items.length == 0" class="text-center my-8">
                <p class="mb-12">Non sono state ancora registrate delle fatture</p>
                <LinkButtonComponent :label="'Registra fattura'" :href="'/new-invoice'" />
            </div>
            <div v-if="typeof items !== 'undefined' && items.length > 0" class="my-8">
                <LinkButtonComponent :label="'Registra fattura'" :href="'/new-invoice'" />
                <table class="w-full border border-stone-200 my-12">
                    <thead>
                        <tr>
                            <th class="text-left py-2 px-3 border border-stone-100" v-for="header in headers">{{ header }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in items">
                            <td class="border border-stone-100 py-2 px-3">{{ item.code }}</td>
                            <td class="border border-stone-100 py-2 px-3">{{ item.amount_it }}</td>
                            <td class="border border-stone-100 py-2 px-3">{{ item.company }}</td>
                            <td class="border border-stone-100 py-2 px-3">{{ new Date(item.date).toLocaleDateString() }}</td>
                            <td class="border border-stone-100 py-2 px-3" :class="{'bg-green-700': item.paid == 1, 'bg-red-700': item.paid == 0}" ></td>                          
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>