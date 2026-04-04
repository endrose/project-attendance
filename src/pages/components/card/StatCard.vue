<template>
  <q-card class="stat-card">

    <div class="row items-center justify-between">
      <div class="stat-label">{{ title }}</div>
      <q-icon :name="icon" size="18px" class="stat-icon" />
    </div>

    <div class="stat-value">{{ value }}</div>

    <div class="stat-sub">{{ sub }}</div>

  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string
  sub: string
  icon: string
}>()
</script>

<style scoped>
.stat-card {
  padding: 16px;
  border-radius: 14px;
  background: white;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
}

.stat-label {
  font-size: 10px;
  font-weight: 700;
  color: #8a94a6;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  margin-top: 6px;
}

.stat-sub {
  font-size: 12px;
  color: #8a94a6;
  margin-top: 4px;
}

.stat-icon {
  color: #c5cad4;
}
</style>
