<script setup lang="ts">

defineProps<{
    label: string
    href: string
}>()

const style: string = "relative inline-flex items-center justify-center bg-blue-400 hover:bg-blue-500 py-2 px-8 border border-transparent rounded-lg text-white transition-colors delay-100 duration-300 ease-in"

</script>

<template>    
    <RouterLink :class="style" :to="href">{{ label }}</RouterLink>
</template>