import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://pitstop2.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    "signed-in": {
      storageKey: "signed-in",
      default: {
        read: true,
        action: true,
      },
      models: {
        booking: {
          read: {
            filter:
              "accessControl/filters/booking/signed-in-read.gelly",
          },
          actions: {
            create: true,
            delete: {
              filter:
                "accessControl/filters/booking/signed-in-delete.gelly",
            },
            update: {
              filter:
                "accessControl/filters/booking/signed-in-update.gelly",
            },
          },
        },
        parkingSpace: {
          read: true,
          actions: {
            create: true,
            delete: {
              filter:
                "accessControl/filters/parkingSpace/signed-in-delete.gelly",
            },
            update: {
              filter:
                "accessControl/filters/parkingSpace/signed-in-update.gelly",
            },
          },
        },
        session: {
          read: true,
        },
        user: {
          read: true,
          actions: {
            changePassword: {
              filter: "accessControl/filters/user/tenant.gelly",
            },
            signOut: {
              filter: "accessControl/filters/user/tenant.gelly",
            },
          },
        },
      },
      actions: {
        chat: true,
      },
    },
    unauthenticated: {
      storageKey: "unauthenticated",
      models: {
        booking: {
          read: true,
        },
        parkingSpace: {
          read: true,
        },
        user: {
          read: true,
          actions: {
            resetPassword: true,
            sendResetPassword: true,
            sendVerifyEmail: true,
            signIn: true,
            signUp: true,
            verifyEmail: true,
          },
        },
      },
    },
    "can-see": {
      storageKey: "J7DgvMW7tGCf",
      models: {
        booking: {
          read: true,
        },
        parkingSpace: {
          read: true,
        },
        session: {
          read: true,
        },
        user: {
          read: true,
          actions: {
            resetPassword: true,
            sendResetPassword: true,
            sendVerifyEmail: true,
            signIn: true,
            signUp: true,
            verifyEmail: true,
          },
        },
      },
    },
  },
};
