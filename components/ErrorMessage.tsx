import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorIcon: React.FC<{ className?: string }> = ({
  className = "h-6 w-6",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div
      className="bg-red-500/70 backdrop-blur-lg text-white p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-lg mx-auto flex items-start space-x-3 sm:space-x-4 animate-fadeInUp"
      role="alert"
    >
      <div className="flex-shrink-0 pt-0.5 sm:pt-1">
        <ErrorIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
      </div>
      <div>
        <p className="font-bold text-base sm:text-lg">
          Oops! Something went wrong.
        </p>
        <p className="text-sm sm:text-base">{message}</p>
        {message.includes("YOUR_OPENWEATHERMAP_API_KEY") && (
          <p className="mt-2 text-xs sm:text-sm">
            Please make sure you have replaced
            <code className="bg-red-800/60 px-1.5 py-0.5 rounded text-red-100 mx-1">
              YOUR_OPENWEATHERMAP_API_KEY
            </code>{" "}
            in
            <code className="bg-red-800/60 px-1.5 py-0.5 rounded text-red-100 mx-1">
              constants.ts
            </code>{" "}
            with your actual OpenWeatherMap API key. You can get one for free
            from{" "}
            <a
              href="https://openweathermap.org/appid"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-red-100 hover:text-white underline"
            >
              OpenWeatherMap
            </a>
            .
          </p>
        )}
        {message.includes("Failed to fetch") && (
          <p className="mt-2 text-xs sm:text-sm">
            Please check your internet connection or the city name and try
            again.
          </p>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
