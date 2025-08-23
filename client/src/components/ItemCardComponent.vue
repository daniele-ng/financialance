<script setup lang="ts">

defineProps<{
    labelColSx: string
    labelColDx: string
}>()

</script>

<template>
    <div class="flex flex-row mb-2 border-b border-b-stone-300">
        <div class="basis-[70%] text-[1rem]">{{ labelColSx }}</div>
        <div class="basis-[70%] text-[1rem]">{{ labelColDx }}</div>
    </div>    
</template>