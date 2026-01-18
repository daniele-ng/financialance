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

async function updateChart() {    

    await handlerFetch("/api/invoices/" + year.value)

    const invoices: InvoiceType[] = apiResponse.value.data as InvoiceType[]

    if (typeof invoices !== "undefined" && invoices.length > 0) {

        const months: string[] = lineDatasets.value.labels

        const data: number[] = []

        months.forEach((month, index) => {            

            const itaMonthIndex = index + 1
            const monthInvoices: InvoiceType[] = invoices.filter((item) => item.month == itaMonthIndex)

            const sum: number = monthInvoices.reduce(
                (accumulator, invoice) => accumulator + invoice.amount,
                0,
            )

            data.push(sum)
        })

        lineDatasets.value = {
            ...lineDatasets.value,
            datasets: [
                {                    
                    label: "Entrate " + year.value,
                    backgroundColor: "#36A2EB33",
                    borderColor: "#36A2EB",
                    data: [...data]
                }
            ]
        }
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