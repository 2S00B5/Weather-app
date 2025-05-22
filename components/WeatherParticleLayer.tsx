import React from "react";

interface WeatherParticleLayerProps {
  weatherCondition: string | undefined;
}

const WeatherParticleLayer: React.FC<WeatherParticleLayerProps> = ({
  weatherCondition,
}) => {
  if (!weatherCondition) return null;

  const mainCondition = weatherCondition.toLowerCase();
  let particleClass = "";
  let particleCount = 0;
  let showThunderstormFlash = false;

  if (mainCondition.includes("rain") || mainCondition.includes("drizzle")) {
    particleClass = "rain-particle";
    particleCount = 50;
  } else if (
    mainCondition.includes("snow") ||
    mainCondition.includes("sleet")
  ) {
    particleClass = "snow-particle";
    particleCount = 70;
  } else if (mainCondition.includes("clear")) {
    particleClass = "shimmer-particle";
    particleCount = 30;
  } else if (mainCondition.includes("thunderstorm")) {
    // For thunderstorms, we can show rain particles and also trigger the flash effect.
    particleClass = "rain-particle"; // Show rain during thunderstorms
    particleCount = 60;
    // Randomly decide to show a flash to make it less predictable,
    // or you could tie this to a timer for more controlled flashes.
    // The CSS animation itself is already infrequent.
    showThunderstormFlash = true;
  } else {
    return null; // No specific particles for other conditions for now
  }

  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const style: React.CSSProperties = {
      left: `${Math.random() * 100}%`,
      animationDuration: `${
        mainCondition.includes("snow")
          ? Math.random() * 5 + 5
          : Math.random() * 0.5 + 0.5
      }s`, // Snow falls slower
      animationDelay: `${Math.random() * 5}s`,
      opacity: mainCondition.includes("shimmer")
        ? Math.random() * 0.5 + 0.3
        : Math.random() * 0.6 + 0.4, // Shimmer more varied
    };
    if (mainCondition.includes("shimmer")) {
      style.top = `${Math.random() * 100}%`; // Shimmers can be anywhere
      style.width = `${Math.random() * 3 + 1}px`;
      style.height = style.width;
    }
    if (mainCondition.includes("snow")) {
      style.width = `${Math.random() * 4 + 2}px`;
      style.height = style.width;
    }

    return (
      <div key={i} className={`particle ${particleClass}`} style={style}></div>
    );
  });

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }} // Positioned between clouds and content
    >
      {particles}
      {showThunderstormFlash && (
        <div className="thunderstorm-flash-overlay"></div>
      )}
    </div>
  );
};

export default WeatherParticleLayer;
