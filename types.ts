
export interface Weather {
  id: number;
  main: string; // e.g., "Clear", "Clouds", "Rain"
  description: string;
  icon: string; // Icon ID
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface WindData {
  speed: number;
  deg: number;
  gust?: number;
}

export interface CurrentWeatherDataResponse {
  coord: { lon: number; lat: number };
  weather: Weather[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: WindData;
  clouds: { all: number };
  rain?: { "1h"?: number; "3h"?: number };
  snow?: { "1h"?: number; "3h"?: number };
  dt: number; // Timestamp
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number; // City ID
  name: string; // City Name
  cod: number;
}

export interface ForecastListItem {
  dt: number;
  main: MainWeatherData & { temp_kf?: number };
  weather: Weather[];
  clouds: { all: number };
  wind: WindData;
  visibility: number;
  pop: number; // Probability of precipitation
  rain?: { "3h"?: number };
  snow?: { "3h"?: number };
  sys: { pod: string }; // Part of the day (n - night, d - day)
  dt_txt: string; // "2024-07-30 12:00:00"
}

export interface CityData {
  id: number;
  name: string;
  coord: { lat: number; lon: number };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface ForecastDataResponse {
  cod: string;
  message: number;
  cnt: number; // Number of timestamps returned
  list: ForecastListItem[];
  city: CityData;
}

export interface ApiError {
  cod: string;
  message: string;
}
