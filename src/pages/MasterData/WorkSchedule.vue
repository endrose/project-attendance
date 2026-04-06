<template>
  <div class="work-schedule-page q-pa-lg">

    <!-- Header Row -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="page-title">Work Schedule Management</div>
        <div class="page-sub">Configure shift timings and manage employee weekly schedules</div>
      </div>
      <div>
        <q-btn unelevated color="dark" icon="add" label="Create New Shift" class="action-btn-dark" />
      </div>
    </div>

    <!-- Layout Split -->
    <div class="row q-col-gutter-lg">
      
      <!-- LEFT: Shift Types List -->
      <div class="col-12 col-md-3">
        <q-card flat bordered class="table-card full-height">
          <q-card-section>
            
            <div class="section-title q-mb-md">Standard Shifts</div>
            
            <div class="shift-list q-gutter-y-sm">
              <div v-for="shift in shifts" :key="shift.id" class="shift-item">
                <div class="row items-center justify-between q-mb-xs">
                  <div class="row items-center q-gutter-x-sm">
                    <span class="shift-color-indicator" :style="{ backgroundColor: shift.textColor }"></span>
                    <span class="shift-name">{{ shift.name }}</span>
                  </div>
                  <q-btn flat round dense icon="more_vert" size="sm" color="grey-6" />
                </div>
                <!-- Shift Details -->
                <div class="shift-details row items-center q-gutter-x-md">
                  <div>
                    <div class="detail-label">TIME</div>
                    <div class="detail-value">{{ shift.startTime }} - {{ shift.endTime }}</div>
                  </div>
                  <div>
                    <div class="detail-label">BREAK</div>
                    <div class="detail-value">{{ shift.breakDuration }}</div>
                  </div>
                </div>
              </div>
            </div>

          </q-card-section>
        </q-card>
      </div>

      <!-- RIGHT: Employee Schedule Table -->
      <div class="col-12 col-md-9">
        <q-card flat bordered class="table-card full-height">
          <q-card-section>
            
            <!-- Table Action Header -->
            <div class="row items-center justify-between q-mb-md">
              <div class="row items-center q-gutter-md">
                <div class="section-title">Weekly Assignments</div>
                <div class="row q-gutter-sm items-center period-selector">
                  <q-btn flat round icon="chevron_left" size="sm" color="grey-7" dense />
                  <span class="period-text">Oct 26 - Nov 01, 2026</span>
                  <q-btn flat round icon="chevron_right" size="sm" color="grey-7" dense />
                </div>
              </div>
              <div class="row q-gutter-sm">
                <q-btn outline icon="download" size="sm" label="Export" color="grey-7" class="btn-outline-regular" />
                <q-btn outline icon="filter_list" size="sm" label="Filters" color="grey-7" class="btn-outline-regular" />
              </div>
            </div>

            <!-- Table -->
            <q-table flat :rows="assignments" :columns="assignmentColumns" row-key="id" hide-bottom class="schedule-table">
              
              <!-- Employee Column -->
              <template #body-cell-employee="props">
                <q-td :props="props">
                  <div class="row items-center q-gutter-sm">
                    <q-avatar size="34px" :style="{ background: props.row.avatarBg, color: '#fff', fontSize: '12px', fontWeight: 600 }">
                      {{ props.row.initials }}
                    </q-avatar>
                    <div>
                      <div class="emp-name">{{ props.row.name }}</div>
                      <div class="emp-role">{{ props.row.role }}</div>
                    </div>
                  </div>
                </q-td>
              </template>

              <!-- Dynamic Days -->
              <!-- V-for loop generating slots for each day. We check if a shift exists, else OFF -->
              <template v-for="day in ['mon','tue','wed','thu','fri','sat','sun']" :key="day" v-slot:[`body-cell-${day}`]="props">
                <q-td :props="props" class="text-center">
                  <span v-if="props.row[day]" class="shift-badge" 
                    :style="{ backgroundColor: getShiftBg(props.row[day]), color: getShiftText(props.row[day]) }">
                    {{ props.row[day] }}
                  </span>
                  <span v-else class="off-badge">OFF</span>
                </q-td>
              </template>

            </q-table>
            
            <div class="row items-center justify-between q-mt-md">
              <div class="pagination-info">Showing {{ assignments.length }} employees</div>
              <q-pagination v-model="currentPage" :max="1" direction-links color="dark" active-color="dark" />
            </div>

          </q-card-section>
        </q-card>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentPage = ref(1)

const shifts = [
  { id: 1, name: 'Morning', startTime: '08:00 AM', endTime: '05:00 PM', breakDuration: '1 hr', textColor: '#175cd3', bgColor: '#eff8ff' },
  { id: 2, name: 'Evening', startTime: '04:00 PM', endTime: '12:00 AM', breakDuration: '45 mins', textColor: '#6941c6', bgColor: '#f9f5ff' },
  { id: 3, name: 'Night', startTime: '12:00 AM', endTime: '08:00 AM', breakDuration: '1 hr', textColor: '#027a48', bgColor: '#ecfdf3' },
  { id: 4, name: 'Half Day', startTime: '08:00 AM', endTime: '12:00 PM', breakDuration: 'None', textColor: '#b54708', bgColor: '#fffaeb' },
]

const getShiftBg = (shiftName: string) => {
  const found = shifts.find(s => s.name === shiftName)
  return found ? found.bgColor : '#f2f4f7'
}

const getShiftText = (shiftName: string) => {
  const found = shifts.find(s => s.name === shiftName)
  return found ? found.textColor : '#667085'
}

const assignmentColumns = [
  { name: 'employee', label: 'EMPLOYEE', field: 'name', align: 'left' as const },
  { name: 'mon', label: 'MON 26', field: 'mon', align: 'center' as const },
  { name: 'tue', label: 'TUE 27', field: 'tue', align: 'center' as const },
  { name: 'wed', label: 'WED 28', field: 'wed', align: 'center' as const },
  { name: 'thu', label: 'THU 29', field: 'thu', align: 'center' as const },
  { name: 'fri', label: 'FRI 30', field: 'fri', align: 'center' as const },
  { name: 'sat', label: 'SAT 31', field: 'sat', align: 'center' as const },
  { name: 'sun', label: 'SUN 01', field: 'sun', align: 'center' as const },
]

const assignments = [
  {
    id: 1, name: 'Alexander Smith', initials: 'AS', avatarBg: '#1a73e8', role: 'Security Ops',
    mon: 'Morning', tue: 'Morning', wed: 'Morning', thu: 'Morning', fri: 'Morning', sat: null, sun: null
  },
  {
    id: 2, name: 'Maria Garcia', initials: 'MG', avatarBg: '#6c63ff', role: 'Superintendent',
    mon: 'Evening', tue: 'Evening', wed: 'Evening', thu: 'Evening', fri: 'Evening', sat: 'Half Day', sun: null
  },
  {
    id: 3, name: 'Johnathan Doe', initials: 'JD', avatarBg: '#8a94a6', role: 'Technician',
    mon: 'Night', tue: 'Night', wed: 'Night', thu: 'Night', fri: 'Night', sat: null, sun: null
  },
  {
    id: 4, name: 'Emily Chen', initials: 'EC', avatarBg: '#10b981', role: 'Support Agent',
    mon: 'Morning', tue: 'Half Day', wed: 'Evening', thu: 'Morning', fri: 'Morning', sat: null, sun: null
  },
  {
    id: 5, name: 'David Lee', initials: 'DL', avatarBg: '#f59e0b', role: 'Facility Manager',
    mon: null, tue: null, wed: 'Morning', thu: 'Morning', fri: 'Morning', sat: 'Morning', sun: 'Morning'
  },
]
</script>

<style scoped>
.work-schedule-page {
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

/* LAYOUT CARDS */
.table-card {
  border-radius: 16px !important;
  background: #ffffff;
  border: 1px solid #eaecf0 !important;
}

.full-height {
  height: 100%;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #101828;
}

/* BUTTONS & CONTROLS */
.action-btn-dark {
  background: #0f2044 !important;
  color: #ffffff !important;
  border-radius: 8px;
  font-size: 13px;
  padding: 8px 16px;
}

.btn-outline-regular {
  border-radius: 8px;
  font-size: 12px;
}

.period-selector {
  background: #f9fafb;
  border: 1px solid #eaecf0;
  border-radius: 8px;
  padding: 2px 4px;
}

.period-text {
  font-size: 13px;
  font-weight: 600;
  color: #344054;
}

/* SHIFT DEFINITION LIST (LEFT PANE) */
.shift-item {
  padding: 14px 16px;
  border: 1px solid #eaecf0;
  border-radius: 12px;
  background: #ffffff;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.01);
}

.shift-item:hover {
  border-color: #d0d5dd;
  box-shadow: 0 4px 6px rgba(0,0,0,0.03);
}

.shift-color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.shift-name {
  font-size: 14px;
  font-weight: 600;
  color: #344054;
}

.detail-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #98a2b3;
  margin-bottom: 2px;
}

.detail-value {
  font-size: 12px;
  font-weight: 500;
  color: #101828;
}

/* EMPLOYEE TABLE (RIGHT PANE) */
.emp-name {
  font-size: 13px;
  font-weight: 600;
  color: #101828;
}

.emp-role {
  font-size: 11px;
  color: #667085;
  margin-top: 2px;
}

/* BADGES */
.shift-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 8px;
  display: inline-block;
  white-space: nowrap;
  letter-spacing: 0.3px;
}

.off-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 8px;
  background: #f2f4f7;
  color: #98a2b3;
  display: inline-block;
}

/* QUASAR TABLE OVERRIDES */
:deep(.schedule-table .q-table__top),
:deep(.schedule-table thead tr th) {
  font-size: 11px;
  font-weight: 600;
  color: #667085;
  background: #f9fafb;
  border-bottom: 1px solid #eaecf0;
  padding: 12px 10px;
  letter-spacing: 0.5px;
}

:deep(.schedule-table tbody tr td) {
  border-bottom: 1px solid #eaecf0;
  padding: 12px 10px;
}

:deep(.schedule-table tbody tr:last-child td) {
  border-bottom: none;
}

.pagination-info {
  font-size: 13px;
  color: #667085;
}
</style>
