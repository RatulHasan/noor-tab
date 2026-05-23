const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

export function calculateQiblaDirection(lat: number, lng: number): number {
  // Convert coordinates to radians
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
  const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;

  const deltaLng = kaabaLngRad - lngRad;

  const y = Math.sin(deltaLng);
  const x =
    Math.cos(latRad) * Math.tan(kaabaLatRad) -
    Math.sin(latRad) * Math.cos(deltaLng);

  let qiblaRad = Math.atan2(y, x);
  let qiblaDeg = (qiblaRad * 180) / Math.PI;

  // Normalize to [0, 360)
  qiblaDeg = (qiblaDeg + 360) % 360;

  return Math.round(qiblaDeg * 100) / 100;
}

export function degreesToCardinal(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const val = Math.floor(degrees / 22.5 + 0.5);
  return directions[val % 16];
}
