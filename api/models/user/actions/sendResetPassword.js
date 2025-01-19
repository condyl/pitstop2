import {
  applyParams,
  save,
  ActionOptions,
  DefaultEmailTemplates,
  Config,
} from "gadget-server";

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
  if (record.resetPasswordToken && params.user?.resetPasswordCode) {
    const url = new URL("/reset-password", Config.appUrl);
    url.searchParams.append("code", params.user?.resetPasswordCode);
    // sends a reset password email with a link generated internally by Gadget
    await emails.sendMail({
      to: record.email,
      subject: `Reset password request from ${Config.appName}`,
      html: DefaultEmailTemplates.renderResetPasswordTemplate({
        url: url.toString(),
      }),
    });
  }
};

/** @type { ActionOptions } */
export const options = {
  actionType: "custom",
  returnType: true,
  triggers: { api: false, sendResetPassword: true },
};
