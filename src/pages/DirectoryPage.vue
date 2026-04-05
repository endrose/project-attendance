<template>
  <div class="directory-page q-pa-lg">

    <!-- STATS CARDS -->
    <div class="row q-col-gutter-md q-mb-lg">

      <!-- Total Active Employees -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-start justify-between">
              <div class="stat-icon-wrap stat-icon--blue">
                <q-icon name="schedule" size="20px" color="primary" />
              </div>
              <span class="stat-badge stat-badge--green">+2.4%</span>
            </div>
            <div class="stat-label q-mt-md">TOTAL ACTIVE EMPLOYEES</div>
            <div class="stat-value">1,284</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Present Today -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-start justify-between">
              <div class="stat-icon-wrap stat-icon--blue">
                <q-icon name="calendar_month" size="20px" color="primary" />
              </div>
              <span class="stat-badge stat-badge--gray">94% rate</span>
            </div>
            <div class="stat-label q-mt-md">PRESENT TODAY</div>
            <div class="stat-value">1,210</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Pending Approvals -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-start justify-between">
              <div class="stat-icon-wrap stat-icon--pink">
                <q-icon name="assignment" size="20px" color="pink-5" />
              </div>
              <span class="stat-badge stat-badge--red">Action Req.</span>
            </div>
            <div class="stat-label q-mt-md">PENDING APPROVALS</div>
            <div class="stat-value">42</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Estimated Payroll -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card stat-card--dark">
          <q-card-section>
            <div class="row items-start justify-between">
              <div class="stat-icon-wrap stat-icon--dark">
                <q-icon name="credit_card" size="20px" color="white" />
              </div>
            </div>
            <div class="stat-label stat-label--light q-mt-md">ESTIMATED PAYROLL (MONTH)</div>
            <div class="stat-value stat-value--light">$428,500.00</div>
          </q-card-section>
        </q-card>
      </div>

    </div>

    <!-- WORKFORCE DIRECTORY TABLE -->
    <q-card flat bordered class="table-card q-mb-lg">
      <q-card-section>

        <!-- Header -->
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="section-title">Workforce Directory</div>
            <div class="section-sub">Managing all company staff and operational status</div>
          </div>
          <div class="row q-gutter-sm">
            <q-btn outline color="grey-7" icon="calendar_month" label="Set Work Schedule" size="sm"
              class="action-btn" />
            <q-btn outline color="grey-7" icon="settings" label="Manage Leave" size="sm" class="action-btn" />
            <q-btn unelevated color="dark" icon="person_add" label="Register New Employee" size="sm"
              class="action-btn-dark" />
          </div>
        </div>

        <!-- Table -->
        <q-table flat :rows="employees" :columns="columns" row-key="id" hide-bottom class="directory-table">
          <!-- Employee & ID -->
          <template #body-cell-employee="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <q-avatar size="38px"
                  :style="{ background: props.row.avatarBg, color: '#fff', fontWeight: 600, fontSize: '13px' }">
                  {{ props.row.initials }}
                </q-avatar>
                <div>
                  <div class="emp-name">{{ props.row.name }}</div>
                  <div class="emp-id">{{ props.row.empId }}</div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Department & Role -->
          <template #body-cell-department="props">
            <q-td :props="props">
              <div class="emp-dept">{{ props.row.department }}</div>
              <div class="emp-role">{{ props.row.role }}</div>
            </q-td>
          </template>

          <!-- Status -->
          <template #body-cell-status="props">
            <q-td :props="props">
              <span
                :class="['status-badge', props.row.status === 'ACTIVE' ? 'status-badge--active' : 'status-badge--inactive']">
                {{ props.row.status }}
              </span>
            </q-td>
          </template>

          <!-- Actions -->
          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm justify-end">
                <q-btn flat round dense icon="edit" size="sm" color="grey-6">
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn flat round dense icon="lock" size="sm" color="grey-6">
                  <q-tooltip>Reset Password</q-tooltip>
                </q-btn>
                <q-btn flat round dense icon="delete" size="sm" color="negative">
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

        </q-table>

        <!-- Pagination -->
        <div class="row items-center justify-between q-mt-md">
          <div class="pagination-info">Showing 1-10 of 1,284 entries</div>
          <q-pagination v-model="currentPage" :max="3" :max-pages="5" boundary-numbers direction-links color="dark"
            active-color="dark" />
        </div>

      </q-card-section>
    </q-card>

    <!-- BOTTOM ROW -->
    <div class="row q-col-gutter-md">

      <!-- Attendance & Salary Calculation -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="table-card">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="section-title">Attendance & Salary Calculation</div>
                <div class="section-sub">Cycle Period: Oct 26 – Nov 25</div>
              </div>
              <q-btn flat icon="download" label="Export Report" size="sm" color="grey-7" />
            </div>

            <q-table flat :rows="salaryRows" :columns="salaryColumns" row-key="emp" hide-bottom class="directory-table">
              <template #body-cell-netSalary="props">
                <q-td :props="props">
                  <span class="salary-value">{{ props.row.netSalary }}</span>
                </q-td>
              </template>
            </q-table>

          </q-card-section>
        </q-card>
      </div>

      <!-- Payroll Summary -->
      <div class="col-12 col-md-4">
        <q-card flat class="stat-card stat-card--dark full-height">
          <q-card-section>
            <div class="section-title section-title--light">Payroll Summary</div>
            <div class="section-sub section-sub--light q-mb-lg">Processing Progress</div>

            <div v-for="item in payrollProgress" :key="item.label" class="q-mb-md">
              <div class="row items-center justify-between q-mb-xs">
                <span class="progress-label">{{ item.label }}</span>
                <span class="progress-pct">{{ item.pct }}%</span>
              </div>
              <q-linear-progress :value="item.pct / 100" color="teal-4" track-color="white" size="6px" rounded />
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

const employees = [
  {
    id: 1,
    name: 'Johnathan Doe',
    empId: 'ID: EMP-88210',
    initials: 'JD',
    avatarBg: '#1a73e8',
    department: 'Engineering',
    role: 'Senior Cloud Architect',
    status: 'ACTIVE',
  },
  {
    id: 2,
    name: 'Sarah Miller',
    empId: 'ID: EMP-88342',
    initials: 'SM',
    avatarBg: '#6c63ff',
    department: 'Human Resources',
    role: 'Talent Acquisition',
    status: 'ACTIVE',
  },
  {
    id: 3,
    name: 'Robert Wilson',
    empId: 'ID: EMP-88102',
    initials: 'RW',
    avatarBg: '#8a94a6',
    department: 'Finance',
    role: 'Comptroller',
    status: 'INACTIVE',
  },
]

const columns = [
  { name: 'employee', label: 'EMPLOYEE & ID', field: 'name', align: 'left' as const },
  { name: 'department', label: 'DEPARTMENT & ROLE', field: 'department', align: 'left' as const },
  { name: 'status', label: 'ACCOUNT STATUS', field: 'status', align: 'left' as const },
  { name: 'actions', label: 'ACTIONS', field: 'actions', align: 'right' as const },
]

const salaryRows = [
  { emp: 'Johnathan Doe', workDays: 22, overtime: '4h', netSalary: '$8,400.00' },
  { emp: 'Sarah Miller', workDays: 21, overtime: '2h', netSalary: '$6,200.00' },
  { emp: 'Robert Wilson', workDays: 18, overtime: '0h', netSalary: '$5,100.00' },
]

const salaryColumns = [
  { name: 'emp', label: 'EMPLOYEE', field: 'emp', align: 'left' as const },
  { name: 'workDays', label: 'WORK DAYS', field: 'workDays', align: 'left' as const },
  { name: 'overtime', label: 'OVERTIME', field: 'overtime', align: 'left' as const },
  { name: 'netSalary', label: 'NET SALARY', field: 'netSalary', align: 'left' as const },
]

const payrollProgress = [
  { label: 'Verification Phase', pct: 85 },
  { label: 'Tax Calculation', pct: 60 },
  { label: 'Final Disbursement', pct: 30 },
]
</script>

<style scoped>
.directory-page {
  background: #f5f7fa;
  min-height: 100vh;
}

/* STAT CARDS */
.stat-card {
  border-radius: 16px !important;
  background: #ffffff;
  border: 1px solid #eaecf0 !important;
}

.stat-card--dark {
  background: #0f2044 !important;
  border: none !important;
}

.full-height {
  height: 100%;
}

.stat-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon--blue {
  background: #eff6ff;
}

.stat-icon--pink {
  background: #fff0f3;
}

.stat-icon--dark {
  background: rgba(255, 255, 255, 0.12);
}

.stat-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
}

.stat-badge--green {
  background: #e6f9f0;
  color: #12b76a;
}

.stat-badge--gray {
  background: #f2f4f7;
  color: #667085;
}

.stat-badge--red {
  background: #e53935;
  color: #ffffff;
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  color: #8a94a6;
  letter-spacing: 0.5px;
}

.stat-label--light {
  color: rgba(255, 255, 255, 0.6);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #101828;
  margin-top: 4px;
}

.stat-value--light {
  color: #ffffff;
}

/* TABLE CARD */
.table-card {
  border-radius: 16px !important;
  background: #ffffff;
  border: 1px solid #eaecf0 !important;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #101828;
}

.section-title--light {
  color: #ffffff;
}

.section-sub {
  font-size: 13px;
  color: #667085;
  margin-top: 2px;
}

.section-sub--light {
  color: rgba(255, 255, 255, 0.55);
}

/* ACTION BUTTONS */
.action-btn {
  border-radius: 8px;
  font-size: 12px;
}

.action-btn-dark {
  background: #0f2044 !important;
  color: #ffffff !important;
  border-radius: 8px;
  font-size: 12px;
}

/* EMPLOYEE TABLE */
.emp-name {
  font-size: 14px;
  font-weight: 600;
  color: #101828;
}

.emp-id {
  font-size: 12px;
  color: #667085;
  margin-top: 2px;
}

.emp-dept {
  font-size: 14px;
  font-weight: 500;
  color: #101828;
}

.emp-role {
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

/* TABLE HEADER */
:deep(.directory-table .q-table__top),
:deep(.directory-table thead tr th) {
  font-size: 11px;
  font-weight: 600;
  color: #8a94a6;
  letter-spacing: 0.5px;
  background: #f9fafb;
  border-bottom: 1px solid #eaecf0;
}

:deep(.directory-table tbody tr td) {
  border-bottom: 1px solid #f2f4f7;
  padding: 14px 16px;
}

:deep(.directory-table tbody tr:last-child td) {
  border-bottom: none;
}

/* PAGINATION */
.pagination-info {
  font-size: 13px;
  color: #667085;
}

/* SALARY */
.salary-value {
  font-weight: 600;
  color: #101828;
}

/* PROGRESS */
.progress-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
}

.progress-pct {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
}

:deep(.q-linear-progress__track) {
  opacity: 0.15;
}
</style>
