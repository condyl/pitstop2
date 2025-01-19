import { InvalidRecordError } from "gadget-server";
import { api } from "gadget-server";

/**
 * Validates that startDate comes before endDate and both are in the future
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {Object} Validation result
 */
export async function validateDateRange(startDate, endDate) {
  const errors = [];
  const now = new Date();

  // Ensure dates are valid
  if (!(startDate instanceof Date) || isNaN(startDate)) {
    errors.push({ field: "startDate", message: "Start date is invalid" });
  }

  if (!(endDate instanceof Date) || isNaN(endDate)) {
    errors.push({ field: "endDate", message: "End date is invalid" });
  }

  // Only continue validation if both dates are valid
  if (errors.length === 0) {
    if (startDate < now) {
      errors.push({ field: "startDate", message: "Start date must be in the future" });
    }

    if (endDate < now) {
      errors.push({ field: "endDate", message: "End date must be in the future" });
    }

    if (startDate >= endDate) {
      errors.push({ field: "endDate", message: "End date must be after start date" });
    }
  }

  return {
    success: errors.length === 0,
    errors
  };
}

/**
 * Checks for any conflicting bookings in the given date range
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @param {string} parkingSpaceId 
 * @param {string|null} excludeBookingId - Optional booking ID to exclude from conflict check
 * @returns {Object} Validation result
 */
export async function checkBookingConflicts(startDate, endDate, parkingSpaceId, excludeBookingId = null) {
  const filter = {
    parkingSpace: { id: { equals: parkingSpaceId } },
    AND: [
      { startDate: { lessThanOrEqual: endDate } },
      { endDate: { greaterThanOrEqual: startDate } }
    ]
  };

  if (excludeBookingId) {
    filter.id = { notEquals: excludeBookingId };
  }

  const conflicts = await api.booking.findMany({ filter });

  return {
    success: conflicts.length === 0,
    errors: conflicts.length > 0 ? [{ field: "dates", message: "This parking space is already booked for the selected dates" }] : []
  };
}

/**
 * Verifies that a parking space exists and is available
 * @param {string} parkingSpaceId 
 * @returns {Object} Validation result
 */
export async function verifyParkingSpaceAvailability(parkingSpaceId) {
  const parkingSpace = await api.parkingSpace.findFirst({
    filter: { id: { equals: parkingSpaceId } }
  });

  if (!parkingSpace || !parkingSpace.availability) {
    return {
      success: false,
      errors: [{ field: "parkingSpace", message: "Parking space is not available" }]
    };
  }
  return { success: true, errors: [] };
}