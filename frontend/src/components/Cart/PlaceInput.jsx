/* eslint-disable react/jsx-key */
import mapSelect from "../../assets/map/select-on-map.svg";
import mapSelectActive from "../../assets/map/select-on-map-active.svg";
import PlacesAutocomplete from "react-places-autocomplete";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const PlaceInput = ({ finalAddress, enableSelectMode }) => {
  const [address, setAddress] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const buildingInputRef = useRef();

  useEffect(() => {
    buildingInputRef.current.focus();
  }, []);
  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = (address) => {
    setAddress(address);
    finalAddress(address);
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div style={{ width: "470px", position: "relative", zIndex: "16" }}>
          <div className="location-search-input-div">
            <input
              {...getInputProps({
                placeholder: "Building",
                className: "location-search-input",
                ref: buildingInputRef,
              })}
            />
            <img
              src={selectMode ? mapSelectActive : mapSelect}
              onClick={() => {
                enableSelectMode(!selectMode);
                setSelectMode(!selectMode);
              }}
              alt=""
            />
          </div>
          <div
            className="autocomplete-dropdown-container"
            style={{
              position: "absolute",
              zIndex: "16",
              flexDirection: "column",
              marginTop: "7px",
              backgroundColor: "#ffffff",
              border: "1px solid #6C5FBC",
            }}
          >
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style: { padding: "12px", cursor: "pointer" },
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

PlaceInput.propTypes = {
  finalAddress: PropTypes.func.isRequired,
  enableSelectMode: PropTypes.func.isRequired,
};

export default PlaceInput;
