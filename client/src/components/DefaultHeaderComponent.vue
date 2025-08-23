<script setup lang="ts">
import { Auth } from '@/lib/auth';
import MenuComponent from './MenuComponent.vue';

</script>

<template>
    <header class="w-full m-0 p-0">
        <div class="flex flex-row w-full">
            <div class="basis-[130px] justify-items-center content-center">
                <img class="w-full max-w-[64px]" src="../assets/img/logo_simple.svg" alt="Logo" title="Logo" />
            </div>
            <div class="basis-[calc(85%-130px)] content-center">
                <h1 class="text-blue-400 text-4xl font-normal font-['Kumbh_Sans']">Financialance</h1>
            </div>
            <div v-if="Auth.isAuthenticated()" class="basis-[10%] content-center">
                <MenuComponent />
            </div>          
        </div>        
    </header>
</template>