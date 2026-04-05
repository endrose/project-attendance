<template>
  <div class="top-bar q-px-md q-px-lg-lg">

    <!-- DESKTOP LAYOUT -->
    <div class="row items-center justify-between full-width gt-sm">

      <!-- LEFT: Menu + Search -->
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

      <!-- CENTER: Title / Breadcrumb -->
      <div class="page-title">
        <template v-if="isDashboard">
          <div class="title-main">Workforce Central</div>
        </template>
        <template v-else>
          <q-breadcrumbs class="text-grey-7">
            <div class="page-title">
              <div class="title-main">
                <q-breadcrumbs-el v-for="(b, i) in breadcrumbs" :key="i" :label="b.label" :to="b.to" />
              </div>
            </div>
          </q-breadcrumbs>
        </template>
      </div>

      <!-- RIGHT: Actions + Profile -->
      <div class="row items-center q-gutter-sm">
        <q-btn flat round dense icon="notifications_none">
          <q-badge color="red" floating rounded>3</q-badge>
        </q-btn>
        <q-btn flat round dense icon="chat_bubble_outline" />
        <q-btn flat round dense icon="help_outline" />
        <q-btn unelevated color="primary" label="Quick Action" size="sm" />

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

    <!-- MOBILE LAYOUT -->
    <div class="lt-md">

      <!-- Row 1: Menu + Page Title + Avatar -->
      <div class="row items-center justify-between q-mb-xs">
        <div class="row items-center q-gutter-xs">
          <q-btn flat dense round icon="menu" @click="$emit('toggle-menu')" />
          <div class="mobile-title">
            <template v-if="isDashboard">Workforce Central</template>
            <template v-else>{{ pageTitle }}</template>
          </div>
        </div>

        <div class="row items-center q-gutter-xs">
          <q-btn flat round dense icon="notifications_none" size="sm">
            <q-badge color="red" floating rounded>3</q-badge>
          </q-btn>
          <q-btn flat round dense icon="help_outline" size="sm" />
          <q-avatar size="30px">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
        </div>
      </div>

      <!-- Row 2: Search -->
      <div class="mobile-search-wrapper">
        <q-input dense borderless placeholder="Search resources..." v-model="search">
          <template #prepend>
            <q-icon name="search" size="16px" />
          </template>
        </q-input>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

defineEmits(['toggle-menu'])

const search = ref('')
const route = useRoute()

const breadcrumbs = computed(() => {
  return (route.meta.breadcrumb as { label: string; to: string }[]) || []
})

const isDashboard = computed(() => route.path === '/')

const pageTitle = computed(() => {
  return (route.meta.title as string) || 'Page'
})
</script>

<style lang="scss" scoped>
.top-bar {
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  padding-top: 12px;
  padding-bottom: 12px;
}

/* SEARCH */
.search-wrapper {
  background: #f5f7fa;
  border-radius: 10px;
  padding: 2px 12px;
  min-width: 220px;
}

.mobile-search-wrapper {
  background: #f5f7fa;
  border-radius: 10px;
  padding: 2px 12px;
  width: 100%;
}

/* TITLE */
.page-title {
  font-weight: 600;
  font-size: 15px;
}

.title-main {
  font-weight: 700;
  font-size: 17px;
  color: var(--q-primary);
}

.mobile-title {
  font-weight: 700;
  font-size: 15px;
  color: #0f2044;
}

/* BREADCRUMB */
.q-breadcrumbs {
  font-size: 13px;
}

/* PROFILE */
.admin-name {
  font-size: 13px;
  font-weight: 600;
  color: #101828;
  white-space: nowrap;
}

.admin-role {
  font-size: 11px;
  color: #8a94a6;
  white-space: nowrap;
}
</style>
