<script setup lang="ts">
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

import { watchEffect, ref, type Ref } from 'vue'

import { Line } from 'vue-chartjs'

export type LineDatasetsType = {
    label: string,
    backgroundColor: string,
    borderColor: string,
    data: number[]
}
export type LineChartType = {
    labels: string[],
    datasets: LineDatasetsType[]
}

const props = defineProps<{
    options: {},
    datasets: LineChartType
}>()

const chartData: Ref<LineChartType> = ref({ 
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
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

</script>

<template>
    <Line :data="chartData" :options="options" />
</template>