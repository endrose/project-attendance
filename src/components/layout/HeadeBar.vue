<template>
  <div class="top-bar row items-center justify-between q-px-lg">

    <!-- LEFT -->
    <div class="row items-center q-gutter-sm">

      <q-btn flat dense round icon="menu" @click="$emit('toggle-menu')" class="menu-btn" />

      <!-- Search -->
      <div class="search-wrapper">
        <q-input dense borderless placeholder="Search resources..." v-model="search">
          <template #prepend>
            <q-icon name="search" size="18px" />
          </template>
        </q-input>
      </div>

    </div>

    <!-- CENTER -->
    <div class="page-title">
      Workforce Central
    </div>

    <!-- RIGHT -->
    <div class="row items-center q-gutter-sm">

      <q-btn flat round dense icon="notifications_none">
        <q-badge color="red" floating rounded>3</q-badge>
      </q-btn>

      <q-btn flat round dense icon="chat_bubble_outline" />
      <q-btn flat round dense icon="help_outline" />

      <q-btn unelevated color="primary" label="Quick Action" class="quick-action-btn" />

      <!-- Profile -->
      <div class="admin-profile row items-center q-ml-sm">
        <div class="text-right q-mr-sm">
          <div class="admin-name">Admin Center</div>
          <div class="admin-role">Super Admin</div>
        </div>

        <q-avatar size="36px">
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')
</script>
