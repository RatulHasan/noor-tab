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
          msg = "Location access denied by user.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Location request timed out.";
        }
        reject(new Error(msg));
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
    );
  });
}
