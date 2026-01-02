<script setup lang="ts">
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,    
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

import { watchEffect, ref, type Ref } from 'vue'

import { Bar } from 'vue-chartjs'

export type BarDatasetsType = {
    label: string,
    backgroundColor: string[],
    borderColor: string[],    
    data: number[]
}

export type BarChartType = {
    labels: string[],
    datasets: BarDatasetsType[]
}

const props = defineProps<{
    options: {},
    datasets: BarChartType
}>()

const chartData: Ref<BarChartType> = ref({
    labels: [...props.datasets.labels],
    datasets: props.datasets.datasets.map(ds => ({ ...ds }))
})

watchEffect(() => {
    chartData.value = {
        labels: [...props.datasets.labels],
        datasets: props.datasets.datasets.map(ds => ({ ...ds })) 
    }
})

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

</script>

<template>
    <Bar :data="chartData" :options="options" />
</template>