<script setup lang="ts">

defineProps<{
    label: string
    for: string
}>()

</script>

<template>
    <label class="text-[1.2rem]" :for="for">{{ label }}</label>
</template>