export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "NoorTab-Browser-Extension/1.0",
        },
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    const address = data.address;
    if (!address) return null;
    
    // Fallback order for city name
    return (
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.suburb ||
      address.county ||
      address.state ||
      null
    );
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    return null;
  }
}

export async function geocodeLocation(
  city: string,
  country: string
): Promise<{ lat: number; lng: number; cityName: string } | null> {
  try {
    const query = encodeURIComponent(`${city}, ${country}`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "NoorTab-Browser-Extension/1.0",
        },
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (!data || data.length === 0) return null;

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    
    // Extract short city name or use display_name
    const displayName = data[0].display_name;
    const cityName = displayName.split(",")[0] || city;

    return { lat, lng, cityName };
  } catch (e) {
    console.error("Geocoding query failed:", e);
    return null;
  }
}

export function detectLocation(): Promise<{
  lat: number;
  lng: number;
  cityName: string | null;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        let cityName: string | null = null;
        try {
          cityName = await reverseGeocode(lat, lng);
        } catch (e) {
          console.error("Failed to reverse geocode coords", e);
        }
        resolve({ lat, lng, cityName });
      },
      (error) => {
        let msg = "Failed to detect location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission is blocked. Please click the site settings/lock icon in your browser address bar to allow location access, or configure it manually using City and Country.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Location information is unavailable. Please check your system settings.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Location request timed out. Please try again or input manually.";
        }
        reject(new Error(msg));
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
    );
  });
}

/**
 * Returns a Date object adjusted to the estimated timezone of the given coordinates (based on longitude).
 * This ensures calendar dates and events update correctly to the selected city's timezone.
 */
export function getCoordinatesLocalDate(coordinates: { lat: number; lng: number } | null, baseDate: Date = new Date()): Date {
  if (!coordinates) return baseDate;
  
  const estimatedOffsetHours = Math.round(coordinates.lng / 15);
  const utcTime = baseDate.getTime() + (baseDate.getTimezoneOffset() * 60 * 1000);
  return new Date(utcTime + (estimatedOffsetHours * 60 * 60 * 1000));
}
