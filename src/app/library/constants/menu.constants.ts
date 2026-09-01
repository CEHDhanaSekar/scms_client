// core/config/menu.config.ts
export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  permission?: string; // single required key
  children?: MenuItem[];
  comingSoon?: boolean;
}

export const MENU_CONFIG: MenuItem[] = [
  { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
  {
    label: 'Clinical',
    icon: 'pi pi-heart',
    children: [
      {
        label: 'Registration',
        icon: 'pi pi-id-card',
        route: '/registration',
        permission: 'REGISTRATION_READ',
      },
      {
        label: 'Consultations',
        icon: 'pi pi-heart',
        route: '/consultations',
        permission: 'CONSULTATION_READ',
      },
      {
        label: 'Admissions',
        icon: 'pi pi-home',
        route: '/admissions',
        permission: 'ADMISSION_READ',
      },
      { label: 'Billing', icon: 'pi pi-wallet', route: '/billing', permission: 'BILLING_READ' },
      {
        label: 'Appointments',
        icon: 'pi pi-calendar',
        route: '/appointments',
        permission: 'APPOINTMENT_READ',
      },
    ],
  },
  {
    label: 'Administration',
    icon: 'pi pi-building',
    children: [
      {
        label: 'Departments',
        icon: 'pi pi-sitemap',
        route: '/departments',
        permission: 'DEPARTMENT_READ',
      },
      {
        label: 'Specializations',
        icon: 'pi pi-star',
        route: '/specializations',
        permission: 'SPECIALIZATION_READ',
      },
      {
        label: 'Employees',
        icon: 'pi pi-briefcase',
        route: '/employees',
        permission: 'EMPLOYEE_READ',
      },
      { label: 'Pharmacy', icon: 'pi pi-box', route: '/pharmacy', permission: 'PHARMACY_READ' },
    ],
  },
  {
    label: 'Security',
    icon: 'pi pi-shield',
    children: [
      { label: 'Roles', icon: 'pi pi-key', route: '/roles', permission: 'ROLE_READ' },
      { label: 'Users', icon: 'pi pi-users', route: '/users', permission: 'USER_READ' },
    ],
  },
];
