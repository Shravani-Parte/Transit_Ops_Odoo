export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const ROLE_NAMES = {
  FLEET_MANAGER: 'Fleet Manager',
  DISPATCHER: 'Dispatcher',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst',
};

export const VEHICLE_STATUSES = ['Available', 'On Trip', 'In Shop', 'Retired'];
export const DRIVER_STATUSES = ['Available', 'On Trip', 'Off Duty', 'Suspended'];
export const TRIP_STATUSES = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];
export const VEHICLE_TYPES = ['Van', 'Truck', 'Trailer', 'Bus'];
export const EXPENSE_TYPES = ['Toll', 'Maintenance', 'Other'];

export const DEMO_USERS = [
  { email: 'fleet@transitops.com', role: 'Fleet Manager', label: 'Fleet Manager' },
  { email: 'dispatcher@transitops.com', role: 'Dispatcher', label: 'Dispatcher' },
  { email: 'safety@transitops.com', role: 'Safety Officer', label: 'Safety Officer' },
  { email: 'finance@transitops.com', role: 'Financial Analyst', label: 'Financial Analyst' },
];

export const DEFAULT_PASSWORD = 'password123';
