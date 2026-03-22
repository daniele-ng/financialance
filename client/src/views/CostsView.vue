<script setup lang="ts">
import DataLoaderComponent from '@/components/DataLoaderComponent.vue';
import LinkButtonComponent from '@/components/LinkButtonComponent.vue';
import TableHeaderComponent, { type HeaderType, type SortingType } from '@/components/TableHeaderComponent.vue';
import { useFetch } from '@/lib/fetch';
import { onMounted, ref, type Ref } from 'vue';

export type CostType = {

    id: number
    title: string
    date: string
    amount: number
    amount_it: string    
    month: number
    year: number
    note: string    

}

const items: Ref<CostType[] | undefined> = ref()

const { pending, apiResponse, handlerFetch } = useFetch()

const headers: HeaderType[] = [
    { label: "Data", sortable: true, sort_field: 'date' },
    { label: "Voce", sortable: true, sort_field: 'title' },
    { label: "Importo", sortable: true, sort_field: 'amount' },
    { label: "Note", sortable: true, sort_field: '' },
    { label: "", sortable: false, sort_field: '' },
]

onMounted(async () => {

    await fetchCosts()

})

async function fetchCosts(params?: SortingType) {

    let url: string  = "/api/costs"

    if (params != undefined) {

        url += "?sort=" + params.field + "&sort_direction=" + params.direction
    }    

    await handlerFetch(url)

    items.value = apiResponse.value.data as CostType[]
}

</script>

<template>
    <div class="py-8 px-16 box-content">
        <h2 class="text-3xl text-blue-400 font-['Oxygen']">Elenco voci di spesa</h2>
        <div v-if="pending" class="flex justify-center">
            <DataLoaderComponent :show="pending" />
        </div>
        <div v-else>
            <p v-if="apiResponse.error" class="text-red-500 text-center my-8">{{ apiResponse.error }}</p>
            <div v-if="typeof items !== 'undefined' && items.length == 0" class="text-center my-8">
                <p class="mb-12">Non sono state ancora registrate delle voci di spesa</p>
                <LinkButtonComponent :label="'Nuova voce di spesa'" :href="'/new-cost'" />
            </div>
            <div v-if="typeof items !== 'undefined' && items.length > 0" class="my-8">
                <LinkButtonComponent :label="'Nuova voce di spesa'" :href="'/new-cost'" />                
                <table class="w-full border border-stone-200 my-12">
                    <TableHeaderComponent :items="headers" :default_sort="{ field: 'date', direction: 'desc'}" @sorting="fetchCosts" />
                    <tbody>
                        <tr v-for="item in items">
                            <td class="border border-stone-100 py-2 px-3">{{ new Date(item.date).toLocaleDateString() }}</td>
                            <td class="border border-stone-100 py-2 px-3">{{ item.title }}</td>
                            <td class="border border-stone-100 py-2 px-3">{{ item.amount_it }}</td>
                            <td class="border border-stone-100 py-2 px-3">{{ item.note }}</td>
                            <td class="border border-stone-100 py-2 px-3 text-center">
                                <LinkButtonComponent :label="'Modifica'" :href="'/edit-cost/' + item.id" />
                            </td>                          
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>