<template>
  <div class="attendance-page q-pa-lg">

    <!-- PAGE HEADER -->
    <div class="row items-start justify-between q-mb-lg">
      <div>
        <div class="page-title">Time & Attendance</div>
        <div class="page-sub">REAL-TIME WORKFORCE MONITORING • {{ todayLabel }}</div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn outline color="grey-7" icon="calendar_month" label="View Schedule" size="sm" class="header-btn" />
        <q-btn unelevated color="dark" icon="download" label="Export Logs" size="sm" class="header-btn-dark" />
      </div>
    </div>

    <!-- STATS CARDS -->
    <div class="row q-col-gutter-md q-mb-lg">

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="stat-icon-wrap stat-icon--green">
                <q-icon name="person" size="22px" color="teal-6" />
              </div>
              <span class="stat-tag">TODAY</span>
            </div>
            <div class="stat-value q-mt-md">1,142</div>
            <div class="stat-label">On Time</div>
            <div class="stat-pct">92% of total</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="stat-icon-wrap stat-icon--orange">
                <q-icon name="schedule" size="22px" color="orange-6" />
              </div>
              <span class="stat-tag">TODAY</span>
            </div>
            <div class="stat-value q-mt-md">48</div>
            <div class="stat-label">Late Arrival</div>
            <div class="stat-pct">4% of total</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="stat-icon-wrap stat-icon--red">
                <q-icon name="person_off" size="22px" color="red-5" />
              </div>
              <span class="stat-tag">TODAY</span>
            </div>
            <div class="stat-value q-mt-md">12</div>
            <div class="stat-label">Absent</div>
            <div class="stat-pct">1% of total</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="stat-icon-wrap stat-icon--blue">
                <q-icon name="timelapse" size="22px" color="primary" />
              </div>
              <span class="stat-tag">TODAY</span>
            </div>
            <div class="stat-value q-mt-md">84</div>
            <div class="stat-label">Overtime</div>
            <div class="stat-pct">7% of total</div>
          </q-card-section>
        </q-card>
      </div>

    </div>

    <!-- MAIN CONTENT -->
    <div class="row q-col-gutter-md">

      <!-- LEFT: Daily Attendance Log -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="table-card">
          <q-card-section>

            <!-- Table Header -->
            <div class="row items-center justify-between q-mb-md">
              <div class="row items-center q-gutter-md">
                <span class="section-title">Daily Attendance Log</span>
                <div class="row q-gutter-xs">
                  <q-btn v-for="f in filters" :key="f" :unelevated="activeFilter === f" :flat="activeFilter !== f"
                    :color="activeFilter === f ? 'dark' : 'grey-6'" :label="f" size="xs" dense class="filter-btn"
                    @click="activeFilter = f" />
                </div>
              </div>
              <div class="row q-gutter-xs">
                <q-btn flat round dense icon="filter_list" size="sm" color="grey-6" />
                <q-btn flat round dense icon="more_vert" size="sm" color="grey-6" />
              </div>
            </div>

            <!-- Table -->
            <q-table flat :rows="filteredRows" :columns="columns" row-key="id" hide-bottom class="attendance-table">
              <!-- Employee -->
              <template #body-cell-employee="props">
                <q-td :props="props">
                  <div class="row items-center q-gutter-sm">
                    <q-avatar size="36px"
                      :style="{ background: props.row.avatarBg, color: '#fff', fontWeight: 600, fontSize: '12px' }">
                      {{ props.row.initials }}
                    </q-avatar>
                    <div>
                      <div class="emp-name">{{ props.row.name }}</div>
                      <div class="emp-role">{{ props.row.role }}</div>
                    </div>
                  </div>
                </q-td>
              </template>

              <!-- Clock In -->
              <template #body-cell-clockIn="props">
                <q-td :props="props">
                  <div class="row items-center q-gutter-xs time-text">
                    <q-icon name="schedule" size="14px" color="grey-5" />
                    <span>{{ props.row.clockIn || '-' }}</span>
                  </div>
                </q-td>
              </template>

              <!-- Clock Out -->
              <template #body-cell-clockOut="props">
                <q-td :props="props">
                  <div class="row items-center q-gutter-xs time-text">
                    <q-icon name="schedule" size="14px" color="grey-5" />
                    <span>{{ props.row.clockOut || '-' }}</span>
                  </div>
                </q-td>
              </template>

              <!-- Status -->
              <template #body-cell-status="props">
                <q-td :props="props">
                  <span :class="['status-badge', `status-badge--${props.row.status.toLowerCase()}`]">
                    {{ props.row.status }}
                  </span>
                </q-td>
              </template>

              <!-- Location -->
              <template #body-cell-location="props">
                <q-td :props="props">
                  <div class="row items-center q-gutter-xs time-text">
                    <q-icon name="location_on" size="14px" color="grey-5" />
                    <span>{{ props.row.location || '-' }}</span>
                  </div>
                </q-td>
              </template>

            </q-table>

          </q-card-section>
        </q-card>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="col-12 col-md-4">

        <!-- My Attendance Dark Card -->
        <q-card flat class="my-attendance-card q-mb-md">
          <q-card-section>

            <div class="row items-center q-gutter-sm q-mb-lg">
              <div class="clock-icon-wrap">
                <q-icon name="schedule" size="20px" color="white" />
              </div>
              <span class="my-att-label">MY ATTENDANCE</span>
            </div>

            <div class="live-clock">{{ liveClock }}</div>
            <div class="live-date">{{ liveDate }}</div>

            <q-btn unelevated label="Clock Out Now" class="clock-out-btn q-mt-xl" size="md" />

            <div class="row items-center justify-center q-mt-sm q-gutter-xs">
              <q-icon name="location_on" size="14px" color="blue-3" />
              <span class="location-label">Office HQ • Floor 4, Zone B</span>
            </div>

            <!-- decorative circle -->
            <div class="deco-circle"></div>

          </q-card-section>
        </q-card>

        <!-- Weekly Overview -->
        <q-card flat bordered class="table-card">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <span class="section-title">Weekly Overview</span>
              <span class="week-badge">Week 41</span>
            </div>

            <div v-for="day in weeklyData" :key="day.day" class="weekly-row q-mb-sm">
              <div class="row items-center justify-between q-mb-xs">
                <span class="day-label">{{ day.day }}</span>
                <span class="day-hours">{{ day.hours }}h</span>
              </div>
              <q-linear-progress :value="day.hours / 10" :color="day.color" track-color="grey-3" size="6px" rounded />
            </div>

          </q-card-section>
        </q-card>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Live clock
const now = ref(new Date())
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => { now.value = new Date() }, 1000)
})
onUnmounted(() => clearInterval(timer))

const liveClock = computed(() => {
  return now.value.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
})

const liveDate = computed(() => {
  return now.value.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
})

const todayLabel = computed(() => {
  return now.value.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
})

// Filter
const filters = ['All', 'Late', 'Absent']
const activeFilter = ref('All')

const employees = [
  { id: 1, name: 'Johnathan Doe', role: 'Cloud Architect', initials: 'JD', avatarBg: '#1a73e8', clockIn: '08:52 AM', clockOut: '05:30 PM', status: 'On Time', location: 'Office HQ' },
  { id: 2, name: 'Sarah Miller', role: 'HR Specialist', initials: 'SM', avatarBg: '#7c3aed', clockIn: '09:15 AM', clockOut: '06:05 PM', status: 'Late', location: 'Remote' },
  { id: 3, name: 'Robert Wilson', role: 'Comptroller', initials: 'RW', avatarBg: '#6b7280', clockIn: '08:45 AM', clockOut: '05:15 PM', status: 'On Time', location: 'Office HQ' },
  { id: 4, name: 'Emily Chen', role: 'UI Designer', initials: 'EC', avatarBg: '#9ca3af', clockIn: '', clockOut: '', status: 'Absent', location: '' },
  { id: 5, name: 'Marcus Lee', role: 'DevOps Engineer', initials: 'ML', avatarBg: '#0891b2', clockIn: '08:30 AM', clockOut: '06:30 PM', status: 'On Time', location: 'Office HQ' },
]

const filteredRows = computed(() => {
  if (activeFilter.value === 'All') return employees
  if (activeFilter.value === 'Late') return employees.filter(e => e.status === 'Late')
  if (activeFilter.value === 'Absent') return employees.filter(e => e.status === 'Absent')
  return employees
})

const columns = [
  { name: 'employee', label: 'EMPLOYEE', field: 'name', align: 'left' as const },
  { name: 'clockIn', label: 'CLOCK IN', field: 'clockIn', align: 'left' as const },
  { name: 'clockOut', label: 'CLOCK OUT', field: 'clockOut', align: 'left' as const },
  { name: 'status', label: 'STATUS', field: 'status', align: 'left' as const },
  { name: 'location', label: 'LOCATION', field: 'location', align: 'left' as const },
]

// Weekly data
const weeklyData = [
  { day: 'Monday', hours: 8.5, color: 'teal-5' },
  { day: 'Tuesday', hours: 9.0, color: 'teal-5' },
  { day: 'Wednesday', hours: 7.5, color: 'teal-5' },
  { day: 'Thursday', hours: 9.5, color: 'blue-5' },
  { day: 'Friday', hours: 4.0, color: 'orange-4' },
]
</script>

<style scoped>
.attendance-page {
  background: #f5f7fa;
  min-height: 100vh;
}

/* HEADER */
.page-title {
  font-size: 32px;
  font-weight: 800;
  color: #0f2044;
  line-height: 1.1;
}

.page-sub {
  font-size: 12px;
  font-weight: 600;
  color: #8a94a6;
  letter-spacing: 0.8px;
  margin-top: 4px;
}

.header-btn {
  border-radius: 8px;
  font-size: 13px;
}

.header-btn-dark {
  background: #0f2044 !important;
  color: #fff !important;
  border-radius: 8px;
  font-size: 13px;
}

/* STAT CARDS */
.stat-card {
  border-radius: 16px !important;
  background: #ffffff;
  border: 1px solid #eaecf0 !important;
}

.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon--green {
  background: #ecfdf5;
}

.stat-icon--orange {
  background: #fff7ed;
}

.stat-icon--red {
  background: #fff1f2;
}

.stat-icon--blue {
  background: #eff6ff;
}

.stat-tag {
  font-size: 11px;
  font-weight: 600;
  color: #8a94a6;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 30px;
  font-weight: 700;
  color: #0f2044;
}

.stat-label {
  font-size: 13px;
  color: #667085;
  margin-top: 2px;
}

.stat-pct {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

/* TABLE CARD */
.table-card {
  border-radius: 16px !important;
  background: #ffffff;
  border: 1px solid #eaecf0 !important;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f2044;
}

/* FILTER BUTTONS */
.filter-btn {
  border-radius: 6px;
  font-size: 12px;
  padding: 2px 10px;
}

/* EMPLOYEE */
.emp-name {
  font-size: 14px;
  font-weight: 600;
  color: #101828;
}

.emp-role {
  font-size: 12px;
  color: #667085;
}

.time-text {
  font-size: 13px;
  color: #374151;
}

/* STATUS BADGES */
.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}

.status-badge--on.time,
.status-badge--on\ time {
  background: #ecfdf5;
  color: #027a48;
}

.status-badge--late {
  background: #fff7ed;
  color: #b45309;
}

.status-badge--absent {
  background: #fff1f2;
  color: #be123c;
}

/* catch "On Time" with space */
.status-badge:has(+ *) {
  display: inline-block;
}

/* TABLE OVERRIDES */
:deep(.attendance-table thead tr th) {
  font-size: 11px;
  font-weight: 600;
  color: #8a94a6;
  letter-spacing: 0.5px;
  background: #f9fafb;
  border-bottom: 1px solid #eaecf0;
}

:deep(.attendance-table tbody tr td) {
  border-bottom: 1px solid #f2f4f7;
  padding: 14px 16px;
}

:deep(.attendance-table tbody tr:last-child td) {
  border-bottom: none;
}

/* MY ATTENDANCE CARD */
.my-attendance-card {
  border-radius: 16px !important;
  background: #0f2044 !important;
  position: relative;
  overflow: hidden;
}

.clock-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.my-att-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 1px;
}

.live-clock {
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -1px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.live-date {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  margin-top: 4px;
}

.clock-out-btn {
  width: 100%;
  background: #ffffff !important;
  color: #0f2044 !important;
  font-weight: 700;
  border-radius: 10px;
  font-size: 14px;
}

.location-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.deco-circle {
  position: absolute;
  bottom: -60px;
  right: -60px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 30px solid rgba(255, 255, 255, 0.05);
  pointer-events: none;
}

/* WEEKLY */
.week-badge {
  font-size: 11px;
  font-weight: 600;
  background: #eff6ff;
  color: #1a73e8;
  padding: 3px 10px;
  border-radius: 20px;
}

.day-label {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
  min-width: 80px;
}

.day-hours {
  font-size: 13px;
  font-weight: 600;
  color: #0f2044;
}
</style>
