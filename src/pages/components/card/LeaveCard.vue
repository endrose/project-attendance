<template>
  <q-card class="leave-card">

    <!-- HEADER -->
    <div class="row items-center justify-between">
      <div class="leave-label">SISA SALDO CUTI</div>
      <div class="leave-icon">
        <q-icon name="flight_takeoff" size="18px" />
      </div>
    </div>

    <!-- VALUE -->
    <div class="leave-main q-mt-sm">
      <span class="leave-number">12</span>
      <span class="leave-text">Days remaining</span>
    </div>

    <!-- PROGRESS -->
    <q-linear-progress :value="0.4" color="primary" track-color="grey-3" rounded size="8px" class="q-mt-md" />

    <!-- META -->
    <div class="row justify-between leave-meta">
      <span>Used: 8 Days</span>
      <span>Total: 20 Days</span>
    </div>

  </q-card>
</template>

<style scoped>
.leave-card {
  padding: 18px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #eef0f4;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

/* header */
.leave-label {
  font-size: 10px;
  font-weight: 700;
  color: #8a94a6;
  letter-spacing: 0.8px;
}

.leave-icon {
  background: #f1f3f6;
  border-radius: 10px;
  padding: 6px;
}

/* value */
.leave-main {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.leave-number {
  font-size: 28px;
  font-weight: 800;
  color: #1a1a2e;
}

.leave-text {
  font-size: 14px;
  color: #6b7280;
}

/* meta */
.leave-meta {
  font-size: 11px;
  color: #8a94a6;
  margin-top: 6px;
}
</style>
