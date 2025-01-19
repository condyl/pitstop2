import { save, ActionOptions, applyParams } from "gadget-server";

/** @type { ActionRun } */
export const run = async ({ params, record, logger, api, session }) => {
  applyParams(params, record);
  record.lastSignedIn = new Date();
  
  if (!record.roles.includes("can-see")) {
    record.roles.push("can-see");
  }
  
  await save(record);
  // associate the current user record with the active session
  session?.set("user", { _link: record.id });
};
export const options = {
  actionType: "update",
  triggers: {
    api: false,
    googleOAuthSignIn: true,
    emailSignIn: true,
  },
};
