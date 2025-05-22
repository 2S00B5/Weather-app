
import { TAILWIND_TO_CSS_COLOR_MAP } from '../constants';
import { ForecastListItem } from '../types';

// Using metric units (Celsius) by default from API.

export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°C`;
};

export const formatSpeed = (speed: number): string => {
  // Assuming speed is in m/s, convert to km/h
  return `${Math.round(speed * 3.6)} km/h`;
};

export const formatTimestampToLocaleString = (timestamp: number, timezoneOffset: number, options: Intl.DateTimeFormatOptions): string => {
  // Convert UTC timestamp and offset to local time of the city
  const localTimestamp = (timestamp + timezoneOffset) * 1000;
  const date = new Date(localTimestamp);
  // To get the city's local time, we format it as UTC then it correctly reflects the city's time because we already adjusted by timezoneOffset
  return date.toLocaleTimeString('en-US', {...options, timeZone: 'UTC'});
};

export const formatDtToDayDate = (dt: number, timezone: number): string => {
  const date = new Date((dt + timezone) * 1000); // Apply timezone offset for correct date
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
};


export const formatDtTxtToHour = (dt_txt: string): string => {
  const date = new Date(dt_txt);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
};

export const formatDtTxtToDayName = (dt_txt: string): string => {
  // dt_txt is like "2024-07-30 12:00:00" and is in UTC
  // Parse as UTC by appending 'Z' after replacing space with 'T'
  const date = new Date(dt_txt.replace(" ", "T") + "Z"); 
  return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }); // Format in UTC to get correct day
};

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const tailwindToCssColor = (tailwindClass: string, fallbackColor: string = '#1f2937'): string => {
  return TAILWIND_TO_CSS_COLOR_MAP[tailwindClass] || fallbackColor;
};

export const processForecastForDailyView = (list: ForecastListItem[]): ForecastListItem[] => {
  if (!list || list.length === 0) return [];

  const dailyForecastsMap = new Map<string, ForecastListItem>();

  for (const item of list) {
    const dateKey = item.dt_txt.substring(0, 10); // YYYY-MM-DD

    if (!dailyForecastsMap.has(dateKey)) {
      // If this date is not yet in the map, add this item (it's the earliest for this day we've seen)
      dailyForecastsMap.set(dateKey, item);
    } else {
      // If date already exists, check if current item is closer to midday (12:00 or 15:00)
      // This aims to get a representative forecast for the day.
      const existingItemHour = parseInt(dailyForecastsMap.get(dateKey)!.dt_txt.substring(11, 13), 10);
      const currentItemHour = parseInt(item.dt_txt.substring(11, 13), 10);

      const preferredHours = [12, 15]; // Prefer 12 PM or 3 PM forecasts
      const existingIsPreferred = preferredHours.includes(existingItemHour);
      const currentIsPreferred = preferredHours.includes(currentItemHour);

      if (currentIsPreferred && !existingIsPreferred) {
        // If current item is a preferred hour and existing wasn't, update.
        dailyForecastsMap.set(dateKey, item);
      } else if (currentIsPreferred && existingIsPreferred) {
        // If both are preferred hours, pick the one closer to 12 PM (arbitrary choice for consistency).
        if (Math.abs(currentItemHour - 12) < Math.abs(existingItemHour - 12)) {
          dailyForecastsMap.set(dateKey, item);
        }
      }
      // If current is not preferred and existing is, do nothing (keep existing preferred).
      // If neither are preferred, the first one encountered for the day is kept.
    }
  }
  // Convert map values to array, sort by date, and ensure we only take up to 5 days.
  // The API should provide 5 days of data with cnt=40.
  return Array.from(dailyForecastsMap.values())
    .sort((a, b) => new Date(a.dt_txt).getTime() - new Date(b.dt_txt).getTime())
    .slice(0, 5);
};

export const formatProbability = (pop: number): string => {
  return `${Math.round(pop * 100)}%`;
};
