<template>
  <div class="roles-page q-pa-lg">

    <q-card flat bordered class="table-card">
      <q-card-section>

        <!-- Header -->
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="section-title">Roles Management</div>
            <div class="section-sub">Manage system roles and configure access</div>
          </div>

          <div class="row items-center q-gutter-md">
            <!-- Search Bar -->
            <q-input v-model="searchQuery" dense outlined placeholder="Search roles..." class="search-input">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <!-- Create Button -->
            <q-btn unelevated color="dark" icon="admin_panel_settings" label="Create Role" size="sm"
              class="action-btn-dark" @click="openAddDialog" />
          </div>
        </div>

        <!-- Table -->
        <q-table flat :rows="filteredRoles" :columns="columns" row-key="id" hide-bottom class="directory-table"
          :loading="loading">

          <template #body-cell-name="props">
            <q-td :props="props">
              <div class="user-name">{{ props.row.name }}</div>
            </q-td>
          </template>

          <!-- Actions -->
          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm justify-end">
                <q-btn flat round dense icon="edit" size="sm" color="grey-6" @click="openEditDialog(props.row)">
                  <q-tooltip>Edit Role</q-tooltip>
                </q-btn>
                <q-btn flat round dense icon="delete" size="sm" color="negative" @click="openDeleteDialog(props.row)">
                  <q-tooltip>Delete Role</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

        </q-table>

        <!-- Pagination Layout -->
        <div class="row items-center justify-between q-mt-md">
          <div class="pagination-info">Showing {{ filteredRoles.length }} roles</div>
          <q-pagination v-model="currentPage" :max="1" direction-links color="dark" active-color="dark" />
        </div>

      </q-card-section>
    </q-card>

    <!-- CREATE ROLE MODAL -->
    <q-dialog v-model="addDialog" persistent>
      <q-card style="width: 400px; max-width: 80vw; border-radius: 12px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Create New Role</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>

        <q-separator class="q-mt-md" />

        <q-card-section class="q-pa-md">
          <q-form @submit="submitCreateRole">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <!-- SELECT TENANT -->
                <q-select v-model="addForm.tenantId" :rules="[val => !!val || 'Tenant is required']"
                  :options="tenantOptions" label="Select Tenant" outlined dense emit-value map-options />
              </div>
              <!-- select level  -->
              <div class="col-12">
                <q-input v-model="addForm.name" label="Role Name *" outlined dense
                  :rules="[val => !!val || 'Role name is required']" />
              </div>
              <!-- number level -->
              <div class="col-12">
                <q-input v-model="addForm.level" label="Roles Level *" type="number" outlined dense
                  :rules="[val => !!val || 'Role level is required']" />
              </div>
            </div>

            <div class="row justify-end q-mt-md q-gutter-sm">
              <q-btn outline label="Cancel" color="grey-7" v-close-popup />
              <q-btn unelevated label="Save Role" color="primary" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- EDIT ROLE MODAL -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="width: 400px; max-width: 80vw; border-radius: 12px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Edit Role</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>

        <q-separator class="q-mt-md" />

        <q-card-section class="q-pa-md">
          <q-form @submit="submitEditRole">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <!-- SELECT TENANT -->
                <q-select v-model="editForm.tenantId" :rules="[val => !!val || 'Tenant is required']"
                  :options="tenantOptions" label="Select Tenant" outlined dense emit-value map-options />
              </div>
              <div class="col-12">
                <q-input v-model="editForm.name" label="Role Name *" outlined dense
                  :rules="[val => !!val || 'Role name is required']" />
              </div>
              <!-- number level -->
              <div class="col-12">
                <q-input v-model="editForm.level" label="Roles Level *" type="number" outlined dense
                  :rules="[val => !!val || 'Role level is required']" />
              </div>
            </div>

            <div class="row justify-end q-mt-md q-gutter-sm">
              <q-btn outline label="Cancel" color="grey-7" v-close-popup />
              <q-btn unelevated label="Update Role" color="primary" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- DELETE ROLE MODAL -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card style="width: 450px; max-width: 80vw; border-radius: 12px; border-top: 4px solid #f04438;">
        <q-card-section class="column items-center q-pt-lg text-center">
          <q-avatar icon="warning" color="red-1" text-color="negative" size="56px" class="q-mb-sm" />
          <div class="text-h6 text-weight-bold q-mb-sm">Delete Role</div>
          <div class="text-body2 text-grey-7" style="max-width: 300px;">
            Are you sure you want to delete <strong>{{ selectedRole?.name }}</strong>? This action cannot be undone.
          </div>
        </q-card-section>

        <q-separator class="q-mt-md" />

        <q-card-actions align="between" class="q-pa-md">
          <q-btn outline label="Cancel" color="grey-7" v-close-popup class="col" style="max-width: 48%" />
          <q-btn unelevated label="Confirm Delete" color="negative" @click="submitDeleteRole" :loading="saving"
            class="col" style="max-width: 48%" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { getRoles, createRole, updateRole, deleteRole, getTenants, } from 'src/shared/services/backendApiContract'
import type { RoleResponseDto } from 'src/shared/api/types/role.types'
import type { TenantResponseDto } from 'src/shared/api/types/tenant.types'
const $q = useQuasar()
const roles = ref<RoleResponseDto[]>([])
const loading = ref(false)
const saving = ref(false)
const currentPage = ref(1)
const searchQuery = ref('')

const addDialog = ref(false)
const addForm = ref({ name: '', tenantId: '', level: 0 })

const editDialog = ref(false)
const editForm = ref({ id: '', name: '', tenantId: '', level: 0 })

const deleteDialog = ref(false)
const selectedRole = ref<RoleResponseDto | null>(null)
const tenants = ref<TenantResponseDto[]>([])




const columns = [
  { name: 'name', label: 'ROLE NAME', field: 'name', align: 'left' as const },
  { name: 'level', label: 'Level', field: 'level', align: 'left' as const },
  { name: 'actions', label: '', field: 'actions', align: 'right' as const },
]

const filteredRoles = computed(() => {
  let result = roles.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(r => r.name.toLowerCase().includes(q))
  }
  return result
})

const fetchRoles = async () => {
  loading.value = true
  try {
    const data = await getRoles()
    roles.value = data
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to fetch roles', position: 'top' })
    roles.value = []
  } finally {
    loading.value = false
  }
}

const fetchAllTenants = async () => {
  try {
    const data = await getTenants()
    tenants.value = data
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to load tenant list' })
  }
}


const openAddDialog = () => {
  addForm.value = {
    name: '',
    tenantId: '',
    level: 0
  }
  addDialog.value = true
}

const submitCreateRole = async () => {
  saving.value = true
  $q.loading.show({ message: 'Creating role...' })

  if (!addForm.value.tenantId) {
    $q.notify({ color: 'negative', message: 'Tenant wajib dipilih' })
    return
  }


  try {
    await createRole({
      name: addForm.value.name,
      tenantId: addForm.value.tenantId,
      level: Number(addForm.value.level)
    })
    $q.notify({ color: 'positive', message: 'Role created successfully', position: 'top' })
    addDialog.value = false
    await fetchRoles()
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to create role', position: 'top' })
  } finally {
    saving.value = false
    $q.loading.hide()
  }
}

const openEditDialog = (role: RoleResponseDto) => {
  selectedRole.value = role

  editForm.value = {
    id: role.id,
    name: role.name,
    tenantId: role.tenantId || '',
    level: role.level || 0
  }

  editDialog.value = true
}

const submitEditRole = async () => {
  if (!editForm.value.id) return
  saving.value = true
  $q.loading.show({ message: 'Updating role...' })
  try {
    await updateRole(editForm.value.id, { tenantId: editForm.value.tenantId, name: editForm.value.name, level: Number(editForm.value.level) })
    $q.notify({ color: 'positive', message: 'Role updated successfully', position: 'top' })
    editDialog.value = false
    await fetchRoles()
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to update role', position: 'top' })
  } finally {
    saving.value = false
    $q.loading.hide()
  }
}

const openDeleteDialog = (role: RoleResponseDto) => {
  selectedRole.value = role
  deleteDialog.value = true
}

const submitDeleteRole = async () => {
  if (!selectedRole.value) return
  saving.value = true
  $q.loading.show({ message: 'Deleting role...' })
  try {
    await deleteRole(selectedRole.value.id)
    $q.notify({ color: 'positive', message: 'Role deleted successfully', position: 'top' })
    deleteDialog.value = false
    await fetchRoles()
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to delete role', position: 'top' })
  } finally {
    saving.value = false
    $q.loading.hide()
  }
}

onMounted(() => {
  void fetchRoles()
  void fetchAllTenants()
})

const tenantOptions = computed(() => tenants.value.map(t => ({ label: t.name, value: t.id })))


</script>

<style scoped>
.roles-page {
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
.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #101828;
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
