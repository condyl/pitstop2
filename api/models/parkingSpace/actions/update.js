import { applyParams, save, ActionOptions } from "gadget-server";
import { geocodeAddress } from "../../../utils/geocoding";

/** @type { ActionRun } */
export const run = async ({ params, record, logger, api, connections }) => {
  const newAddress = params.parkingSpace?.address;
  const currentAddress = record.get("address");
  
  // Only geocode if address is being changed and new address exists
  if (newAddress && newAddress !== currentAddress) {
    try {
      const { latitude, longitude } = await geocodeAddress(newAddress);
      record.latitude = latitude;
      record.longitude = longitude;
    } catch (error) {
      throw new Error(`Failed to geocode address: ${error.message}`);
    }
  }

  applyParams(params, record);
  await save(record);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
