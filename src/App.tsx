import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // SEARCH STATES
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // SORT STATE
  const [sortBy, setSortBy] = useState<"name" | "population">("name");

  // SINGLE COUNTRY VIEW
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);

  useEffect(() => {
    fetch(
      "https://restcountries.com/v3.1/all?fields=name,capital,population,flags,cca3,region,currencies"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }
        return response.json();
      })
      .then((data) => {
        setCountries(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredCountries = countries
    .filter((country) =>
      country.name.common
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.common.localeCompare(b.name.common);
      }
      return b.population - a.population;
    });

  return (
    <div className="app">
      {/* HEADER */}
      <div className="header">
        <h1>Countries Explorer</h1>
        <p>Explore countries around the world</p>
      </div>

      {/* BACK BUTTON */}
      {selectedCountry && (
        <button onClick={() => setSelectedCountry(null)}>
          ← Back to all countries
        </button>
      )}

      {/* SEARCH + SORT */}
      {!selectedCountry && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search countries..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <button onClick={() => setSearchQuery(searchInput)}>
            Search
          </button>

          <button
            onClick={() =>
              setSortBy(sortBy === "name" ? "population" : "name")
            }
          >
            Sort by {sortBy === "name" ? "Population" : "Name"}
          </button>
        </div>
      )}

      {loading && <p>Loading countries...</p>}
      {error && <p className="error">{error}</p>}

      {!loading &&
        !error &&
        !selectedCountry &&
        filteredCountries.length === 0 && (
          <p>No countries found.</p>
        )}

      {/* SINGLE COUNTRY VIEW */}
      {selectedCountry && (
        <div className="single-card">
          <img
            src={selectedCountry.flags.svg}
            alt={`${selectedCountry.name.common} flag`}
          />
          <h2>{selectedCountry.name.common}</h2>

          <p>
            <strong>Continent:</strong> {selectedCountry.region}
          </p>

          <p>
            <strong>Capital:</strong>{" "}
            {selectedCountry.capital?.[0] || "N/A"}
          </p>

          <p>
            <strong>Population:</strong>{" "}
            {selectedCountry.population.toLocaleString()}
          </p>

        
        </div>
      )}

      {/* GRID VIEW */}
      {!selectedCountry && (
        <ul className="countries-grid">
          {!loading &&
            !error &&
            filteredCountries.map((country) => (
              <li
                key={country.cca3}
                className="country-card"
                onClick={() => setSelectedCountry(country)}
              >
                <img
                  src={country.flags.svg}
                  alt={`${country.name.common} flag`}
                />

                <h3>{country.name.common}</h3>
                <p className="region">{country.region}</p>

                <p>
                  <strong>Capital:</strong>{" "}
                  {country.capital?.[0] || "N/A"}
                </p>

                <p>
                  <strong>Population:</strong>{" "}
                  {country.population.toLocaleString()}
                </p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default App;
