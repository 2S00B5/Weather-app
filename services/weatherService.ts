
import { OPENWEATHERMAP_API_KEY, OPENWEATHERMAP_BASE_URL } from '../constants';
import { CurrentWeatherDataResponse, ForecastDataResponse, ApiError } from '../types';

const handleResponse = async <T,>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const fetchCurrentWeather = async (city: string): Promise<CurrentWeatherDataResponse> => {
  if (OPENWEATHERMAP_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    throw new Error("Please replace 'YOUR_OPENWEATHERMAP_API_KEY' in constants.ts with your actual OpenWeatherMap API key.");
  }
  const response = await fetch(`${OPENWEATHERMAP_BASE_URL}/weather?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
  return handleResponse<CurrentWeatherDataResponse>(response);
};

export const fetchForecast = async (city: string): Promise<ForecastDataResponse> => {
   if (OPENWEATHERMAP_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    throw new Error("Please replace 'YOUR_OPENWEATHERMAP_API_KEY' in constants.ts with your actual OpenWeatherMap API key.");
  }
  // Request 40 timestamps for 5 days of 3-hourly data (5 * 8 = 40)
  const response = await fetch(`${OPENWEATHERMAP_BASE_URL}/forecast?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&cnt=40`); 
  return handleResponse<ForecastDataResponse>(response);
};