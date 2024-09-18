/**
 * All Constant Data
 */

export const USER_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const BLOOD_GROUPS = [
  { value: "", label: "Select your blood group" },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

export const PUNCHING_ACTIONS = {
  PUNCH_IN: "punchIn",
  PUNCH_OUT: "punchOut",
};

export const MAX_METRIC_POINTS = 10;

export const LEAVE_TYPES = [
  { value: "", label: "Select" },
  { value: "casual", label: "Casual" },
  { value: "earned", label: "Earned" },
  { value: "maternity", label: "Maternity" },
  { value: "parent", label: "Parent" },
];

export const DAY_TYPES = [
  { value: "", label: "Select" },
  { value: 1, label: "Full Day" },
  { value: 0.5, label: "Half Day" },
];
