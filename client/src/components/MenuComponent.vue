<script setup lang="ts">
import { ref, type Ref } from 'vue';

const isOpen: Ref<boolean> = ref(false)

</script>

<template>
    <nav class="pr-6 sm:pr-10 relative">

        <div class="hidden md:flex flex-row w-full">
            <div class="basis-auto text-blue-400 hover:text-stone-950 hover:cursor-pointer">
                <RouterLink to="/dashboard">Dashboard</RouterLink>
            </div>
            <div class="basis-auto text-blue-400 hover:text-stone-950 hover:cursor-pointer ml-5">
                <RouterLink to="/invoices">Fatture</RouterLink>
            </div>
            <div class="basis-auto text-blue-400 hover:text-stone-950 hover:cursor-pointer ml-5">
                <RouterLink to="/settings">Impostazioni</RouterLink>
            </div>
            <div class="basis-auto text-blue-400 hover:text-stone-950 hover:cursor-pointer ml-5">                
                <RouterLink to="/logout">Esci</RouterLink>
            </div>
        </div>

        <div class="block md:hidden" @click="isOpen = !isOpen">
            <div class="w-[30px] h-[4px] mb-1.5 rounded-xl bg-blue-400 cursor-pointer"></div>
            <div class="w-[30px] h-[4px] mb-1.5 rounded-xl  bg-blue-400 cursor-pointer"></div>
            <div class="w-[30px] h-[4px] bg-blue-400 cursor-pointer"></div>
        </div>
        <Transition name="slide-fade">
            <div v-if="isOpen"
                class="absolute top-8 right-0 bg-blue-400/80 px-3 py-2 w-[150px] shadow-md shadow-blue-800/25">
                <ul class="w-full box-content px-3">
                    <li class="py-2">
                        <RouterLink :class="'text-white'" to="/dashboard" @click="isOpen = false">Dashboard</RouterLink>
                    </li>
                    <li class="py-2">
                        <RouterLink :class="'text-white'" to="/invoices" @click="isOpen = false">Fatture</RouterLink>
                    </li>
                    <li class="py-2">
                        <RouterLink :class="'text-white'" to="/settings" @click="isOpen = false">Impostazioni</RouterLink>
                    </li>
                    <li class="py-2">
                        <RouterLink :class="'text-white'" to="/logout" @click="isOpen = false">Impostazioni</RouterLink>
                    </li>
                </ul>
            </div>
        </Transition>
    </nav>
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