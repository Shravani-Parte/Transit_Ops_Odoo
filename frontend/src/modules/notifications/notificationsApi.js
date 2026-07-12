import { db } from "@/store/mockDb";
import { daysUntil } from "@/common/utils/formatDate";

export function licenseExpiryNotifications({ within = 60 } = {}) {
  return db().drivers
    .filter(d => daysUntil(d.license_expiry_date) <= within)
    .map(d => ({
      id: `notif-${d.id}`,
      driver_id: d.id,
      driver_name: d.name,
      license_number: d.license_number,
      expires_on: d.license_expiry_date,
      days: daysUntil(d.license_expiry_date),
    }))
    .sort((a, b) => a.days - b.days);
}
