<script setup lang="ts">

defineProps<{
    id: string,
    name: string,
    options: { [key: string]: string }[]
    selectedOption?: string
    required?: boolean
}>()

const style: string = "w-full border h-9 px-2 box-border border-gray-200 focus:border-blue-300 focus:ring-0 focus:outline-none rounded-md shadow-sm"

</script>

<template>
    <select :id="id" :name="name" :class="style" :required="required">
        <option v-for="value in options" v-bind:key="value.key" :value="value.key" :selected="selectedOption == value.key">{{ value.label }}</option>
    </select>
</template>