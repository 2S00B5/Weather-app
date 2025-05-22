import React from "react";
import { CurrentWeatherDataResponse } from "../types";
import WeatherIcon from "./WeatherIcon";
import {
  formatTemperature,
  formatSpeed,
  formatTimestampToLocaleString,
  capitalizeFirstLetter,
  formatDtToDayDate,
} from "../utils/helpers";

interface WeatherCardProps {
  data: CurrentWeatherDataResponse;
  textColorClass: string;
}

const WeatherInfoItem: React.FC<{
  label: string;
  value: string;
  icon?: React.ReactNode;
  textColorClass: string;
}> = ({ label, value, icon, textColorClass }) => (
  <div
    className={`flex flex-col items-center text-center p-1 sm:p-2 ${textColorClass}`}
  >
    {icon && <div className="mb-1">{icon}</div>}
    <span
      className="text-xs sm:text-sm opacity-80"
      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
    >
      {label}
    </span>
    <span
      className="font-semibold text-sm sm:text-base"
      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
    >
      {value}
    </span>
  </div>
);

const WeatherCard: React.FC<WeatherCardProps> = ({ data, textColorClass }) => {
  const { name, main, weather, wind, dt, timezone, sys } = data;

  const weatherDescription =
    weather.length > 0 ? capitalizeFirstLetter(weather[0].description) : "N/A";
  const weatherIconCode = weather.length > 0 ? weather[0].icon : "01d"; // Default to clear day icon if not available
  const weatherMain = weather.length > 0 ? weather[0].main : "Clear"; // Default to Clear if not available

  return (
    <div
      className={`bg-white/15 backdrop-blur-lg p-4 sm:p-5 md:p-6 rounded-xl shadow-2xl w-full max-w-lg mx-auto text-center ${textColorClass} transition-all duration-500 ease-in-out transform hover:scale-105`}
    >
      <div className="mb-3 sm:mb-4">
        <h2
          className="text-2xl sm:text-3xl font-bold drop-shadow-md"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
        >
          {name}, {sys.country}
        </h2>
        <p
          className="text-xs sm:text-sm opacity-80 drop-shadow-sm"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
        >
          {formatDtToDayDate(dt, timezone)}
        </p>
        <p
          className="text-xs sm:text-sm opacity-80 drop-shadow-sm"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
        >
          Local Time:{" "}
          {formatTimestampToLocaleString(dt, timezone, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-around mb-4 sm:mb-6">
        <div className="flex flex-col items-center">
          <WeatherIcon
            owmIconCode={weatherIconCode}
            owmMain={weatherMain}
            altText={weatherDescription}
            size="large"
            textColorClass={textColorClass}
          />
          <p
            className="text-lg sm:text-xl font-medium mt-1 sm:mt-2 drop-shadow-sm"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
          >
            {weatherDescription}
          </p>
        </div>
        <div
          className={`text-4xl xs:text-5xl sm:text-6xl font-light my-3 md:my-0 md:ml-4 ${textColorClass} drop-shadow-lg`}
          style={{ textShadow: "0 2px 5px rgba(0,0,0,0.2)" }}
        >
          {formatTemperature(main.temp)}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-sm">
        <WeatherInfoItem
          label="Feels Like"
          value={formatTemperature(main.feels_like)}
          textColorClass={textColorClass}
        />
        <WeatherInfoItem
          label="Humidity"
          value={`${main.humidity}%`}
          textColorClass={textColorClass}
        />
        <WeatherInfoItem
          label="Wind Speed"
          value={formatSpeed(wind.speed)}
          textColorClass={textColorClass}
        />
        <WeatherInfoItem
          label="Pressure"
          value={`${main.pressure} hPa`}
          textColorClass={textColorClass}
        />
        <WeatherInfoItem
          label="Sunrise"
          value={formatTimestampToLocaleString(sys.sunrise, timezone, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
          textColorClass={textColorClass}
        />
        <WeatherInfoItem
          label="Sunset"
          value={formatTimestampToLocaleString(sys.sunset, timezone, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
          textColorClass={textColorClass}
        />
        <WeatherInfoItem
          label="Min Temp"
          value={formatTemperature(main.temp_min)}
          textColorClass={textColorClass}
        />
        <WeatherInfoItem
          label="Max Temp"
          value={formatTemperature(main.temp_max)}
          textColorClass={textColorClass}
        />
      </div>
    </div>
  );
};

export default WeatherCard;
