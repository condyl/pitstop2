import { Client } from "@gadget-client/pitstop2";

/**
 
 * The API client instance configured for the current environment. 
 * @description Provides access to the Pitstop2 API for:
 *  - Running model actions (create, update, delete)
 *  - Executing global actions
 *  - Managing file uploads
 *  - Making authenticated API requests
 *
 * @type {Client} 
 */
export const api = new Client({ 
  environment: typeof window !== 'undefined' && window.gadgetConfig?.environment 
    ? window.gadgetConfig.environment 
    : 'development'
});
