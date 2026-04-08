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
            <!-- SELECT TENANT -->
            <q-select v-model="selectedTenantId" :options="tenantOptions" label="Filter by Tenant" outlined dense
              emit-value map-options class="tenant-select" clearable>
              <template v-slot:prepend>
                <q-icon name="business" />
              </template>
            </q-select>



            <q-input v-model="searchQuery" dense outlined placeholder="Search employees..." class="search-input">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <q-btn unelevated color="dark" icon="person_add" label="Add New Employee" size="sm" class="action-btn-dark"
              @click="openForm" />
          </div>
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

          <!-- Division & Position -->
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
            <q-td :props="props">
              <div class="row items-center q-gutter-sm justify-end">
                <q-btn flat round dense icon="visibility" size="sm" color="grey-6" @click="viewProfile(props.row)">
                  <q-tooltip>View Profile</q-tooltip>
                </q-btn>
                <q-btn flat round dense icon="edit" size="sm" color="grey-6" @click="openEditForm(props.row)">
                  <q-tooltip>Edit Data</q-tooltip>
                </q-btn>
                <q-btn flat round dense icon="delete" size="sm" color="negative" @click="confirmDelete(props.row)">
                  <q-tooltip class="bg-negative text-white">Delete Employee</q-tooltip>
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
        <q-card class="modal-card" style="min-width: 450px;">
          <q-card-section class="modal-header">
            <div class="modal-title">
              {{ isView ? 'Employee Details' : isEdit ? 'Edit Employee' : 'Add New Employee' }}
            </div>
            <div class="modal-sub">
              {{ isView ? 'View information for this record' : 'Fill the form below to manage employee data' }}
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none q-gutter-md">
            <q-select v-model="formEmployee.tenantId" :options="tenantOptions" label="Tenant" outlined dense emit-value
              map-options />


            <!-- SELECT DIVISIOn -->
            <q-select v-model="formEmployee.divisionId" :options="divisionOptions" label="Division" outlined dense
              :disable="!formEmployee.tenantId" emit-value map-options />



            <q-input v-model="formEmployee.fullName" label="Full Name" outlined dense :disable="isView" />

            <q-input v-model="formEmployee.employeeCode" label="Employee Code" outlined dense :disable="isView" />

            <q-input v-model="formEmployee.position" label="Position" outlined dense :disable="isView" />


            <q-input v-model.number="formEmployee.basicSalary" label="Basic Salary" type="number" outlined dense
              :disable="isView" />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="Cancel" color="grey-7" v-close-popup />
            <q-btn v-if="!isView" label="Save" color="dark" unelevated :loading="isSubmitting" @click="saveEmployee" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>

    <!-- VIEW PROFILE MODAL -->
    <q-dialog v-model="viewDialog">
      <q-card style="width: 650px; max-width: 80vw; border-radius: 12px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Employee Profile</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator class="q-mt-md" />

        <q-card-section class="q-pa-lg">
          <div v-if="selectedEmployee" class="row q-col-gutter-lg">
            <!-- Avatar column -->
            <div class="col-12 col-sm-4 flex flex-center column">
              <q-avatar size="100px"
                :style="{ background: selectedEmployee.avatarBg, color: '#fff', fontSize: '36px', fontWeight: 600 }">
                {{ selectedEmployee.initials }}
              </q-avatar>
              <div class="q-mt-md text-h6 text-center text-weight-bold">{{ selectedEmployee.fullName }}</div>
              <div class="text-grey-7 text-center">{{ selectedEmployee.position }}</div>
            </div>

            <!-- Details column -->
            <div class="col-12 col-sm-8">
              <div class="text-subtitle2 q-mb-sm text-primary text-weight-bold">Work Details</div>
              <div class="row q-col-gutter-sm q-mb-md">
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Employee ID (NIK)</div>
                  <div class="text-body2 text-weight-medium">{{ selectedEmployee.nik }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Division</div>
                  <div class="text-body2 text-weight-medium">{{ selectedEmployee.division }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Join Date</div>
                  <div class="text-body2 text-weight-medium">{{ selectedEmployee.joinDate }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Status</div>
                  <q-badge :color="selectedEmployee.status === 'Permanent' ? 'primary' : 'secondary'">{{
                    selectedEmployee.status }}</q-badge>
                </div>
              </div>

              <q-separator class="q-my-md" />

              <div class="text-subtitle2 q-mb-sm text-primary text-weight-bold">Personal Information</div>
              <div class="row q-col-gutter-sm">
                <div class="col-12">
                  <div class="text-caption text-grey-7">Email Address</div>
                  <div class="text-body2 text-weight-medium">contact@{{ selectedEmployee.initials.toLowerCase()
                    }}.example.com</div>
                </div>
                <div class="col-12">
                  <div class="text-caption text-grey-7">Phone Number</div>
                  <div class="text-body2 text-weight-medium">+1 (555) 123-4567</div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn unelevated label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>



  </div>
</template>

<script setup lang="ts">
import type { CreateEmployeeRequestDto, EmployeeResponseDto } from 'src/shared/api/types/employee.type'
import type { TenantResponseDto } from 'src/shared/api/types/tenant.types'
import type { DivisionResponsetDto } from 'src/shared/api/types/division.type'
import { getEmployeeByTenandId, getTenants, createEmployee, getDivisionByTenandId, deleteEmployee, getEmployeeById, updateEmployee } from 'src/shared/services/backendApiContract'
import { useQuasar } from 'quasar'
import { ref, computed, onMounted, watch } from 'vue'

const $q = useQuasar()
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

interface EmployeeRow extends EmployeeResponseDto {
  initials: string;
  avatarBg: string;
  nik: string;
  status: string;
  division?: string;
  joinDate?: string;
}

const viewDialog = ref(false)
const selectedEmployee = ref<EmployeeRow | null>(null)

const employees = ref<EmployeeRow[]>([])
const tenants = ref<TenantResponseDto[]>([])
const divisions = ref<DivisionResponsetDto[]>([])

const selectedTenantId = ref(defaultTenants)  // State untuk tenant yang dipilih

const formEmployee = ref<CreateEmployeeRequestDto>({
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
  selectedId.value = ''
  formEmployee.value = {
    tenantId: defaultTenants,
    divisionId: '',
    employeeCode: '',
    fullName: '',
    position: '',
    basicSalary: 0,
    facePhotoUrl: '',
    faceEmbedding: '',
  }
  showForm.value = true
}

// Open edit form: fetches full employee data from API and pre-fills form
const openEditForm = async (row: EmployeeRow) => {
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
    }
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to fetch employee detail' })
    showForm.value = false
  } finally {
    isLoading.value = false
  }
}

// Open view profile using real API data
const viewProfile = async (row: EmployeeRow) => {
  selectedEmployee.value = row
  viewDialog.value = true
  isLoading.value = true
  try {
    const data = await getEmployeeById(row.id)
    selectedEmployee.value = {
      ...row,
      fullName: data.fullName,
      position: data.position,
      employeeCode: data.employeeCode,
      divisionId: data.divisionId,
      nik: data.employeeCode,
    }
  } catch {
    // keep the row data already set above
  } finally {
    isLoading.value = false
  }
}

const columns = [
  { name: 'profile', label: 'EMPLOYEE', field: 'fullName', align: 'left' as const },
  { name: 'role', label: 'POSITION', field: 'position', align: 'left' as const },
  { name: 'status', label: 'STATUS', field: 'status', align: 'left' as const },
  { name: 'actions', label: 'ACTIONS', field: 'actions', align: 'right' as const },
]

// 2. Watcher: Mendeteksi perubahan pada dropdown selectedTenantId
watch(selectedTenantId, async (newId) => {
  // Jika dropdown di-clear (null), kembali ke default atau kosongkan
  const idToFetch = newId || defaultTenants
  await fetchEmployeesByTenant(idToFetch)
})

watch(() => formEmployee.value.tenantId, async (newTenantId) => {
  if (!isEdit.value) formEmployee.value.divisionId = ''
  await fetchDivisionByTenant(newTenantId)
})

onMounted(async () => {
  isLoading.value = true
  await fetchAllTenants()
  await fetchEmployeesByTenant(selectedTenantId.value || defaultTenants)
  await fetchDivisionByTenant(selectedTenantId.value || defaultTenants)
  isLoading.value = false
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
    // Map data to match template expectation
    employees.value = data.map((e: EmployeeResponseDto) => ({
      ...e,
      initials: (e.fullName || '').substring(0, 2).toUpperCase(),
      avatarBg: '#1a73e8',
      nik: e.employeeCode,
      status: 'Permanent'
    })) as EmployeeRow[]
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

// 4. Update Filtered Employees (Filter Tenant + Search)
const filteredEmployees = computed(() => {
  let result = employees.value

  // Filter berdasarkan Tenant yang dipilih
  if (selectedTenantId.value) {
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

const saveEmployee = async () => {
  if (!formEmployee.value.fullName || !formEmployee.value.employeeCode) {
    $q.notify({ color: 'warning', message: 'Please fill name and employee code' })
    return
  }

  isSubmitting.value = true
  try {
    if (isEdit.value) {
      await updateEmployee(formEmployee.value, selectedId.value)
      $q.notify({ color: 'positive', message: 'Employee updated successfully' })
    } else {
      await createEmployee(formEmployee.value)
      $q.notify({ color: 'positive', message: 'Employee added successfully', icon: 'check' })
    }
    showForm.value = false
    await fetchEmployeesByTenant(selectedTenantId.value || defaultTenants)
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to save data' })
  } finally {
    isSubmitting.value = false
  }
}

// Delete confirmation + API call
const confirmDelete = (row: EmployeeRow) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete employee "${row.fullName}"?`,
    persistent: true,
    ok: { label: 'Delete', color: 'negative', flat: true },
    cancel: { label: 'Cancel', color: 'grey-7', flat: true }
  }).onOk(() => {
    void onDeleteEmployee(row.id)
  })
}

const onDeleteEmployee = async (id: string) => {
  $q.loading.show({ message: 'Deleting employee...' })
  try {
    await deleteEmployee(id)
    employees.value = employees.value.filter(e => e.id !== id)
    $q.notify({ color: 'positive', message: 'Employee deleted successfully', icon: 'delete' })
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to delete employee. Please try again.' })
  } finally {
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
</style>
