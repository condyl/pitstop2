import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "booking" model, go to https://pitstop2.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "-t9h65NRRf9s",
  comment:
    "Represents a booking for a parking space by a user, capturing the booking period, status, and price computation.",
  fields: {
    endDate: {
      type: "dateTime",
      includeTime: true,
      validations: { required: true },
      storageKey: "-t9h65NRRf9s-endDate",
    },
    parkingSpace: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "parkingSpace" },
      storageKey: "-t9h65NRRf9s-parkingSpace",
    },
    startDate: {
      type: "dateTime",
      includeTime: true,
      validations: { required: true },
      storageKey: "-t9h65NRRf9s-startDate",
    },
    status: {
      type: "string",
      default: "pending",
      validations: {
        required: true,
        regex: ["^(pending|confirmed|completed|cancelled)$"],
      },
      storageKey: "-t9h65NRRf9s-status",
    },
    user: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "user" },
      storageKey: "-t9h65NRRf9s-user",
    },
  },
};
