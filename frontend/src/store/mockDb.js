/**
 * Local mock database backed by localStorage.
 * Enforces business rules per PROCESS.md and DATA_MODEL.md.
 * Frontend feature code reads/writes here — never via HTTP.
 */
import { VEHICLE_STATUSES, DRIVER_STATUSES, TRIP_STATUSES } from "@/config/constants";

const DB_KEY = "transitops.db.v1";

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const DEFAULT = () => {
  const today = new Date();
  const iso = (d) => new Date(d).toISOString();
  const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString(); };
  const addMonths = (n) => { const d = new Date(); d.setMonth(d.getMonth() + n); return d.toISOString(); };

  const users = [
    { id: "u1", name: "Ramesh Iyer",   email: "ramesh@transitops.in",  role: "FleetManager",     status: "Active" },
    { id: "u2", name: "Anita Sharma",  email: "anita@transitops.in",   role: "Dispatcher",       status: "Active" },
    { id: "u3", name: "Vikram Menon",  email: "vikram@transitops.in",  role: "SafetyOfficer",    status: "Active" },
    { id: "u4", name: "Priya Nair",    email: "priya@transitops.in",   role: "FinancialAnalyst", status: "Active" },
  ];

  const regions = ["South", "North", "West", "East"];

  const vehicles = [
    { id: "v1", registration_number: "TN01AB1234", name_model: "Tata Ace Gold",    type: "Mini Truck", max_load_capacity: 750,  odometer: 45210, acquisition_cost: 620000,  status: "Available", region: "South", created_at: iso(today) },
    { id: "v2", registration_number: "KA05CD5678", name_model: "Ashok Leyland Dost", type: "Van",      max_load_capacity: 1250, odometer: 88100, acquisition_cost: 890000,  status: "On Trip",   region: "South", created_at: iso(today) },
    { id: "v3", registration_number: "MH12EF9012", name_model: "Tata 407",         type: "Truck",     max_load_capacity: 2500, odometer: 132500, acquisition_cost: 1250000, status: "In Shop",   region: "West",  created_at: iso(today) },
    { id: "v4", registration_number: "DL03GH3456", name_model: "Eicher Pro 3015",  type: "Truck",     max_load_capacity: 7500, odometer: 210300, acquisition_cost: 2200000, status: "Available", region: "North", created_at: iso(today) },
    { id: "v5", registration_number: "GJ01IJ7890", name_model: "Bharat Benz 1617", type: "Tanker",    max_load_capacity: 9000, odometer: 65400, acquisition_cost: 2850000, status: "Available", region: "West",  created_at: iso(today) },
    { id: "v6", registration_number: "TN22KL2345", name_model: "Mahindra Bolero Pikup", type: "Mini Truck", max_load_capacity: 1000, odometer: 34120, acquisition_cost: 780000, status: "On Trip", region: "South", created_at: iso(today) },
    { id: "v7", registration_number: "KA01MN6789", name_model: "Force Traveller", type: "Van",       max_load_capacity: 900,  odometer: 22540, acquisition_cost: 1100000, status: "Available", region: "South", created_at: iso(today) },
    { id: "v8", registration_number: "HR26OP1122", name_model: "Tata Prima 3128",  type: "Trailer",   max_load_capacity: 25000, odometer: 145200, acquisition_cost: 4500000, status: "Retired", region: "North", created_at: iso(today) },
  ];

  const drivers = [
    { id: "d1", name: "Suresh Kumar",  license_number: "TN-2020-000123", license_category: "HMV", license_expiry_date: addDays(220),  contact_number: "+91 98765 43210", safety_score: 92, status: "Available", trip_completion_pct: 96 },
    { id: "d2", name: "Manoj Pillai",  license_number: "KA-2019-004512", license_category: "LMV", license_expiry_date: addDays(45),   contact_number: "+91 99887 12345", safety_score: 88, status: "On Trip",   trip_completion_pct: 91 },
    { id: "d3", name: "Rajesh Verma",  license_number: "MH-2018-007821", license_category: "HTV", license_expiry_date: addDays(-12),  contact_number: "+91 98111 22233", safety_score: 74, status: "Suspended", trip_completion_pct: 82 },
    { id: "d4", name: "Ganesh Reddy",  license_number: "TG-2021-002145", license_category: "HMV", license_expiry_date: addDays(365),  contact_number: "+91 90000 11122", safety_score: 95, status: "Available", trip_completion_pct: 98 },
    { id: "d5", name: "Balaji Nair",   license_number: "KL-2020-009911", license_category: "LMV", license_expiry_date: addDays(120),  contact_number: "+91 94444 55566", safety_score: 90, status: "Available", trip_completion_pct: 94 },
    { id: "d6", name: "Prakash Singh", license_number: "DL-2017-003344", license_category: "HTV", license_expiry_date: addDays(9),    contact_number: "+91 95555 66677", safety_score: 78, status: "Off Duty",  trip_completion_pct: 85 },
    { id: "d7", name: "Kiran Deshmukh",license_number: "MH-2022-008812", license_category: "HMV", license_expiry_date: addDays(500),  contact_number: "+91 91111 33344", safety_score: 89, status: "On Trip",   trip_completion_pct: 93 },
  ];

  const trips = [
    { id: "t1", source: "Chennai", destination: "Bengaluru", vehicle_id: "v2", driver_id: "d2", cargo_weight: 1100, planned_distance: 350, actual_distance: null,  revenue: 45000, status: "Dispatched", dispatched_at: iso(today), completed_at: null, created_at: iso(today) },
    { id: "t2", source: "Mumbai",  destination: "Pune",      vehicle_id: "v6", driver_id: "d7", cargo_weight: 900,  planned_distance: 150, actual_distance: null,  revenue: 22000, status: "Dispatched", dispatched_at: iso(today), completed_at: null, created_at: iso(today) },
    { id: "t3", source: "Hyderabad", destination: "Vijayawada", vehicle_id: "v4", driver_id: "d4", cargo_weight: 5200, planned_distance: 275, actual_distance: 280, revenue: 68000, status: "Completed", dispatched_at: iso(new Date(today.getTime()-86400000*3)), completed_at: iso(new Date(today.getTime()-86400000*2)), created_at: iso(today) },
    { id: "t4", source: "Coimbatore", destination: "Kochi",   vehicle_id: "v1", driver_id: "d5", cargo_weight: 620,  planned_distance: 190, actual_distance: 195, revenue: 28000, status: "Completed", dispatched_at: iso(new Date(today.getTime()-86400000*5)), completed_at: iso(new Date(today.getTime()-86400000*4)), created_at: iso(today) },
    { id: "t5", source: "Ahmedabad", destination: "Surat",    vehicle_id: "v5", driver_id: "d1", cargo_weight: 8500, planned_distance: 265, actual_distance: null, revenue: 72000, status: "Draft", dispatched_at: null, completed_at: null, created_at: iso(today) },
  ];

  const maintenance = [
    { id: "m1", vehicle_id: "v3", opened_at: iso(new Date(today.getTime()-86400000*4)), closed_at: null, category: "Engine", description: "Coolant leak diagnosis", cost: 8500, status: "Open" },
    { id: "m2", vehicle_id: "v4", opened_at: iso(new Date(today.getTime()-86400000*30)), closed_at: iso(new Date(today.getTime()-86400000*28)), category: "Tyres", description: "Rear tyre replacement", cost: 22000, status: "Closed" },
    { id: "m3", vehicle_id: "v1", opened_at: iso(new Date(today.getTime()-86400000*60)), closed_at: iso(new Date(today.getTime()-86400000*59)), category: "Service", description: "Scheduled 40,000 km service", cost: 6200, status: "Closed" },
  ];

  const fuel = [
    { id: "f1", vehicle_id: "v3", trip_id: "t3", liters: 45, cost: 4550, odometer: 132500, logged_at: iso(new Date(today.getTime()-86400000*2)) },
    { id: "f2", vehicle_id: "v1", trip_id: "t4", liters: 22, cost: 2220, odometer: 45210, logged_at: iso(new Date(today.getTime()-86400000*4)) },
    { id: "f3", vehicle_id: "v2", trip_id: "t1", liters: 55, cost: 5590, odometer: 88100, logged_at: iso(today) },
    { id: "f4", vehicle_id: "v4", trip_id: null, liters: 80, cost: 8100, odometer: 210300, logged_at: iso(new Date(today.getTime()-86400000*10)) },
  ];

  const expenses = [
    { id: "e1", vehicle_id: "v3", trip_id: "t3", category: "Toll",    amount: 1250, notes: "NH-65 toll",   incurred_at: iso(new Date(today.getTime()-86400000*2)) },
    { id: "e2", vehicle_id: "v1", trip_id: "t4", category: "Loading", amount: 800,  notes: "Kochi port",   incurred_at: iso(new Date(today.getTime()-86400000*4)) },
    { id: "e3", vehicle_id: "v2", trip_id: "t1", category: "Parking", amount: 200,  notes: "Bengaluru hub",incurred_at: iso(today) },
    { id: "e4", vehicle_id: "v4", trip_id: null, category: "Insurance", amount: 32000, notes: "Annual premium", incurred_at: iso(new Date(today.getTime()-86400000*15)) },
  ];

  return {
    users, regions, vehicles, drivers, trips, maintenance, fuel, expenses,
    notifications: [],
    vehicle_status_history: [],
    driver_status_history: [],
    trip_status_history: [],
    settings: { depot_name: "TransitOps Central Depot", currency: "INR", distance_unit: "km" },
    seeded_at: iso(today),
  };
};

export function seedMockDataIfEmpty() {
  if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT()));
  }
}

export function resetMockData() {
  localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT()));
}

export function db() {
  return JSON.parse(localStorage.getItem(DB_KEY) || "null") || DEFAULT();
}

export function saveDb(next) {
  localStorage.setItem(DB_KEY, JSON.stringify(next));
}

export function update(mutator) {
  const cur = db();
  mutator(cur);
  saveDb(cur);
  return cur;
}

// ============ Business rules ============
export function validateVehicleUnique(regNo, excludeId = null) {
  return !db().vehicles.some(v => v.registration_number.toLowerCase() === regNo.toLowerCase() && v.id !== excludeId);
}

export function validateDriverUnique(licNo, excludeId = null) {
  return !db().drivers.some(d => d.license_number.toLowerCase() === licNo.toLowerCase() && d.id !== excludeId);
}

export function availableVehicles() {
  // Retired and In Shop are filtered out of dispatch pool at service layer, not just UI.
  return db().vehicles.filter(v => v.status === "Available");
}

export function eligibleDrivers() {
  const today = new Date();
  return db().drivers.filter(d =>
    d.status === "Available" &&
    new Date(d.license_expiry_date) >= today
  );
}

export function validateCargoWithinCapacity(vehicleId, cargoWeight) {
  const v = db().vehicles.find(x => x.id === vehicleId);
  if (!v) return { ok: false, reason: "Vehicle not found" };
  if (Number(cargoWeight) > Number(v.max_load_capacity)) {
    return { ok: false, reason: `Cargo ${cargoWeight}kg exceeds capacity ${v.max_load_capacity}kg` };
  }
  return { ok: true };
}

// ============ Status history helpers ============
function pushVehicleHistory(state, vehicleId, from, to, reason) {
  state.vehicle_status_history.push({ id: uid("vsh"), vehicle_id: vehicleId, from_status: from, to_status: to, reason, changed_at: new Date().toISOString() });
}
function pushDriverHistory(state, driverId, from, to, reason) {
  state.driver_status_history.push({ id: uid("dsh"), driver_id: driverId, from_status: from, to_status: to, reason, changed_at: new Date().toISOString() });
}
function pushTripHistory(state, tripId, from, to, reason) {
  state.trip_status_history.push({ id: uid("tsh"), trip_id: tripId, from_status: from, to_status: to, reason, changed_at: new Date().toISOString() });
}

// ============ Trip lifecycle atomics ============
export function dispatchTrip(tripId) {
  return update((s) => {
    const t = s.trips.find(x => x.id === tripId);
    if (!t) throw new Error("Trip not found");
    if (t.status !== "Draft") throw new Error("Only Draft trips can be dispatched");
    const v = s.vehicles.find(x => x.id === t.vehicle_id);
    const d = s.drivers.find(x => x.id === t.driver_id);
    if (!v || v.status !== "Available") throw new Error("Vehicle not available");
    if (!d || d.status !== "Available") throw new Error("Driver not available");
    if (new Date(d.license_expiry_date) < new Date()) throw new Error("Driver license expired");
    if (Number(t.cargo_weight) > Number(v.max_load_capacity)) throw new Error("Cargo exceeds capacity");

    pushVehicleHistory(s, v.id, v.status, "On Trip", `Dispatched trip ${t.id}`);
    pushDriverHistory(s, d.id, d.status, "On Trip", `Dispatched trip ${t.id}`);
    pushTripHistory(s, t.id, t.status, "Dispatched", null);
    v.status = "On Trip";
    d.status = "On Trip";
    t.status = "Dispatched";
    t.dispatched_at = new Date().toISOString();
  });
}

export function completeTrip(tripId, { actual_distance, revenue }) {
  return update((s) => {
    const t = s.trips.find(x => x.id === tripId);
    if (!t) throw new Error("Trip not found");
    if (t.status !== "Dispatched") throw new Error("Only Dispatched trips can be completed");
    const v = s.vehicles.find(x => x.id === t.vehicle_id);
    const d = s.drivers.find(x => x.id === t.driver_id);
    pushVehicleHistory(s, v.id, v.status, "Available", `Completed trip ${t.id}`);
    pushDriverHistory(s, d.id, d.status, "Available", `Completed trip ${t.id}`);
    pushTripHistory(s, t.id, t.status, "Completed", null);
    v.status = "Available";
    v.odometer = Number(v.odometer) + Number(actual_distance || 0);
    d.status = "Available";
    t.status = "Completed";
    t.actual_distance = Number(actual_distance);
    if (revenue !== undefined) t.revenue = Number(revenue);
    t.completed_at = new Date().toISOString();
  });
}

export function cancelTrip(tripId, reason) {
  return update((s) => {
    const t = s.trips.find(x => x.id === tripId);
    if (!t) throw new Error("Trip not found");
    if (!["Draft", "Dispatched"].includes(t.status)) throw new Error("Cannot cancel");
    if (t.status === "Dispatched") {
      const v = s.vehicles.find(x => x.id === t.vehicle_id);
      const d = s.drivers.find(x => x.id === t.driver_id);
      pushVehicleHistory(s, v.id, v.status, "Available", `Cancelled trip ${t.id}`);
      pushDriverHistory(s, d.id, d.status, "Available", `Cancelled trip ${t.id}`);
      v.status = "Available";
      d.status = "Available";
    }
    pushTripHistory(s, t.id, t.status, "Cancelled", reason);
    t.status = "Cancelled";
  });
}

// ============ Maintenance lifecycle ============
export function openMaintenance({ vehicle_id, category, description, cost }) {
  return update((s) => {
    const v = s.vehicles.find(x => x.id === vehicle_id);
    if (!v) throw new Error("Vehicle not found");
    if (v.status === "On Trip") throw new Error("Cannot open maintenance on a vehicle On Trip");
    if (v.status === "Retired") throw new Error("Vehicle is Retired");
    s.maintenance.push({ id: uid("m"), vehicle_id, opened_at: new Date().toISOString(), closed_at: null, category, description: description || "", cost: Number(cost) || 0, status: "Open" });
    if (v.status === "Available") {
      pushVehicleHistory(s, v.id, v.status, "In Shop", "Maintenance opened");
      v.status = "In Shop";
    }
  });
}

export function closeMaintenance(logId, finalCost) {
  return update((s) => {
    const m = s.maintenance.find(x => x.id === logId);
    if (!m || m.status !== "Open") throw new Error("Log not open");
    m.status = "Closed";
    m.closed_at = new Date().toISOString();
    if (finalCost !== undefined) m.cost = Number(finalCost);
    const v = s.vehicles.find(x => x.id === m.vehicle_id);
    if (v && v.status === "In Shop") {
      pushVehicleHistory(s, v.id, v.status, "Available", `Maintenance ${m.id} closed`);
      v.status = "Available";
    }
  });
}

// ============ CRUD helpers ============
export function insert(collection, record) {
  return update((s) => {
    const withId = { ...record, id: record.id || uid(collection.slice(0, 1)) };
    s[collection].push(withId);
  });
}

export function replace(collection, id, patch) {
  return update((s) => {
    const idx = s[collection].findIndex(x => x.id === id);
    if (idx >= 0) s[collection][idx] = { ...s[collection][idx], ...patch };
  });
}

export function remove(collection, id) {
  return update((s) => {
    s[collection] = s[collection].filter(x => x.id !== id);
  });
}
