import { applyParams, save, ActionOptions, InvalidRecordError, assert } from "gadget-server";
import { validateBookingDates } from "../../../utils/bookingValidations";

/** @type { ActionRun } */
export const run = async ({ params, record, session, api, logger }) => {
  logger.info("Starting booking creation");
  
  applyParams(params, record);
  
  // Ensure user is logged in
  logger.debug("Verifying user authentication");
  record.user = { _link: assert(session?.get("user"), "Must be logged in to create a booking") };
  
  // Validate parking space is specified
  if (!record.parkingSpace?._link) {
    throw new InvalidRecordError(
      "Missing parking space",
      [{ field: "parkingSpace", message: "Parking space is required" }],
      "booking"
    );
  }
  
  logger.debug("Validating booking dates");
  await validateBookingDates(record.startDate, record.endDate);
 
  // Check parking space availability
  logger.debug("Checking parking space availability");
  const parkingSpace = await api.parkingSpace.findOne(record.parkingSpace._link);
  if (!parkingSpace?.availability) {
    throw new InvalidRecordError(
      "Parking space unavailable",
      [{ field: "parkingSpace", message: "Selected parking space is not available" }],
      "booking"
    );
  }
 
  // Check for booking conflicts
  logger.debug("Checking for booking conflicts");
  const existingBookings = await api.booking.findMany({
    filter: {
      parkingSpace: { equals: record.parkingSpace._link },
      startDate: { lessThanOrEqual: record.endDate },
      endDate: { greaterThanOrEqual: record.startDate }
    }
  });
 
  if (existingBookings.length > 0) {
    throw new InvalidRecordError(
      "Booking conflict",
      [{ field: "startDate", message: "Parking space is already booked for these dates" }],
      "booking"
    );
  }
  
  logger.debug("Saving booking record");
  await save(record);
  await api.parkingSpace.update(record.parkingSpace._link, { availability: false });
  
  logger.info("Successfully created booking");
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};