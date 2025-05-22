import React, { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  history?: string[];
  onSuggestionClick?: (city: string) => void;
}

const HistoryIcon: React.FC<{ className?: string }> = ({
  className = "h-4 w-4",
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  history = [],
  onSuggestionClick,
}) => {
  const [cityInput, setCityInput] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cityInput.trim()) {
      onSearch(cityInput.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city: string) => {
    setCityInput(city);
    if (onSuggestionClick) {
      onSuggestionClick(city);
    } else {
      onSearch(city); // Fallback if onSuggestionClick is not provided
    }
    setShowSuggestions(false);
  };

  return (
    <div
      className="w-full max-w-md mx-auto mb-6 sm:mb-8 relative"
      ref={searchBarRef}
    >
      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-2 w-full p-1 bg-white/15 backdrop-blur-lg rounded-full shadow-xl"
      >
        <input
          type="text"
          value={cityInput}
          onChange={(e) => {
            setCityInput(e.target.value);
            if (e.target.value.length > 0 && history.length > 0) {
              setShowSuggestions(true);
            } else if (e.target.value.length === 0 && history.length > 0) {
              setShowSuggestions(true); // Show all history if input is cleared but still focused
            } else {
              setShowSuggestions(false);
            }
          }}
          onFocus={() => history.length > 0 && setShowSuggestions(true)}
          placeholder="Enter city name"
          className="flex-grow p-2.5 pl-4 text-base sm:p-3 sm:pl-6 sm:text-lg bg-transparent text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/60 rounded-full"
          disabled={isLoading}
          aria-haspopup="listbox"
          aria-expanded={showSuggestions}
        />
        <button
          type="submit"
          disabled={isLoading || !cityInput.trim()}
          className="bg-white/30 hover:bg-white/50 text-white font-semibold py-2.5 px-4 text-base sm:py-3 sm:px-6 sm:text-lg rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-white mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Search"
          )}
        </button>
      </form>
      {showSuggestions && history.length > 0 && (
        <ul
          className="absolute top-full left-0 right-0 mt-1 bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg shadow-2xl z-10 overflow-hidden max-h-60 overflow-y-auto"
          role="listbox"
        >
          {history.map((item, index) => (
            <li key={index}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(item);
                }}
                className="w-full flex items-center space-x-2 text-left px-4 py-2.5 text-white hover:bg-white/40 transition-colors duration-150 ease-in-out text-sm"
                role="option"
                aria-selected={false}
              >
                <HistoryIcon className="h-4 w-4 text-white/70 flex-shrink-0" />
                <span>{item}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
