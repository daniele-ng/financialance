<script setup lang="ts">
import DataLoaderComponent from '@/components/DataLoaderComponent.vue';
import LinkButtonComponent from '@/components/LinkButtonComponent.vue';
import TableHeaderComponent, { type HeaderType, type SortingType } from '@/components/TableHeaderComponent.vue';
import { useFetch } from '@/lib/fetch';
import { onMounted, ref, type Ref } from 'vue';

export type InvoiceType = {

    id: number,
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

const headers: HeaderType[] = [
    { label: "Data", sortable: true, sort_field: 'date' },
    { label: "Codice", sortable: true, sort_field: 'code' },
    { label: "Importo", sortable: true, sort_field: 'amount' },
    { label: "Cliente", sortable: true, sort_field: 'company' },    
    { label: "Pagata", sortable: false, sort_field: ''},
    { label: "", sortable: false, sort_field: '' },
]

onMounted(async () => {

    await fetchInvoices()

})

async function fetchInvoices(params?: SortingType) {

    let url: string  = "/api/invoices"

    if (params != undefined) {

        url += "?sort=" + params.field + "&sort_direction=" + params.direction
    }    

    await handlerFetch(url)

    items.value = apiResponse.value.data as InvoiceType[]
}

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
                    <TableHeaderComponent :items="headers" :default_sort="{ field: 'date', direction: 'desc'}" @sorting="fetchInvoices" />
                    <tbody>
                        <tr v-for="item in items">
                            <td class="border border-stone-100 py-2 px-3">{{ new Date(item.date).toLocaleDateString() }}</td>
                            <td class="border border-stone-100 py-2 px-3">{{ item.code }}</td>
                            <td class="border border-stone-100 py-2 px-3">{{ item.amount_it }}</td>
                            <td class="border border-stone-100 py-2 px-3">{{ item.company }}</td>                            
                            <td class="border border-stone-100 py-2" :class="{'bg-green-700': item.paid == 1, 'bg-red-700': item.paid == 0}" ></td>                          
                            <td class="border border-stone-100 py-2 px-3 text-center">
                                <LinkButtonComponent :label="'Modifica'" :href="'/edit-invoice/' + item.id" />
                            </td>                          
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>