<template>
  <div class="holiday-page q-pa-lg">

    <!-- Page Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="page-title">Public Holiday Setup</div>
        <div class="page-sub">Configure national and corporate holidays for the current year</div>
      </div>
      <div class="row q-gutter-md">
        <!-- Import Button -->
        <q-btn outline color="primary" icon="file_upload" label="Import Holidays" class="btn-outline-regular"
          @click="triggerImport" />
        <!-- Add Button -->
        <q-btn unelevated color="dark" icon="event_available" label="Add Holiday" class="action-btn-dark"
          @click="openAddDialog" />
      </div>
    </div>

    <!-- Layout Split -->
    <div class="row q-col-gutter-lg">

      <!-- LEFT: Summary / Small Calendar Widget -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="table-card">
          <q-card-section>
            <div class="section-title q-mb-md">Calendar View</div>

            <q-date v-model="calendarDate" minimal flat color="primary" :events="holidayEvents" event-color="negative"
              class="full-width q-mb-md custom-calendar" />

            <div class="q-pt-md border-top">
              <div class="detail-label q-mb-md">UPCOMING HOLIDAYS</div>
              <div class="upcoming-list q-gutter-y-sm">
                <div v-for="h in holidays.slice(0, 3)" :key="h.id" class="upcoming-item">
                  <div class="row items-center justify-between">
                    <div>
                      <div class="upcoming-name">{{ h.name }}</div>
                      <div class="upcoming-cat">{{ h.category }}</div>
                    </div>
                    <span class="upcoming-date">{{ formatShortDate(h.date) }}</span>
                  </div>
                </div>
              </div>
            </div>

          </q-card-section>
        </q-card>
      </div>

      <!-- RIGHT: Table List View -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="table-card full-height">
          <q-card-section>

            <div class="row items-center justify-between q-mb-md">
              <div class="section-title">Holiday Registry</div>
              <q-input v-model="searchQuery" dense outlined placeholder="Search events..." class="search-input">
                <template v-slot:prepend><q-icon name="search" /></template>
              </q-input>
            </div>

            <!-- Table -->
            <q-table flat :loading="loading" :rows="filteredHolidays" :columns="columns" row-key="id" hide-bottom
              class="directory-table">

              <!-- Holiday Name -->
              <template #body-cell-name="props">
                <q-td :props="props">
                  <span class="holiday-name">{{ props.row.name }}</span>
                </q-td>
              </template>

              <!-- Date -->
              <template #body-cell-date="props">
                <q-td :props="props">
                  <span>{{ formatFullDate(props.row.date) }}</span>
                </q-td>
              </template>

              <!-- Category -->
              <template #body-cell-category="props">
                <q-td :props="props">
                  <span :class="['category-badge', getCatClass(props.row.category)]">
                    {{ props.row.category }}
                  </span>
                </q-td>
              </template>

              <!-- Actions -->
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <div class="row items-center q-gutter-sm justify-end">
                    <q-btn flat round dense icon="edit" size="sm" color="grey-6" @click="openEditDialog(props.row)">
                      <q-tooltip>Edit Holiday</q-tooltip>
                    </q-btn>
                    <q-btn flat round dense icon="delete" size="sm" color="negative"
                      @click="openDeleteDialog(props.row)">
                      <q-tooltip>Delete Holiday</q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </template>

            </q-table>

            <div class="row items-center justify-between q-mt-md">
              <div class="pagination-info">Showing {{ filteredHolidays.length }} holidays</div>
              <q-pagination v-model="currentPage" :max="1" direction-links color="dark" active-color="dark" />
            </div>

          </q-card-section>
        </q-card>
      </div>

    </div>

    <!-- CREATE HOLIDAY MODAL -->
    <q-dialog v-model="addDialog" persistent>
      <q-card style="width: 400px; max-width: 80vw; border-radius: 12px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Add Holiday</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>

        <q-separator class="q-mt-md" />

        <q-card-section class="q-pa-md">
          <q-form @submit="submitCreateHoliday">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input v-model="addForm.name" label="Holiday Name *" outlined dense
                  :rules="[val => !!val || 'Required']" />
              </div>
              <div class="col-12">
                <q-input v-model="addForm.date" label="Date (YYYY-MM-DD) *" outlined dense mask="####-##-##"
                  :rules="[val => !!val || 'Required']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="addForm.date" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-select v-model="addForm.category" :options="categoryOptions" label="Category *" outlined dense
                  :rules="[val => !!val || 'Required']" />
              </div>
            </div>

            <div class="row justify-end q-mt-md q-gutter-sm">
              <q-btn outline label="Cancel" color="grey-7" v-close-popup />
              <q-btn unelevated label="Save" color="primary" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- EDIT HOLIDAY MODAL -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="width: 400px; max-width: 80vw; border-radius: 12px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Edit Holiday</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>

        <q-separator class="q-mt-md" />

        <q-card-section class="q-pa-md">
          <q-form @submit="submitEditHoliday">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input v-model="editForm.name" label="Holiday Name *" outlined dense
                  :rules="[val => !!val || 'Required']" />
              </div>
              <div class="col-12">
                <q-input v-model="editForm.date" label="Date (YYYY-MM-DD) *" outlined dense mask="####-##-##"
                  :rules="[val => !!val || 'Required']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="editForm.date" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-select v-model="editForm.category" :options="categoryOptions" label="Category *" outlined dense
                  :rules="[val => !!val || 'Required']" />
              </div>
            </div>

            <div class="row justify-end q-mt-md q-gutter-sm">
              <q-btn outline label="Cancel" color="grey-7" v-close-popup />
              <q-btn unelevated label="Update" color="primary" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- DELETE HOLIDAY MODAL -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card style="width: 450px; max-width: 80vw; border-radius: 12px; border-top: 4px solid #f04438;">
        <q-card-section class="column items-center q-pt-lg text-center">
          <q-avatar icon="warning" color="red-1" text-color="negative" size="56px" class="q-mb-sm" />
          <div class="text-h6 text-weight-bold q-mb-sm">Delete Holiday</div>
          <div class="text-body2 text-grey-7" style="max-width: 300px;">
            Are you sure you want to delete <strong>{{ selectedHoliday?.name }}</strong>? This action cannot be undone.
          </div>
        </q-card-section>

        <q-separator class="q-mt-md" />

        <q-card-actions align="between" class="q-pa-md">
          <q-btn outline label="Cancel" color="grey-7" v-close-popup class="col" style="max-width: 48%" />
          <q-btn unelevated label="Confirm Delete" color="negative" @click="submitDeleteHoliday" :loading="saving"
            class="col" style="max-width: 48%" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar, date } from 'quasar'
import { getHolidaysByTenantId, createHoliday, updateHoliday, deleteHoliday } from 'src/shared/services/backendApiContract'
import type { PublicHolidayResponseDto } from 'src/shared/api/types/publicHoliday.types'

const $q = useQuasar()
const loading = ref(false)
const saving = ref(false)
const currentPage = ref(1)
const searchQuery = ref('')
const selectedTenantId = '1a780d07-dd9b-4b2f-83c5-1c0b0a5c676d' // Mock tenant context

const calendarDate = ref(date.formatDate(Date.now(), 'YYYY/MM/DD'))

const holidays = ref<PublicHolidayResponseDto[]>([])

const categoryOptions = ['National Holiday', 'Corporate Event', 'Observance']

const holidayEvents = computed(() => {
  return holidays.value.map(h => {
    // Format YYYY-MM-DD or ISO to YYYY/MM/DD for q-date parsing
    try {
      const d = new Date(h.date)
      if (!isNaN(d.getTime())) {
        return date.formatDate(d, 'YYYY/MM/DD')
      }
    } catch { /* ignore */ }
    return h.date
  })
})

const columns = [
  { name: 'description', label: 'HOLIDAY NAME', field: 'description', align: 'left' as const },
  { name: 'date', label: 'DATE', field: 'date', align: 'left' as const },
  { name: 'category', label: 'CATEGORY', field: 'category', align: 'left' as const },
  { name: 'actions', label: '', field: 'actions', align: 'right' as const },
]

const filteredHolidays = computed(() => {
  let result = holidays.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(h =>
      h.name.toLowerCase().includes(q) ||
      h.category.toLowerCase().includes(q)
    )
  }
  // Sort by date ascending
  return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const formatFullDate = (val: string) => {
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return date.formatDate(d, 'MMMM D, YYYY');
  } catch { /* ignore */ }
  return val;
}

const formatShortDate = (val: string) => {
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return date.formatDate(d, 'DD MMM');
  } catch { /* ignore */ }
  return val;
}

const getCatClass = (cat: string) => {
  if (cat === 'National Holiday') return 'cat-national'
  if (cat === 'Corporate Event') return 'cat-corporate'
  return 'cat-observance'
}

// Fetch Logic
const fetchHolidays = async () => {
  loading.value = true
  try {
    const data = await getHolidaysByTenantId(selectedTenantId)
    holidays.value = data || []
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to fetch holidays' })
    holidays.value = []
  } finally {
    loading.value = false
  }
}

// Create Logic
const addDialog = ref(false)
const addForm = ref({ name: '', date: '', category: 'National Holiday' })

const openAddDialog = () => {
  addForm.value = { name: '', date: date.formatDate(Date.now(), 'YYYY-MM-DD'), category: 'National Holiday' }
  addDialog.value = true
}

const submitCreateHoliday = async () => {
  saving.value = true
  $q.loading.show()
  try {
    await createHoliday({
      name: addForm.value.name,
      date: addForm.value.date,
      category: addForm.value.category,
      tenantId: selectedTenantId
    })
    $q.notify({ color: 'positive', message: 'Holiday created successfully', position: 'top' })
    addDialog.value = false
    await fetchHolidays()
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to create holiday', position: 'top' })
  } finally {
    saving.value = false
    $q.loading.hide()
  }
}

// Edit Logic
const editDialog = ref(false)
const editForm = ref({ id: '', name: '', date: '', category: '' })
const selectedHoliday = ref<PublicHolidayResponseDto | null>(null)

const openEditDialog = (holiday: PublicHolidayResponseDto) => {
  selectedHoliday.value = holiday

  // Format date to YYYY-MM-DD for the input mask
  let formattedDate = holiday.date
  try {
    const d = new Date(holiday.date)
    if (!isNaN(d.getTime())) formattedDate = date.formatDate(d, 'YYYY-MM-DD')
  } catch { /* ignore */ }

  editForm.value = {
    id: holiday.id,
    name: holiday.name,
    date: formattedDate,
    category: holiday.category
  }
  editDialog.value = true
}

const submitEditHoliday = async () => {
  if (!editForm.value.id) return
  saving.value = true
  $q.loading.show()
  try {
    await updateHoliday(editForm.value.id, {
      name: editForm.value.name,
      date: editForm.value.date,
      category: editForm.value.category
    })
    $q.notify({ color: 'positive', message: 'Holiday updated successfully', position: 'top' })
    editDialog.value = false
    await fetchHolidays()
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to update holiday', position: 'top' })
  } finally {
    saving.value = false
    $q.loading.hide()
  }
}

// Delete Logic
const deleteDialog = ref(false)

const openDeleteDialog = (holiday: PublicHolidayResponseDto) => {
  selectedHoliday.value = holiday
  deleteDialog.value = true
}

const submitDeleteHoliday = async () => {
  if (!selectedHoliday.value) return
  saving.value = true
  $q.loading.show()
  try {
    await deleteHoliday(selectedHoliday.value.id)
    $q.notify({ color: 'positive', message: 'Holiday deleted successfully', position: 'top' })
    deleteDialog.value = false
    await fetchHolidays()
  } catch {
    $q.notify({ color: 'negative', message: 'Failed to delete holiday', position: 'top' })
  } finally {
    saving.value = false
    $q.loading.hide()
  }
}

const triggerImport = () => {
  $q.notify({
    message: 'Feature simulated: Import dialog would open here to upload CSV calendars.',
    color: 'primary',
    icon: 'info',
    position: 'top'
  })
}

onMounted(() => {
  void fetchHolidays()
})
</script>

<style scoped>
.holiday-page {
  background: #f5f7fa;
  min-height: 100vh;
}

/* TYPOGRAPHY */
.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #101828;
}

.page-sub {
  font-size: 14px;
  color: #667085;
  margin-top: 4px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #101828;
}

.detail-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #98a2b3;
}

/* CARDS & LAYOUT */
.table-card {
  border-radius: 16px !important;
  background: #ffffff;
  border: 1px solid #eaecf0 !important;
}

.full-height {
  height: 100%;
}

.border-top {
  border-top: 1px solid #eaecf0;
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

.btn-outline-regular {
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

/* CALENDAR OVERRIDES */
.custom-calendar :deep(.q-date__header) {
  background-color: transparent !important;
  color: #101828 !important;
}

/* UPCOMING LIST */
.upcoming-item {
  background: #fafafb;
  border: 1px solid #eaecf0;
  border-radius: 8px;
  padding: 10px 14px;
}

.upcoming-name {
  font-size: 13px;
  font-weight: 600;
  color: #101828;
}

.upcoming-cat {
  font-size: 11px;
  color: #667085;
  margin-top: 2px;
}

.upcoming-date {
  font-size: 12px;
  font-weight: 600;
  color: #0f2044;
}

/* TABLE STYLES */
.holiday-name {
  font-size: 14px;
  font-weight: 600;
  color: #101828;
}

/* CATEGORY BADGES */
.category-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}

.cat-national {
  background: #fff1f3;
  color: #e11d48;
}

.cat-corporate {
  background: #eff8ff;
  color: #175cd3;
}

.cat-observance {
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
