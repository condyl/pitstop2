import { deleteRecord, InvalidRecordError, ActionOptions } from "gadget-server";
 

/** @type { ActionRun } */
export const run = async ({ params, record, session, api }) => {
  const userId = session?.get("user");
  
  if (!userId) {
    throw new InvalidRecordError(
      "Authentication required",
      [{ message: "You must be logged in to delete a booking", field: "user" }]
    );
  }

  if (record.userId !== userId) {
    throw new InvalidRecordError(
      "Permission denied", 
      [{ message: "You can only delete your own bookings", field: "user" }]
    );
  }
 

  if (!parkingSpaceId) {
    throw new InvalidRecordError(
      "Invalid booking",
      [{ message: "Booking has no associated parking space", field: "parkingSpace" }]
    );
  }
 
  const parkingSpaceId = record.parkingSpaceId;

  await deleteRecord(record);
 
  await api.parkingSpace.update(parkingSpaceId, { availability: true });
};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
};
