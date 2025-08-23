<script setup lang="ts">

import DataLoaderComponent from './DataLoaderComponent.vue';

defineProps<{
    title: string
    showLoader: boolean
    error: string    
}>()

</script>

<template>

    <div class="w-full max-w-[400px] h-[400px] mx-auto py-4 px-8 box-border bg-stone-100 rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <h3 class="text-[1.3rem] mb-4">{{ title }}</h3>
        <div v-if="showLoader" class="flex justify-center">
            <DataLoaderComponent :show="showLoader" />
        </div>
        <div v-else>
            <p v-if="error" class="text-red-500 text-center my-8">{{ error }}</p>            
            <slot></slot>
        </div>
    </div>

</template>