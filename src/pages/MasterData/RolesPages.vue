<template>
  <div class="roles-page q-pa-lg">

    <!-- Page Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="page-title">Roles & Permissions</div>
        <div class="page-sub">Configure access levels and module permissions across the organization</div>
      </div>
      <div>
        <q-btn unelevated color="dark" icon="admin_panel_settings" label="Create New Role" class="action-btn-dark" />
      </div>
    </div>

    <!-- Layout Split -->
    <div class="row q-col-gutter-lg">
      
      <!-- LEFT: Roles List -->
      <div class="col-12 col-md-3">
        <q-card flat bordered class="table-card full-height">
          <q-card-section class="q-pa-none">
            
            <div class="q-pa-md border-bottom">
              <div class="section-title">Available Roles</div>
            </div>

            <q-list class="roles-list">
              <q-item 
                v-for="role in roles" 
                :key="role.id" 
                clickable 
                v-ripple
                :active="activeRoleId === role.id"
                active-class="active-role-item"
                class="role-item"
                @click="activeRoleId = role.id"
              >
                <q-item-section>
                  <q-item-label class="role-name">{{ role.name }}</q-item-label>
                  <q-item-label caption class="role-users">{{ role.usersCount }} Users assigned</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" color="grey-5" size="xs" v-if="activeRoleId !== role.id" />
                </q-item-section>
              </q-item>
            </q-list>

          </q-card-section>
        </q-card>
      </div>

      <!-- RIGHT: Permission Configuration -->
      <div class="col-12 col-md-9">
        <q-card flat bordered class="table-card full-height">
          <q-card-section>
            
            <!-- Context Header -->
            <div class="row items-center justify-between q-mb-lg">
              <div>
                <div class="section-title">Module Permissions: <span class="text-primary">{{ activeRole?.name }}</span></div>
                <div class="section-sub">Adjust what this role can see and do within each module</div>
              </div>
              <q-btn outline color="primary" label="Save Changes" class="btn-outline-regular" size="sm" />
            </div>

            <!-- Permissions Table Matrix -->
            <q-table 
              flat 
              :rows="permissionsMatrix" 
              :columns="permissionColumns" 
              row-key="module" 
              hide-bottom 
              :pagination="{ rowsPerPage: 0 }"
              class="permissions-table"
            >
              
              <!-- Module Label -->
              <template #body-cell-module="props">
                <q-td :props="props">
                  <span class="module-name">{{ props.row.module }}</span>
                </q-td>
              </template>

              <!-- Read Toggle -->
              <template #body-cell-read="props">
                <q-td :props="props" class="text-center">
                  <q-toggle v-model="props.row.read" color="primary" dense />
                </q-td>
              </template>

              <!-- Write Toggle -->
              <template #body-cell-write="props">
                <q-td :props="props" class="text-center">
                  <q-toggle v-model="props.row.write" color="primary" dense />
                </q-td>
              </template>

              <!-- Delete Toggle -->
              <template #body-cell-delete="props">
                <q-td :props="props" class="text-center">
                  <q-toggle v-model="props.row.delete" color="negative" dense />
                </q-td>
              </template>

            </q-table>

          </q-card-section>
        </q-card>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeRoleId = ref(1)

const roles = [
  { id: 1, name: 'Super Admin', usersCount: 2 },
  { id: 2, name: 'Manager', usersCount: 15 },
  { id: 3, name: 'Staff', usersCount: 142 },
  { id: 4, name: 'HR Department', usersCount: 6 },
  { id: 5, name: 'Finance Controller', usersCount: 4 },
]

const activeRole = computed(() => roles.find(r => r.id === activeRoleId.value))

// DUMMY STATE - IN A REAL APP, THIS WOULD CHANGE BASED ON `activeRoleId`
const permissionsMatrix = ref([
  { module: 'Dashboard & Analytics', read: true, write: true, delete: false },
  { module: 'Time & Attendance', read: true, write: true, delete: true },
  { module: 'Payroll Processing', read: true, write: false, delete: false },
  { module: 'Employee Directory', read: true, write: true, delete: false },
  { module: 'Master Data Config', read: false, write: false, delete: false },
  { module: 'Settings & Security', read: false, write: false, delete: false },
])

const permissionColumns = [
  { name: 'module', label: 'APPLICATION MODULE', field: 'module', align: 'left' as const },
  { name: 'read', label: 'READ', field: 'read', align: 'center' as const },
  { name: 'write', label: 'WRITE', field: 'write', align: 'center' as const },
  { name: 'delete', label: 'DELETE', field: 'delete', align: 'center' as const },
]

</script>

<style scoped>
.roles-page {
  background: #f5f7fa;
  min-height: 100vh;
}

/* TYPOGRAPHY */
.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #101828;
}

.page-sub {
  font-size: 14px;
  color: #667085;
  margin-top: 4px;
}

.table-card {
  border-radius: 16px !important;
  background: #ffffff;
  border: 1px solid #eaecf0 !important;
}

.full-height {
  height: 100%;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #101828;
}

.border-bottom {
  border-bottom: 1px solid #eaecf0;
}

/* BUTTONS */
.action-btn-dark {
  background: #0f2044 !important;
  color: #ffffff !important;
  border-radius: 8px;
  font-size: 13px;
  padding: 8px 16px;
}

.btn-outline-regular {
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

/* LEFT LIST */
.roles-list {
  padding: 8px;
}

.role-item {
  border-radius: 8px;
  margin-bottom: 4px;
  padding: 12px 16px;
}

.role-name {
  font-size: 14px;
  font-weight: 600;
  color: #344054;
}

.role-users {
  font-size: 12px;
  color: #667085;
  margin-top: 2px;
}

.active-role-item {
  background: #eff8ff;
}

.active-role-item .role-name {
  color: #175cd3;
}

.active-role-item .role-users {
  color: #175cd3;
  opacity: 0.8;
}

/* PERMISSIONS MATRIX */
.module-name {
  font-size: 14px;
  font-weight: 600;
  color: #101828;
}

/* QUASAR TABLE OVERRIDES */
:deep(.permissions-table .q-table__top),
:deep(.permissions-table thead tr th) {
  font-size: 11px;
  font-weight: 600;
  color: #667085;
  background: #f9fafb;
  border-bottom: 1px solid #eaecf0;
  padding: 16px !important;
  letter-spacing: 0.5px;
}

:deep(.permissions-table tbody tr td) {
  border-bottom: 1px solid #eaecf0;
  padding: 14px 16px !important;
}

:deep(.permissions-table tbody tr:last-child td) {
  border-bottom: none;
}
</style>
