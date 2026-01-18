<script setup lang="ts">

const selected = defineModel()

const props = defineProps<{
    id: string,
    name: string,
    options: { [key: string]: string }[]    
    required?: boolean
    onChange?: any
}>()

const style: string = "w-full bg-white border h-9 px-2 box-border border-gray-200 focus:border-blue-300 focus:ring-0 focus:outline-none rounded-md shadow-sm"

</script>

<template>
    <select :id="id" :name="name" :class="style" :required="required" v-model="selected" @change="onChange">
        <option v-for="value in options" v-bind:key="value.key" :value="value.key">{{ value.label }}</option>
    </select>
</template>