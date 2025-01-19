/** @type { ActionRun } */
import { ActionOptions } from "gadget-server";

export const run = async ({ params, logger, api, connections }) => {
  logger.info("Starting makeAllUsersAdmins action");
  
  let processedCount = 0;
  let updatedCount = 0;
  let currentPage = await api.user.findMany({
    select: {
      id: true,
      roles: true
    },
    first: 100
  });
  
  do {
    for (const user of currentPage) {
      processedCount++;
      const hasAdminRole = user.roles.some(role => role.key === "system-admin");
      
      if (!hasAdminRole) {
        await api.user.update(user.id, {
          roles: [...user.roles.map(r => r.key), "system-admin"]
        });
        updatedCount++;
      }
    }
    
    currentPage = currentPage.hasNextPage ? await currentPage.nextPage() : null;
  } while (currentPage);

  logger.info(`Completed makeAllUsersAdmins action. Processed ${processedCount} users, updated ${updatedCount} users`);
  return { processedCount, updatedCount };
};

export const options = {
  permissions: {
    role: "system-admin"
  }
};