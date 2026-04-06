<template>
  <div class="division-page q-pa-lg">

    <q-card flat bordered class="table-card">
      <q-card-section>
        
        <!-- Header -->
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="section-title">Division Management</div>
            <div class="section-sub">Configure organizational structure and manage department heads</div>
          </div>
          
          <div class="row items-center q-gutter-md">
            <!-- Search Bar -->
            <q-input v-model="searchQuery" dense outlined placeholder="Search division..." class="search-input">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <!-- Add Button -->
            <q-btn 
              unelevated 
              color="dark" 
              icon="domain_add" 
              label="Add Division" 
              size="sm" 
              class="action-btn-dark"
              @click="showAddModal = true" 
            />
          </div>
        </div>

        <!-- Table -->
        <q-table flat :rows="filteredDivisions" :columns="columns" row-key="id" hide-bottom class="directory-table">
          
          <!-- Division Name -->
          <template #body-cell-division="props">
            <q-td :props="props">
              <div class="division-name">{{ props.row.name }}</div>
              <div class="division-desc">{{ props.row.description }}</div>
            </q-td>
          </template>

          <!-- Head of Division -->
          <template #body-cell-head="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <!-- Mini Avatar for Head -->
                <q-avatar size="28px" :style="{ background: '#f2f4f7', color: '#475467', fontWeight: 600, fontSize: '10px' }">
                  {{ props.row.headInitials }}
                </q-avatar>
                <span class="head-name">{{ props.row.head }}</span>
              </div>
            </q-td>
          </template>

          <!-- Employee Count -->
          <template #body-cell-count="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-xs">
                <q-icon name="people" color="grey-6" size="16px" />
                <span class="emp-count">{{ props.row.count }} Employees</span>
              </div>
            </q-td>
          </template>

          <!-- Actions -->
          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm justify-end">
                <q-btn flat round dense icon="edit" size="sm" color="grey-6">
                  <q-tooltip>Edit Division</q-tooltip>
                </q-btn>
                <q-btn flat round dense icon="delete" size="sm" color="negative">
                  <q-tooltip>Delete Division</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

        </q-table>
        
        <!-- Pagination -->
        <div class="row items-center justify-between q-mt-md">
          <div class="pagination-info">Showing {{ filteredDivisions.length }} divisions</div>
          <q-pagination v-model="currentPage" :max="1" direction-links color="dark" active-color="dark" />
        </div>

      </q-card-section>
    </q-card>

    <!-- ADD DIVISION MODAL -->
    <q-dialog v-model="showAddModal" persistent>
      <q-card style="min-width: 450px; border-radius: 16px;">
        
        <!-- Header -->
        <q-card-section class="row items-center q-pb-none">
          <div class="modal-title">Add New Division</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>

        <q-separator color="grey-2" class="q-mt-md" />

        <!-- Form Elements -->
        <q-card-section class="q-pt-lg q-pb-sm">
          
          <div class="form-label">Division Name *</div>
          <q-input v-model="newDivision.name" outlined dense placeholder="e.g. Finance" class="q-mb-md input-styled" />
          
          <div class="form-label">Head of Division</div>
          <q-select v-model="newDivision.head" :options="managerOptions" outlined dense placeholder="Select Manager" class="q-mb-md input-styled" />

          <div class="form-label">Description (Optional)</div>
          <q-input v-model="newDivision.desc" type="textarea" outlined dense autogrow class="input-styled" placeholder="Brief details about the division..." />
        
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right" class="q-pt-md q-px-lg q-pb-lg">
          <q-btn outline label="Cancel" color="grey-7" class="btn-cancel" v-close-popup />
          <q-btn unelevated label="Create Division" color="dark" class="btn-submit" @click="saveDivision" />
        </q-card-actions>

      </q-card>
    </q-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const currentPage = ref(1)
const searchQuery = ref('')

const showAddModal = ref(false)

const managerOptions = [
  'Alexander Smith',
  'Maria Garcia',
  'Emily Chen',
  'Vacant (To be filled)'
]

const newDivision = ref({
  name: '',
  head: null,
  desc: ''
})

const divisions = ref([
  {
    id: 1,
    name: 'Tech & Engineering',
    description: 'Software development and IT infrastructure',
    head: 'Alexander Smith',
    headInitials: 'AS',
    count: 42
  },
  {
    id: 2,
    name: 'Human Resources',
    description: 'Talent acquisition, operations, and culture',
    head: 'Maria Garcia',
    headInitials: 'MG',
    count: 14
  },
  {
    id: 3,
    name: 'Finance & Operations',
    description: 'Accounting, payroll, and corporate budgets',
    head: 'Emily Chen',
    headInitials: 'EC',
    count: 22
  },
  {
    id: 4,
    name: 'Marketing & Sales',
    description: 'Client acquisition, inbound and outbound sales',
    head: 'Vacant',
    headInitials: 'V',
    count: 35
  }
])

const columns = [
  { name: 'division', label: 'DIVISION DETAILS', field: 'name', align: 'left' as const },
  { name: 'head', label: 'HEAD OF DIVISION', field: 'head', align: 'left' as const },
  { name: 'count', label: 'WORKFORCE', field: 'count', align: 'left' as const },
  { name: 'actions', label: '', field: 'actions', align: 'right' as const },
]

const filteredDivisions = computed(() => {
  if (!searchQuery.value) return divisions.value
  const q = searchQuery.value.toLowerCase()
  return divisions.value.filter(d => 
    d.name.toLowerCase().includes(q) || 
    d.head.toLowerCase().includes(q)
  )
})

const saveDivision = () => {
  // Mock save logic
  if(newDivision.value.name) {
    divisions.value.push({
      id: divisions.value.length + 1,
      name: newDivision.value.name,
      description: newDivision.value.desc || 'No description provided.',
      head: newDivision.value.head || 'Vacant',
      headInitials: newDivision.value.head ? String(newDivision.value.head).substring(0,2).toUpperCase() : 'V',
      count: 0
    });
    // Reset and close
    newDivision.value = { name: '', head: null, desc: '' };
    showAddModal.value = false;
  }
}
</script>

<style scoped>
.division-page {
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

/* TABLE TYPOGRAPHY */
.division-name {
  font-size: 14px;
  font-weight: 600;
  color: #101828;
}

.division-desc {
  font-size: 12px;
  color: #667085;
  margin-top: 2px;
}

.head-name {
  font-size: 13px;
  font-weight: 500;
  color: #344054;
}

.emp-count {
  font-size: 13px;
  font-weight: 500;
  color: #344054;
}

/* MODAL STYLES */
.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #101828;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #344054;
  margin-bottom: 6px;
}

.input-styled :deep(.q-field__control) {
  border-radius: 8px;
}

.btn-cancel {
  border-radius: 8px !important;
  font-size: 13px;
}

.btn-submit {
  background: #0f2044 !important;
  border-radius: 8px !important;
  font-size: 13px;
  padding: 0 16px;
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
