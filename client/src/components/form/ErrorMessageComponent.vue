<script setup lang="ts">

defineProps<{
    message: string
}>()

</script>

<template>
    <p aria-live="polite" class="text-red-600 mt-2">{{ message }}</p>
</template>