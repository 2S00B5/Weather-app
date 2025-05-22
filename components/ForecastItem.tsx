import React, { useState } from "react";
import { ForecastListItem } from "../types";
import WeatherIcon from "./WeatherIcon";
import {
  formatTemperature,
  capitalizeFirstLetter,
  formatDtTxtToDayName,
  formatDtTxtToHour,
  formatSpeed,
  formatProbability,
} from "../utils/helpers";

interface ForecastItemProps {
  item: ForecastListItem;
  textColorClass: string;
  displayMode: "hourly" | "daily";
}

const ForecastItem: React.FC<ForecastItemProps> = ({
  item,
  textColorClass,
  displayMode,
}) => {
  const { dt_txt, main, weather, wind, pop } = item;
  const [isExpanded, setIsExpanded] = useState(false);

  const weatherDescription =
    weather.length > 0 ? capitalizeFirstLetter(weather[0].description) : "N/A";
  const weatherIconCode = weather.length > 0 ? weather[0].icon : "01d";
  const weatherMain = weather.length > 0 ? weather[0].main : "Clear";

  const timeOrDayDisplay =
    displayMode === "hourly"
      ? formatDtTxtToHour(dt_txt)
      : formatDtTxtToDayName(dt_txt);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const DetailItem: React.FC<{ label: string; value: string }> = ({
    label,
    value,
  }) => (
    <div
      className="flex justify-between text-xs w-full py-0.5"
      style={{ textShadow: "0 1px 1px rgba(0,0,0,0.1)" }}
    >
      <span className="opacity-80">{label}:</span>
      <span className="font-medium text-right pl-1">{value}</span>
    </div>
  );

  return (
    <div
      className={`bg-white/10 backdrop-blur-lg rounded-lg shadow-lg ${textColorClass} w-full transition-all duration-300 ease-in-out`}
    >
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/20 transition-colors duration-200 ease-in-out rounded-t-lg"
        onClick={handleToggleExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && handleToggleExpand()
        }
        aria-expanded={isExpanded}
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
      >
        <span className="font-semibold text-sm sm:text-base">
          {timeOrDayDisplay}
        </span>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <WeatherIcon
            owmIconCode={weatherIconCode}
            owmMain={weatherMain}
            altText={weatherDescription}
            size={"small"}
            textColorClass={textColorClass}
          />
          <span className="font-semibold text-sm sm:text-base">
            {formatTemperature(main.temp)}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded
            ? "max-h-screen opacity-100 p-3 border-t border-white/15 bg-black/5 backdrop-blur-sm rounded-b-lg"
            : "max-h-0 opacity-0 p-0 border-t-0"
        }`}
      >
        {isExpanded && (
          <div className="space-y-1">
            <p
              className="text-xs opacity-90 mb-1 sm:text-sm"
              style={{ textShadow: "0 1px 1px rgba(0,0,0,0.1)" }}
            >
              {weatherDescription}
            </p>
            <DetailItem
              label="Feels Like"
              value={formatTemperature(main.feels_like)}
            />
            <DetailItem label="Wind" value={formatSpeed(wind.speed)} />
            <DetailItem label="Humidity" value={`${main.humidity}%`} />
            <DetailItem label="Pressure" value={`${main.pressure} hPa`} />
            <DetailItem label="POP" value={formatProbability(pop)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ForecastItem;
