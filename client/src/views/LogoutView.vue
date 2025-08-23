<script setup lang="ts">
import DataLoaderComponent from '@/components/DataLoaderComponent.vue';
import { Auth } from '@/lib/auth';
import { useFetch } from '@/lib/fetch';
import router from '@/router';
import { onMounted } from 'vue';


const { pending, apiResponse, handlerFetch } = useFetch()

onMounted(async () => {

    await handlerFetch('/api/logout')

    if (apiResponse.value.success) {

        Auth.deleteTokens()

        router.push({ name: "Login" })

    }

})

</script>

<template>
    <div class="py-8 px-16 box-content">
        <div v-if="pending" class="flex flex-col items-center">            
            <DataLoaderComponent :show="pending" />
            <p class="mt-2 text-[1.2rem] text-blue-500">Disconnessione in corso...</p>
        </div>
    </div>
</template>