import type { RouteRecordRaw } from 'vue-router';


export interface SidebarItem {
  key: string;
  label: string;
  description: string;
  icon: string;
  to: string;
  expanded?: boolean;
  foceActive?: boolean;
  children?: SidebarItem[];
}

const DashboardPage = () => import('pages/DashboardPage.vue');
const DirectoryPage = () => import('pages/DirectoryPage.vue');

const TimeAttendancePage = () => import('src/pages/MasterData/TimeAttendance.vue');

const PayrollPage = () => import('src/pages/PayrollPage.vue');
const PerformancePage = () => import('src/pages/PerformancePage.vue');

const SettingsPage = () => import('pages/SettingsPage.vue');

const MainLayout = () => import('layouts/MainLayout.vue');
const TenantPage = () => import('src/pages/MasterData/TenantPage.vue');
const UsersPage = () => import('pages/MasterData/UsersPage.vue');
const RolesPages = () => import('src/pages/MasterData/RolesPages.vue');
const PublicHolidayPage = () => import('src/pages/MasterData/PublicHoliday.vue');
const WorkSchedulePage = () => import('src/pages/MasterData/WorkSchedule.vue');
const LeaveBalancePage = () => import('src/pages/MasterData/LeaveBalance.vue');
const DivisionPage = () => import('src/pages/MasterData/DivisionPage.vue');
const EmployeePage = () => import('src/pages/MasterData/EmployeePage.vue');


const LoginPage = () => import('pages/LoginPage.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    meta: {
      requiresAuth: false,
    },
    children: [
      {
        path: '',
        component: () => LoginPage(),
      },
    ],
  },
  {
    path: '/',
    component: () => MainLayout(),
    meta: {
      requiresAuth: true,
      menu:
        [
          //
          {
            key: 'home',
            label: 'Dashboard',
            description: 'Main dashboard view',
            icon: 'dashboard',
            to: '/',
          },
          // Directory
          {
            key: 'directory',
            label: 'Directory',
            description: 'Manage directory data',
            icon: 'people_outline',
            to: '/directory',
          },

          // Time Attendance
          {
            key: 'time-attendance',
            label: 'Time Attendance',
            description: 'Manage time attendance data',
            icon: 'access_time',
            to: '/time-attendance',
          },
          // Payroll
          {
            key: 'payroll',
            label: 'Payroll',
            description: 'Manage payroll data',
            icon: 'credit_card',
            to: '/payroll',
          },
          // Performance
          {
            key: 'performance',
            label: 'Performance',
            description: 'Manage performance data',
            icon: 'trending_up',
            to: '/performance',
          },
          // Settings
          {
            key: 'settings',
            label: 'Settings',
            description: 'Manage application settings',
            icon: 'settings',
            to: '/settings',
          },
          // Master Data

          {
            key: 'master-data',
            label: 'Master Data',
            description: 'Manage master data',
            icon: 'storage',
            expanded: true,
            children: [
              {
                key: 'tenant',
                label: 'Tenant',
                description: 'Manage tenant data',
                icon: 'business',
                to: '/master-data/tenant',
              },
              {
                key: 'users',
                label: 'Users',
                description: 'Manage user data',
                icon: 'people',
                to: '/master-data/users',
              },
              {
                key: 'employee',
                label: 'Employee',
                description: 'Manage employee data',
                icon: 'person',
                to: '/master-data/employee',
              },
              {
                key: 'division',
                label: 'Division',
                description: 'Manage division data',
                icon: 'domain',
                to: '/master-data/division',
              },
              {
                key: 'work-schedule',
                label: 'Work Schedule',
                description: 'Manage work schedule data',
                icon: 'schedule',
                to: '/master-data/work-schedule',
              },
              {
                key: 'roles',
                label: 'Roles',
                description: 'Manage roles data',
                icon: 'security',
                to: '/master-data/roles',
              },
              {
                key: 'public_holidays',
                label: 'Public Holidays',
                description: 'Manage public holidays data',
                icon: 'holiday_village',
                to: '/master-data/public-holidays',
              },
              {
                key: 'leave-balance',
                label: 'Leave Balance',
                description: 'Manage leave balance data',
                icon: 'beach_access',
                to: '/master-data/leave-balance',
              },
            ]
          },
        ] as SidebarItem[],
    },
    children: [
      {
        path: '',
        component: DashboardPage,
        meta: {
          title: 'Dashboard',
          breadcrumb: [{
            label: 'Dashboard',
            to: '/',
          }],
          requiresAuth: true // 🔥 WAJIB

        },
      },
      {
        path: 'directory',
        component: DirectoryPage,
        meta: {
          title: 'Directory',
          breadcrumb: [{
            label: 'Directory',
            to: '/directory',
          }],
          requiresAuth: true // 🔥 WAJIB

        },
      },
      // time attendance
      {
        path: 'time-attendance',
        component: TimeAttendancePage,
        meta: {
          title: 'Time Attendance',
          breadcrumb: [{
            label: 'Time Attendance',
            to: '/time-attendance',
          }],
          requiresAuth: true // 🔥 WAJIB

        },
      },
      // payroll
      {
        path: 'payroll',
        component: PayrollPage,
        meta: {
          title: 'Payroll',
          breadcrumb: [{
            label: 'Payroll',
            to: '/payroll',
          }],
          requiresAuth: true // 🔥 WAJIB

        },
      },
      // performance
      {
        path: 'performance',
        component: PerformancePage,
        meta: {
          title: 'Performance',
          breadcrumb: [{
            label: 'Performance',
            to: '/performance',
          }],
          requiresAuth: true // 🔥 WAJIB

        },
      },
      // settings
      {
        path: 'settings',
        component: SettingsPage,
        meta: {
          title: 'Settings',
          breadcrumb: [{
            label: 'Settings',
            to: '/settings',
          }],
          requiresAuth: true // 🔥 WAJIB

        },

      },

      // tenant
      {
        path: 'master-data/tenant',
        component: TenantPage,
        meta: {
          title: 'Tenant',
          breadcrumb: [{
            label: 'Master Data Tenant',
            to: '/master-data/tenant',
          }],
          requiresAuth: true // 🔥 WAJIB

        },
      },
      // users
      {
        path: 'master-data/users',
        component: UsersPage,
        meta: {
          title: 'Users',
          breadcrumb: [{
            label: 'Master Data Users',
            to: '/master-data/users',
          }],
          requiresAuth: true // 🔥 WAJIB

        },
      },
      // roles
      {
        path: 'master-data/roles',
        component: RolesPages,
        meta: {
          title: 'Roles',
          breadcrumb: [{
            label: 'Master Data Roles',
            to: '/master-data/roles',
          }],
          requiresAuth: true // 🔥 WAJIB

        },
      },
      // employee
      {
        path: 'master-data/employee',
        component: EmployeePage,
        meta: {
          title: 'Employee',
          breadcrumb: [{
            label: 'Master Data Employee',
            to: '/master-data/employee',
          }],
          requiresAuth: true // 🔥 WAJIB

        },
      },
      // division
      {
        path: 'master-data/division',
        component: DivisionPage,
        meta: {
          title: 'Division',
          breadcrumb: [{
            label: 'Master Data Division',
            to: '/master-data/division',
          }],
          requiresAuth: true // 🔥 WAJIB

        },
      },
      // work schedule
      {
        path: 'master-data/work-schedule',
        component: WorkSchedulePage,
        meta: {
          title: 'Work Schedule',
          breadcrumb: [{
            label: 'Master Data Work Schedule',
            to: '/master-data/work-schedule',
          }],
          requiresAuth: true // 🔥 WAJIB

        },
      },
      // public holidays
      {
        path: 'master-data/public-holidays',
        component: PublicHolidayPage,
        meta: {
          title: 'Public Holidays',
          breadcrumb: [{
            label: 'Master Data Public Holidays',
            to: '/master-data/public-holidays',
          }],
          requiresAuth: true // 🔥 WAJIB

        },
      },
      // leave balance
      {
        path: 'master-data/leave-balance',
        component: LeaveBalancePage,
        meta: {
          title: 'Leave Balance',
          breadcrumb: [{
            label: 'Master Data Leave Balance',
            to: '/master-data/leave-balance',
          }],
          requiresAuth: true // 🔥 WAJIB

        },
      },

    ],

  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
