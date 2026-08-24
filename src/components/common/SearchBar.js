import React, { useState, useEffect } from "react";
import "../../styles/components/searchbar.css";

const SearchBar = ({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  debounce = 300,
  showButton = false,
  buttonText = "Search",
  disabled = false,
}) => {
  const [searchText, setSearchText] = useState(value);

  useEffect(() => {
    setSearchText(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange) {
        onChange(searchText);
      }
    }, debounce);

    return () => clearTimeout(timer);
  }, [searchText, debounce, onChange]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(searchText);
    }
  };

  return (
    <form
      className="searchbar"
      onSubmit={handleSubmit}
    >
      <span className="search-icon">
        🔍
      </span>

      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchText}
        disabled={disabled}
        onChange={(e) =>
          setSearchText(e.target.value)
        }
      />

      {searchText && (
        <button
          type="button"
          className="clear-button"
          onClick={() => {
            setSearchText("");

            if (onChange) {
              onChange("");
            }
          }}
        >
          ✕
        </button>
      )}

      {showButton && (
        <button
          className="search-button"
          type="submit"
        >
          {buttonText}
        </button>
      )}
    </form>
  );
};

export default SearchBar;
