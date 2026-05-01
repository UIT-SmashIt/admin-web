export const AdminRole = {
  Manager: 'Manager',
  Employee: 'Employee',
} as const;

export type AdminRole = typeof AdminRole[keyof typeof AdminRole];