<script setup lang="ts">

defineProps<{
    label: string
    type: "button" | "submit" | "reset"
    showLoader: boolean
}>()

const style: string = "relative inline-flex items-center justify-center bg-stone-950 hover:bg-stone-500 py-2 px-8 border border-transparent rounded-lg text-white transition-colors delay-100 duration-300 ease-in"

</script>

<template>
    <button :type="type" :class="style">
        <span v-if="showLoader" class="h-[20px] w-[20px] border-[5px] border-dotted border-white rounded-full animate-spin"></span>
        <span :class="{ 'ml-2': showLoader }">{{ label }}</span>
    </button>
</template>