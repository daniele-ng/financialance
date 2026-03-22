<script setup lang="ts">
import LineComponent from '@/components/charts/LineComponent.vue';
import type { LineChartType } from '@/components/charts/LineComponent.vue';
import DataLoaderComponent from '@/components/DataLoaderComponent.vue';
import LabelComponent from '@/components/form/LabelComponent.vue';
import SelectComponent from '@/components/form/SelectComponent.vue';
import { useFetch } from '@/lib/fetch';
import { currentYear, years } from '@/lib/years';
import type { InvoiceType } from '@/views/InvoicesView.vue';
import { onMounted, ref, type Ref } from 'vue';
import type { CostType } from './CostsView.vue';

const { pending, apiResponse, handlerFetch } = useFetch()

const year: Ref<number> = ref(currentYear)

const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales : {
        y: {
            beginAtZero: true
        }
    },
    borderWidth: 1,
}

const lineDatasets: Ref<LineChartType> = ref({
    labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
    datasets: [{ label: "Entrate " + year.value, backgroundColor: "#36A2EB33", borderColor: "#36A2EB", data: [] }]
})

onMounted(async () => {

    await updateChart()
})

async function getDataset(url: string): Promise<number[]> {

    await handlerFetch(url)

    const results: (InvoiceType | CostType)[] = apiResponse.value.data as (InvoiceType | CostType)[]

    const data: number[] = []

    if (typeof results !== "undefined" && results.length > 0) {

        const months: string[] = lineDatasets.value.labels

        months.forEach((month, index) => {            

            const itaMonthIndex = index + 1
            const monthResults: (InvoiceType | CostType)[] = results.filter((item) => item.month == itaMonthIndex)

            const sum: number = monthResults.reduce(
                (accumulator, result) => accumulator + result.amount,
                0,
            )

            data.push(sum)
        })
    }

    return data
}

async function updateChart() {

    const invoiceDataset: number[] = await getDataset("/api/invoices/" + year.value)

    const costDataset: number[] = await getDataset("/api/costs?year=" + year.value)
    
    lineDatasets.value = {
        ...lineDatasets.value,
        datasets: [
            {                    
                label: "Entrate " + year.value,
                backgroundColor: "#36A2EB33",
                borderColor: "#36A2EB",
                data: [...invoiceDataset]
            },
            {                    
                label: "Spese " + year.value,
                backgroundColor: "#FF638433",
                borderColor: "#FF6384",
                data: [...costDataset]
            }
        ]
    }
}

</script>

<template>
    <div class="mt-12">        
        <div v-if="pending" class="flex justify-center">
            <DataLoaderComponent :show="pending" />
        </div>
        <div v-else>
            <div v-if="apiResponse.error">
                <p class="text-red-500 text-center my-8">{{ apiResponse.error }}</p>
            </div>
            <div v-else>
                <div>
                    <div class="my-4">
                        <LabelComponent :for="'year'" :label="'Anno solare'" />
                        <div class="w-full max-w-[200px] inline-block ml-6">
                            <SelectComponent :id="'year'" :name="'year'" :required="false" :options="years"
                                v-model="year" :on-change="updateChart"/>
                        </div>
                    </div>                    
                </div>
                <div>                                                            
                    <LineComponent :options="chartOptions" :datasets="lineDatasets" />
                </div>                
            </div>
        </div>
    </div>
</template>