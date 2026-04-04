<template>
  <div class="welcome-banner">

    <div class="row items-center">
      <q-avatar size="90px" class="avatar-border q-mr-md">
        <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
      </q-avatar>

      <div>
        <div class="welcome-title">
          Welcome back, <span class="bold">Adrian Smith</span>
        </div>

        <div class="welcome-sub q-mt-xs">
          It's a great day to achieve milestones. Your attendance streak is
          looking strong this month. Keep up the excellent work!
        </div>

        <div class="welcome-date q-mt-sm">
          <q-icon name="event" size="16px" class="q-mr-xs" />
          Today: 14 Oct 2023
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.welcome-banner {
  background: linear-gradient(120deg, #1a73e8 0%, #0052cc 60%, #003a9b 100%);
  padding: 28px;
  border-radius: 18px;
  color: white;
  box-shadow: 0 8px 24px rgba(0, 82, 204, 0.2);
}

.avatar-border {
  border: 3px solid rgba(255, 255, 255, 0.4);
}

.welcome-title {
  font-size: 20px;
  font-weight: 400;
}

.bold {
  font-weight: 700;
}

.welcome-sub {
  font-size: 13px;
  opacity: 0.85;
}

.welcome-date {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
}
</style>
