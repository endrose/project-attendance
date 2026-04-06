<template>
  <div class="employee-page q-pa-lg">

    <q-card flat bordered class="table-card">
      <q-card-section>
        
        <!-- Header -->
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="section-title">Employee Master Data</div>
            <div class="section-sub">Manage all employee records, departments, and roles</div>
          </div>
          
          <div class="row items-center q-gutter-md">
            <!-- Search Bar -->
            <q-input v-model="searchQuery" dense outlined placeholder="Search by NIK or name..." class="search-input">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <!-- Add Button -->
            <q-btn unelevated color="dark" icon="person_add" label="Add New Employee" size="sm" class="action-btn-dark" />
          </div>
        </div>

        <!-- Table -->
        <q-table flat :rows="filteredEmployees" :columns="columns" row-key="id" hide-bottom class="directory-table">
          
          <!-- Employee Profile -->
          <template #body-cell-profile="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <!-- If you had real images you could use <q-avatar><img src="..."></q-avatar> -->
                <q-avatar size="38px" :style="{ background: props.row.avatarBg, color: '#fff', fontWeight: 600, fontSize: '13px' }">
                  {{ props.row.initials }}
                </q-avatar>
                <div>
                  <div class="employee-name">{{ props.row.fullName }}</div>
                  <div class="employee-nik">{{ props.row.nik }}</div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Division & Position -->
          <template #body-cell-role="props">
            <q-td :props="props">
              <div class="employee-division">{{ props.row.division }}</div>
              <div class="employee-position">{{ props.row.position }}</div>
            </q-td>
          </template>

          <!-- Employment Status -->
          <template #body-cell-status="props">
            <q-td :props="props">
              <span :class="['status-badge', props.row.status === 'Permanent' ? 'status-badge--solid' : 'status-badge--outline']">
                {{ props.row.status }}
              </span>
            </q-td>
          </template>

          <!-- Actions -->
          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm justify-end">
                <q-btn flat round dense icon="visibility" size="sm" color="grey-6">
                  <q-tooltip>View Details</q-tooltip>
                </q-btn>
                <q-btn flat round dense icon="edit" size="sm" color="grey-6">
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

        </q-table>
        
        <!-- Pagination -->
        <div class="row items-center justify-between q-mt-md">
          <div class="pagination-info">Showing {{ filteredEmployees.length }} entries</div>
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

const employees = [
  {
    id: 1,
    nik: 'NIK-2023001',
    fullName: 'Alexander Smith',
    initials: 'AS',
    avatarBg: '#1a73e8',
    division: 'Engineering',
    position: 'Lead Backend Developer',
    joinDate: '12 Jan 2023',
    status: 'Permanent',
  },
  {
    id: 2,
    nik: 'NIK-2023045',
    fullName: 'Maria Garcia',
    initials: 'MG',
    avatarBg: '#6c63ff',
    division: 'Human Resources',
    position: 'HR Manager',
    joinDate: '01 Mar 2023',
    status: 'Permanent',
  },
  {
    id: 3,
    nik: 'NIK-2024012',
    fullName: 'Johnathan Doe',
    initials: 'JD',
    avatarBg: '#8a94a6',
    division: 'Marketing',
    position: 'Content Strategist',
    joinDate: '15 Feb 2024',
    status: 'Contract',
  },
  {
    id: 4,
    nik: 'NIK-2024018',
    fullName: 'Emily Chen',
    initials: 'EC',
    avatarBg: '#10b981',
    division: 'Finance',
    position: 'Senior Accountant',
    joinDate: '01 Apr 2024',
    status: 'Permanent',
  },
  {
    id: 5,
    nik: 'NIK-2024022',
    fullName: 'Marcus Johnson',
    initials: 'MJ',
    avatarBg: '#f59e0b',
    division: 'Sales',
    position: 'Sales Representative',
    joinDate: '10 May 2024',
    status: 'Contract',
  }
]

const columns = [
  { name: 'profile', label: 'EMPLOYEE & NIK', field: 'fullName', align: 'left' as const },
  { name: 'role', label: 'DIVISION & POSITION', field: 'division', align: 'left' as const },
  { name: 'joinDate', label: 'JOIN DATE', field: 'joinDate', align: 'left' as const },
  { name: 'status', label: 'EMPLOYMENT STATUS', field: 'status', align: 'left' as const },
  { name: 'actions', label: 'ACTIONS', field: 'actions', align: 'right' as const },
]

const filteredEmployees = computed(() => {
  if (!searchQuery.value) return employees
  const term = searchQuery.value.toLowerCase()
  return employees.filter(e => 
    e.fullName.toLowerCase().includes(term) || 
    e.nik.toLowerCase().includes(term) ||
    e.division.toLowerCase().includes(term)
  )
})
</script>

<style scoped>
.employee-page {
  background: #f5f7fa;
  min-height: 100vh;
}

/* LAYOUT */
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

.search-input {
  width: 260px;
}
.search-input :deep(.q-field__control) {
  border-radius: 8px;
}

/* BUTTONS */
.action-btn-dark {
  background: #0f2044 !important;
  color: #ffffff !important;
  border-radius: 8px;
  font-size: 13px;
  padding: 8px 16px;
}

/* TYPOGRAPHY IN TABLE */
.employee-name {
  font-size: 14px;
  font-weight: 600;
  color: #101828;
}

.employee-nik {
  font-size: 12px;
  color: #667085;
  margin-top: 2px;
}

.employee-division {
  font-size: 14px;
  font-weight: 500;
  color: #101828;
}

.employee-position {
  font-size: 12px;
  color: #667085;
  margin-top: 2px;
}

/* BADGES */
.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.3px;
  display: inline-block;
}

.status-badge--solid {
  background: #eff8ff;
  color: #175cd3;
}

.status-badge--outline {
  background: #fdf2fa;
  color: #c11574;
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
