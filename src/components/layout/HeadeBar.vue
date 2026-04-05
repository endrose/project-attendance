<template>
  <div class="top-bar column q-px-lg">
    <div class="row items-center justify-between">

      <!-- LEFT -->
      <div class="row items-center q-gutter-sm">
        <q-btn flat dense round icon="menu" @click="$emit('toggle-menu')" />
        <div class="search-wrapper">
          <q-input dense borderless placeholder="Search resources..." v-model="search">
            <template #prepend>
              <q-icon name="search" size="18px" />
            </template>
          </q-input>
        </div>
      </div>

      <!-- 🔥 TITLE TENGAH -->
      <div class="page-title">
        <!-- Dashboard: statis -->
        <template v-if="isDashboard">
          <div class="title-main">Workforce Central</div>
        </template>

        <!-- Halaman lain: breadcrumb -->
        <template v-else>
          <q-breadcrumbs class="text-grey-7">
            <q-breadcrumbs-el v-for="(b, i) in breadcrumbs" :key="i" :label="b.label" :to="b.to" />
          </q-breadcrumbs>
        </template>
      </div>

      <!-- RIGHT -->
      <div class="row items-center q-gutter-sm">
        <q-btn flat round dense icon="notifications_none">
          <q-badge color="red" floating rounded>3</q-badge>
        </q-btn>
        <q-btn flat round dense icon="chat_bubble_outline" />
        <q-btn flat round dense icon="help_outline" />
        <q-btn unelevated color="primary" label="Quick Action" />

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const search = ref('')
const route = useRoute()

const breadcrumbs = computed(() => {
  return (route.meta.breadcrumb as { label: string; to: string }[]) || []
})

const isDashboard = computed(() => route.path === '/')
</script>

<style lang="scss" scoped>
.q-breadcrumbs {
  font-size: 13px;
}

.page-title {
  font-weight: 600;
  font-size: 16px;
}

.title-main {
  font-weight: 700;
  font-size: 18px;
  color: var(--q-primary);
}
</style>
