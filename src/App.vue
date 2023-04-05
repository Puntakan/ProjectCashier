<script setup>
import NavBar from './component/Nav.vue';
import { RouterView } from 'vue-router';
</script>

<template>
    <div class="w-full h-screen bg-white">
        <div class="w-full h-14 bg" style="background: #DFE6F9;">
            <div class="flex flex-row w-full h-full">
                <div class="w-48 h-full font-bold text-xl flex items-center justify-center"
                    style="background-color: #304477; color: #FFC635;">
                    203 Store
                </div>
                <NavBar class="w-40 h-full flex items-center justify-center font-sans text-lg text-black ml-14 space-x-16" />
            </div>
        </div>
        <RouterView></RouterView>
    </div>
</template>

<style scoped></style>