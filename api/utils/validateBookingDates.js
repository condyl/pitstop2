import { api } from "gadget-server";

/**
 * Validates booking dates to ensure they are valid and don't overlap with existing bookings
 * @param {Date | string} startDate - The proposed booking start date
 * @param {Date | string} endDate - The proposed booking end date
 * @param {string} parkingSpaceId - The ID of the parking space to check
 * @returns {Promise<{success: boolean, message?: string}>} Validation result
 */
export async function validateBookingDates(startDate, endDate, parkingSpaceId) {
  // Convert dates to Date objects if they're strings
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validate basic date order
  if (end <= start) {
    return {
      success: false,
      message: "End date must be after start date"
    };
  }

  // Check for overlapping bookings
  const overlappingBookings = await api.booking.findMany({
    filter: {
      AND: [
        { parkingSpaceId: { equals: parkingSpaceId } },
        {
          startDate: { lessThan: end.toISOString() }
        },
        {
          endDate: { greaterThan: start.toISOString() }
        }
      ]
    }
  });

  if (overlappingBookings.length > 0) {
    return {
      success: false,
      message: "This time slot conflicts with an existing booking"
    };
  }

  return {
    success: true
  };
}