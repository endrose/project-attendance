<template>
  <q-card class="attendance-card">

    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-md">
      <div class="section-title">Recent Attendance Log</div>

      <div class="view-history">
        View History
        <q-icon name="arrow_outward" size="14px" />
      </div>
    </div>

    <!-- TABLE -->
    <q-table :rows="rows" :columns="columns" row-key="date" flat hide-bottom class="attendance-table">

      <!-- STATUS -->
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge :class="[
            'status-badge',
            props.row.status === 'On Time' ? 'success' : 'late'
          ]">
            {{ props.row.status }}
            <span v-if="props.row.late" class="late-text">
              ({{ props.row.late }})
            </span>
          </q-badge>
        </q-td>
      </template>

      <!-- PHOTO -->
      <template #body-cell-photo="props">
        <q-td :props="props">
          <div class="avatar-stack">
            <q-avatar v-for="(p, i) in props.row.photos" :key="i" size="28px" class="avatar" :style="{
              marginLeft: Number(i) > 0 ? '-8px' : '0',
              zIndex: 10 - Number(i)
            }">
              <img :src="p" />
            </q-avatar>
          </div>
        </q-td>
      </template>

      <!-- LOCATION -->
      <template #body-cell-location="props">
        <q-td :props="props">
          <q-icon name="location_on" size="18px" class="location-icon" />
        </q-td>
      </template>

    </q-table>

  </q-card>
</template>

<script setup lang="ts">

import type { QTableColumn } from 'quasar'


type Row = {
  date: string
  clock: string
  location: string
  photos: string[]
  status: string
  late: string
}

const columns: QTableColumn<Row>[] = [
  {
    name: 'date',
    label: 'DATE',
    field: 'date',
    align: 'left'
  },
  {
    name: 'clock',
    label: 'CLOCK IN/OUT',
    field: 'clock',
    align: 'left'
  },
  {
    name: 'location',
    label: 'LOCATION',
    field: 'location',
    align: 'center'
  },
  {
    name: 'photo',
    label: 'PHOTO',
    field: 'photos',
    align: 'center'
  },
  {
    name: 'status',
    label: 'STATUS',
    field: 'status',
    align: 'left'
  }
]

const rows = [
  {
    date: 'Oct 13, 2023',
    clock: '08:02 — 17:15',
    location: '',
    photos: [
      'https://cdn.quasar.dev/img/avatar.png',
      'https://cdn.quasar.dev/img/avatar2.jpg'
    ],
    status: 'On Time',
    late: ''
  },
  {
    date: 'Oct 12, 2023',
    clock: '08:15 — 17:05',
    location: '',
    photos: ['https://cdn.quasar.dev/img/avatar2.jpg'],
    status: 'Late',
    late: '15m'
  },
  {
    date: 'Oct 11, 2023',
    clock: '07:55 — 18:30',
    location: '',
    photos: ['https://cdn.quasar.dev/img/avatar3.jpg'],
    status: 'On Time',
    late: ''
  }
]
</script>
