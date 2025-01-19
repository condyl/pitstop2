import { applyParams, save, ActionOptions, InvalidRecordError } from "gadget-server";
 
/** @type { ActionRun } */
export const run = async ({ params, record, logger, api, session }) => {
  // Verify booking ownership
  if (session?.get("user") !== record.user?.id) {
    throw new InvalidRecordError(
      "You can only update your own bookings",
      [{
        field: "user",
        message: "You can only update your own bookings"
      }],
      "booking",
      record
    );
  }
 
  // If dates are being modified, validate them
  if (params.startDate || params.endDate) {
    const startDate = params.startDate ? new Date(params.startDate) : record.startDate;
    const endDate = params.endDate ? new Date(params.endDate) : record.endDate;
 
    if (startDate >= endDate) {
      throw new InvalidRecordError(
        "Invalid date range",
        [{
          field: "startDate",
          message: "Start date must be before end date"
        }],
        "booking",
        record
      );
    }
 
    // Check for conflicts
    const conflicts = await api.booking.findMany({
      filter: {
        parkingSpace: { equals: record.parkingSpace.id },
        id: { notEquals: record.id },
        startDate: { lessThanOrEqual: endDate.toISOString() },
        endDate: { greaterThanOrEqual: startDate.toISOString() }
      }
    });
    
    if (conflicts.length > 0) {
      throw new InvalidRecordError(
        "Booking conflict",
        [{
          field: "startDate",
          message: "This time slot conflicts with an existing booking"
        }],
        "booking",
        record
      );
    }
  }
 
  applyParams(params, record);
  await save(record);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};
