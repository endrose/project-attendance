<template>
  <q-page class="dashboard-page">

    <div class="row q-col-gutter-lg">

      <!-- LEFT -->
      <div class="col-12 col-lg-8">

        <!-- Welcome -->
        <WelcomeCard class="q-mb-lg" />

        <!-- Stats -->
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-6 col-md-3">
            <StatCard title="TOTAL WORKING DAYS" value="18 / 22" sub="Progress to Cut-off" icon="work_outline" />
          </div>

          <div class="col-6 col-md-3">
            <StatCard title="TOTAL LATE" value="45 min" sub="Across 2 instances" icon="schedule" />
          </div>

          <div class="col-6 col-md-3">
            <StatCard title="TOTAL LEAVE/SICK" value="0 days" sub="Healthy Streak!" icon="favorite_border" />
          </div>

          <div class="col-6 col-md-3">
            <StatCard title="TOTAL OVERTIME" value="8.5 hr" sub="6.0 Wkdy | 2.5 Wkend" icon="timer" />
          </div>
        </div>

        <!-- Table -->
        <AttendanceTable />

      </div>

      <!-- RIGHT -->
      <div class="col-12 col-lg-4">

        <LeaveCard class="q-mb-lg" />
        <PayrollCard />

      </div>

    </div>

  </q-page>
</template>

<script setup lang="ts">
import WelcomeCard from 'src/pages/components/card/WelcomeCard.vue'
import StatCard from 'src/pages/components/card/StatCard.vue'
import AttendanceTable from 'src/pages/components/table/AttendanceTable.vue'
import PayrollCard from 'src/pages/components/card/PayrollCard.vue'
import LeaveCard from 'src/pages/components/card/LeaveCard.vue'
</script>
