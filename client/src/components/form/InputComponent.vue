<script setup lang="ts">

defineProps<{
    id: string,
    name: string,
    type: string,
    placeholder?: string
    required?: boolean
}>()

const style: string = "w-full border h-9 px-2 box-border border-gray-200 focus:border-blue-300 focus:ring-0 focus:outline-none rounded-md shadow-sm"

</script>

<template>
    <input :class="style" :id="id" :name="name" :type="type" :placeholder="placeholder" :required="required" />
</template>