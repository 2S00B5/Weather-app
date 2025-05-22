import React from "react";
import { ForecastDataResponse } from "../types";
import ForecastItem from "./ForecastItem";

interface ForecastDisplayProps {
  data: ForecastDataResponse;
  textColorClass: string;
  title: string;
  displayMode: "hourly" | "daily";
}

const ForecastDisplay: React.FC<ForecastDisplayProps> = ({
  data,
  textColorClass,
  title,
  displayMode,
}) => {
  if (!data || !data.list || data.list.length === 0) {
    return (
      <p className={`text-center ${textColorClass}`}>
        No forecast data available for {title.toLowerCase()}.
      </p>
    );
  }

  // Both hourly and daily displays now use a vertical stack of dropdowns.
  const containerClasses =
    "flex flex-col space-y-2 sm:space-y-3 w-full max-w-lg mx-auto";

  return (
    <div className="w-full max-w-5xl mx-auto mt-4">
      <h3
        className={`text-lg sm:text-xl font-semibold mb-3 text-center ${textColorClass}`}
      >
        {title}
      </h3>
      <div className={containerClasses}>
        {data.list.map((item, index) => (
          <ForecastItem
            key={item.dt_txt + index}
            item={item}
            textColorClass={textColorClass}
            displayMode={displayMode}
          />
        ))}
      </div>
    </div>
  );
};

export default ForecastDisplay;
