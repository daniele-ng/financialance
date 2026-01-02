<script setup lang="ts">
import BarComponent from '@/components/charts/BarComponent.vue';
import type { BarChartType } from '@/components/charts/BarComponent.vue';
import DataLoaderComponent from '@/components/DataLoaderComponent.vue';
import { useFetch } from '@/lib/fetch';
import { onMounted, ref, type Ref } from 'vue';

const { pending, apiResponse, handlerFetch } = useFetch()

const date = new Date()
const year: number = date.getFullYear()

const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales : {
        y: {
            beginAtZero: true
        }
    },
    borderWidth: 1,
    barThickness: 60
}

const barDatasets: Ref<BarChartType> = ref({
    labels: [],
    datasets: [{ 
        label: "Totale entrate anno solare", 
        backgroundColor: ["#FF638433", "#FF9F4033", "#FFCD5633", "#4BC0C033", "#36A2EB33"],
        borderColor: ["#FF6384", "#FF9F40", "#FFCD56", "#4BC0C0", "#36A2EB"],
        data: [] }]
})

onMounted(async () => {

    await handlerFetch('/api/financial-statement/annual-income?year_start=2025&year_end=' + year)

    const incomes: Array<{year: string, income: number}> = apiResponse.value.data as Array<{year: string, income: number}>

    barDatasets.value = {
        labels: incomes.map(item => item.year),
        datasets: [            
            {
                ...barDatasets.value.datasets[0],
                data: incomes.map(item => item.income),
            }
        ]
    }
})

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
                    <BarComponent :options="chartOptions" :datasets="barDatasets" />
                </div>
            </div>
        </div>
    </div>
</template>