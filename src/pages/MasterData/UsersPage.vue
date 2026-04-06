<template>
  <div class="users-page q-pa-lg">

    <q-card flat bordered class="table-card">
      <q-card-section>
        
        <!-- Header -->
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="section-title">User Management</div>
            <div class="section-sub">Manage system users, access roles, and monitor account activity</div>
          </div>
          
          <div class="row items-center q-gutter-md">
            <!-- Search Bar -->
            <q-input v-model="searchQuery" dense outlined placeholder="Search username or email..." class="search-input">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <!-- Invite Button -->
            <q-btn unelevated color="dark" icon="person_add" label="Invite User" size="sm" class="action-btn-dark" />
          </div>
        </div>

        <!-- Table -->
        <q-table flat :rows="filteredUsers" :columns="columns" row-key="id" hide-bottom class="directory-table">
          
          <!-- User Profile Column -->
          <template #body-cell-user="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <!-- Fallback Initial Avatar -->
                <q-avatar size="38px" :style="{ background: props.row.avatarBg, color: '#fff', fontWeight: 600, fontSize: '13px' }">
                  {{ props.row.initials }}
                </q-avatar>
                <div>
                  <div class="user-name">{{ props.row.username }}</div>
                  <div class="user-email">{{ props.row.email }}</div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Assigned Role -->
          <template #body-cell-role="props">
            <q-td :props="props">
              <div class="user-role">{{ props.row.role }}</div>
            </q-td>
          </template>

          <!-- Status Indicator -->
          <template #body-cell-status="props">
            <q-td :props="props">
              <span :class="['status-badge', props.row.status === 'Active' ? 'status-badge--active' : 'status-badge--inactive']">
                <span class="status-dot" :class="props.row.status === 'Active' ? 'status-dot--green' : 'status-dot--red'"></span>
                {{ props.row.status }}
              </span>
            </q-td>
          </template>

          <!-- Actions -->
          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm justify-end">
                <q-btn flat round dense icon="vpn_key" size="sm" color="grey-6">
                  <q-tooltip>Reset Password</q-tooltip>
                </q-btn>
                <q-btn flat round dense icon="edit" size="sm" color="grey-6">
                  <q-tooltip>Edit Configuration</q-tooltip>
                </q-btn>
                <q-btn flat round dense icon="delete" size="sm" color="negative">
                  <q-tooltip>Remove Login</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

        </q-table>
        
        <!-- Pagination Layout -->
        <div class="row items-center justify-between q-mt-md">
          <div class="pagination-info">Showing {{ filteredUsers.length }} users</div>
          <q-pagination v-model="currentPage" :max="1" direction-links color="dark" active-color="dark" />
        </div>

      </q-card-section>
    </q-card>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const currentPage = ref(1)
const searchQuery = ref('')

const users = [
  {
    id: 1,
    username: 'alex.smith',
    email: 'alex.smith@example.local',
    initials: 'AS',
    avatarBg: '#1a73e8',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: 'Today, 08:24 AM'
  },
  {
    id: 2,
    username: 'm.garcia',
    email: 'm.garcia@globalcorp.net',
    initials: 'MG',
    avatarBg: '#6c63ff',
    role: 'Manager',
    status: 'Active',
    lastLogin: 'Yesterday, 04:12 PM'
  },
  {
    id: 3,
    username: 'john.doe',
    email: 'john.doe@company.local',
    initials: 'JD',
    avatarBg: '#8a94a6',
    role: 'Staff',
    status: 'Inactive',
    lastLogin: 'Oct 15, 2026'
  },
  {
    id: 4,
    username: 'e.chen',
    email: 'emily.chen@example.local',
    initials: 'EC',
    avatarBg: '#10b981',
    role: 'HR Department',
    status: 'Active',
    lastLogin: 'Today, 09:15 AM'
  },
  {
    id: 5,
    username: 'd.lee',
    email: 'david.lee@globalcorp.net',
    initials: 'DL',
    avatarBg: '#f59e0b',
    role: 'Staff',
    status: 'Inactive',
    lastLogin: 'Sep 28, 2026'
  }
]

const columns = [
  { name: 'user', label: 'USER DETAILS', field: 'username', align: 'left' as const },
  { name: 'role', label: 'ASSIGNED ROLE', field: 'role', align: 'left' as const },
  { name: 'status', label: 'STATUS', field: 'status', align: 'left' as const },
  { name: 'lastLogin', label: 'LAST LOGIN', field: 'lastLogin', align: 'left' as const },
  { name: 'actions', label: '', field: 'actions', align: 'right' as const },
]

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users
  const q = searchQuery.value.toLowerCase()
  return users.filter(u => 
    u.username.toLowerCase().includes(q) || 
    u.email.toLowerCase().includes(q)
  )
})
</script>

<style scoped>
.users-page {
  background: #f5f7fa;
  min-height: 100vh;
}

/* CARDS & LAYOUT */
.table-card {
  border-radius: 16px !important;
  background: #ffffff;
  border: 1px solid #eaecf0 !important;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #101828;
}

.section-sub {
  font-size: 13px;
  color: #667085;
  margin-top: 2px;
}

/* INPUTS & BUTTONS */
.search-input {
  width: 260px;
}
.search-input :deep(.q-field__control) {
  border-radius: 8px;
}

.action-btn-dark {
  background: #0f2044 !important;
  color: #ffffff !important;
  border-radius: 8px;
  font-size: 13px;
  padding: 8px 16px;
}

/* USER TABLE TYPOGRAPHY */
.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #101828;
}

.user-email {
  font-size: 12px;
  color: #667085;
  margin-top: 2px;
}

.user-role {
  font-size: 13px;
  font-weight: 500;
  color: #344054;
}

/* STATUS BADGES WITH CSS DOTS */
.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  letter-spacing: 0.3px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Modern Pill styling */
.status-badge--active {
  background: #ffffff;
  border: 1px solid #d1fadf;
  color: #027a48;
}

.status-badge--inactive {
  background: #ffffff;
  border: 1px solid #fee4e2;
  color: #b42318;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot--green {
  background-color: #12b76a;
}

.status-dot--red {
  background-color: #f04438;
}

/* OVERRIDE QUASAR TABLE */
:deep(.directory-table .q-table__top),
:deep(.directory-table thead tr th) {
  font-size: 12px;
  font-weight: 600;
  color: #667085;
  letter-spacing: 0.5px;
  background: #f9fafb;
  border-bottom: 1px solid #eaecf0;
  padding: 12px 16px;
}

:deep(.directory-table tbody tr td) {
  border-bottom: 1px solid #f2f4f7;
  padding: 14px 16px;
}

:deep(.directory-table tbody tr:last-child td) {
  border-bottom: none;
}

.pagination-info {
  font-size: 13px;
  color: #667085;
}
</style>
