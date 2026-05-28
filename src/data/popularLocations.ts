export interface PopularCity {
  name: string;
  lat: number;
  lng: number;
}

export interface PopularCountry {
  countryName: string;
  countryCode: string;
  cities: PopularCity[];
}

export const POPULAR_LOCATIONS: PopularCountry[] = [
  {
    countryName: "Bangladesh",
    countryCode: "BD",
    cities: [
      { name: "Dhaka", lat: 23.8103, lng: 90.4125 },
      { name: "Chittagong", lat: 22.3569, lng: 91.7832 },
      { name: "Sylhet", lat: 24.8949, lng: 91.8687 },
      { name: "Rajshahi", lat: 24.3745, lng: 88.6042 },
      { name: "Khulna", lat: 22.8456, lng: 89.5403 },
      { name: "Barisal", lat: 22.7010, lng: 90.3535 },
      { name: "Rangpur", lat: 25.7508, lng: 89.2519 },
      { name: "Mymensingh", lat: 24.7471, lng: 90.4203 },
      { name: "Jhenaidah", lat: 23.5448, lng: 89.1539 }
    ]
  },
  {
    countryName: "Saudi Arabia",
    countryCode: "SA",
    cities: [
      { name: "Makkah", lat: 21.4225, lng: 39.8262 },
      { name: "Madinah", lat: 24.4672, lng: 39.6111 },
      { name: "Riyadh", lat: 24.7136, lng: 46.6753 },
      { name: "Jeddah", lat: 21.5433, lng: 39.1728 },
      { name: "Dammam", lat: 26.4207, lng: 50.0888 }
    ]
  },
  {
    countryName: "United Arab Emirates",
    countryCode: "AE",
    cities: [
      { name: "Dubai", lat: 25.2048, lng: 55.2708 },
      { name: "Abu Dhabi", lat: 24.4539, lng: 54.3773 },
      { name: "Sharjah", lat: 25.3463, lng: 55.4209 }
    ]
  },
  {
    countryName: "Pakistan",
    countryCode: "PK",
    cities: [
      { name: "Karachi", lat: 24.8607, lng: 67.0011 },
      { name: "Lahore", lat: 31.5204, lng: 74.3587 },
      { name: "Islamabad", lat: 33.6844, lng: 73.0479 },
      { name: "Faisalabad", lat: 31.4504, lng: 73.1350 },
      { name: "Peshawar", lat: 34.0151, lng: 71.5249 },
      { name: "Multan", lat: 30.1575, lng: 71.5249 }
    ]
  },
  {
    countryName: "India",
    countryCode: "IN",
    cities: [
      { name: "Delhi", lat: 28.6139, lng: 77.2090 },
      { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
      { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
      { name: "Chennai", lat: 13.0827, lng: 80.2707 },
      { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
      { name: "Hyderabad", lat: 17.3850, lng: 78.4867 }
    ]
  },
  {
    countryName: "Indonesia",
    countryCode: "ID",
    cities: [
      { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
      { name: "Surabaya", lat: -7.2575, lng: 112.7521 },
      { name: "Bandung", lat: -6.9175, lng: 107.6191 },
      { name: "Medan", lat: 3.5952, lng: 98.6722 }
    ]
  },
  {
    countryName: "Malaysia",
    countryCode: "MY",
    cities: [
      { name: "Kuala Lumpur", lat: 3.1390, lng: 101.6869 },
      { name: "Penang", lat: 5.4141, lng: 100.3288 },
      { name: "Johor Bahru", lat: 1.4854, lng: 103.7618 }
    ]
  },
  {
    countryName: "Turkey",
    countryCode: "TR",
    cities: [
      { name: "Istanbul", lat: 41.0082, lng: 28.9784 },
      { name: "Ankara", lat: 39.9334, lng: 32.8597 },
      { name: "Izmir", lat: 38.4237, lng: 27.1428 }
    ]
  },
  {
    countryName: "Egypt",
    countryCode: "EG",
    cities: [
      { name: "Cairo", lat: 30.0444, lng: 31.2357 },
      { name: "Alexandria", lat: 31.2001, lng: 29.9187 }
    ]
  },
  {
    countryName: "United Kingdom",
    countryCode: "GB",
    cities: [
      { name: "London", lat: 51.5074, lng: -0.1278 },
      { name: "Birmingham", lat: 52.4862, lng: -1.8904 },
      { name: "Manchester", lat: 53.4808, lng: -2.2426 },
      { name: "Glasgow", lat: 55.8642, lng: -4.2518 }
    ]
  },
  {
    countryName: "United States",
    countryCode: "US",
    cities: [
      { name: "New York", lat: 40.7128, lng: -74.0060 },
      { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
      { name: "Chicago", lat: 41.8781, lng: -87.6298 },
      { name: "Houston", lat: 29.7604, lng: -95.3698 },
      { name: "Washington D.C.", lat: 38.9072, lng: -77.0369 }
    ]
  },
  {
    countryName: "Canada",
    countryCode: "CA",
    cities: [
      { name: "Toronto", lat: 43.6532, lng: -79.3832 },
      { name: "Montreal", lat: 45.5017, lng: -73.5673 },
      { name: "Vancouver", lat: 49.2827, lng: -123.1207 }
    ]
  }
];
