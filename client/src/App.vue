<script setup lang="ts">
import DefaultHeaderComponent from './components/DefaultHeaderComponent.vue';
import LoginHeaderComponent from './components/LoginHeaderComponent.vue';

</script>

<template>    
    <LoginHeaderComponent v-if="$route.name == 'Login'" />
    <DefaultHeaderComponent v-else />
    <div id="container" class="w-full h-auto m-0 p-0">
        <RouterView />
    </div>    
</template>
