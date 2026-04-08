<template>
  <div class="employee-page q-pa-lg">

    <q-card flat bordered class="table-card">
      <q-card-section>

        <!-- Header -->
        <!-- ROW 1 -->
        <div class="row items-center justify-between q-mb-xs">

          <!-- TITLE -->
          <div class="section-title">
            Employee Master Data
          </div>

          <!-- ACTION -->
          <div class="row items-center q-gutter-sm">

            <q-select v-model="selectedTenantId" :options="tenantOptions" dense outlined emit-value map-options
              class="tenant-select" />

            <q-input v-model="searchQuery" dense outlined placeholder="Search employees..." class="search-input">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <q-btn unelevated color="indigo-10" icon="person_add" label="ADD NEW EMPLOYEE" class="add-btn"
              @click="openForm" />

          </div>
        </div>

        <!-- ROW 2 (SUBTITLE) -->
        <div class="section-sub q-mb-md">
          Manage all employee records, departments, and roles
        </div>

        <!-- Table -->
        <q-table flat :rows="filteredEmployees" :columns="columns" row-key="id" hide-bottom class="directory-table">

          <!-- Employee Profile -->
          <template #body-cell-profile="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <!-- If you had real images you could use <q-avatar><img src="..."></q-avatar> -->
                <q-avatar size="38px"
                  :style="{ background: props.row.avatarBg, color: '#fff', fontWeight: 600, fontSize: '13px' }">
                  {{ props.row.initials }}
                </q-avatar>
                <div>
                  <div class="employee-name">{{ props.row.fullName }}</div>
                  <div class="employee-nik">{{ props.row.nik }}</div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Employee Position -->
          <template #body-cell-role="props">
            <q-td :props="props">
              <div class="employee-position">{{ props.row.position }}</div>
            </q-td>
          </template>

          <!-- Employment Status -->
          <template #body-cell-status="props">
            <q-td :props="props">
              <span
                :class="['status-badge', props.row.status === 'Permanent' ? 'status-badge--solid' : 'status-badge--outline']">
                {{ props.row.status }}
              </span>
            </q-td>
          </template>

          <!-- Actions -->
          <template #body-cell-actions="props">
            <q-td :props="props" class="text-right">
              <div class="action-group">
                <q-btn flat round dense icon="visibility" size="sm" color="primary" @click="openViewForm(props.row)">
                  <q-tooltip>View Details</q-tooltip>
                </q-btn>

                <q-btn flat round dense icon="edit" size="sm" color="warning" @click="openEditForm(props.row)">
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>

                <q-btn flat round dense icon="delete" size="sm" color="negative" @click="confirmDelete(props.row)">
                  <q-tooltip>Delete</q-tooltip>
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


      <!-- DIALOG FORM -->
      <q-dialog v-model="showForm" persistent>
        <q-card class="modal-card">
          <q-card-section class="modal-header">
            <div class="modal-title">
              {{ isView ? 'Employee Details' : isEdit ? 'Edit Employee' : 'Add New Employee' }}
            </div>
            <div class="modal-sub">
              {{ isView ? 'View information for this record' : 'Fill the form below to manage employee data' }}
            </div>
          </q-card-section>


          <!-- FORM VIEW  -->
          <q-card-section class="q-pt-none q-gutter-md">
            <q-select v-model="activeForm.tenantId" :options="tenantOptions" label="Tenant" outlined dense emit-value
              map-options :disable="isView" />

            <q-select v-model="activeForm.divisionId" :options="divisionOptions" label="Division" outlined dense
              emit-value map-options :disable="isView || !activeForm.tenantId" :loading="isLoading" />

            <q-input v-model="activeForm.fullName" label="Full Name" outlined dense :disable="isView" />

            <q-input v-model="activeForm.employeeCode" label="Employee Code" outlined dense :disable="isView" />

            <q-input v-model="activeForm.position" label="Position" outlined dense :disable="isView" />

            <q-input v-model.number="activeForm.basicSalary" label="Basic Salary" type="number" outlined dense
              :disable="isView" />
          </q-card-section>

          <q-card-actions class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn flat label="Cancel" color="grey-7" v-close-popup />
            <q-btn v-if="!isView" label="Save" color="dark" unelevated :loading="isSubmitting" @click="saveEmployee" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>

  </div>
</template>

<script setup lang="ts">
import type { CreateEmployeeRequestDto, EmployeeResponseDto, } from 'src/shared/api/types/employee.type'
import type { TenantResponseDto } from 'src/shared/api/types/tenant.types'
import type { DivisionResponsetDto } from 'src/shared/api/types/division.type'
import { getEmployeeByTenandId, getTenants, createEmployee, getDivisionByTenandId, getEmployeeById, updateEmployee } from 'src/shared/services/backendApiContract'
import { useQuasar } from 'quasar'

const $q = useQuasar()

import { ref, computed, onMounted, watch } from 'vue'
import { deleteEmployee } from '../../shared/services/backendApiContract'

const currentPage = ref(1)
const searchQuery = ref('')
const isLoading = ref(false)
const defaultTenants = '1a780d07-dd9b-4b2f-83c5-1c0b0a5c676d';
const showForm = ref(false)
const isEdit = ref(false)
const isView = ref(false)
const isSubmitting = ref(false)
let lastDivisionRequestId = 0
const selectedId = ref('')


const employeeViewFrom = ref<EmployeeResponseDto>({
  id: '',
  tenantId: '',
  divisionId: '',
  employeeCode: '',
  fullName: '',
  position: '',
  basicSalary: 0,
  facePhotoUrl: '',
  faceEmbedding: '',
})

const openEditForm = async (row: EmployeeResponseDto) => {
  isEdit.value = true
  isView.value = false
  showForm.value = true
  isLoading.value = true

  try {
    const data = await getEmployeeById(row.id)
    selectedId.value = data.id

    formEmployee.value = {
      tenantId: data.tenantId,
      divisionId: data.divisionId,
      employeeCode: data.employeeCode,
      fullName: data.fullName,
      position: data.position,
      basicSalary: data.basicSalary,
      facePhotoUrl: data.facePhotoUrl ?? '',
      faceEmbedding: data.faceEmbedding ?? '',
      companyCode: '' // kalau belum ada dari API
    }

  } catch {
    $q.notify({
      color: 'negative',
      message: 'Failed to fetch employee detail'
    })
  } finally {
    isLoading.value = false
  }
}

const employees = ref<EmployeeResponseDto[]>([])
const tenants = ref<TenantResponseDto[]>([])
const divisions = ref<DivisionResponsetDto[]>([])

const selectedTenantId = ref(defaultTenants)  // State untuk tenant yang dipilih
// const selectedEmployeeId = ref('')  // State untuk tenant yang dipilih

const activeForm = computed(() =>
  isView.value ? viewFormEmployee.value : formEmployee.value
)

const formEmployee = ref<CreateEmployeeRequestDto>({
  tenantId: defaultTenants,
  divisionId: '',
  employeeCode: '',
  fullName: '',
  position: '',
  basicSalary: 0,
  facePhotoUrl: '',
  faceEmbedding: '',
  companyCode: ''

})

const viewFormEmployee = ref<EmployeeResponseDto>({
  id: '',
  tenantId: defaultTenants,
  divisionId: '',
  employeeCode: '',
  fullName: '',
  position: '',
  basicSalary: 0,
  facePhotoUrl: '',
  faceEmbedding: '',

})

const openForm = () => {
  isEdit.value = false
  isView.value = false
  formEmployee.value = {
    tenantId: defaultTenants,
    divisionId: '',
    employeeCode: '',
    fullName: '',
    position: '',
    basicSalary: 0,
    facePhotoUrl: '',
    faceEmbedding: '',
    companyCode: ''
  }
  showForm.value = true
}

const openViewForm = async (row: EmployeeResponseDto) => {
  isView.value = true
  isEdit.value = false

  showForm.value = true
  isLoading.value = true

  try {
    const data = await getEmployeeById(row.id)

    viewFormEmployee.value = {
      id: data.id,
      tenantId: data.tenantId,
      divisionId: data.divisionId,
      employeeCode: data.employeeCode,
      fullName: data.fullName,
      position: data.position,
      basicSalary: data.basicSalary,
      facePhotoUrl: data.facePhotoUrl || '',
      faceEmbedding: data.faceEmbedding || '',
    }

  } catch {
    $q.notify({
      color: 'negative',
      message: 'Failed to fetch employee detail'
    })
  } finally {
    isLoading.value = false
  }
}

// const openViewForm = async (row: EmployeeResponseDto) => {
//   const data = await getEmployeeById(row.id)
//   viewFormEmployee.value = {
//     id: data.id,
//     tenantId: data.tenantId,
//     divisionId: data.divisionId,
//     employeeCode: data.employeeCode,
//     fullName: data.fullName,
//     position: data.position,
//     basicSalary: data.basicSalary,
//     facePhotoUrl: data.facePhotoUrl || '',
//     faceEmbedding: data.faceEmbedding || '',
//   }
// }

const columns = [
  { name: 'id', label: 'EMPLOYEE ID', field: 'id', align: 'left' as const },
  { name: 'tenantId', label: 'TENANT ID', field: 'tenantId', align: 'left' as const },
  { name: 'divisionId', label: 'DIVISION ID', field: 'divisionId', align: 'left' as const },
  { name: 'employeeCode', label: 'EMPLOYEE CODE', field: 'employeeCode', align: 'left' as const },
  { name: 'fullName', label: 'FULLNAME', field: 'fullName', align: 'left' as const },
  { name: 'position', label: 'POSITION', field: 'position', align: 'left' as const },
  { name: 'basicSalary', label: 'SALARY', field: 'basicSalary', align: 'left' as const },
  { name: 'actions', label: 'ACTIONS', field: 'actions', align: 'right' as const },
]

// 2. Watcher: Mendeteksi perubahan pada dropdown selectedTenantId
watch(selectedTenantId, async (newId) => {
  // Jika dropdown di-clear (null), kembali ke default atau kosongkan
  const idToFetch = newId || defaultTenants
  await fetchEmployeesByTenant(idToFetch)
})

// 3. Watcher: Mendeteksi perubahan pada formEmployee
watch(() => formEmployee.value.tenantId, async (newTenantId) => {
  formEmployee.value.divisionId = ''
  await fetchDivisionByTenant(newTenantId)
})

onMounted(async () => {

  isLoading.value = true
  await fetchAllTenants()
  await fetchEmployees()
  await fetchEmployeesByTenant(selectedTenantId.value || defaultTenants)
  await fetchDivisionByTenant(selectedTenantId.value || defaultTenants)
  await fetchEmployeesById(null)
  isLoading.value = false

  // const initTenantId = selectedTenantId.value || defaultTenants
  // await Promise.all([
  //   fetchAllTenants(),
  //   fetchEmployees(),

  //   fetchEmployeesByTenant(initTenantId)
  // ])
})


// 1. Tambahkan fetchTenants (semua tenant) untuk dropdown
const fetchAllTenants = async () => {
  try {
    const data = await getTenants()
    tenants.value = data
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to load tenant list' })
  }
}



// 1. Fungsi Utama untuk mengambil data karyawan berdasarkan ID Tenant
const fetchEmployeesByTenant = async (tenantId: string | null) => {
  if (!tenantId) {
    employees.value = []
    return
  }

  isLoading.value = true
  $q.loading.show({
    message: 'Loading employees for selected tenant...'
  })

  try {
    // Memanggil API getEmployeeByTenandId untuk mengisi tabel
    const data = await getEmployeeByTenandId(tenantId)
    employees.value = data
  } catch {
    $q.notify({
      color: 'negative',
      message: 'Failed to fetch employees for this tenant'
    })
    employees.value = []
  } finally {
    isLoading.value = false
    $q.loading.hide()
  }
}

const fetchEmployeesById = async (employeeId: string | null) => {
  if (!employeeId) {
    employeeViewFrom.value = {
      id: '',
      tenantId: '',
      divisionId: '',
      employeeCode: '',
      fullName: '',
      position: '',
      basicSalary: 0,
      facePhotoUrl: '',
      faceEmbedding: '',
    }
    return
  }

  isLoading.value = true
  $q.loading.show({
    message: 'Loading employee by id for selected employee...'
  })

  try {
    // Memanggil API getEmployeeById untuk mengisi tabel
    const data = await getEmployeeById(employeeId)
    employeeViewFrom.value = {
      id: data.id,
      tenantId: data.tenantId,
      divisionId: data.divisionId,
      employeeCode: data.employeeCode,
      fullName: data.fullName,
      position: data.position,
      basicSalary: data.basicSalary,
      facePhotoUrl: data.facePhotoUrl || '',
      faceEmbedding: data.faceEmbedding || '',
    }



  } catch {
    $q.notify({
      color: 'negative',
      message: 'Failed to fetch employee by id for this employee'
    })
    employeeViewFrom.value = {
      id: '',
      tenantId: '',
      divisionId: '',
      employeeCode: '',
      fullName: '',
      position: '',
      basicSalary: 0,
      facePhotoUrl: '',
      faceEmbedding: '',
    }
  } finally {
    isLoading.value = false
    $q.loading.hide()
  }
}

// Computed Options
const tenantOptions = computed(() => tenants.value.map(t => ({ label: t.name, value: t.id })))
const divisionOptions = computed(() => divisions.value.map(d => ({ label: d.name, value: d.id })))


const fetchDivisionByTenant = async (tenantId: string | null) => {
  if (!tenantId) {
    divisions.value = []
    return
  }

  const requestId = ++lastDivisionRequestId

  try {
    const data = await getDivisionByTenandId(tenantId)

    // 🔥 prevent race condition
    if (requestId !== lastDivisionRequestId) return

    divisions.value = data
  } catch {
    if (requestId !== lastDivisionRequestId) return

    divisions.value = []
    $q.notify({
      color: 'negative',
      message: 'Failed to fetch divisions'
    })
  }
}

const fetchEmployees = async () => {
  isLoading.value = true
  $q.loading.show({
    message: 'Fetching employees...'
  })
  try {
    employees.value = await getEmployeeByTenandId(defaultTenants)
  } catch { // <--- Hapus (error) jika tidak digunakan
    $q.notify({ color: 'negative', message: 'Failed to fetch employees' })
  } finally {
    isLoading.value = false
    $q.loading.hide()
  }
}

// 4. Update Filtered Employees (Filter Tenant + Search)
const filteredEmployees = computed(() => {
  let result = employees.value

  // Filter berdasarkan Tenant yang dipilih
  if (selectedTenantId.value) {
    console.log({
      selected: selectedTenantId.value
    })
    result = result.filter(e => e.tenantId === selectedTenantId.value)
  }

  // Filter berdasarkan Search Query
  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    result = result.filter(e =>
      e.fullName.toLowerCase().includes(term) ||
      e.position.toLowerCase().includes(term) ||
      e.employeeCode.toLowerCase().includes(term) ||
      (e.basicSalary && e.basicSalary.toString().includes(term))
    )
  }

  return result
})


// Tambahkan fungsi save (seperti pada TenantPage sebelumnya)
const saveEmployee = async () => {
  if (!formEmployee.value.fullName || !formEmployee.value.employeeCode) {
    $q.notify({ color: 'warning', message: 'Please fill name and employee code' })
    return
  }

  isSubmitting.value = true
  try {
    if (isEdit.value) {
      await updateEmployee(formEmployee.value, selectedId.value)
      $q.notify({
        color: 'positive',
        message: 'Employee updated successfully'
      })
    } else {
      // Logika Create (panggil service createEmployee jika ada)
      await createEmployee(formEmployee.value)
      $q.notify({ color: 'positive', message: 'Employee added successfully', icon: 'check', })
    }

    showForm.value = false
    await fetchEmployeesByTenant(selectedTenantId.value) // Refresh tabel
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to save data' })
  } finally {
    isSubmitting.value = false
  }
}


const confirmDelete = (row: EmployeeResponseDto) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete employee "${row.fullName}"?`,
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
    void onDeleteEmployee(row.id)
  })
}

const onDeleteEmployee = async (id: string) => {
  // 1. Tampilkan loading overlay
  $q.loading.show({
    message: 'Deleting employee...'
  })

  try {
    // 2. Eksekusi API call
    console.log({ id })
    await deleteEmployee(id)

    // 3. Update State Lokal secara Reaktif
    // Menggunakan filter untuk menghapus data dari UI tanpa re-fetch
    employees.value = employees.value.filter(t => t.id !== id)

    // 4. Notifikasi Berhasil
    $q.notify({
      color: 'positive',
      message: 'Employee deleted successfully',
      icon: 'delete'
    })
  } catch {
    // 5. Penanganan Error
    $q.notify({
      color: 'negative',
      message: 'Failed to delete Employee. Please try again.'
    })
  } finally {
    // 6. Tutup loading overlay (selalu dijalankan baik sukses maupun gagal)
    $q.loading.hide()
  }
}


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

/* ... style lainnya ... */

.tenant-select {
  width: 220px;
  /* Sedikit lebih kecil dari search input */
}

/* Pastikan select terlihat bersih di dalam card */
.tenant-select :deep(.q-field__control) {
  border-radius: 8px;
  background: white;
}

/* ... MODAL ... */
.modal-card {
  border-radius: 14px;
}

.modal-header {
  padding: 20px 20px 10px 20px;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #101828;
}

.modal-sub {
  font-size: 13px;
  color: #667085;
}


.action-group {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
}

/* Hover effect */
.action-group .q-btn:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: scale(1.05);
  transition: all 0.15s ease;
}

/* Ukuran font judul */
.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
}

.section-sub {
  font-size: 13px;
}

/* Lebar Select agar tidak terlalu memakan tempat */
.tenant-select {
  width: 200px;
}

.tenant-select :deep(.q-field__control) {
  border-radius: 8px;
}

/* Lebar Search sesuai gambar referensi */
.search-input {
  width: 280px;
}

.search-input :deep(.q-field__control) {
  border-radius: 8px;
  background: #fff;
}

.header-row {
  align-items: center;
}

/* RIGHT SIDE */
.header-actions {
  align-items: center;
}

/* SIZE KONSISTEN (INI KUNCI!) */
.tenant-select,
.search-input,
.add-btn {
  height: 40px;
}

/* Samain tinggi input Quasar */
:deep(.q-field__control) {
  height: 40px;
  border-radius: 10px;
}

/* SEARCH lebih panjang */
.search-input {
  width: 260px;
}

/* SELECT lebih kecil */
.tenant-select {
  width: 200px;
}

/* BUTTON STYLE kayak gambar */
.add-btn {
  border-radius: 10px;
  padding: 0 18px;
  font-weight: 600;
  letter-spacing: 0.4px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
}

.section-sub {
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

.search-input {
  width: 260px;
}

.tenant-select {
  width: 200px;
}

.add-btn {
  border-radius: 10px;
  padding: 0 18px;
  font-weight: 600;
}
</style>
