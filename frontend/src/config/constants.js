<<<<<<< HEAD
/** Enums and constants. Roles per resolved diff #1 (mock login screen). */
export const ROLE_NAMES = ["FleetManager", "Dispatcher", "SafetyOfficer", "FinancialAnalyst"];

export const ROLE_LABELS = {
  FleetManager: "Fleet Manager",
  Dispatcher: "Dispatcher",
  SafetyOfficer: "Safety Officer",
  FinancialAnalyst: "Financial Analyst",
};

export const VEHICLE_STATUSES = ["Available", "On Trip", "In Shop", "Retired"];
export const DRIVER_STATUSES = ["Available", "On Trip", "Off Duty", "Suspended"];
export const TRIP_STATUSES = ["Draft", "Dispatched", "Completed", "Cancelled"];
export const MAINTENANCE_STATUSES = ["Open", "Closed"];

export const VEHICLE_TYPES = ["Truck", "Mini Truck", "Van", "Tempo", "Tanker", "Trailer"];
export const LICENSE_CATEGORIES = ["LMV", "HMV", "MCWG", "HTV", "Trailer"];
export const REGIONS = ["South", "North", "West", "East"];
export const EXPENSE_CATEGORIES = ["Toll", "Parking", "Loading", "Insurance", "Repair", "Misc"];

export const CURRENCY = "INR";
export const DISTANCE_UNIT = "km";
=======
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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
