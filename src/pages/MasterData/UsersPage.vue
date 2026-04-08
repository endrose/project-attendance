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
            <!-- SELECT TENANT -->
            <q-select v-model="selectedTenantId" :options="tenantOptions" label="Filter by Tenant" outlined dense emit-value map-options class="tenant-select" clearable>
              <template v-slot:prepend>
                <q-icon name="business" />
              </template>
            </q-select>

            <!-- Search Bar -->
            <q-input v-model="searchQuery" dense outlined placeholder="Search username or email..." class="search-input">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <!-- Invite Button -->
            <q-btn unelevated color="dark" icon="person_add" label="Invite User" size="sm" class="action-btn-dark" @click="addDialog = true" />
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
                <q-btn flat round dense icon="vpn_key" size="sm" color="grey-6" @click="openChangePassword(props.row)">
                  <q-tooltip>Reset Password</q-tooltip>
                </q-btn>
                <q-btn flat round dense icon="edit" size="sm" color="grey-6" @click="openEditUser(props.row)">
                  <q-tooltip>Edit Configuration</q-tooltip>
                </q-btn>
                <q-btn flat round dense icon="delete" size="sm" color="negative" @click="openDeleteUser(props.row)">
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

    <!-- INVITE USER MODAL -->
    <q-dialog v-model="addDialog" persistent>
      <q-card style="width: 500px; max-width: 80vw; border-radius: 12px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Invite New User</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>
        
        <q-separator class="q-mt-md" />

        <q-card-section class="q-pa-md">
          <q-form @submit="saveNewUser">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input v-model="addForm.username" label="Username *" outlined dense />
              </div>
              <div class="col-12">
                <q-input v-model="addForm.email" label="Work Email *" outlined dense type="email" />
              </div>
              <div class="col-12 col-sm-6">
                <q-select v-model="addForm.employee" :options="['Alexander Smith', 'Maria Garcia', 'Johnathan Doe', 'Emily Chen']" label="Select Employee" outlined dense use-input />
              </div>
              <div class="col-12 col-sm-6">
                <q-select v-model="addForm.role" :options="['Super Admin', 'Manager', 'Staff', 'HR Department']" label="Assigned Role *" outlined dense />
              </div>
              <div class="col-12">
                <q-input v-model="addForm.password" :type="showPassword ? 'text' : 'password'" label="Initial Password *" outlined dense>
                  <template v-slot:append>
                    <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword = !showPassword" />
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-checkbox v-model="addForm.sendEmail" label="Send Invitation Email" color="primary" />
              </div>
            </div>
            
            <div class="row justify-end q-mt-md q-gutter-sm">
              <q-btn outline label="Cancel" color="grey-7" v-close-popup />
              <q-btn unelevated label="Create Account" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- EDIT USER MODAL -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="width: 500px; max-width: 80vw; border-radius: 12px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Edit User Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>
        
        <q-separator class="q-mt-md" />

        <q-card-section class="q-pa-md">
          <q-form @submit="submitEditUser">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input v-model="editForm.username" label="Username *" outlined dense readonly bg-color="grey-2" />
              </div>
              <div class="col-12">
                <q-input v-model="editForm.email" label="Email Address *" outlined dense :rules="[val => /.+@.+\..+/.test(val) || 'Valid email is required']" />
              </div>
              <div class="col-12 col-sm-6">
                <q-select v-model="editForm.role" :options="['Super Admin', 'Manager', 'Staff', 'HR Department']" label="Assigned Role *" outlined dense />
              </div>
              <div class="col-12 col-sm-6">
                <q-select v-model="editForm.status" :options="['Active', 'Inactive']" label="Account Status" outlined dense />
              </div>
            </div>
            
            <div class="row justify-end q-mt-md q-gutter-sm">
              <q-btn outline label="Cancel" color="grey-7" v-close-popup />
              <q-btn unelevated label="Update User" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- CHANGE PASSWORD MODAL -->
    <q-dialog v-model="passwordDialog" persistent>
      <q-card style="width: 400px; max-width: 80vw; border-radius: 12px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Change Password</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>
        
        <q-separator class="q-mt-md" />

        <q-card-section class="q-pa-md">
          <q-form @submit="submitChangePassword">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input v-model="passwordForm.currentPassword" :type="showCurrPwd ? 'text' : 'password'" label="Current Password *" outlined dense :rules="[val => !!val || 'Required']">
                  <template v-slot:append>
                    <q-icon :name="showCurrPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showCurrPwd = !showCurrPwd" />
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input v-model="passwordForm.newPassword" :type="showNewPwd ? 'text' : 'password'" label="New Password *" outlined dense :rules="[val => !!val || 'Required']">
                  <template v-slot:append>
                    <q-icon :name="showNewPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showNewPwd = !showNewPwd" />
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input v-model="passwordForm.confirmPassword" :type="showConfPwd ? 'text' : 'password'" label="Confirm New Password *" outlined dense :rules="[val => val === passwordForm.newPassword || 'Passwords must match']">
                  <template v-slot:append>
                    <q-icon :name="showConfPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showConfPwd = !showConfPwd" />
                  </template>
                </q-input>
              </div>
            </div>
            
            <div class="row justify-end q-mt-md q-gutter-sm">
              <q-btn outline label="Cancel" color="grey-7" v-close-popup />
              <q-btn unelevated label="Reset Password" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- DELETE USER MODAL -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card style="width: 450px; max-width: 80vw; border-radius: 12px; border-top: 4px solid #f04438;">
        <q-card-section class="column items-center q-pt-lg text-center">
          <q-avatar icon="warning" color="red-1" text-color="negative" size="56px" class="q-mb-sm" />
          <div class="text-h6 text-weight-bold q-mb-sm">Delete User Account</div>
          <div class="text-body2 text-grey-7" style="max-width: 300px;">
            Are you sure you want to delete <strong>{{ selectedUser?.username }}</strong>? This action cannot be undone.
          </div>
        </q-card-section>
        
        <q-card-section class="q-px-lg q-pb-md">
          <div class="text-caption text-grey-8 q-mb-xs">To confirm, type the username below:</div>
          <q-input v-model="deleteConfirmText" outlined dense placeholder="Type username here..." />
        </q-card-section>

        <q-separator />
        
        <q-card-actions align="between" class="q-pa-md">
          <q-btn outline label="Cancel" color="grey-7" v-close-popup class="col" style="max-width: 48%" />
          <q-btn unelevated label="Confirm Delete" color="negative" @click="submitDeleteUser" :disable="deleteConfirmText !== selectedUser?.username" class="col" style="max-width: 48%" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { getTenants, getUsers, updateUser, changeUserPassword, deleteUser, createUser } from 'src/shared/services/backendApiContract'
import type { TenantResponseDto } from 'src/shared/api/types/tenant.types'
import type { UserResponseDto } from 'src/shared/api/types/user.types'

const $q = useQuasar()
const currentPage = ref(1)
const searchQuery = ref('')

const defaultTenant = '1a780d07-dd9b-4b2f-83c5-1c0b0a5c676d'
const selectedTenantId = ref(defaultTenant)
const tenants = ref<TenantResponseDto[]>([])

interface UIRow extends UserResponseDto {
  username: string
  email: string
  initials: string
  avatarBg: string
  role: string
  status: string
  lastLogin: string
}

const users = ref<UIRow[]>([])

const showPassword = ref(false)
const addDialog = ref(false)
const addForm = ref({
  username: '',
  email: '',
  employee: '',
  role: '',
  password: '',
  sendEmail: true
})

const selectedUser = ref<UIRow | null>(null)

// Edit State
const editDialog = ref(false)
const editForm = ref({ email: '', username: '', role: '', status: '' })

// PW State
const passwordDialog = ref(false)
const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })
const showCurrPwd = ref(false)
const showNewPwd = ref(false)
const showConfPwd = ref(false)

// Delete State
const deleteDialog = ref(false)
const deleteConfirmText = ref('')

const openEditUser = (row: UIRow) => {
  selectedUser.value = row
  editForm.value = {
    username: row.username,
    email: row.email,
    role: row.role,
    status: row.status
  }
  editDialog.value = true
}

const openChangePassword = (row: UIRow) => {
  selectedUser.value = row
  passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  showCurrPwd.value = false
  showNewPwd.value = false
  showConfPwd.value = false
  passwordDialog.value = true
}

const openDeleteUser = (row: UIRow) => {
  selectedUser.value = row
  deleteConfirmText.value = ''
  deleteDialog.value = true
}

const submitEditUser = async () => {
  if (!selectedUser.value) return
  
  try {
    $q.loading.show()
    await updateUser(selectedUser.value.id, {
      employeeId: selectedUser.value.employeeId || '00000000-0000-0000-0000-000000000000',
      roleId: selectedUser.value.roleId || '00000000-0000-0000-0000-000000000000',
      email: editForm.value.email
    })
    $q.notify({ message: `User ${editForm.value.username} updated successfully`, color: 'positive' })
    editDialog.value = false
    await fetchUsers(selectedTenantId.value)
  } catch {
    $q.notify({ message: 'Failed to update user', color: 'negative' })
  } finally {
    $q.loading.hide()
  }
}

const submitChangePassword = async () => {
  if (!selectedUser.value) return
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) return

  try {
    $q.loading.show()
    await changeUserPassword(selectedUser.value.id, {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    $q.notify({ message: 'Password reset successfully', color: 'positive' })
    passwordDialog.value = false
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    const errorMsg = error.response?.data?.message || 'Failed to change password'
    $q.notify({ message: errorMsg, color: 'negative' })
  } finally {
    $q.loading.hide()
  }
}

const submitDeleteUser = async () => {
  if (!selectedUser.value) return
  try {
    $q.loading.show()
    await deleteUser(selectedUser.value.id)
    $q.notify({ message: `User ${selectedUser.value.username} deleted successfully`, color: 'positive' })
    deleteDialog.value = false
    await fetchUsers(selectedTenantId.value)
  } catch {
    $q.notify({ message: 'Failed to delete user', color: 'negative' })
  } finally {
    $q.loading.hide()
  }
}

const saveNewUser = async () => {
  try {
    $q.loading.show()
    await createUser({
      tenantId: selectedTenantId.value || '1a780d07-dd9b-4b2f-83c5-1c0b0a5c676d',
      employeeId: '00000000-0000-0000-0000-000000000000',
      roleId: '00000000-0000-0000-0000-000000000000',
      email: addForm.value.email,
      password: addForm.value.password || 'Temporary123!'
    })
    $q.notify({ message: `Account created for ${addForm.value.username}`, color: 'positive', position: 'top' })
    addDialog.value = false
    await fetchUsers(selectedTenantId.value)
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    const errorMsg = error.response?.data?.message || 'Failed to create user'
    $q.notify({ message: errorMsg, color: 'negative', position: 'top' })
  } finally {
    $q.loading.hide()
  }
}

const fetchAllTenants = async () => {
  try {
    tenants.value = await getTenants()
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to load tenant list' })
  }
}

const fetchUsers = async (tenantId: string) => {
  if (!tenantId) {
    users.value = []
    return
  }
  
  $q.loading.show({ message: 'Loading users...' })
  try {
    const data = await getUsers(tenantId)
    users.value = data.map((u) => {
      const emailLocalPart = (u.email || '').split('@')[0] || 'Unknown';
      return {
        ...u,
        username: emailLocalPart,
        email: u.email || 'unknown@example.local',
        initials: emailLocalPart.substring(0, 2).toUpperCase(),
        avatarBg: '#1a73e8',
        role: 'Staff', // Mocked currently
        status: 'Active',
        lastLogin: 'Never'
      }
    }) as UIRow[]
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to fetch users' })
    users.value = []
  } finally {
    $q.loading.hide()
  }
}

const tenantOptions = computed(() => tenants.value.map(t => ({ label: t.name, value: t.id })))

watch(selectedTenantId, async (newId) => {
  await fetchUsers(newId || defaultTenant)
})

onMounted(async () => {
  await fetchAllTenants()
  await fetchUsers(selectedTenantId.value)
})

const columns = [
  { name: 'user', label: 'USER DETAILS', field: 'username', align: 'left' as const },
  { name: 'role', label: 'ASSIGNED ROLE', field: 'role', align: 'left' as const },
  { name: 'status', label: 'STATUS', field: 'status', align: 'left' as const },
  { name: 'lastLogin', label: 'LAST LOGIN', field: 'lastLogin', align: 'left' as const },
  { name: 'actions', label: '', field: 'actions', align: 'right' as const },
]

const filteredUsers = computed(() => {
  let result = users.value
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(u => 
      u.username.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q)
    )
  }
  return result
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

.tenant-select {
  width: 220px;
}
.tenant-select :deep(.q-field__control) {
  border-radius: 8px;
  background: white;
}
</style>
