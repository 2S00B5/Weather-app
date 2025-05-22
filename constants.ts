export const OPENWEATHERMAP_API_KEY = process.env.API_KEY;
export const OPENWEATHERMAP_BASE_URL = "https://api.openweathermap.org/data/2.5";

interface WeatherGradientColors {
  from: string;
  via?: string;
  to: string;
}

export const WEATHER_GRADIENT_COLORS: { [key: string]: WeatherGradientColors } = {
  Clear: { from: '#fde68a', via: '#fef3c7', to: '#fffbeb' }, // Pale yellows (previously Haze)
  Clouds: { from: '#d1d5db', via: '#e5e7eb', to: '#f3f4f6' }, // Light Grays
  Rain: { from: '#3b82f6', via: '#60a5fa', to: '#93c5fd' }, // Blues
  Drizzle: { from: '#a5f3fc', via: '#cffafe', to: '#e0f2fe' }, // Light blues
  Thunderstorm: { from: '#4b0082', via: '#3730a3', to: '#1e1b4b' }, // Dark purples/blues
  Snow: { from: '#e0f2fe', via: '#f0f9ff', to: '#f8fafc' }, // Light icy blues/whites
  Mist: { from: '#e5e7eb', via: '#f3f4f6', to: '#f9fafb' }, // Light grays
  Smoke: { from: '#6b7280', via: '#9ca3af', to: '#d1d5db' }, // Grays
  Haze: { from: '#0ea5e9', via: '#67e8f9', to: '#a5f3fc' }, // Sky blues (previously Clear)
  Dust: { from: '#eab308', via: '#facc15', to: '#fde047' }, // Yellows/browns
  Fog: { from: '#d1d5db', via: '#e5e7eb', to: '#f9fafb' }, // Same as Mist
  Sand: { from: '#f59e0b', via: '#fbbf24', to: '#fcd34d' }, // Sandy yellows
  Ash: { from: '#4b5563', via: '#6b7280', to: '#9ca3af' }, // Dark grays
  Squall: { from: '#1e3a8a', via: '#2563eb', to: '#3b82f6' }, // Darker blues
  Tornado: { from: '#1f2937', via: '#374151', to: '#4b5563' }, // Very dark grays
  Default: { from: '#4f46e5', via: '#7c3aed', to: '#a78bfa' } // Indigo/Purple
};

export const WEATHER_TEXT_COLOR: { [key: string]: string } = {
  Clear: "text-amber-800", // Amber text for pale yellow sky (previously Haze's text color)
  Clouds: "text-slate-800", // Darker for lighter clouds
  Rain: "text-blue-100",
  Drizzle: "text-sky-700", 
  Thunderstorm: "text-purple-200", 
  Snow: "text-blue-800", 
  Mist: "text-slate-700", 
  Smoke: "text-neutral-200",
  Haze: "text-sky-900", // Dark blue text for sky blue background (previously Clear's text color)
  Dust: "text-orange-800", 
  Fog: "text-gray-700", 
  Sand: "text-yellow-800", 
  Ash: "text-zinc-200", 
  Squall: "text-cyan-100",
  Tornado: "text-red-200", 
  Default: "text-white",
};

// Mapping Tailwind classes to actual CSS color values for react-animated-weather
export const TAILWIND_TO_CSS_COLOR_MAP: { [key: string]: string } = {
  "text-yellow-100": "#fef9c3",
  "text-yellow-800": "#92400e",
  "text-gray-900": "#111827",
  "text-gray-700": "#374151",
  "text-blue-100": "#dbeafe",
  "text-blue-800": "#1e40af",
  "text-sky-700": "#0369a1",
  "text-sky-900": "#0c4a6e", 
  "text-purple-200": "#e9d5ff",
  "text-slate-700": "#334155",
  "text-slate-800": "#1e293b", 
  "text-neutral-200": "#e5e5e5",
  "text-amber-800": "#92400e", // This one already existed for Haze and Dust, now also for Clear
  "text-orange-800": "#9a3412",
  "text-zinc-200": "#e4e4e7",
  "text-cyan-100": "#cffafe",
  "text-red-200": "#fecaca",
  "text-white": "#ffffff",
};
