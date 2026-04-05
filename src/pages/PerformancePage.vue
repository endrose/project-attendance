<template>
  <div class="performance-page q-pa-lg">

    <!-- PAGE HEADER -->
    <div class="row items-start justify-between q-mb-lg">
      <div>
        <div class="page-title">Performance Metrics</div>
        <div class="page-sub">REVIEW PERIOD: Q3 2023 • ANNUAL CYCLE</div>
      </div>
      <div class="row q-gutter-sm items-center">
        <q-btn outline color="grey-7" icon="download" label="Export Analytics" size="sm" class="header-btn" />
        <q-btn unelevated color="dark" icon="bolt" label="Start Review Cycle" size="sm" class="header-btn-dark" />
      </div>
    </div>

    <!-- STAT CARDS -->
    <div class="row q-col-gutter-md q-mb-lg">

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-start justify-between">
              <div class="stat-icon-wrap stat-icon--yellow">
                <q-icon name="star_outline" size="22px" color="amber-6" />
              </div>
              <q-icon name="trending_up" size="18px" color="grey-4" />
            </div>
            <div class="stat-value q-mt-lg">4.2</div>
            <div class="stat-label">AVG. PERFORMANCE RATING</div>
            <div class="stat-sub stat-sub--green">+0.3 from Q2</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-start justify-between">
              <div class="stat-icon-wrap stat-icon--blue">
                <q-icon name="my_location" size="22px" color="teal-5" />
              </div>
              <q-icon name="trending_up" size="18px" color="grey-4" />
            </div>
            <div class="stat-value q-mt-lg">88%</div>
            <div class="stat-label">GOALS COMPLETION RATE</div>
            <div class="stat-sub">Target: 90%</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-start justify-between">
              <div class="stat-icon-wrap stat-icon--green">
                <q-icon name="chat_bubble_outline" size="22px" color="teal-5" />
              </div>
              <q-icon name="trending_up" size="18px" color="grey-4" />
            </div>
            <div class="stat-value q-mt-lg">94%</div>
            <div class="stat-label">FEEDBACK RESPONSE</div>
            <div class="stat-sub">High Engagement</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-start justify-between">
              <div class="stat-icon-wrap stat-icon--purple">
                <q-icon name="workspace_premium" size="22px" color="purple-5" />
              </div>
              <q-icon name="trending_up" size="18px" color="grey-4" />
            </div>
            <div class="stat-value q-mt-lg">15%</div>
            <div class="stat-label">PROMOTABLE TALENT</div>
            <div class="stat-sub">24 Employees</div>
          </q-card-section>
        </q-card>
      </div>

    </div>

    <!-- MAIN ROW -->
    <div class="row q-col-gutter-md">

      <!-- LEFT: Rating Distribution Chart -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="chart-card">
          <q-card-section>

            <div class="row items-center justify-between q-mb-lg">
              <div class="row items-center q-gutter-sm">
                <q-icon name="bar_chart" size="18px" color="grey-6" />
                <span class="section-title">Rating Distribution</span>
              </div>
              <q-btn outline color="grey-6" size="sm" class="dept-btn">
                All Departments
                <q-icon name="expand_more" size="16px" class="q-ml-xs" />
              </q-btn>
            </div>

            <!-- Bar Chart -->
            <div class="bar-chart">
              <div class="bars-area">
                <div v-for="bar in ratingBars" :key="bar.label" class="bar-col">
                  <div class="bar-value-label">{{ bar.value }}</div>
                  <div class="bar-track">
                    <div class="bar-fill"
                      :style="{ height: (bar.value / maxBarValue * 100) + '%', background: bar.color }"></div>
                  </div>
                </div>
              </div>
              <div class="bar-x-labels">
                <span v-for="bar in ratingBars" :key="bar.label" class="bar-x-label">{{ bar.label }}</span>
              </div>
            </div>

          </q-card-section>
        </q-card>
      </div>

      <!-- RIGHT: OKR Progress -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="chart-card">
          <q-card-section class="column full-height">

            <div class="row items-center q-gutter-sm q-mb-lg">
              <q-icon name="timelapse" size="18px" color="grey-6" />
              <span class="section-title">OKR Progress</span>
            </div>

            <div class="col">
              <div v-for="okr in okrItems" :key="okr.label" class="q-mb-lg">
                <div class="row items-center justify-between q-mb-xs">
                  <span class="okr-label">{{ okr.label }}</span>
                  <span class="okr-pct">{{ okr.pct }}%</span>
                </div>
                <q-linear-progress :value="okr.pct / 100" :color="okr.color" track-color="grey-3" size="8px" rounded />
              </div>
            </div>

            <q-btn unelevated label="View All Company Goals" class="goals-btn q-mt-md" color="grey-2"
              text-color="dark" />

          </q-card-section>
        </q-card>
      </div>

    </div>

    <!-- BOTTOM ROW -->
    <div class="row q-col-gutter-md q-mt-md">

      <!-- Top Performers -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="chart-card">
          <q-card-section>

            <div class="row items-center justify-between q-mb-md">
              <div class="row items-center q-gutter-sm">
                <q-icon name="emoji_events" size="18px" color="amber-6" />
                <span class="section-title">Top Performers</span>
              </div>
              <q-btn flat dense size="sm" color="grey-6" label="View All" />
            </div>

            <q-table flat :rows="performers" :columns="perfColumns" row-key="id" hide-bottom class="perf-table">
              <template #body-cell-employee="props">
                <q-td :props="props">
                  <div class="row items-center q-gutter-sm">
                    <q-avatar size="34px"
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

              <template #body-cell-score="props">
                <q-td :props="props">
                  <div class="row items-center q-gutter-xs">
                    <q-icon name="star" size="14px" color="amber-5" />
                    <span class="score-val">{{ props.row.score }}</span>
                  </div>
                </q-td>
              </template>

              <template #body-cell-completion="props">
                <q-td :props="props">
                  <div class="row items-center q-gutter-sm">
                    <q-linear-progress :value="props.row.completion / 100" color="teal-5" track-color="grey-3"
                      size="6px" rounded style="width: 80px" />
                    <span class="comp-val">{{ props.row.completion }}%</span>
                  </div>
                </q-td>
              </template>

              <template #body-cell-badge="props">
                <q-td :props="props">
                  <span :class="['perf-badge', `perf-badge--${props.row.badgeKey}`]">{{ props.row.badge }}</span>
                </q-td>
              </template>
            </q-table>

          </q-card-section>
        </q-card>
      </div>

      <!-- Review Status -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="chart-card">
          <q-card-section>

            <div class="row items-center q-gutter-sm q-mb-lg">
              <q-icon name="assignment_turned_in" size="18px" color="grey-6" />
              <span class="section-title">Review Status</span>
            </div>

            <div v-for="rs in reviewStatus" :key="rs.label" class="review-row q-mb-md">
              <div class="row items-center justify-between q-mb-xs">
                <div class="row items-center q-gutter-xs">
                  <div class="review-dot" :style="{ background: rs.dotColor }"></div>
                  <span class="review-label">{{ rs.label }}</span>
                </div>
                <span class="review-count">{{ rs.count }}</span>
              </div>
              <q-linear-progress :value="rs.count / 1284" :color="rs.color" track-color="grey-2" size="6px" rounded />
            </div>

          </q-card-section>
        </q-card>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const ratingBars = [
  { label: 'Needs Imp.', value: 42, color: '#f87171' },
  { label: 'Developing', value: 118, color: '#fb923c' },
  { label: 'Meets Exp.', value: 487, color: '#60a5fa' },
  { label: 'Exceeds Exp.', value: 512, color: '#34d399' },
  { label: 'Outstanding', value: 125, color: '#a78bfa' },
]

const maxBarValue = computed(() => Math.max(...ratingBars.map(b => b.value)))

const okrItems = [
  { label: 'Product Launch', pct: 85, color: 'blue-5' },
  { label: 'Customer Retention', pct: 62, color: 'purple-5' },
  { label: 'Revenue Growth', pct: 94, color: 'green-5' },
  { label: 'Team Expansion', pct: 40, color: 'amber-5' },
]

const performers = [
  { id: 1, name: 'Johnathan Doe', role: 'Cloud Architect', initials: 'JD', avatarBg: '#1a73e8', score: 4.9, completion: 98, badge: 'Outstanding', badgeKey: 'outstanding' },
  { id: 2, name: 'Sarah Miller', role: 'HR Specialist', initials: 'SM', avatarBg: '#7c3aed', score: 4.7, completion: 94, badge: 'Exceeds Exp.', badgeKey: 'exceeds' },
  { id: 3, name: 'Emily Chen', role: 'UI Designer', initials: 'EC', avatarBg: '#0891b2', score: 4.6, completion: 91, badge: 'Exceeds Exp.', badgeKey: 'exceeds' },
  { id: 4, name: 'Marcus Lee', role: 'DevOps Engineer', initials: 'ML', avatarBg: '#059669', score: 4.5, completion: 89, badge: 'Meets Exp.', badgeKey: 'meets' },
]

const perfColumns = [
  { name: 'employee', label: 'EMPLOYEE', field: 'name', align: 'left' as const },
  { name: 'score', label: 'SCORE', field: 'score', align: 'left' as const },
  { name: 'completion', label: 'GOAL COMPLETION', field: 'completion', align: 'left' as const },
  { name: 'badge', label: 'RATING', field: 'badge', align: 'left' as const },
]

const reviewStatus = [
  { label: 'Completed', count: 842, color: 'teal-5', dotColor: '#14b8a6' },
  { label: 'In Progress', count: 312, color: 'blue-5', dotColor: '#3b82f6' },
  { label: 'Not Started', count: 98, color: 'orange-4', dotColor: '#fb923c' },
  { label: 'Overdue', count: 32, color: 'red-4', dotColor: '#f87171' },
]
</script>

<style scoped>
.performance-page {
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

.stat-icon--yellow {
  background: #fffbeb;
}

.stat-icon--blue {
  background: #ecfdf5;
}

.stat-icon--green {
  background: #ecfdf5;
}

.stat-icon--purple {
  background: #f5f3ff;
}

.stat-value {
  font-size: 34px;
  font-weight: 800;
  color: #0f2044;
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  color: #8a94a6;
  letter-spacing: 0.4px;
  margin-top: 2px;
}

.stat-sub {
  font-size: 12px;
  color: #667085;
  margin-top: 4px;
}

.stat-sub--green {
  color: #059669;
  font-weight: 600;
}

/* CHART CARDS */
.chart-card {
  border-radius: 16px !important;
  background: #ffffff;
  border: 1px solid #eaecf0 !important;
  height: 100%;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f2044;
}

.dept-btn {
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 14px;
}

/* BAR CHART */
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bars-area {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  height: 200px;
  padding: 0 8px;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 6px;
}

.bar-value-label {
  font-size: 11px;
  font-weight: 600;
  color: #667085;
}

.bar-track {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  background: #f3f4f6;
  border-radius: 6px 6px 0 0;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  border-radius: 6px 6px 0 0;
  transition: height 0.6s ease;
}

.bar-x-labels {
  display: flex;
  gap: 16px;
  padding: 0 8px;
}

.bar-x-label {
  flex: 1;
  text-align: center;
  font-size: 11px;
  color: #8a94a6;
  font-weight: 500;
}

/* OKR */
.okr-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.okr-pct {
  font-size: 13px;
  font-weight: 700;
  color: #0f2044;
}

.goals-btn {
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  width: 100%;
}

/* PERFORMERS TABLE */
.emp-name {
  font-size: 13px;
  font-weight: 600;
  color: #101828;
}

.emp-role {
  font-size: 11px;
  color: #667085;
}

.score-val {
  font-size: 13px;
  font-weight: 700;
  color: #0f2044;
}

.comp-val {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.perf-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}

.perf-badge--outstanding {
  background: #f5f3ff;
  color: #6d28d9;
}

.perf-badge--exceeds {
  background: #ecfdf5;
  color: #027a48;
}

.perf-badge--meets {
  background: #eff6ff;
  color: #1d4ed8;
}

:deep(.perf-table thead tr th) {
  font-size: 11px;
  font-weight: 600;
  color: #8a94a6;
  letter-spacing: 0.5px;
  background: #f9fafb;
  border-bottom: 1px solid #eaecf0;
}

:deep(.perf-table tbody tr td) {
  border-bottom: 1px solid #f2f4f7;
  padding: 12px 16px;
}

:deep(.perf-table tbody tr:last-child td) {
  border-bottom: none;
}

/* REVIEW STATUS */
.review-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.review-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.review-count {
  font-size: 13px;
  font-weight: 700;
  color: #0f2044;
}
</style>
