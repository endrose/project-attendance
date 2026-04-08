<template>
  <div class="division-page q-pa-lg">
    <q-card flat bordered class="table-card">
      <q-card-section>
        <!-- Header -->
        <!-- ROW 1 -->
        <div class="row items-center justify-between q-mb-xs">

          <!-- TITLE -->
          <div class="section-title">
            Division Management
          </div>

          <!-- ACTION -->
          <div class="row items-center q-gutter-sm">

            <q-select v-model="selectedTenantId" :options="tenantOptions" dense outlined emit-value map-options
              class="tenant-select">
              <template v-slot:prepend>
                <q-icon name="business" />
              </template>
            </q-select>

            <q-input v-model="searchQuery" dense outlined placeholder="Search division..." class="search-input">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <q-btn unelevated color="dark" icon="domain_add" label="Add Division" class="add-btn"
              @click="openAddForm()" />

          </div>
        </div>

        <!-- ROW 2 -->
        <div class="section-sub q-mb-md">
          Configure organizational structure and manage department heads
        </div>

        <!-- Table -->
        <q-table flat :rows="filteredDivisions" :columns="columns" :loading="isLoading" row-key="id" hide-bottom
          class="directory-table">
          <template #body-cell-division="props">
            <q-td :props="props">
              <div class="division-name">{{ props.row.name }}</div>
            </q-td>
          </template>

          <template #body-cell-head="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <q-avatar size="28px"
                  :style="{ background: '#f2f4f7', color: '#475467', fontWeight: 600, fontSize: '10px' }">
                  {{ props.row.head ? props.row.head.substring(0, 2).toUpperCase() : '?' }}
                </q-avatar>
                <span class="head-name">{{ props.row.head || 'Not Assigned' }}</span>
              </div>
            </q-td>
          </template>

          <template #body-cell-count="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-xs">
                <q-icon name="people" color="grey-6" size="16px" />
                <span class="emp-count">{{ props.row.count || 0 }} Employees</span>
              </div>
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="row items-center justify-end action-group">
                <q-btn flat round dense icon="visibility" size="sm" class="action-btn view"
                  @click="openViewForm(props.row)" />
                <q-btn flat round dense icon="edit" size="sm" class="action-btn edit"
                  @click="openEditForm(props.row)" />
                <q-btn flat round dense icon="delete" size="sm" class="action-btn delete"
                  @click="confirmDelete(props.row)" />
              </div>
            </q-td>
          </template>
        </q-table>

        <div class="row items-center justify-between q-mt-md">
          <div class="pagination-info">Showing {{ filteredDivisions.length }} divisions</div>
          <q-pagination v-model="currentPage" :max="1" direction-links color="dark" active-color="dark" />
        </div>
      </q-card-section>
    </q-card>

    <!-- DIALOG -->
    <q-dialog v-model="showForm" persistent>
      <q-card class="modal-card" style="min-width: 400px">

        <!-- HEADER -->
        <q-card-section>
          <div class="modal-title">
            {{
              isView
                ? 'Division Details'
                : isEdit
                  ? 'Edit Division'
                  : 'Add Division'
            }}
          </div>

          <div class="section-sub">
            {{
              isView
                ? 'View division information'
                : 'Fill form below'
            }}
          </div>
        </q-card-section>

        <!-- ADD FORM -->
        <q-card-section class="q-gutter-md">
          <!-- INPUT -->
          <!-- <q-input v-model="activeForm.tenantId" label="Tenant" outlined dense :disable="isView || isEdit" /> -->
          <q-select v-model="activeForm.tenantId" :options="tenantOptions" label="Tenant" outlined dense emit-value
            map-options :disable="isView || isEdit" />
          <q-input v-model="activeForm.name" label="Division Name" outlined dense :disable="isView" />

        </q-card-section>

        <!-- ACTION -->
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />

          <q-btn v-if="!isView" label="Save" color="dark" unelevated :loading="isSubmitting" @click="saveDivision" />
        </q-card-actions>

      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import type { CreateDivisionRequestDto, DivisionResponsetDto } from 'src/shared/api/types/division.type'
import type { TenantResponseDto } from 'src/shared/api/types/tenant.types' // Import tipe tenant
import { getDivisionByTenandId, getTenants, createDivision, deleteDivision, updateDivision } from 'src/shared/services/backendApiContract'

const $q = useQuasar()

// State
const currentPage = ref(1)
const searchQuery = ref('')
const isLoading = ref(false)
let lastDivisionRequestId = 0

const defaultTenants = '1a780d07-dd9b-4b2f-83c5-1c0b0a5c676d'
const selectedTenantId = ref(defaultTenants)

const divisions = ref<DivisionResponsetDto[]>([])
const tenants = ref<TenantResponseDto[]>([]) // PERBAIKAN: State untuk menampung daftar tenant


const showForm = ref(false)
const isEdit = ref(false)
const isView = ref(false)
const isSubmitting = ref(false)
const selectedId = ref('')

watch(showForm, (val) => {
  if (!val) {
    isEdit.value = false
    isView.value = false
  }
})
const formDivision = ref<CreateDivisionRequestDto>({
  tenantId: defaultTenants,
  name: ''
})

const viewDivision = ref<DivisionResponsetDto>({
  id: '',
  tenantId: '',
  name: '',
  createdAt: '',
  updatedAt: ''
})

const activeForm = computed(() =>
  isView.value ? viewDivision.value : formDivision.value
)

const openAddForm = () => {
  isEdit.value = false
  isView.value = false

  formDivision.value = {
    tenantId: selectedTenantId.value,
    name: ''
  }

  showForm.value = true
}

const openEditForm = (row: DivisionResponsetDto) => {
  isEdit.value = true
  isView.value = false

  selectedId.value = row.id

  formDivision.value = {
    tenantId: row.tenantId,
    name: row.name
  }

  showForm.value = true
}

const openViewForm = (row: DivisionResponsetDto) => {
  isView.value = true
  isEdit.value = false

  viewDivision.value = { ...row }

  showForm.value = true
}

const saveDivision = async () => {
  if (!formDivision.value.name) {
    $q.notify({ color: 'warning', message: 'Division name is required' })
    return
  }

  isSubmitting.value = true

  try {
    if (isEdit.value) {
      // TODO: updateDivision API
      await updateDivision(formDivision.value, selectedId.value)
      $q.notify({ color: 'positive', message: 'Division updated successfully' })
    } else {
      await createDivision(formDivision.value)
      $q.notify({ color: 'positive', message: 'Division created successfully' })
    }

    showForm.value = false
    await fetchDivisionByTenant(selectedTenantId.value)

  } catch {
    $q.notify({ color: 'negative', message: 'Failed to save division' })
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (row: DivisionResponsetDto) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete division "${row.name}"?`,
    persistent: true,
    ok: {
      label: 'Delete',
      color: 'negative',
      flat: true
    },
    cancel: {
      label: 'Cancel',
      color: 'grey-7',
      flat: true
    }
  }).onOk(() => {
    void onDeleteDivision(row.id)
  })
}

const onDeleteDivision = async (id: string) => {
  // 1. Tampilkan loading overlay
  $q.loading.show({
    message: 'Deleting division...'
  })

  try {
    // 2. Eksekusi API call
    console.log({ id })
    await deleteDivision(id)

    // 3. Update State Lokal secara Reaktif
    // Menggunakan filter untuk menghapus data dari UI tanpa re-fetch
    divisions.value = divisions.value.filter(t => t.id !== id)

    // 4. Notifikasi Berhasil
    $q.notify({
      color: 'positive',
      message: 'Division deleted successfully',
      icon: 'delete'
    })
  } catch {
    // 5. Penanganan Error
    $q.notify({
      color: 'negative',
      message: 'Failed to delete Division. Please try again.'
    })
  } finally {
    // 6. Tutup loading overlay (selalu dijalankan baik sukses maupun gagal)
    $q.loading.hide()
  }
}

// --- COMPUTED ---

// PERBAIKAN: Mapping data tenants untuk opsi q-select
const tenantOptions = computed(() => {
  return tenants.value.map(t => ({
    label: t.name,
    value: t.id
  }))
})

const filteredDivisions = computed(() => {
  if (!searchQuery.value) return divisions.value
  const q = searchQuery.value.toLowerCase()
  return divisions.value.filter(d => d.name.toLowerCase().includes(q))
})

// --- FUNCTIONS ---

/**
 * Mengambil daftar semua tenant untuk dropdown q-select
 */
const fetchAllTenants = async () => {
  try {
    const data = await getTenants()
    tenants.value = data
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to load tenant list' })
  }
}

const fetchDivisionByTenant = async (tenantId: string | null) => {
  if (!tenantId) {
    divisions.value = []
    return
  }

  isLoading.value = true
  const requestId = ++lastDivisionRequestId

  try {
    const data = await getDivisionByTenandId(tenantId)
    if (requestId === lastDivisionRequestId) {
      divisions.value = data
    }
  } catch {
    if (requestId === lastDivisionRequestId) {
      divisions.value = []
      $q.notify({ color: 'negative', message: 'Failed to fetch divisions' })
    }
  } finally {
    if (requestId === lastDivisionRequestId) {
      isLoading.value = false
    }
  }
}

// --- LIFECYCLE & WATCHERS ---

onMounted(async () => {
  // Panggil list tenant dulu baru fetch division
  isLoading.value = true

  await fetchAllTenants()
  await fetchDivisionByTenant(selectedTenantId.value)
  isLoading.value = false

})

// Watcher untuk mendeteksi perubahan dropdown Tenant
watch(selectedTenantId, async (newVal) => {
  await fetchDivisionByTenant(newVal)
})

const columns = [
  { name: 'id', label: 'DIVISION ID', field: 'id', align: 'left' as const },
  { name: 'tenantId', label: 'TENANT ID', field: 'tenantId', align: 'left' as const },
  { name: 'division', label: 'NAME', field: 'name', align: 'left' as const }, // Menggunakan slot division
  { name: 'actions', label: 'ACTIONS', field: 'actions', align: 'right' as const },
]
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

/* Samakan tinggi semua */
.tenant-select,
.search-input,
.add-btn {
  height: 40px;
}

:deep(.q-field__control) {
  height: 40px;
  border-radius: 10px;
}

/* Lebar konsisten */
.search-input {
  width: 260px;
}

.tenant-select {
  width: 200px;
}

/* Button */
.add-btn {
  border-radius: 10px;
  padding: 0 18px;
  font-weight: 600;
}

.modal-card {
  border-radius: 14px;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
}

.action-group {
  gap: 6px;
}

/* Base style */
.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
}

/* Warna sesuai gambar */
.action-btn.view {
  color: #1570ef;
}

.action-btn.edit {
  color: #f59e0b;
}

.action-btn.delete {
  color: #ef4444;
}

/* Hover effect (biar modern) */
.action-btn:hover {
  background: #f2f4f7;
}

:deep(.q-field--disabled .q-field__control) {
  background: #f9fafb;
}
</style>
