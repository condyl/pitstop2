import { applyParams, save, ActionOptions } from "gadget-server";
import { geocodeAddress } from "../../../utils/geocoding";

/** @type { ActionRun } */
export const run = async ({ params, record, logger, api, connections, session }) => {
  applyParams(params, record);

  const userId = session?.get("user");
  if (!userId) {
    throw new Error("You must be signed in to create a parking space");
  }
  record.owner = { _link: userId }; 
  
  // Only geocode if we have an address but no coordinates
  if (
    record.address && 
    (!record.latitude || !record.longitude)
  ) {
    try {
      const { latitude, longitude } = await geocodeAddress(record.address);
      record.latitude = latitude;
      record.longitude = longitude;
    } catch (error) {
      throw new Error(`Failed to geocode address: ${error.message}`);
    }
  }

  await save(record);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
