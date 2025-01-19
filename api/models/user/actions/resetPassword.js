import { applyParams, save, ActionOptions } from "gadget-server";

/** @type { ActionRun } */
export const run = async ({ params, record, logger, api, session }) => {
  applyParams(params, record);
  await save(record);
  return {
    result: "ok",
  };
};

/** @type { ActionOnSuccess } */
export const onSuccess = async ({ params, record, logger, api, emails }) => {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "custom",
  returnType: true,
  triggers: { api: false, resetPassword: true },
};
