import { applyParams, save, ActionOptions } from "gadget-server";

/** @type { ActionRun } */
export const run = async ({ params, record, logger, api, session }) => {
  applyParams(params, record);
  record.lastSignedIn = new Date();
  await save(record);
  // associate the current user record with the active session
  if (record.emailVerified) {
    session?.set("user", { _link: record.id });
  }
  return {
    result: "ok",
  };
};

/** @type { ActionOnSuccess } */
export const onSuccess = async ({ params, record, logger, api }) => {
  // sends the user a verification email if they have not yet verified
  if (!record.emailVerified) {
    await api.user.sendVerifyEmail({ email: record.email });
  }
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
  returnType: true,
  triggers: {
    api: false,
    googleOAuthSignUp: true,
    emailSignUp: true,
  },
};
