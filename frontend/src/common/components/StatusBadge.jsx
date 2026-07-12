<<<<<<< HEAD
import React from "react";

// Single source of truth for status colors across the app.
const STYLES = {
  // Vehicle
  "Available":  "bg-green-50 text-green-700 border-green-200",
  "On Trip":    "bg-blue-50 text-blue-700 border-blue-200",
  "In Shop":    "bg-amber-50 text-amber-700 border-amber-200",
  "Retired":    "bg-gray-100 text-gray-600 border-gray-200",
  // Driver
  "Off Duty":   "bg-gray-100 text-gray-600 border-gray-200",
  "Suspended":  "bg-red-50 text-red-700 border-red-200",
  // Trip
  "Draft":      "bg-gray-100 text-gray-700 border-gray-200",
  "Dispatched": "bg-blue-50 text-blue-700 border-blue-200",
  "Completed":  "bg-green-50 text-green-700 border-green-200",
  "Cancelled":  "bg-red-50 text-red-700 border-red-200",
  // Maintenance
  "Open":       "bg-amber-50 text-amber-700 border-amber-200",
  "Closed":     "bg-green-50 text-green-700 border-green-200",
  // Users
  "Active":     "bg-green-50 text-green-700 border-green-200",
  "Disabled":   "bg-gray-100 text-gray-600 border-gray-200",
};

export default function StatusBadge({ status }) {
  const cls = STYLES[status] || "bg-gray-100 text-gray-700 border-gray-200";
  return <span className={`badge border ${cls}`}>{status}</span>;
=======
import { statusColorMap } from '../../config/theme';

export default function StatusBadge({ status }) {
  const cls = statusColorMap[status] || 'draft';
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium status-${cls}`}>
      {status}
    </span>
  );
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
}
