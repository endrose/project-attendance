<template>
  <q-card class="payroll-wrapper">

    <!-- TOP BLUE -->
    <div class="payroll-top">

      <div class="row items-center justify-between">
        <div class="payroll-label">ESTIMATED PAYROLL</div>
        <q-icon name="calendar_month" size="18px" />
      </div>

      <div class="payroll-sub q-mt-xs">
        ESTIMATED TAKE-HOME PAY
      </div>

      <div class="payroll-amount">
        Rp 12,450,000
      </div>

      <div class="payroll-growth">
        <q-icon name="trending_up" size="14px" />
        +4.2% from last month
      </div>

    </div>

    <!-- DETAIL -->
    <div class="payroll-body">

      <div class="payroll-row">
        <span>Basic Salary</span>
        <span class="value">Rp 10,000,000</span>
      </div>

      <div class="payroll-row">
        <span>
          Overtime (OT)
          <q-badge class="badge">8.5h</q-badge>
        </span>
        <span class="value">Rp 2,850,000</span>
      </div>

      <div class="payroll-row">
        <span>
          Late Deductions
          <q-badge class="badge red">2x</q-badge>
        </span>
        <span class="value negative">- Rp 400,000</span>
      </div>

    </div>

  </q-card>
</template>

<style scoped>
.payroll-wrapper {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #eef0f4;
}

/* TOP */
.payroll-top {
  background: linear-gradient(120deg, #0f2a44, #1a73e8);
  padding: 18px;
  color: white;
}

.payroll-label {
  font-size: 10px;
  letter-spacing: 0.6px;
  opacity: 0.8;
}

.payroll-sub {
  font-size: 10px;
  opacity: 0.7;
}

.payroll-amount {
  font-size: 24px;
  font-weight: 800;
  margin-top: 6px;
}

.payroll-growth {
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* BODY */
.payroll-body {
  padding: 16px;
  background: white;
}

.payroll-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 13px;
  color: #374151;
}

.value {
  font-weight: 600;
}

.negative {
  color: #ef4444;
}

/* BADGE */
.badge {
  margin-left: 6px;
  font-size: 10px;
  background: #e0f2fe;
  color: #0284c7;
}

.badge.red {
  background: #fee2e2;
  color: #dc2626;
}
</style>
