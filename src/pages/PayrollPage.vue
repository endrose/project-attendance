<template>
  <div class="payroll-page q-pa-lg">

    <!-- PAGE HEADER -->
    <div class="row items-start justify-between q-mb-lg">
      <div>
        <div class="page-title">Payroll Management</div>
        <div class="page-sub">FINANCIAL PERIOD: OCTOBER 2023 • CYCLE #882</div>
      </div>
      <div class="row q-gutter-sm items-center">
        <q-btn outline color="grey-7" icon="download" label="Export Report" size="sm" class="header-btn" />
        <q-btn unelevated color="dark" icon="play_arrow" label="Run Payroll" size="sm" class="header-btn-dark" />
      </div>
    </div>

    <!-- CURRENT PAYROLL CYCLE -->
    <q-card flat bordered class="cycle-card q-mb-md">
      <q-card-section>
        <div class="row items-center justify-between q-mb-lg">
          <div class="row items-center q-gutter-sm">
            <q-icon name="schedule" size="18px" color="grey-6" />
            <span class="section-title">Current Payroll Cycle</span>
          </div>
          <div class="row items-center q-gutter-xs">
            <q-icon name="error_outline" size="16px" color="orange-6" />
            <span class="approval-pending">Approval Pending</span>
          </div>
        </div>

        <!-- Stepper -->
        <div class="stepper-wrap">
          <div class="stepper-line"></div>
          <div class="stepper-steps">

            <div v-for="(step, i) in cycleSteps" :key="i" class="stepper-item">
              <div :class="['stepper-node', `stepper-node--${step.state}`]">
                <q-icon v-if="step.state === 'done'" name="check_circle" size="28px" color="teal-5" />
                <span v-else class="stepper-num">{{ i + 1 }}</span>
              </div>
              <div class="stepper-label">{{ step.label }}</div>
              <div class="stepper-date">{{ step.date }}</div>
            </div>

          </div>
        </div>

      </q-card-section>
    </q-card>

    <!-- MIDDLE ROW -->
    <div class="row q-col-gutter-md q-mb-md">

      <!-- LEFT: Total Disbursement -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="disburse-card full-height">
          <q-card-section class="full-height column justify-between">

            <div>
              <div class="row items-start justify-between">
                <div>
                  <div class="disburse-label">TOTAL PAYROLL DISBURSEMENT</div>
                  <div class="disburse-value">$412,850.00</div>
                </div>
                <div class="trend-icon-wrap">
                  <q-icon name="trending_up" size="22px" color="primary" />
                </div>
              </div>
            </div>

            <div>
              <div class="row items-center justify-between q-mb-xs">
                <span class="budget-label">Budget Utilization</span>
                <span class="budget-pct">72%</span>
              </div>
              <q-linear-progress :value="0.72" color="dark" track-color="grey-3" size="8px" rounded class="q-mb-md" />

              <div class="row items-center justify-between">
                <span class="last-month">Last month: $398,200.00</span>
                <div class="row items-center q-gutter-xs">
                  <q-icon name="trending_up" size="14px" color="teal-5" />
                  <span class="trend-pct">+3.6%</span>
                </div>
              </div>
            </div>

          </q-card-section>
        </q-card>
      </div>

      <!-- RIGHT: Stats -->
      <div class="col-12 col-md-4">
        <div class="column q-gutter-md">

          <!-- Processed Employees -->
          <q-card flat bordered class="mini-stat-card mini-stat-card--green">
            <q-card-section>
              <div class="mini-stat-label">PROCESSED EMPLOYEES</div>
              <div class="row items-end justify-between">
                <div class="mini-stat-value">1,272</div>
                <span class="complete-badge">99% Complete</span>
              </div>
            </q-card-section>
          </q-card>

          <!-- Pending Approvals -->
          <q-card flat bordered class="mini-stat-card mini-stat-card--orange">
            <q-card-section>
              <div class="mini-stat-label">PENDING APPROVALS</div>
              <div class="row items-end justify-between">
                <div class="mini-stat-value">12</div>
                <span class="review-link" @click="() => { }">Review All</span>
              </div>
            </q-card-section>
          </q-card>

        </div>
      </div>

    </div>

    <!-- BOTTOM ROW -->
    <div class="row q-col-gutter-md">

      <!-- LEFT: Salary Breakdown -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="table-card">
          <q-card-section>

            <div class="row items-center justify-between q-mb-md">
              <div class="row items-center q-gutter-sm">
                <q-icon name="receipt_long" size="18px" color="grey-6" />
                <span class="section-title">Salary Breakdown (Average)</span>
              </div>
              <div class="row q-gutter-xs">
                <q-btn flat round dense icon="filter_list" size="sm" color="grey-6" />
                <q-btn flat round dense icon="more_vert" size="sm" color="grey-6" />
              </div>
            </div>

            <q-table flat :rows="salaryRows" :columns="salaryColumns" row-key="department" hide-bottom
              class="payroll-table">
              <template #body-cell-department="props">
                <q-td :props="props">
                  <div class="dept-name">{{ props.row.department }}</div>
                  <div class="dept-count">{{ props.row.headcount }} employees</div>
                </q-td>
              </template>

              <template #body-cell-baseSalary="props">
                <q-td :props="props">
                  <span class="salary-cell">{{ props.row.baseSalary }}</span>
                </q-td>
              </template>

              <template #body-cell-allowance="props">
                <q-td :props="props">
                  <span class="salary-cell">{{ props.row.allowance }}</span>
                </q-td>
              </template>

              <template #body-cell-deduction="props">
                <q-td :props="props">
                  <span class="deduction-cell">{{ props.row.deduction }}</span>
                </q-td>
              </template>

              <template #body-cell-netPay="props">
                <q-td :props="props">
                  <span class="net-cell">{{ props.row.netPay }}</span>
                </q-td>
              </template>

              <template #body-cell-status="props">
                <q-td :props="props">
                  <span :class="['pay-badge', `pay-badge--${props.row.statusKey}`]">
                    {{ props.row.status }}
                  </span>
                </q-td>
              </template>
            </q-table>

          </q-card-section>
        </q-card>
      </div>

      <!-- RIGHT: Payment History -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="table-card">
          <q-card-section>

            <div class="row items-center justify-between q-mb-md">
              <span class="section-title">Payment History</span>
              <span class="archive-link">Archive</span>
            </div>

            <div v-for="(h, i) in paymentHistory" :key="i" class="history-item">
              <div class="row items-center q-gutter-md">
                <div class="history-icon-wrap">
                  <q-icon name="calendar_month" size="18px" color="grey-6" />
                </div>
                <div class="col">
                  <div class="history-period">{{ h.period }}</div>
                  <div class="history-emp">{{ h.employees }} employees</div>
                </div>
                <div class="text-right">
                  <div class="history-amount">{{ h.amount }}</div>
                  <span :class="['pay-badge', `pay-badge--${h.statusKey}`]" style="font-size:10px">{{ h.status }}</span>
                </div>
              </div>
              <q-separator class="q-my-sm" v-if="i < paymentHistory.length - 1" />
            </div>

          </q-card-section>
        </q-card>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
const cycleSteps = [
  { label: 'Data Collection', date: 'Oct 20', state: 'done' },
  { label: 'Verification', date: 'Oct 22', state: 'done' },
  { label: 'Approval', date: 'Oct 24', state: 'active' },
  { label: 'Disbursement', date: 'Oct 28', state: 'pending' },
]

const salaryRows = [
  { department: 'Engineering', headcount: 320, baseSalary: '$6,800', allowance: '$1,200', deduction: '-$420', netPay: '$7,580', status: 'Processed', statusKey: 'processed' },
  { department: 'Human Resources', headcount: 85, baseSalary: '$5,200', allowance: '$800', deduction: '-$310', netPay: '$5,690', status: 'Processed', statusKey: 'processed' },
  { department: 'Finance', headcount: 120, baseSalary: '$7,100', allowance: '$1,500', deduction: '-$510', netPay: '$8,090', status: 'Processed', statusKey: 'processed' },
  { department: 'Operations', headcount: 410, baseSalary: '$4,800', allowance: '$600', deduction: '-$280', netPay: '$5,120', status: 'Pending', statusKey: 'pending' },
  { department: 'Marketing', headcount: 95, baseSalary: '$5,500', allowance: '$900', deduction: '-$350', netPay: '$6,050', status: 'Pending', statusKey: 'pending' },
]

const salaryColumns = [
  { name: 'department', label: 'DEPARTMENT', field: 'department', align: 'left' as const },
  { name: 'baseSalary', label: 'BASE SALARY', field: 'baseSalary', align: 'left' as const },
  { name: 'allowance', label: 'ALLOWANCE', field: 'allowance', align: 'left' as const },
  { name: 'deduction', label: 'DEDUCTION', field: 'deduction', align: 'left' as const },
  { name: 'netPay', label: 'NET PAY', field: 'netPay', align: 'left' as const },
  { name: 'status', label: 'STATUS', field: 'status', align: 'left' as const },
]

const paymentHistory = [
  { period: 'September 2023', employees: 1268, amount: '$398,200.00', status: 'Disbursed', statusKey: 'processed' },
  { period: 'August 2023', employees: 1255, amount: '$391,400.00', status: 'Disbursed', statusKey: 'processed' },
  { period: 'July 2023', employees: 1241, amount: '$385,700.00', status: 'Disbursed', statusKey: 'processed' },
  { period: 'June 2023', employees: 1230, amount: '$379,100.00', status: 'Disbursed', statusKey: 'processed' },
]
</script>

<style scoped>
.payroll-page {
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
  font-size: 11px;
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

/* CYCLE CARD */
.cycle-card {
  border-radius: 16px !important;
  background: #ffffff;
  border: 1px solid #eaecf0 !important;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f2044;
}

.approval-pending {
  font-size: 13px;
  font-weight: 600;
  color: #d97706;
}

/* STEPPER */
.stepper-wrap {
  position: relative;
  padding: 0 40px;
}

.stepper-line {
  position: absolute;
  top: 22px;
  left: 100px;
  right: 100px;
  height: 2px;
  background: #e5e7eb;
  z-index: 0;
}

.stepper-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.stepper-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stepper-node {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stepper-node--done {
  background: transparent;
}

.stepper-node--active {
  background: #0f2044;
}

.stepper-node--pending {
  background: #e5e7eb;
}

.stepper-num {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}

.stepper-node--pending .stepper-num {
  color: #9ca3af;
}

.stepper-label {
  font-size: 13px;
  font-weight: 600;
  color: #0f2044;
  text-align: center;
}

.stepper-date {
  font-size: 12px;
  color: #8a94a6;
}

/* DISBURSEMENT CARD */
.disburse-card {
  border-radius: 16px !important;
  background: #ffffff;
  border: 1px solid #eaecf0 !important;
}

.full-height {
  height: 100%;
}

.disburse-label {
  font-size: 11px;
  font-weight: 600;
  color: #8a94a6;
  letter-spacing: 0.5px;
}

.disburse-value {
  font-size: 36px;
  font-weight: 800;
  color: #0f2044;
  margin-top: 6px;
}

.trend-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.budget-label {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.budget-pct {
  font-size: 13px;
  font-weight: 700;
  color: #0f2044;
}

.last-month {
  font-size: 12px;
  color: #9ca3af;
}

.trend-pct {
  font-size: 13px;
  font-weight: 600;
  color: #059669;
}

/* MINI STAT CARDS */
.mini-stat-card {
  border-radius: 16px !important;
  background: #ffffff;
  border-left-width: 4px !important;
  border-style: solid !important;
}

.mini-stat-card--green {
  border-color: #10b981 !important;
}

.mini-stat-card--orange {
  border-color: #f59e0b !important;
}

.mini-stat-label {
  font-size: 11px;
  font-weight: 600;
  color: #8a94a6;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.mini-stat-value {
  font-size: 34px;
  font-weight: 800;
  color: #0f2044;
}

.complete-badge {
  font-size: 12px;
  font-weight: 600;
  color: #059669;
  background: #ecfdf5;
  padding: 3px 10px;
  border-radius: 20px;
  align-self: flex-end;
  margin-bottom: 6px;
}

.review-link {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  text-decoration: underline;
  align-self: flex-end;
  margin-bottom: 6px;
}

/* TABLE CARD */
.table-card {
  border-radius: 16px !important;
  background: #ffffff;
  border: 1px solid #eaecf0 !important;
}

.dept-name {
  font-size: 14px;
  font-weight: 600;
  color: #101828;
}

.dept-count {
  font-size: 12px;
  color: #667085;
  margin-top: 2px;
}

.salary-cell {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.deduction-cell {
  font-size: 13px;
  color: #dc2626;
  font-weight: 500;
}

.net-cell {
  font-size: 13px;
  font-weight: 700;
  color: #0f2044;
}

.pay-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  display: inline-block;
}

.pay-badge--processed {
  background: #ecfdf5;
  color: #027a48;
}

.pay-badge--pending {
  background: #fff7ed;
  color: #b45309;
}

/* TABLE OVERRIDES */
:deep(.payroll-table thead tr th) {
  font-size: 11px;
  font-weight: 600;
  color: #8a94a6;
  letter-spacing: 0.5px;
  background: #f9fafb;
  border-bottom: 1px solid #eaecf0;
}

:deep(.payroll-table tbody tr td) {
  border-bottom: 1px solid #f2f4f7;
  padding: 14px 16px;
}

:deep(.payroll-table tbody tr:last-child td) {
  border-bottom: none;
}

/* PAYMENT HISTORY */
.archive-link {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  text-decoration: underline;
}

.history-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.history-period {
  font-size: 14px;
  font-weight: 600;
  color: #101828;
}

.history-emp {
  font-size: 12px;
  color: #667085;
  margin-top: 2px;
}

.history-amount {
  font-size: 14px;
  font-weight: 700;
  color: #0f2044;
  margin-bottom: 4px;
}
</style>
