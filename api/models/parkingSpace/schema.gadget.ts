import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "parkingSpace" model, go to https://pitstop2.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "yKlvmVdV_0ec",
  comment:
    "Represents a parking space listing with details such as location, pricing, availability, and owner relationship. Facilitates parking space management, allowing users to create, update, and delete their own listings.",
  fields: {
    address: { type: "string", storageKey: "yKlvmVdV_0ec-address" },
    availability: {
      type: "boolean",
      default: true,
      storageKey: "yKlvmVdV_0ec-availability",
    },
    canAccomodateLargeVehicles: {
      type: "boolean",
      default: false,
      storageKey: "yKlvmVdV_0ec-canAccomodateLargeVehicles",
    },
    description: {
      type: "string",
      storageKey: "yKlvmVdV_0ec-description",
    },
    dimensions: {
      type: "json",
      storageKey: "yKlvmVdV_0ec-dimensions",
    },
    hasRoof: {
      type: "boolean",
      default: false,
      storageKey: "yKlvmVdV_0ec-hasRoof",
    },
    latitude: {
      type: "number",
      validations: {
        required: true,
        numberRange: { min: -90, max: 90 },
      },
      storageKey: "yKlvmVdV_0ec-latitude",
    },
    longitude: {
      type: "number",
      validations: {
        required: true,
        numberRange: { min: -180, max: 180 },
      },
      storageKey: "yKlvmVdV_0ec-longitude",
    },
    owner: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "user" },
      storageKey: "yKlvmVdV_0ec-owner",
    },
    photos: {
      type: "file",
      allowPublicAccess: false,
      storageKey: "yKlvmVdV_0ec-photos",
    },
    pricePerDay: {
      type: "number",
      decimals: 2,
      validations: { numberRange: { min: 0, max: null } },
      storageKey: "yKlvmVdV_0ec-pricePerDay",
    },
    pricePerHour: {
      type: "number",
      decimals: 2,
      validations: { numberRange: { min: 0, max: null } },
      storageKey: "yKlvmVdV_0ec-pricePerHour",
    },
    surfaceType: {
      type: "string",
      storageKey: "yKlvmVdV_0ec-surfaceType",
    },
    title: {
      type: "string",
      validations: {
        required: true,
        stringLength: { min: null, max: 100 },
      },
      storageKey: "yKlvmVdV_0ec-title",
    },
  },
};
