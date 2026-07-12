/** Field validators for forms. */
export const required = (v) => (v === undefined || v === null || v === "" ? "Required" : null);
export const email = (v) => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Invalid email");
export const positive = (v) => (Number(v) > 0 ? null : "Must be positive");
export const nonNegative = (v) => (Number(v) >= 0 ? null : "Must be ≥ 0");
export const futureDate = (v) => (v && new Date(v) >= new Date(new Date().toDateString()) ? null : "Must be today or later");
