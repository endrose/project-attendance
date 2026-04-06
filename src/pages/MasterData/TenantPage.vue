<template>
  <div class="tenant-page q-pa-lg">

    <q-card flat bordered class="table-card">
      <q-card-section>

        <!-- Header -->
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="section-title">Tenant Management</div>
            <div class="section-sub">Manage all registered tenants and their operational status</div>
          </div>

          <div class="row items-center q-gutter-md">
            <!-- Search Bar -->
            <q-input v-model="searchQuery" dense outlined placeholder="Search tenants..." class="search-input">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <!-- Add Button -->
            <q-btn unelevated color="dark" icon="add_business" label="Add New Tenant" size="sm" class="action-btn-dark"
              @click="openForm()" />
          </div>
        </div>

        <!-- Table -->
        <q-table flat :rows="filteredTenants" :columns="columns" row-key="id" hide-bottom class="directory-table">

          <!-- Company Name -->
          <template #body-cell-company="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <q-avatar size="38px"
                  :style="{ background: props.row.avatarBg, color: '#fff', fontWeight: 600, fontSize: '13px' }">
                  {{ props.row.initials }}
                </q-avatar>
                <div>
                  <div class="company-name">{{ props.row.company }}</div>
                  <div class="tenant-id">{{ props.row.tenantId }}</div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Status -->
          <template #body-cell-status="props">
            <q-td :props="props">
              <span
                :class="['status-badge', props.row.status === 'ACTIVE' ? 'status-badge--active' : 'status-badge--inactive']">
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
                <q-btn flat round dense icon="delete" size="sm" color="negative">
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

        </q-table>

        <!-- Pagination (Dummy) -->
        <div class="row items-center justify-between q-mt-md">
          <div class="pagination-info">Showing {{ filteredTenants.length }} entries</div>
          <q-pagination v-model="currentPage" :max="1" direction-links color="dark" active-color="dark" />
        </div>

      </q-card-section>

      <!-- MODAL -->
      <q-dialog v-model="showForm">
        <q-card class="modal-card">

          <!-- Header -->
          <div class="modal-header">
            <div>
              <div class="modal-title">
                {{ isEdit ? 'Edit Tenant' : 'Add New Tenant' }}
              </div>
              <div class="modal-sub">
                Fill the form below to {{ isEdit ? 'update tenant' : 'create a new tenant' }}
              </div>
            </div>
          </div>

          <!-- Form -->
          <div class="q-mt-md q-gutter-md">

            <q-input v-model="form.name" label="Tenant Name" outlined dense />

            <q-input v-model="form.tenantId" label="Tenant ID" outlined dense />



          </div>

          <!-- Actions -->
          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn label="Save" color="dark" />
          </div>

        </q-card>
      </q-dialog>
    </q-card>

  </div>
</template>

<script setup lang="ts">
import type { CreateTenantRequestDto, TenantResponseDto } from 'src/shared/api/types/tenant.types'
import { getTenants } from 'src/shared/services/backendApiContract'
import { ref, computed, onMounted } from 'vue'

const currentPage = ref(1)
const searchQuery = ref('')
const showForm = ref(false)
const isEdit = ref(false)
const isLoading = ref(false);
const tenantId = ref('1a780d07-dd9b-4b2f-83c5-1c0b0a5c676d');

const tenants = ref<TenantResponseDto[]>([]);

const form = ref<CreateTenantRequestDto>({
  tenantId: '',
  name: ''
})


onMounted(async () => {
  // Fetch tenants
  isLoading.value = true;
  try {
    tenants.value = await getTenants(tenantId.value);

  } catch {
    tenants.value = [];
  } finally {
    isLoading.value = false;
  }
})



const openForm = () => {
  isEdit.value = false

  form.value = {
    tenantId: '',
    name: ''
  }

  showForm.value = true
}



const columns = [
  { name: 'tenantId', label: 'TENANT ID', field: 'tenantId', align: 'left' as const },
  { name: 'name', label: 'NAME', field: 'name', align: 'left' as const },
  { name: 'actions', label: 'ACTIONS', field: 'actions', align: 'right' as const },
]

const filteredTenants = computed(() => {
  if (!searchQuery.value) return tenants.value

  const q = searchQuery.value.toLowerCase()

  return tenants.value.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.tenantId.toLowerCase().includes(q)
  )
})
</script>

<style scoped>
.tenant-page {
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

/* TABLE STYLES */
.company-name {
  font-size: 14px;
  font-weight: 600;
  color: #101828;
}

.tenant-id {
  font-size: 12px;
  color: #667085;
  margin-top: 2px;
}

.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}

.status-badge--active {
  background: #e6f9f0;
  color: #027a48;
}

.status-badge--inactive {
  background: #f2f4f7;
  color: #667085;
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


.modal-card {
  width: 420px;
  padding: 20px;
  border-radius: 14px;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: #101828;
}

.modal-sub {
  font-size: 12px;
  color: #667085;
  margin-top: 2px;
}
</style>
