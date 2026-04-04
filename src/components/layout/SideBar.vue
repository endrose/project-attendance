<template>
  <div class="sidebar">

    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon">
        <q-icon name="grid_view" size="20px" color="white" />
      </div>
      <div>
        <div class="logo-brand">Aksadigitex</div>
        <div class="logo-sub">WORKFORCE MANAGEMENT</div>
      </div>
    </div>

    <q-separator />

    <!-- Menu -->
    <q-list class="q-mt-sm">

      <q-item v-for="nav in navItems" :key="nav.label" clickable v-ripple
        :class="['sidebar-item', { active: nav.active }]" @click="setActive(nav)">
        <q-item-section avatar>
          <q-icon :name="nav.icon" size="20px" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ nav.label }}</q-item-label>
        </q-item-section>
      </q-item>

    </q-list>

    <!-- Bottom -->
    <div class="sidebar-bottom">

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="add_circle_outline" color="primary" />
        </q-item-section>
        <q-item-section class="text-primary">
          New Request
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="help_outline" />
        </q-item-section>
        <q-item-section>
          Help Center
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>
        <q-item-section>
          Logout
        </q-item-section>
      </q-item>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type NavItem = {
  label: string
  icon: string
  active: boolean
}

const navItems = ref<NavItem[]>([
  { label: 'Dashboard', icon: 'dashboard', active: true },
  { label: 'Directory', icon: 'people_outline', active: false },
  { label: 'Time & Attendance', icon: 'access_time', active: false },
  { label: 'Payroll', icon: 'credit_card', active: false },
  { label: 'Performance', icon: 'trending_up', active: false },
  { label: 'Settings', icon: 'settings', active: false }
])

function setActive(nav: NavItem) {
  navItems.value.forEach(n => (n.active = false))
  nav.active = true
}
</script>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

/* LOGO */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1a73e8, #0052cc);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-brand {
  font-weight: 700;
  font-size: 14px;
}

.logo-sub {
  font-size: 10px;
  color: #8a94a6;
}

/* MENU */
.sidebar-item {
  border-radius: 10px;
  margin: 4px 10px;
  color: #6b7280;
}

.sidebar-item:hover {
  background: #f5f7ff;
  color: #1a73e8;
}

.sidebar-item.active {
  background: #eff6ff;
  color: #1a73e8;
}

/* BOTTOM */
.sidebar-bottom {
  margin-top: auto;
  padding: 10px;
}
</style>
