import React, { useState, useEffect, useCallback, useRef } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastDisplay from "./components/ForecastDisplay";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import WeatherParticleLayer from "./components/WeatherParticleLayer"; // Import new component
import { fetchCurrentWeather, fetchForecast } from "./services/weatherService";
import {
  CurrentWeatherDataResponse,
  ForecastDataResponse,
  ForecastListItem,
} from "./types";
import {
  WEATHER_GRADIENT_COLORS,
  WEATHER_TEXT_COLOR,
  OPENWEATHERMAP_API_KEY,
} from "./constants";
import { processForecastForDailyView } from "./utils/helpers";

type TabKey = "current" | "hourly" | "daily";

interface TabStyleProps {
  button: string;
  // text: string; // Text styling is now part of the button class or handled by dynamicTextColor
  // underline: string; // Replaced by pill background for active, or different hover effect
}

const MAX_HISTORY_ITEMS = 3;

const App: React.FC = () => {
  const [currentWeather, setCurrentWeather] =
    useState<CurrentWeatherDataResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastDataResponse | null>(null);
  const [dailyForecast, setDailyForecast] =
    useState<ForecastDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<string>("");
  const [searchCount, setSearchCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<TabKey>("current");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const appRef = useRef<HTMLDivElement>(null);
  const [gradientStyle, setGradientStyle] = useState<React.CSSProperties>({});
  const [dynamicTextColor, setDynamicTextColor] = useState<string>(
    WEATHER_TEXT_COLOR.Default
  );
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem("weatherSearchHistory");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const darkenHexColor = (hex: string, factor: number): string => {
    if (!hex || !hex.startsWith("#")) return hex;
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.max(0, Math.floor(r * (1 - factor)));
    g = Math.max(0, Math.floor(g * (1 - factor)));
    b = Math.max(0, Math.floor(b * (1 - factor)));

    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (appRef.current) {
        const x = event.clientX / window.innerWidth;
        const y = event.clientY / window.innerHeight;
        appRef.current.style.setProperty("--cursor-x", x.toString());
        appRef.current.style.setProperty("--cursor-y", y.toString());
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const animateDrift = (timestamp: number) => {
      if (appRef.current) {
        const driftX = Math.sin(timestamp * 0.00002) * 0.5;
        const driftY = Math.cos(timestamp * 0.000015) * 0.5;
        appRef.current.style.setProperty("--anim-drift-x", driftX.toString());
        appRef.current.style.setProperty("--anim-drift-y", driftY.toString());
      }
      animationFrameId.current = requestAnimationFrame(animateDrift);
    };
    animationFrameId.current = requestAnimationFrame(animateDrift);
    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  useEffect(() => {
    let baseGradientColors = WEATHER_GRADIENT_COLORS.Default;
    let textColor = WEATHER_TEXT_COLOR.Default;

    if (currentWeather?.weather?.length) {
      const mainWeather = currentWeather.weather[0].main;
      baseGradientColors =
        WEATHER_GRADIENT_COLORS[mainWeather] || WEATHER_GRADIENT_COLORS.Default;
      textColor = WEATHER_TEXT_COLOR[mainWeather] || WEATHER_TEXT_COLOR.Default;
    }

    setDynamicTextColor(textColor);

    const currentDarkeningFactor = Math.min(0.75, searchCount * 0.05);
    const { from: baseFrom, via: baseVia, to: baseTo } = baseGradientColors;

    const from = darkenHexColor(baseFrom, currentDarkeningFactor);
    const via = baseVia
      ? darkenHexColor(baseVia, currentDarkeningFactor)
      : undefined;
    const to = darkenHexColor(baseTo, currentDarkeningFactor);

    const dynamicAngleDeg = `calc(135deg + (var(--cursor-x, 0.5) - 0.5) * 40deg + (var(--anim-drift-x, 0)) * 25deg)`;
    const baseGradient = `linear-gradient(${dynamicAngleDeg}, ${from}, ${
      via || from
    }, ${to})`;

    const lensGradientPosition = `calc(var(--cursor-x, 0.5) * 100%) calc(var(--cursor-y, 0.5) * 100%)`;
    const lensGradient = `radial-gradient(circle at ${lensGradientPosition}, rgba(255,255,255,0.08) 0%, transparent 50%)`;

    const bgImage = `${lensGradient}, ${baseGradient}`;

    setGradientStyle({
      backgroundColor: from,
      backgroundImage: bgImage,
    });
  }, [currentWeather, searchCount]);

  const handleSearch = useCallback(async (city: string) => {
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    if (OPENWEATHERMAP_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
      setError(
        "API Key is missing or is the placeholder. Please configure your actual key in constants.ts."
      );
      setIsLoading(false);
      setActiveTab("current");
      setCurrentWeather(null);
      setForecast(null);
      setDailyForecast(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentCity(trimmedCity);
    setActiveTab("current");

    try {
      const [weatherData, forecastDataResponse] = await Promise.all([
        fetchCurrentWeather(trimmedCity),
        fetchForecast(trimmedCity),
      ]);
      setCurrentWeather(weatherData);

      const currentObservationTimeUtc = weatherData.dt;

      const relevantHourlyForecasts = forecastDataResponse.list.filter(
        (item) => item.dt >= currentObservationTimeUtc
      );
      setForecast({
        ...forecastDataResponse,
        list: relevantHourlyForecasts.slice(0, 8),
      });

      const dailyForecastList: ForecastListItem[] = processForecastForDailyView(
        forecastDataResponse.list
      );
      setDailyForecast({ ...forecastDataResponse, list: dailyForecastList });

      setSearchCount((prevCount) => prevCount + 1);

      setSearchHistory((prevHistory) => {
        const updatedHistory = [
          trimmedCity,
          ...prevHistory.filter(
            (item) => item.toLowerCase() !== trimmedCity.toLowerCase()
          ),
        ];
        return updatedHistory.slice(0, MAX_HISTORY_ITEMS);
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      setCurrentWeather(null);
      setForecast(null);
      setDailyForecast(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (appRef.current) {
      appRef.current.style.setProperty("--cursor-x", "0.5");
      appRef.current.style.setProperty("--cursor-y", "0.5");
      appRef.current.style.setProperty("--anim-drift-x", "0");
      appRef.current.style.setProperty("--anim-drift-y", "0");
    }

    const baseGradientColors = WEATHER_GRADIENT_COLORS.Default;
    setDynamicTextColor(WEATHER_TEXT_COLOR.Default);
    const initialDarkeningFactor = Math.min(0.75, 0 * 0.05);
    const from = darkenHexColor(
      baseGradientColors.from,
      initialDarkeningFactor
    );
    const via = baseGradientColors.via
      ? darkenHexColor(baseGradientColors.via, initialDarkeningFactor)
      : undefined;
    const to = darkenHexColor(baseGradientColors.to, initialDarkeningFactor);

    const defaultAngleDeg = `calc(135deg + (0.5 - 0.5) * 40deg + (0) * 25deg)`;
    const defaultBaseGradient = `linear-gradient(${defaultAngleDeg}, ${from}, ${
      via || from
    }, ${to})`;
    const defaultLensGradientPosition = `calc(0.5 * 100%) calc(0.5 * 100%)`;
    const defaultLensGradient = `radial-gradient(circle at ${defaultLensGradientPosition}, rgba(255,255,255,0.08) 0%, transparent 50%)`;
    const defaultBgImage = `${defaultLensGradient}, ${defaultBaseGradient}`;

    setGradientStyle({
      backgroundColor: from,
      backgroundImage: defaultBgImage,
    });

    if (
      !OPENWEATHERMAP_API_KEY ||
      OPENWEATHERMAP_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY"
    ) {
      setError(
        "Welcome! Please ensure your OpenWeatherMap API key is set in constants.ts, then search for a city."
      );
    } else {
      setError(null);
    }
  }, []);

  const getTabStyles = (tabKey: TabKey): string => {
    const baseButtonClasses = `relative group py-2.5 px-4 sm:px-5 text-sm sm:text-base font-medium transition-all duration-300 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-full`;

    let specificTextColorClass = dynamicTextColor;

    if (activeTab === tabKey) {
      return `${baseButtonClasses} ${specificTextColorClass} bg-white/25 scale-105 shadow-lg`;
    }
    return `${baseButtonClasses} ${specificTextColorClass} opacity-70 hover:opacity-100 hover:bg-white/10`;
  };

  return (
    <div
      ref={appRef}
      className={`min-h-screen w-full flex flex-col items-center p-4 sm:p-6 md:p-8 relative overflow-hidden`}
      style={{
        ...gradientStyle,
        transition:
          "background-image 1s ease-in-out, background-color 1s ease-in-out",
      }}
    >
      {/* Adjusted z-index for clouds to be behind particles */}
      <div className="cloud cloud1" style={{ zIndex: 0 }}></div>
      <div className="cloud cloud2" style={{ zIndex: 0 }}></div>
      <div className="cloud cloud3" style={{ zIndex: 0 }}></div>
      <div className="cloud cloud4" style={{ zIndex: 0 }}></div>
      <div className="cloud cloud5" style={{ zIndex: 0 }}></div>

      <WeatherParticleLayer
        weatherCondition={currentWeather?.weather?.[0]?.main}
      />

      <header className="w-full max-w-4xl mb-6 sm:mb-8 text-center relative z-[2]">
        <h1
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${dynamicTextColor} mb-1 sm:mb-2 drop-shadow-lg transition-colors duration-1000 ease-in-out`}
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.25)" }}
        >
          ForeCatcher
        </h1>
        <p
          className={`text-base sm:text-lg ${dynamicTextColor} opacity-90 drop-shadow-md transition-colors duration-1000 ease-in-out`}
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
        >
          Live Weather Forecast at your fingertips
        </p>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center relative z-[2]">
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          history={searchHistory}
          onSuggestionClick={handleSearch}
        />

        {isLoading && <LoadingSpinner textColorClass={dynamicTextColor} />}
        {error && !isLoading && <ErrorMessage message={error} />}

        {!isLoading && !error && (
          <>
            {(currentWeather || forecast || dailyForecast) && (
              <div className="flex justify-center space-x-1 sm:space-x-2 my-4 sm:my-6 relative z-[2] bg-black/10 backdrop-blur-sm p-1 rounded-full">
                <button
                  onClick={() => setActiveTab("current")}
                  className={getTabStyles("current")}
                  disabled={!currentWeather}
                  aria-pressed={activeTab === "current"}
                >
                  Current
                </button>
                <button
                  onClick={() => setActiveTab("hourly")}
                  className={getTabStyles("hourly")}
                  disabled={!forecast}
                  aria-pressed={activeTab === "hourly"}
                >
                  24-Hour
                </button>
                <button
                  onClick={() => setActiveTab("daily")}
                  className={getTabStyles("daily")}
                  disabled={!dailyForecast}
                  aria-pressed={activeTab === "daily"}
                >
                  5-Day
                </button>
              </div>
            )}

            <div key={activeTab} className="w-full animate-fadeInUp mt-2">
              {activeTab === "current" && currentWeather && (
                <WeatherCard
                  data={currentWeather}
                  textColorClass={dynamicTextColor}
                />
              )}
              {activeTab === "hourly" && forecast && (
                <ForecastDisplay
                  data={forecast}
                  textColorClass={dynamicTextColor}
                  title="Next 24 Hours Forecast"
                  displayMode="hourly"
                />
              )}
              {activeTab === "daily" && dailyForecast && (
                <ForecastDisplay
                  data={dailyForecast}
                  textColorClass={dynamicTextColor}
                  title="5-Day Forecast"
                  displayMode="daily"
                />
              )}
            </div>

            {!currentWeather &&
              !forecast &&
              !dailyForecast &&
              !currentCity &&
              OPENWEATHERMAP_API_KEY &&
              OPENWEATHERMAP_API_KEY !== "YOUR_OPENWEATHERMAP_API_KEY" &&
              !isLoading &&
              !error && (
                <p className={`${dynamicTextColor} text-lg sm:text-xl mt-8`}>
                  Hey There! Welcome to ForeCatcher 💖
                </p>
              )}
          </>
        )}
      </main>
      <footer
        className={`mt-auto pt-6 sm:pt-8 text-center ${dynamicTextColor} opacity-70 text-sm transition-colors duration-1000 ease-in-out relative z-[2]`}
      >
        <p>&copy; {new Date().getFullYear()} ForeCatcher App</p>
      </footer>
      <style>{`
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .cloud {
          position: absolute;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%); /* Slightly less opaque */
          border-radius: 50%;
          filter: blur(40px); /* Increased blur */
          will-change: transform, opacity;
          pointer-events: none; 
        }
        .cloud1 { width: 400px; height: 200px; top: 10%; left: -20%; animation: cloud-drift-1 90s linear infinite; opacity: 0.5; }
        .cloud2 { width: 300px; height: 150px; top: 60%; left: -30%; animation: cloud-drift-2 75s linear infinite 5s; opacity: 0.4; }
        .cloud3 { width: 500px; height: 250px; bottom: 5%; right: -25%; animation: cloud-drift-3 100s linear infinite 10s; background: radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 65%); filter: blur(50px); opacity: 0.55; }
        .cloud4 { width: 150vw; height: 100vh; top: 0; left: -25vw; background: radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%); filter: blur(65px); animation: cloud-drift-4 150s linear infinite 2s; opacity: 0.2; }
        .cloud5 { width: 350px; height: 180px; top: 30%; right: -15%; filter: blur(45px); background: radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%); animation: cloud-drift-5 80s linear infinite 7s; opacity: 0.45; }
        
        @keyframes cloud-drift-1 {
          0% { transform: translateX(-150%) translateY(0%) scale(1); }
          50% { transform: translateX(150%) translateY(-10%) scale(1.2); }
          100% { transform: translateX(-150%) translateY(0%) scale(1); } 
        }
        @keyframes cloud-drift-2 {
          0% { transform: translateX(-150%) translateY(10%) scale(0.9); }
          50% { transform: translateX(150%) translateY(0%) scale(1.1); }
          100% { transform: translateX(-150%) translateY(10%) scale(0.9); }
        }
        @keyframes cloud-drift-3 {
          0% { transform: translateX(150%) translateY(5%) scale(1.1); }
          50% { transform: translateX(-150%) translateY(-5%) scale(1); }
          100% { transform: translateX(150%) translateY(5%) scale(1.1); }
        }
        @keyframes cloud-drift-4 {
          0% { transform: translateX(-20%) translateY(0%) scale(1); }
          25% { transform: translateX(0%) translateY(-2%) scale(1.05); }
          50% { transform: translateX(20%) translateY(0%) scale(1); }
          75% { transform: translateX(0%) translateY(2%) scale(1.05); }
          100% { transform: translateX(-20%) translateY(0%) scale(1); }
        }
        @keyframes cloud-drift-5 {
          0% { transform: translateX(160%) translateY(-15%) scale(1); }
          50% { transform: translateX(-160%) translateY(10%) scale(1.15); }
          100% { transform: translateX(160%) translateY(-15%) scale(1); }
        }

        /* Particle Styles */
        .particle {
          position: absolute;
          border-radius: 50%;
          animation-name: fall; /* Default, override for specific particles */
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }

        .rain-particle {
          width: 1px;
          height: 15px; /* Elongated for rain */
          background-color: rgba(173, 216, 230, 0.6); /* Light blue, semi-transparent */
          animation-name: fall;
        }

        .snow-particle {
          width: 5px;
          height: 5px;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation-name: snowfall;
        }

        .shimmer-particle {
          width: 2px;
          height: 2px;
          background-color: rgba(255, 255, 224, 0.7); /* Light yellow */
          border-radius: 50%;
          animation-name: twinkle;
          opacity: 0; /* Start invisible for twinkle effect */
        }

        @keyframes fall {
          0% { transform: translateY(-20px) translateX(0); opacity: 1; }
          100% { transform: translateY(100vh) translateX(-20px); opacity: 0; } /* Slight diagonal fall */
        }

        @keyframes snowfall {
          0% { transform: translateY(-20px) translateX(0px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) translateX(50px) rotate(360deg); opacity: 0; } /* Slower, wider drift for snow */
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        /* Thunderstorm Flash Effect */
        .thunderstorm-flash-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(200, 200, 255, 0); /* Start transparent */
            z-index: 100; /* High z-index to cover everything */
            pointer-events: none; /* Allow interactions with elements underneath */
            animation: screenFlash 10s infinite ease-out; /* Adjust timing as needed */
        }

        @keyframes screenFlash {
            0%, 95%, 100% { background-color: rgba(200, 200, 255, 0); } /* Mostly transparent */
            95.5% { background-color: rgba(200, 200, 255, 0.3); } /* Quick flash */
            96% { background-color: rgba(200, 200, 255, 0.1); }
            96.5% { background-color: rgba(200, 200, 255, 0.4); } /* Second quick flash */
        }

      `}</style>
    </div>
  );
};

export default App;
