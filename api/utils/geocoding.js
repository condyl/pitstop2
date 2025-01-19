import { logger } from "gadget-server";

export class GeocodingError extends Error {
  constructor(message) {
    super(message);
    this.name = "GeocodingError";
  }
}

export class InvalidAddressError extends GeocodingError {
  constructor(message) {
    super(message);
    this.name = "InvalidAddressError";
  }
}

export class LowRelevanceError extends GeocodingError {
  constructor(message) {
    super(message);
    this.name = "LowRelevanceError";
  }
}

const ONTARIO_BOUNDS = "-95.16,41.67,-74.34,56.86";
const MIN_RELEVANCE_SCORE = 0.8;

const validateAddressComponents = (feature) => {
  if (!feature.place_type?.includes("address")) {
    throw new InvalidAddressError("Result is not a street address");
  }

  const context = feature.context || [];
  const hasPostcode = context.some(item => item.id?.startsWith("postcode"));
  const hasOntario = context.some(item => 
    item.id?.startsWith("region") && 
    (item.text === "Ontario" || item.text === "ON")
  );
  const hasCanada = context.some(item => 
    item.id?.startsWith("country") && 
    item.text === "Canada"
  );

  if (!hasPostcode) {
    throw new InvalidAddressError("Address must include a postal code");
  }
  if (!hasOntario) {
    throw new InvalidAddressError("Address must be in Ontario");
  }
  if (!hasCanada) {
    throw new InvalidAddressError("Address must be in Canada");
  }
};

/**
 * Geocodes an address string to latitude and longitude coordinates using Mapbox's Geocoding API
 * @param {string} address - The address to geocode
 * @returns {Promise<{latitude: number, longitude: number}>} The coordinates for the address
 * @throws {GeocodingError} If geocoding fails or returns invalid results
 */
export async function geocodeAddress(address) {
  // Validate inputs
  if (!address || typeof address !== "string" || !address.trim()) {
    throw new GeocodingError("Address is required");
  }

  const token = process.env.MAPBOX_TOKEN;
  if (!token) {
    throw new GeocodingError("Mapbox API token is not configured");
  }

  try {
    // Encode the address for the URL
    const encodedAddress = encodeURIComponent(address.trim());
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?` + 
      `access_token=${token}` +
      `&country=ca` +
      `&types=address` +
      `&limit=1` +
      `&bbox=${ONTARIO_BOUNDS}`;
    
    logger.debug({ url }, "Geocoding request URL");
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new GeocodingError(`Geocoding request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      throw new GeocodingError("No coordinates found for the provided address");
    }

    const feature = data.features[0];
    
    if (feature.relevance < MIN_RELEVANCE_SCORE) {
      throw new LowRelevanceError(
        `Address match not confident enough (score: ${feature.relevance})`
      );
    }
    
    validateAddressComponents(feature);
    const [longitude, latitude] = feature.center;
    return { latitude, longitude };
  } catch (error) {
    logger.error({ err: error, address }, "Geocoding failed");
    if (error instanceof GeocodingError) throw error;
    throw new GeocodingError("Failed to geocode address");
  }
}
