import { useState } from "react";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!city.trim()) {
      return;
    }

    onSearch(city);

    setCity("");
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label htmlFor="city" className="sr-only">
        City Name
      </label>

      <span className="search-icon" aria-hidden="true">
        🔍
      </span>

      <input
        id="city"
        type="text"
        className="search-input"
        placeholder="Search for a city..."
        autoComplete="off"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
