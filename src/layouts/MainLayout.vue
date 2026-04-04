<template>
  <q-layout view="lHh Lpr lFf">

    <!-- Sidebar -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="220" class="sidebar">
      <Sidebar />
    </q-drawer>

    <!-- Header -->
    <q-header class="bg-white text-dark">
      <HeaderBar @toggle-menu="toggleLeftDrawer" />
    </q-header>

    <!-- Content -->
    <q-page-container class="main-container">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeaderBar from 'src/components/layout/HeadeBar.vue' // ✅ WAJIB
import Sidebar from 'src/components/layout/SideBar.vue' // ✅ WAJIB

const leftDrawerOpen = ref(true)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
