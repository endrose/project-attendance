<template>
  <div class="leave-balance-page q-pa-lg">

    <q-card flat bordered class="table-card">
      <q-card-section>
        
        <!-- Header -->
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="section-title">Leave Balance & Quotas</div>
            <div class="section-sub">Track employee leave allocations and adjust annual balances</div>
          </div>
          
          <div class="row items-center q-gutter-md">
            <!-- Search Bar -->
            <q-input v-model="searchQuery" dense outlined placeholder="Search employee..." class="search-input">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <!-- Adjust Quota Action -->
            <q-btn unelevated color="dark" icon="edit_calendar" label="Adjust Global Quota" size="sm" class="action-btn-dark" />
          </div>
        </div>

        <!-- Table -->
        <q-table flat :rows="filteredBalances" :columns="columns" row-key="id" hide-bottom class="directory-table">
          
          <!-- Employee Profile -->
          <template #body-cell-employee="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <!-- Avatar Initial -->
                <q-avatar size="34px" :style="{ background: props.row.avatarBg, color: '#fff', fontWeight: 600, fontSize: '12px' }">
                  {{ props.row.initials }}
                </q-avatar>
                <div>
                  <div class="emp-name">{{ props.row.name }}</div>
                  <div class="emp-dept">{{ props.row.department }}</div>
                </div>
              </div>
            </q-td>
          </template>

          <template #body-cell-category="props">
            <q-td :props="props">
              <span class="category-text">
                <q-icon :name="getCategoryIcon(props.row.category)" size="16px" color="grey-6" class="q-mr-xs" />
                {{ props.row.category }}
              </span>
            </q-td>
          </template>

          <!-- Metrics (Allocated, Used) -->
          <template #body-cell-allocated="props">
            <q-td :props="props" class="text-center font-metric">
              {{ props.row.allocated }}
            </q-td>
          </template>
          
          <template #body-cell-used="props">
            <q-td :props="props" class="text-center font-metric font-metric--used">
              {{ props.row.used }}
            </q-td>
          </template>

          <!-- Remaining Balance with Visual progress -->
          <template #body-cell-remaining="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm justify-center">
                <span :class="['remaining-text', getRemainingClass(props.row.remaining, props.row.allocated)]">
                  {{ props.row.remaining }} Days
                </span>
                <q-linear-progress 
                  :value="props.row.remaining / props.row.allocated" 
                  :color="getProgressColor(props.row.remaining, props.row.allocated)"
                  track-color="grey-2" 
                  rounded 
                  size="6px"
                  style="width: 50px"
                />
              </div>
            </q-td>
          </template>

          <!-- Actions -->
          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm justify-end">
                <q-btn flat dense icon="restore" label="Reset" size="sm" color="grey-7" class="btn-text-action" />
                <q-btn flat dense icon="edit" label="Adjust" size="sm" color="primary" class="btn-text-action" />
              </div>
            </q-td>
          </template>

        </q-table>
        
        <!-- Pagination -->
        <div class="row items-center justify-between q-mt-md">
          <div class="pagination-info">Showing {{ filteredBalances.length }} records</div>
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

const balances = [
  {
    id: 1, name: 'Alexander Smith', initials: 'AS', avatarBg: '#1a73e8', department: 'Engineering',
    category: 'Annual Leave', allocated: 20, used: 15, remaining: 5
  },
  {
    id: 2, name: 'Maria Garcia', initials: 'MG', avatarBg: '#6c63ff', department: 'Human Resources',
    category: 'Annual Leave', allocated: 24, used: 2, remaining: 22
  },
  {
    id: 3, name: 'Johnathan Doe', initials: 'JD', avatarBg: '#8a94a6', department: 'Marketing',
    category: 'Sick Leave', allocated: 10, used: 8, remaining: 2
  },
  {
    id: 4, name: 'Emily Chen', initials: 'EC', avatarBg: '#10b981', department: 'Finance',
    category: 'Annual Leave', allocated: 20, used: 10, remaining: 10
  },
  {
    id: 5, name: 'David Lee', initials: 'DL', avatarBg: '#f59e0b', department: 'Sales',
    category: 'Maternity/Paternity', allocated: 90, used: 90, remaining: 0
  }
]

const columns = [
  { name: 'employee', label: 'EMPLOYEE', field: 'name', align: 'left' as const },
  { name: 'category', label: 'LEAVE CATEGORY', field: 'category', align: 'left' as const },
  { name: 'allocated', label: 'ALLOCATED', field: 'allocated', align: 'center' as const },
  { name: 'used', label: 'USED', field: 'used', align: 'center' as const },
  { name: 'remaining', label: 'REMAINING', field: 'remaining', align: 'center' as const },
  { name: 'actions', label: '', field: 'actions', align: 'right' as const },
]

const filteredBalances = computed(() => {
  if (!searchQuery.value) return balances
  const q = searchQuery.value.toLowerCase()
  return balances.filter(b => 
    b.name.toLowerCase().includes(q) || 
    b.category.toLowerCase().includes(q)
  )
})

// UI Helper Methods
const getCategoryIcon = (cat: string) => {
  if (cat.includes('Sick')) return 'medical_services'
  if (cat.includes('Maternity') || cat.includes('Paternity')) return 'child_care'
  return 'flight_takeoff'
}

const getRemainingClass = (rem: number, total: number) => {
  const ratio = rem / total
  if (ratio === 0) return 'text-negative'
  if (ratio < 0.3) return 'text-warning'
  return 'text-positive'
}

const getProgressColor = (rem: number, total: number) => {
  const ratio = rem / total
  if (ratio === 0) return 'negative'
  if (ratio < 0.3) return 'warning'
  return 'positive'
}

</script>

<style scoped>
.leave-balance-page {
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
  width: 240px;
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

/* TYPOGRAPHY */
.emp-name {
  font-size: 13px;
  font-weight: 600;
  color: #101828;
}

.emp-dept {
  font-size: 11px;
  color: #667085;
  margin-top: 2px;
}

.category-text {
  font-size: 13px;
  font-weight: 500;
  color: #344054;
  display: inline-flex;
  align-items: center;
}

.font-metric {
  font-size: 14px;
  font-weight: 600;
  color: #101828;
}

.font-metric--used {
  color: #667085;
}

.remaining-text {
  font-size: 13px;
  font-weight: 700;
  width: 50px;
  text-align: right;
  display: inline-block;
}

.btn-text-action {
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

/* OVERRIDE QUASAR TABLE */
:deep(.directory-table .q-table__top),
:deep(.directory-table thead tr th) {
  font-size: 11px;
  font-weight: 600;
  color: #667085;
  letter-spacing: 0.5px;
  background: #f9fafb;
  border-bottom: 1px solid #eaecf0;
  padding: 14px 16px;
}

:deep(.directory-table tbody tr td) {
  border-bottom: 1px solid #f2f4f7;
  padding: 12px 16px;
}

:deep(.directory-table tbody tr:last-child td) {
  border-bottom: none;
}

.pagination-info {
  font-size: 13px;
  color: #667085;
}
</style>
