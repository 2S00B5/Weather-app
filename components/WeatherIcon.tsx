import React from "react";
import ReactAnimatedWeather from "react-animated-weather";
import { tailwindToCssColor } from "../utils/helpers";

interface WeatherIconProps {
  owmIconCode: string;
  owmMain: string; // e.g. "Clear", "Rain", "Clouds"
  altText: string;
  size?: "small" | "medium" | "large";
  className?: string;
  textColorClass: string; // e.g. "text-yellow-900"
}

const mapOwmToReactAnimatedWeather = (
  owmIconCode: string,
  owmMain: string
): string => {
  const mainLower = owmMain.toLowerCase();
  const dayNight = owmIconCode.substring(2, 3); // "d" or "n"

  // Priority mapping based on owmMain for specific conditions
  if (mainLower.includes("thunderstorm")) return "RAIN"; // react-animated-weather lacks a dedicated thunderstorm icon
  if (mainLower.includes("drizzle")) return "RAIN";
  if (mainLower.includes("sleet")) return "SLEET";
  if (mainLower.includes("squall")) return "WIND";
  if (mainLower.includes("tornado")) return "WIND";

  const code = owmIconCode.substring(0, 2);
  switch (code) {
    case "01":
      return dayNight === "d" ? "CLEAR_DAY" : "CLEAR_NIGHT";
    case "02":
      return dayNight === "d" ? "PARTLY_CLOUDY_DAY" : "PARTLY_CLOUDY_NIGHT";
    case "03":
      return "CLOUDY";
    case "04":
      return "CLOUDY"; // Covers broken and overcast clouds
    case "09":
      return "RAIN"; // Shower rain
    case "10":
      return "RAIN"; // Rain
    // '11' (Thunderstorm) is typically handled by mainLower check above
    case "13":
      return "SNOW";
    case "50": // Atmosphere group (Mist, Smoke, Haze, Dust, Fog, Sand, Ash)
      if (mainLower.includes("fog")) return "FOG";
      if (mainLower.includes("mist")) return "FOG";
      if (mainLower.includes("haze")) return "FOG";
      if (mainLower.includes("smoke")) return "FOG"; // Representing as visibility issue
      if (mainLower.includes("dust")) return "FOG"; // Representing as visibility issue, could also be 'WIND'
      if (mainLower.includes("sand")) return "FOG"; // Representing as visibility issue, could also be 'WIND'
      if (mainLower.includes("ash")) return "FOG"; // Representing as visibility issue
      return "FOG"; // Default for '50' icon group if specific mainLower not matched
    default:
      // Fallback based on mainLower if icon code is unknown or not specific enough
      if (mainLower.includes("clear"))
        return dayNight === "d" ? "CLEAR_DAY" : "CLEAR_NIGHT";
      if (mainLower.includes("clouds")) return "CLOUDY";
      if (mainLower.includes("rain")) return "RAIN";
      if (mainLower.includes("snow")) return "SNOW";
      return "CLOUDY"; // A general default animated icon
  }
};

const WeatherIcon: React.FC<WeatherIconProps> = ({
  owmIconCode,
  owmMain,
  altText,
  size = "medium",
  className = "",
  textColorClass,
}) => {
  if (!owmIconCode || !owmMain) return null;

  const iconName = mapOwmToReactAnimatedWeather(owmIconCode, owmMain);
  const iconColor = tailwindToCssColor(textColorClass, "#1f2937"); // Default to a dark color

  let iconSizePx: number;
  switch (size) {
    case "small":
      iconSizePx = 32;
      break;
    case "large":
      iconSizePx = 80;
      break;
    case "medium":
    default:
      iconSizePx = 48;
      break;
  }

  // react-animated-weather's default color for some icons can be too light/dark depending on theme.
  // The passed 'iconColor' prop aims to make it consistent with text color.

  return (
    <div
      role="img"
      aria-label={altText}
      className={className}
      style={{ width: iconSizePx, height: iconSizePx }}
    >
      <ReactAnimatedWeather
        icon={iconName}
        color={iconColor}
        size={iconSizePx}
        animate={true}
      />
    </div>
  );
};

export default WeatherIcon;
