<template>
  <div class="sidebar">

    <!-- Logo -->
    <div class="sidebar-logo">
      <!-- <div class="logo-icon">
        <q-icon name="grid_view" size="20px" color="white" />
      </div> -->
      <!-- LOGO DARI ASSET -->
      <div class="logo-icon">
        <img src="../../assets/png/logo.png" width="40px" alt="Logo Aksadigitex" class="logo-image" />
      </div>
      <div>
        <div class="logo-brand">Aksadigitex</div>
        <div class="logo-sub">WORKFORCE MANAGEMENT</div>
      </div>
    </div>

    <q-separator />

    <!-- Menu -->
    <q-list class="q-mt-sm">

      <template v-for="nav in navItems" :key="nav.key">

        <!-- 🔹 MENU TANPA CHILD -->
        <q-item v-if="!nav.children" clickable v-ripple :to="nav.to" exact class="sidebar-item" active-class="active">
          <q-item-section avatar>
            <q-icon :name="nav.icon" size="20px" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ nav.label }}</q-item-label>
          </q-item-section>
        </q-item>

        <!-- 🔥 MENU DENGAN CHILD (MASTER DATA) -->
        <q-expansion-item v-else expand-separator dense :icon="nav.icon" :label="nav.label" class="sidebar-expansion"
          :model-value="expanded[nav.key] ?? false" @update:model-value="val => expanded[nav.key] = val">

          <!-- CHILD MENU -->
          <q-item v-for="child in nav.children" :key="child.key" clickable v-ripple :to="child.to" class="sidebar-child"
            active-class="active">
            <q-item-section avatar>
              <q-icon :name="child.icon" size="18px" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ child.label }}</q-item-label>
            </q-item-section>
          </q-item>

        </q-expansion-item>

      </template>

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

      <q-item clickable v-ripple @click="handleLogout">
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
import { useRoute, useRouter } from 'vue-router'
import { computed, reactive, watchEffect } from 'vue'
import type { SidebarItem } from 'src/router/routes'
import { useAuthStore } from 'src/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore();

const navItems = computed<SidebarItem[]>(() => {
  return (route.meta.menu as SidebarItem[]) || []
})

// Inisialisasi semua key dengan false saat navItems tersedia
const expanded = reactive<Record<string, boolean>>({})

watchEffect(() => {
  navItems.value.forEach(nav => {
    if (nav.children) {
      const isChildActive = nav.children.some(child =>
        route.path.startsWith(child.to)
      )
      // ✅ selalu boolean, tidak pernah undefined
      expanded[nav.key] = isChildActive ?? false
    }
  })
})

 function handleLogout(){
  auth.logoutRemote();
  void router.replace('/login');
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
  transition: all 0.2s ease;
}

.sidebar-item:hover {
  background: #f5f7ff;
  color: #1a73e8;
}

.sidebar-item.active {
  background: #eff6ff;
  color: #1a73e8;
  font-weight: 600;
}

/* BOTTOM */
.sidebar-bottom {
  margin-top: auto;
  padding: 10px;
}

.sidebar-expansion {
  margin: 4px 10px;
  color: #6b7280;
  border-radius: 10px;
}

.sidebar-child {
  margin-left: 20px;
  border-radius: 8px;
  color: #6b7280;
}

.sidebar-child:hover {
  background: #f5f7ff;
  color: #1a73e8;
}
</style>
