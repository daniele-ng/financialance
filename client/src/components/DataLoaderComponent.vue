<script setup lang="ts">

defineProps<{

    show: boolean

}>()

</script>

<template>
    <Transition name="slide-fade">
        <div v-if="show" class="h-[35px] w-[35px] border-[8px] border-dotted border-blue-400 rounded-full animate-spin">
        </div>
    </Transition>
</template>

<style lang="css" scoped>
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}
</style>