import { useState } from "react";
import "./App.css";

import SearchBar from "./SearchBar";
import WeatherCard from "./WeatherCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

import fetchgeolocation from "./fetchgeolocation";

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(city) {
    setLoading(true);
    setError("");
    setWeather(null);

    const result = await fetchgeolocation(city);

    if (result.error) {
      setError(result.error);
    } else {
      setWeather(result);
    }

    setLoading(false);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌤 Weather App</h1>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} />

        {loading && <LoadingSpinner />}

        {error && <ErrorMessage message={error} />}

        {weather && (
          <WeatherCard
            city={weather.city}
            temp={weather.current_weather.temperature}
            WindSpeed={`${weather.current_weather.windspeed} km/h`}
            WindDirection={`${weather.current_weather.winddirection}°`}
            WeatherCode={weather.current_weather.weathercode}
            Interval={`${weather.current_weather.interval} seconds`}
          />
        )}
      </main>
    </div>
  );
}

export default App;
