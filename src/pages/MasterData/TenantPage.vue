<template>
  <div class="tenant-page q-pa-lg">
    <q-card flat bordered class="table-card">
      <q-card-section>
        <!-- Header -->
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="section-title">Tenant Management</div>
            <div class="section-sub">
              Manage all registered tenants and their operational status
            </div>
          </div>

          <div class="row items-center q-gutter-md">
            <!-- Search Bar -->
            <q-input
              v-model="searchQuery"
              dense
              outlined
              placeholder="Search tenants..."
              class="search-input"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <!-- Add Button -->
            <q-btn
              unelevated
              color="dark"
              icon="add_business"
              label="Add New Tenant"
              size="sm"
              class="action-btn-dark"
              @click="openForm()"
            />
          </div>
        </div>

        <!-- Table -->
        <q-table
          flat
          :rows="filteredTenants"
          :columns="columns"
          row-key="id"
          hide-bottom
          class="directory-table"
        >
          <!-- Company Name -->
          <template #body-cell-company="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <q-avatar
                  size="38px"
                  :style="{
                    background: props.row.avatarBg,
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '13px',
                  }"
                >
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
                :class="[
                  'status-badge',
                  props.row.status === 'ACTIVE' ? 'status-badge--active' : 'status-badge--inactive',
                ]"
              >
                {{ props.row.status }}
              </span>
            </q-td>
          </template>

          <!-- Actions -->
          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm justify-end">
                <q-btn flat round dense icon="visibility" size="sm" color="grey-6" @click="openViewForm(props.row)">
                  <q-tooltip>View Details</q-tooltip>
                </q-btn>
                <q-btn flat round dense icon="edit" size="sm" color="grey-6" @click="openEditForm(props.row)">
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn flat round dense icon="delete" size="sm" color="negative" @click="confirmDelete(props.row)">
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>

        <!-- Pagination (Dummy) -->
        <div class="row items-center justify-between q-mt-md">
          <div class="pagination-info">Showing {{ filteredTenants.length }} entries</div>
          <q-pagination
            v-model="currentPage"
            :max="1"
            direction-links
            color="dark"
            active-color="dark"
          />
        </div>
      </q-card-section>

      <!-- MODAL -->
      <q-dialog v-model="showForm" persistent>
        <q-card class="modal-card">
          <!-- Header -->
          <div class="modal-header">
            <div>
              <div class="modal-title">
                {{ isView ? 'Tenant Details' : isEdit ? 'Edit Tenant' : 'Add New Tenant' }}
              </div>
              <div class="modal-sub">
                Fill the form below to {{ isEdit ? 'update tenant' : 'create a new tenant' }}
              </div>
            </div>
          </div>

          <!-- Form -->
          <div class="q-mt-md q-gutter-md">
            <q-input v-model="form.name" label="Tenant Name" outlined dense :disable="isView" />

            <q-input v-model="form.companyCode" label="Company Code" outlined dense :disable="isView" />
          </div>

          <!-- Actions -->
          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn v-if="!isView" label="Save" color="dark" @click="saveTenant" :loading="isSubmitting" />
          </div>
        </q-card>
      </q-dialog>
    </q-card>

    <!-- VIEW TENANT DETAILS MODAL -->
    <q-dialog v-model="viewDialog">
      <q-card style="width: 650px; max-width: 80vw; border-radius: 12px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Tenant Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator class="q-mt-md" />

        <q-card-section class="q-pa-lg">
          <div v-if="selectedTenant" class="row q-col-gutter-lg">
            <!-- Avatar column -->
            <div class="col-12 col-sm-4 flex flex-center column">
              <q-avatar
                size="100px"
                :style="{
                  background: selectedTenant.avatarBg,
                  color: '#fff',
                  fontSize: '36px',
                  fontWeight: 600,
                }"
              >
                {{ selectedTenant.initials }}
              </q-avatar>
              <div class="q-mt-md text-h6 text-center text-weight-bold">
                {{ selectedTenant.company }}
              </div>
              <div class="text-grey-7 text-center">{{ selectedTenant.tenantId }}</div>
            </div>

            <!-- Details column -->
            <div class="col-12 col-sm-8">
              <div class="text-subtitle2 q-mb-sm text-primary text-weight-bold">
                Company Information
              </div>
              <div class="row q-col-gutter-sm q-mb-md">
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Tenant ID</div>
                  <div class="text-body2 text-weight-medium">{{ selectedTenant.tenantId }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Industry</div>
                  <div class="text-body2 text-weight-medium">{{ selectedTenant.industry }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Location</div>
                  <div class="text-body2 text-weight-medium">{{ selectedTenant.location }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Status</div>
                  <q-badge :color="selectedTenant.status === 'ACTIVE' ? 'positive' : 'grey'">{{
                    selectedTenant.status
                  }}</q-badge>
                </div>
              </div>

              <q-separator class="q-my-md" />

              <div class="text-subtitle2 q-mb-sm text-primary text-weight-bold">
                Contact Details
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-12">
                  <div class="text-caption text-grey-7">Admin Email Address</div>
                  <div class="text-body2 text-weight-medium">
                    admin@{{ selectedTenant.company.replace(/\s+/g, '').toLowerCase() }}.com
                  </div>
                </div>
                <div class="col-12">
                  <div class="text-caption text-grey-7">Support Phone Number</div>
                  <div class="text-body2 text-weight-medium">+1 (800) 123-4567</div>
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
import type { CreateTenantRequestDto, TenantResponseDto } from 'src/shared/api/types/tenant.types'
import { getTenants, createTenants, deleteTenantById, updateTenant } from 'src/shared/services/backendApiContract'
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const currentPage = ref(1)
const searchQuery = ref('')
const showForm = ref(false)
const isEdit = ref(false)
const isView = ref(false)
const isLoading = ref(false);
const isSubmitting = ref(false) // Loading khusus tombol save
const selectedId = ref<string | null>(null) // Simpan ID untuk keperluan update

interface UIRow extends TenantResponseDto {
  company: string;
  tenantId: string;
  initials: string;
  avatarBg: string;
  industry: string;
  location: string;
  status: string;
}

const viewDialog = ref(false);
const selectedTenant = ref<UIRow | null>(null);



const tenants = ref<UIRow[]>([]);

const form = ref<CreateTenantRequestDto>({
  tenantId: '',
  name: '',
  companyCode: '',
})

// Fetch Data
const fetchTenants = async () => {
  isLoading.value = true
  $q.loading.show({
    message: 'Fetching tenant...'
  })
  try {
    const data = await getTenants()
    tenants.value = data.map(t => ({
      ...t,
      company: t.name,
      tenantId: t.id,
      initials: t.name.substring(0, 2).toUpperCase(),
      avatarBg: '#1a73e8',
      industry: 'N/A',
      location: 'N/A',
      status: 'ACTIVE'
    })) as UIRow[]
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to fetch tenants' })
  } finally {
    isLoading.value = false
    $q.loading.hide()
  }
}

onMounted(async () => {
  await fetchTenants();
})



const openForm = () => {
  isEdit.value = false
  isView.value = false
  form.value = {
    tenantId: '',
    name: '',
    companyCode: '',
  }
  showForm.value = true
}

const openEditForm = (row: TenantResponseDto) => {
  isEdit.value = true
  selectedId.value = row.id // Simpan ID database

  // Isi form dengan data yang ada
  form.value = {
    tenantId: row.id,
    name: row.name,
    companyCode: row.companyCode || '' // Pastikan field sesuai dengan DTO Anda
  }

  showForm.value = true
}

const openViewForm = (row: TenantResponseDto) => {
  isView.value = true
  selectedId.value = row.id // Simpan ID database

  // Isi form dengan data yang ada
  form.value = {
    tenantId: row.id,
    name: row.name,
    companyCode: row.companyCode || '' // Pastikan field sesuai dengan DTO Anda
  }

  showForm.value = true
}


// Save Tenant (Create & Update)
const saveTenant = async () => {
  // 1. Validasi input
  if (!form.value.name || !form.value.companyCode) {
    $q.notify({ color: 'warning', message: 'Please fill all required fields' })
    return
  }

  isSubmitting.value = true
  try {
    if (isEdit.value && selectedId.value) {
      // --- LOGIKA UPDATE ---
      await updateTenant(form.value, selectedId.value)

      $q.notify({
        color: 'positive',
        message: 'Tenant updated successfully',
        icon: 'edit'
      })
    } else {
      // --- LOGIKA CREATE ---
      await createTenants(form.value)

      $q.notify({
        color: 'positive',
        message: 'Tenant created successfully',
        icon: 'check'
      })
    }

    // 2. Refresh data dari server agar sinkron
    await fetchTenants()

    // 3. Tutup modal dan reset state
    showForm.value = false
    selectedId.value = null
    isEdit.value = false
    isView.value = false

  } catch {
    $q.notify({
      color: 'negative',
      message: 'Failed to save tenant'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Fungsi untuk memicu dialog konfirmasi
const confirmDelete = (row: TenantResponseDto) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete tenant "${row.name}"?`,
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
    void onDeleteTenant(row.id)
  })
}
// Fungsi eksekusi ke API
const onDeleteTenant = async (id: string) => {
  // 1. Tampilkan loading overlay
  $q.loading.show({
    message: 'Deleting tenant...'
  })

  try {
    // 2. Eksekusi API call
    console.log({ id })
    await deleteTenantById(id)

    // 3. Update State Lokal secara Reaktif
    // Menggunakan filter untuk menghapus data dari UI tanpa re-fetch
    tenants.value = tenants.value.filter(t => t.id !== id)

    // 4. Notifikasi Berhasil
    $q.notify({
      color: 'positive',
      message: 'Tenant deleted successfully',
      icon: 'delete'
    })
  } catch {
    // 5. Penanganan Error
    $q.notify({
      color: 'negative',
      message: 'Failed to delete tenant. Please try again.'
    })
  } finally {
    // 6. Tutup loading overlay (selalu dijalankan baik sukses maupun gagal)
    $q.loading.hide()
  }
}


const columns = [
  { name: 'id', label: 'TENANT ID', field: 'id', align: 'left' as const },
  { name: 'name', label: 'COMPANY NAME', field: 'name', align: 'left' as const },
  { name: 'createdAt', label: 'CREATE', field: 'name', align: 'left' as const },
  { name: 'actions', label: 'ACTIONS', field: 'actions', align: 'right' as const },
];

const filteredTenants = computed(() => {
  if (!searchQuery.value) return tenants.value;

  const q = searchQuery.value.toLowerCase();

  return tenants.value.filter(t =>
    (t.name && t.name.toLowerCase().includes(q)) ||
    (t.companyCode && t.companyCode.toLowerCase().includes(q))
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
