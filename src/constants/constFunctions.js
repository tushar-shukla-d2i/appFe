/**
 * All Constant Functions
 */

import { LEAVE_TYPES } from "./constantData";

export const getLeaveType = (leaveType) => {
  return LEAVE_TYPES.filter((l) => l.value === leaveType)?.[0]?.label || "";
};
