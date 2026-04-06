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
        <q-btn outline color="primary" icon="file_upload" label="Import Holidays" class="btn-outline-regular" @click="triggerImport" />
        <!-- Add Button -->
        <q-btn unelevated color="dark" icon="event_available" label="Add Holiday" class="action-btn-dark" />
      </div>
    </div>

    <!-- Layout Split -->
    <div class="row q-col-gutter-lg">
      
      <!-- LEFT: Summary / Small Calendar Widget -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="table-card">
          <q-card-section>
            <div class="section-title q-mb-md">Calendar View</div>
            
            <q-date 
              v-model="calendarDate" 
              minimal 
              flat 
              color="primary"
              :events="holidayEvents" 
              event-color="negative"
              class="full-width q-mb-md custom-calendar" 
            />

            <div class="q-pt-md border-top">
              <div class="detail-label q-mb-md">UPCOMING HOLIDAYS</div>
              <div class="upcoming-list q-gutter-y-sm">
                <div v-for="h in holidays.slice(0,3)" :key="h.id" class="upcoming-item">
                  <div class="row items-center justify-between">
                    <div>
                      <div class="upcoming-name">{{ h.name }}</div>
                      <div class="upcoming-cat">{{ h.category }}</div>
                    </div>
                    <span class="upcoming-date">{{ h.shortDate }}</span>
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
              <div class="section-title">Holiday Registry (2026)</div>
              <q-input v-model="searchQuery" dense outlined placeholder="Search events..." class="search-input">
                <template v-slot:prepend><q-icon name="search" /></template>
              </q-input>
            </div>

            <!-- Table -->
            <q-table flat :rows="filteredHolidays" :columns="columns" row-key="id" hide-bottom class="directory-table">
              
              <!-- Holiday Name -->
              <template #body-cell-name="props">
                <q-td :props="props">
                  <span class="holiday-name">{{ props.row.name }}</span>
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
                    <q-btn flat round dense icon="edit" size="sm" color="grey-6" />
                    <q-btn flat round dense icon="delete" size="sm" color="negative" />
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

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const currentPage = ref(1)
const searchQuery = ref('')

// Initialize standard date view (for dummy layout)
const calendarDate = ref('2026/04/03')

const holidays = ref([
  { id: 1, name: 'New Year\'s Day', date: 'January 1, 2026', shortDate: '01 Jan', eventDate: '2026/01/01', category: 'National Holiday' },
  { id: 2, name: 'Good Friday', date: 'April 3, 2026', shortDate: '03 Apr', eventDate: '2026/04/03', category: 'National Holiday' },
  { id: 3, name: 'Company Retreat', date: 'May 15, 2026', shortDate: '15 May', eventDate: '2026/05/15', category: 'Corporate Event' },
  { id: 4, name: 'Independence Day', date: 'August 17, 2026', shortDate: '17 Aug', eventDate: '2026/08/17', category: 'National Holiday' },
  { id: 5, name: 'Christmas Day', date: 'December 25, 2026', shortDate: '25 Dec', eventDate: '2026/12/25', category: 'Observance' },
])

const holidayEvents = computed(() => holidays.value.map(h => h.eventDate))

const columns = [
  { name: 'name', label: 'HOLIDAY NAME', field: 'name', align: 'left' as const },
  { name: 'date', label: 'DATE', field: 'date', align: 'left' as const },
  { name: 'category', label: 'CATEGORY', field: 'category', align: 'left' as const },
  { name: 'actions', label: '', field: 'actions', align: 'right' as const },
]

const filteredHolidays = computed(() => {
  if (!searchQuery.value) return holidays.value
  const q = searchQuery.value.toLowerCase()
  return holidays.value.filter(h => 
    h.name.toLowerCase().includes(q) || 
    h.category.toLowerCase().includes(q)
  )
})

const getCatClass = (cat: string) => {
  if (cat === 'National Holiday') return 'cat-national'
  if (cat === 'Corporate Event') return 'cat-corporate'
  return 'cat-observance'
}

const triggerImport = () => {
  $q.notify({
    message: 'Feature simulated: Import dialog would open here to upload CSV calendars.',
    color: 'primary',
    icon: 'info',
    position: 'top'
  })
}
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
