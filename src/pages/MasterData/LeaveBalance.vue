<template>
  <div class="leave-approval-page q-pa-lg">
    <!-- Page Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="page-title">Leave Approval</div>
        <div
          class="page-sub text-uppercase text-grey-6 text-caption text-weight-bold q-mt-xs"
          style="letter-spacing: 1px"
        >
          REVIEW & APPROVE STAFF LEAVE REQUESTS
        </div>
      </div>
      <div class="row q-gutter-md">
        <q-btn
          outline
          color="dark"
          label="Tolak Terpilih"
          class="btn-outline-regular"
          :disable="selected.length === 0"
        />
        <q-btn
          unelevated
          color="dark"
          label="Setujui Terpilih"
          class="action-btn-dark"
          :disable="selected.length === 0"
          @click="approveSelectedDialog = true"
        />
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card flat bordered class="summary-card">
          <q-card-section>
            <div class="row justify-between items-center q-mb-sm">
              <div class="icon-circle bg-yellow-1">
                <q-icon name="circle" color="warning" size="12px" />
              </div>
              <div class="text-caption text-weight-bold text-grey-8">Pending</div>
            </div>
            <div class="text-h4 text-weight-bold text-dark q-mb-xs">{{ pendingCount }}</div>
            <div class="text-caption text-grey-7 text-weight-medium">Menunggu Approval</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card flat bordered class="summary-card">
          <q-card-section>
            <div class="row justify-between items-center q-mb-sm">
              <div class="icon-circle bg-green-1">
                <q-icon name="circle" color="positive" size="12px" />
              </div>
              <div class="text-caption text-weight-bold text-grey-8">Bulan Ini</div>
            </div>
            <div class="text-h4 text-weight-bold text-dark q-mb-xs">{{ approvedCount }}</div>
            <div class="text-caption text-grey-7 text-weight-medium">Disetujui</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card flat bordered class="summary-card">
          <q-card-section>
            <div class="row justify-between items-center q-mb-sm">
              <div class="icon-circle bg-red-1">
                <q-icon name="circle" color="negative" size="12px" />
              </div>
              <div class="text-caption text-weight-bold text-grey-8">Bulan Ini</div>
            </div>
            <div class="text-h4 text-weight-bold text-dark q-mb-xs">{{ rejectedCount }}</div>
            <div class="text-caption text-grey-7 text-weight-medium">Ditolak</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card flat bordered class="summary-card">
          <q-card-section>
            <div class="row justify-between items-center q-mb-sm">
              <div class="icon-circle bg-blue-1">
                <q-icon name="circle" color="primary" size="12px" />
              </div>
              <div class="text-caption text-weight-bold text-grey-8">Hari Ini</div>
            </div>
            <div class="text-h4 text-weight-bold text-dark q-mb-xs">0</div>
            <div class="text-caption text-grey-7 text-weight-medium">Staff On Leave</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="row q-gutter-md q-mb-md">
      <q-input
        v-model="searchQuery"
        outlined
        dense
        placeholder="Cari nama karyawan..."
        class="bg-white"
        style="width: 280px; border-radius: 8px"
      >
        <template v-slot:prepend><q-icon name="search" size="18px" /></template>
      </q-input>
      <q-select
        outlined
        dense
        :options="['Semua Jenis Cuti', 'Cuti Tahunan', 'Cuti Sakit', 'Cuti Darurat']"
        v-model="filterJenis"
        class="bg-white"
        style="min-width: 180px"
      />
      <q-select
        outlined
        dense
        :options="['Semua Status', 'Pending', 'Disetujui', 'Ditolak']"
        v-model="filterStatus"
        class="bg-white"
        style="min-width: 160px"
      />
      <q-space />
      <q-btn
        unelevated
        color="white"
        text-color="dark"
        icon="refresh"
        class="action-btn-outline q-px-sm"
        @click="fetchLeaveRequests"
      />
    </div>

    <!-- Table -->
    <q-card flat bordered class="table-card q-mb-xl relative-position">
      <q-table
        flat
        :rows="filteredRequests"
        :columns="columns"
        row-key="id"
        hide-bottom
        class="directory-table"
        selection="multiple"
        v-model:selected="selected"
        :pagination="{ rowsPerPage: 0 }"
      >
        <!-- Karyawan -->
        <template #body-cell-karyawan="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-sm">
              <q-avatar
                size="34px"
                :style="{
                  background: props.row.bg,
                  color: getTextColor(props.row.bg),
                  fontWeight: 600,
                  fontSize: '13px',
                }"
              >
                {{ props.row.initials }}
              </q-avatar>
              <div>
                <div class="emp-name">{{ props.row.name }}</div>
                <div class="emp-dept">{{ props.row.role }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Jenis Cuti -->
        <template #body-cell-jenis="props">
          <q-td :props="props">
            <q-badge
              :class="getJenisClass(props.row.type)"
              class="q-px-sm q-py-xs text-weight-bold"
              style="border-radius: 6px"
              >{{ props.row.type }}</q-badge
            >
          </q-td>
        </template>

        <!-- Date Formats -->
        <template #body-cell-start="props">
          <q-td :props="props" class="date-text">{{ formatShortDate(props.row.start) }}</q-td>
        </template>
        <template #body-cell-end="props">
          <q-td :props="props" class="date-text">{{ formatShortDate(props.row.end) }}</q-td>
        </template>

        <template #body-cell-durasi="props">
          <q-td :props="props" class="duration-text"
            ><span class="text-weight-bold text-dark">{{ props.row.duration }}</span> hari</q-td
          >
        </template>

        <template #body-cell-alasan="props">
          <q-td :props="props" class="reason-text text-grey-8">{{ props.row.reason }}</q-td>
        </template>

        <template #body-cell-saldo="props">
          <q-td :props="props" class="duration-text">
            <span v-if="props.row.balance >= 0" class="text-weight-bold text-dark">{{
              props.row.balance
            }}</span>
            <span v-else class="text-grey-6">-</span>
            <span v-if="props.row.balance >= 0"> hari</span>
          </q-td>
        </template>

        <!-- Status -->
        <template #body-cell-status="props">
          <q-td :props="props">
            <span :class="['status-badge', getStatusClass(props.row.status)]">
              <span class="status-dot" :class="getStatusDot(props.row.status)"></span>
              {{ props.row.status }}
            </span>
          </q-td>
        </template>

        <!-- Aksi -->
        <template #body-cell-aksi="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-xs justify-end">
              <q-btn
                outline
                round
                dense
                icon="visibility"
                size="sm"
                color="grey-5"
                text-color="grey-7"
                @click="viewDetails(props.row)"
              >
                <q-tooltip>View Detail</q-tooltip>
              </q-btn>

              <template v-if="props.row.status === 'Pending'">
                <q-btn
                  outline
                  round
                  dense
                  icon="check"
                  size="sm"
                  color="positive"
                  :loading="isRowApproving(props.row.id)"
                  @click="approveRequest(props.row)"
                >
                  <q-tooltip>Approve</q-tooltip>
                </q-btn>
                <q-btn
                  outline
                  round
                  dense
                  icon="close"
                  size="sm"
                  color="negative"
                  @click="openReject(props.row)"
                >
                  <q-tooltip>Reject</q-tooltip>
                </q-btn>
              </template>
            </div>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-lg text-grey-7">
            No leave requests found for the selected criteria.
          </div>
        </template>
      </q-table>

      <!-- DATA LOADING OVERLAY -->
      <q-inner-loading
        :showing="loading"
        label="Fetching data..."
        label-class="text-dark"
        label-style="font-size: 1.1em"
      />
    </q-card>

    <!-- ==== DIALOGS ==== -->

    <!-- REJECT REQUEST MODAL -->
    <q-dialog v-model="rejectDialog" persistent>
      <q-card style="width: 450px; border-radius: 12px">
        <q-card-section class="row items-center q-pb-sm">
          <div class="text-h6 text-weight-bold">Provide Reason for Rejection</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-caption text-grey-7 q-mb-md">
            Please elaborate on why taking this leave is not possible at this time. The employee
            will receive this reasoning.
          </div>
          <q-input
            v-model="rejectReason"
            type="textarea"
            outlined
            autogrow
            placeholder="State your reason here..."
            autofocus
          />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey-8" v-close-popup />
          <q-btn
            unelevated
            label="Confirm Reject"
            color="negative"
            @click="confirmReject"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- APPROVE SELECTED MODAL -->
    <q-dialog v-model="approveSelectedDialog" persistent>
      <q-card style="width: 400px; border-radius: 12px">
        <q-card-section class="row items-center q-pb-sm">
          <div class="text-h6 text-weight-bold">Batch Approval</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p class="text-body2 text-grey-8">
            You are about to approve <strong>{{ selected.length }}</strong> leave requests. Proceed?
          </p>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey-8" v-close-popup />
          <q-btn
            unelevated
            label="Approve Selected"
            color="positive"
            @click="confirmApproveSelected"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- LEAVE REQUEST DETAIL MODAL -->
    <q-dialog v-model="detailDialog">
      <q-card style="width: 500px; border-radius: 12px">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6 text-weight-bold">Leave Request Detail</div>
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>

        <q-separator class="q-mt-md" />

        <q-card-section v-if="selectedDetail" class="q-pa-lg">
          <!-- Status Ribbon -->
          <div class="row justify-end q-mb-sm">
            <span
              :class="['status-badge', getStatusClass(selectedDetail.status)]"
              style="font-size: 13px"
            >
              <span class="status-dot" :class="getStatusDot(selectedDetail.status)"></span>
              {{ selectedDetail.status }}
            </span>
          </div>

          <!-- Employee Header -->
          <div class="row items-center q-gutter-md q-mb-lg">
            <q-avatar
              size="60px"
              :style="{
                background: selectedDetail.bg,
                color: getTextColor(selectedDetail.bg),
                fontSize: '20px',
                fontWeight: 600,
              }"
            >
              {{ selectedDetail.initials }}
            </q-avatar>
            <div>
              <div class="text-h6 text-weight-bold">{{ selectedDetail.name }}</div>
              <div class="text-caption text-grey-7">{{ selectedDetail.role }}</div>
            </div>
          </div>

          <!-- Details Grid -->
          <div class="row q-col-gutter-y-md">
            <div class="col-12">
              <div class="text-caption text-grey-6 text-weight-bold text-uppercase">Leave Type</div>
              <div class="text-body1 text-weight-medium">{{ selectedDetail.type }}</div>
            </div>
            <div class="col-6">
              <div class="text-caption text-grey-6 text-weight-bold text-uppercase">Duration</div>
              <div class="text-body1 text-weight-medium">
                {{ selectedDetail.duration }} Hari ({{ formatShortDate(selectedDetail.start) }} -
                {{ formatShortDate(selectedDetail.end) }})
              </div>
            </div>
            <div class="col-6">
              <div class="text-caption text-grey-6 text-weight-bold text-uppercase">
                Current Balance
              </div>
              <div class="text-body1 text-weight-medium">
                {{ selectedDetail.balance >= 0 ? selectedDetail.balance + ' Hari' : 'N/A' }}
              </div>
            </div>
            <div class="col-12">
              <div class="text-caption text-grey-6 text-weight-bold text-uppercase">
                Reason for Leave
              </div>
              <div
                class="text-body1"
                style="
                  background: #f9fafb;
                  padding: 12px;
                  border-radius: 8px;
                  border: 1px solid #eaecf0;
                  margin-top: 4px;
                "
              >
                {{ selectedDetail.reason || 'No reason provided' }}
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn unelevated label="Close Window" color="dark" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar, date } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import {
  getLeaveRequestsByTenant,
  approveLeaveRequest,
  rejectLeaveRequest,
} from 'src/shared/services/backendApiContract';

interface UILeaveRequest {
  id: string;
  name: string;
  initials: string;
  bg: string;
  role: string;
  type: string;
  start: string;
  end: string;
  duration: number;
  reason: string;
  balance: number;
  status: string;
}

const $q = useQuasar();

// State
const loading = ref(false);
const saving = ref(false);
const loadingRowIds = ref<string[]>([]);

// Auth / Context
const authStore = useAuthStore();
const currentAdminUserId = computed(
  () => authStore.user?.id || '00000000-0000-0000-0000-000000000000',
);
const selectedTenantId = computed(
  () => authStore.user?.tenantId || '1a780d07-dd9b-4b2f-83c5-1c0b0a5c676d',
);

// Filters
const searchQuery = ref('');
const filterJenis = ref('Semua Jenis Cuti');
const filterStatus = ref('Semua Status');

// Selections
const selected = ref<UILeaveRequest[]>([]);

// Modals State
const rejectDialog = ref(false);
const rejectReason = ref('');
const rowToReject = ref<UILeaveRequest | null>(null);

const approveSelectedDialog = ref(false);

const detailDialog = ref(false);
const selectedDetail = ref<UILeaveRequest | null>(null);

// Data
const requests = ref<UILeaveRequest[]>([]);

const pendingCount = computed(() => requests.value.filter((r) => r.status === 'Pending').length);
const approvedCount = computed(() => requests.value.filter((r) => r.status === 'Disetujui').length);
const rejectedCount = computed(() => requests.value.filter((r) => r.status === 'Ditolak').length);

const fetchLeaveRequests = async () => {
  loading.value = true;
  try {
    const data = await getLeaveRequestsByTenant(selectedTenantId.value);

    const palette = ['#e0e7ff', '#dcfce7', '#fef3c7', '#ffe4e6', '#f3e8ff'];

    requests.value = (data || []).map((r, index) => {
      const empName = r.employee?.fullName || r.employeeName || 'Unknown Employee';
      const init = empName.substring(0, 2).toUpperCase();
      const dept = r.employee?.division?.name || r.employee?.position || 'Staff';

      return {
        id: r.id,
        name: empName,
        initials: init,
        bg: palette[index % palette.length] || '#e0e7ff',
        role: dept,
        type: r.leaveType || 'Cuti Tahunan',
        start: r.startDate,
        end: r.endDate,
        duration: r.durationInDays || r.duration || 1,
        reason: r.reason || '',
        balance: r.balance !== undefined ? r.balance : -1,
        status:
          r.status === 'Approved' ? 'Disetujui' : r.status === 'Rejected' ? 'Ditolak' : 'Pending',
      };
    });
  } catch {
    if (requests.value.length === 0) {
      // Fallback dummy to test layout if API is totally dead
      console.warn('Using fallback data due to fetch error:');
    } else {
      $q.notify({ message: 'Failed to fetch leave requests.', color: 'negative' });
    }
  } finally {
    loading.value = false;
  }
};

const columns = [
  { name: 'karyawan', label: 'KARYAWAN', field: 'name', align: 'left' as const },
  { name: 'jenis', label: 'JENIS CUTI', field: 'type', align: 'left' as const },
  { name: 'start', label: 'TANGGAL MULAI', field: 'start', align: 'left' as const },
  { name: 'end', label: 'TANGGAL SELESAI', field: 'end', align: 'left' as const },
  { name: 'durasi', label: 'DURASI', field: 'duration', align: 'left' as const },
  {
    name: 'alasan',
    label: 'ALASAN',
    field: 'reason',
    align: 'left' as const,
    style: 'max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
  },
  { name: 'saldo', label: 'SALDO CUTI', field: 'balance', align: 'left' as const },
  { name: 'status', label: 'STATUS', field: 'status', align: 'left' as const },
  { name: 'aksi', label: 'AKSI', field: 'actions', align: 'right' as const },
];

const filteredRequests = computed(() => {
  return requests.value.filter((r: UILeaveRequest) => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchJenis = filterJenis.value === 'Semua Jenis Cuti' || r.type === filterJenis.value;
    const matchStatus = filterStatus.value === 'Semua Status' || r.status === filterStatus.value;
    return matchSearch && matchJenis && matchStatus;
  });
});

const isRowApproving = (id: string) => loadingRowIds.value.includes(id);

// Actions
const viewDetails = (row: UILeaveRequest) => {
  selectedDetail.value = row;
  detailDialog.value = true;
};

const approveRequest = async (row: UILeaveRequest) => {
  loadingRowIds.value.push(row.id);
  try {
    await approveLeaveRequest({
      leaveRequestId: row.id,
      adminUserId: currentAdminUserId.value,
    });
    $q.notify({
      message: 'Request Approved',
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
    });
    await fetchLeaveRequests();
  } catch {
    $q.notify({ message: 'Failed to approve request', color: 'negative', position: 'top' });
  } finally {
    loadingRowIds.value = loadingRowIds.value.filter((id) => id !== row.id);
  }
};

const openReject = (row: UILeaveRequest) => {
  rowToReject.value = row;
  rejectReason.value = '';
  rejectDialog.value = true;
};

const confirmReject = async () => {
  const targetRow = rowToReject.value;
  if (!targetRow || !rejectReason.value) {
    $q.notify({ message: 'Please provide a valid reason', color: 'warning', position: 'top' });
    return;
  }

  saving.value = true;
  try {
    await rejectLeaveRequest({
      leaveRequestId: targetRow.id,
      reason: rejectReason.value,
      adminUserId: currentAdminUserId.value,
    });
    $q.notify({ message: 'Request Rejected', color: 'negative', icon: 'cancel', position: 'top' });
    rejectDialog.value = false;
    await fetchLeaveRequests();
  } catch {
    $q.notify({ message: 'Failed to reject request', color: 'negative', position: 'top' });
  } finally {
    saving.value = false;
  }
};

// Batch Actions
const confirmApproveSelected = async () => {
  if (selected.value.length === 0) return;
  saving.value = true;

  let approvedCount = 0;

  // Ideally this would be a single batch endpoint, but we loop for now
  for (const sel of selected.value) {
    try {
      await approveLeaveRequest({
        leaveRequestId: sel.id,
        adminUserId: currentAdminUserId.value,
      });
      approvedCount++;
    } catch {
      console.warn(`Failed to approve ${sel.id}`);
    }
  }

  if (approvedCount > 0) {
    $q.notify({
      message: `Successfully approved ${approvedCount} requests.`,
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
    });
    await fetchLeaveRequests();
  }

  selected.value = [];
  approveSelectedDialog.value = false;
  saving.value = false;
};

// Helpers
const getTextColor = (bg: string) => {
  if (bg === '#e0e7ff') return '#3730a3'; // Indigo
  if (bg === '#dcfce7') return '#166534'; // Green
  if (bg === '#fef3c7') return '#92400e'; // Amber
  if (bg === '#ffe4e6') return '#9f1239'; // Rose
  if (bg === '#f3e8ff') return '#6b21a8'; // Purple
  return '#333';
};

const getJenisClass = (type: string) => {
  if (type === 'Cuti Tahunan') return 'bg-blue-1 text-primary';
  if (type === 'Cuti Sakit') return 'bg-red-1 text-negative';
  if (type === 'Cuti Darurat') return 'bg-orange-1 text-warning';
  return 'bg-grey-2 text-dark';
};

const getStatusClass = (status: string) => {
  if (status === 'Pending') return 'bg-yellow-1 text-warning-dark border-warning';
  if (status === 'Disetujui') return 'bg-green-1 text-positive-dark border-positive';
  if (status === 'Ditolak') return 'bg-red-1 text-negative-dark border-negative';
  return 'bg-grey-2 text-dark';
};

const getStatusDot = (status: string) => {
  if (status === 'Pending') return 'bg-warning';
  if (status === 'Disetujui') return 'bg-positive';
  if (status === 'Ditolak') return 'bg-negative';
  return 'bg-grey';
};

const formatShortDate = (val: string) => {
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return date.formatDate(d, 'DD MMM YYYY');
  } catch {
    // ignore
  }
  return val || '-';
};

onMounted(() => {
  void fetchLeaveRequests();
});
</script>

<style scoped>
.leave-approval-page {
  background: #f5f7fa;
  min-height: 100vh;
}

/* TYPOGRAPHY */
.page-title {
  font-size: 26px;
  font-weight: 800;
  color: #0f2044;
}

.text-warning-dark {
  color: #b45309;
}
.text-positive-dark {
  color: #15803d;
}
.text-negative-dark {
  color: #b91c1c;
}

.border-warning {
  border: 1px solid #fde68a !important;
}
.border-positive {
  border: 1px solid #bbf7d0 !important;
}
.border-negative {
  border: 1px solid #fecdd3 !important;
}

/* CARDS & LAYOUT */
.table-card {
  border-radius: 16px !important;
  background: #ffffff;
  border: 1px solid #eaecf0 !important;
}

.summary-card {
  border-radius: 16px !important;
  background: #ffffff;
  border: 1px solid #eaecf0 !important;
  transition: all 0.2s ease;
}

.summary-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.icon-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* BUTTONS */
.action-btn-dark {
  background: #0f2044 !important;
  color: #ffffff !important;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
}

.btn-outline-regular {
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.action-btn-outline {
  border: 1px solid #eaecf0;
  border-radius: 8px;
}

/* TABLE TYPOGRAPHY */
.emp-name {
  font-size: 14px;
  font-weight: 700;
  color: #101828;
}

.emp-dept {
  font-size: 11px;
  color: #667085;
  margin-top: 2px;
}

.date-text,
.duration-text,
.reason-text {
  font-size: 13px;
  font-weight: 500;
}

/* STATUS BADGES WITH CSS DOTS */
.status-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

/* OVERRIDE QUASAR TABLE */
:deep(.directory-table .q-table__top),
:deep(.directory-table thead tr th) {
  font-size: 11px;
  font-weight: 700;
  color: #667085;
  letter-spacing: 0.5px;
  background: #f9fafb;
  border-bottom: 2px solid #eaecf0;
  padding: 16px !important;
  text-transform: uppercase;
}

:deep(.directory-table tbody tr td) {
  border-bottom: 1px solid #f2f4f7;
  padding: 14px 16px !important;
}

:deep(.directory-table tbody tr:last-child td) {
  border-bottom: none;
}
</style>
