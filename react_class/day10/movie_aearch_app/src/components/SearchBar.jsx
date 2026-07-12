import "../css/SearchBar.css";

function SearchBar({ searchTerm, setSearchTerm, onSearch, loading }) {
  // Run search when Enter is pressed
  function handleKeyDown(event) {
    // Don't search if already loading
    if (loading) {
      return;
    }

    // Search only when Enter is pressed
    if (event.key === "Enter") {
      // Extra safety check
      if (searchTerm.trim() === "") {
        return;
      }

      onSearch();
    }
  }

  // Search button click
  function handleSearch() {
    if (loading) {
      return;
    }

    onSearch();
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter movie name..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />

      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}

export default SearchBar;
