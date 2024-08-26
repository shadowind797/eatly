import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import React, {useState} from "react";

const PlaceInput = ({finalAddress}) => {
    const [address, setAddress] = useState('');

    const handleChange = address => {
        setAddress(address);
    };

    const handleSelect = address => {
        setAddress(address)
        finalAddress(address)
    };

    return (
        <PlacesAutocomplete
            value={address}
            onChange={handleChange}
            onSelect={handleSelect}
        >
            {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                <div style={{width: "470px", position: "relative", zIndex: "16"}}>
                    <input
                        {...getInputProps({
                            placeholder: 'Building',
                            className: 'location-search-input',
                            style: {width: "96%"},
                        })}
                    />
                    <div className="autocomplete-dropdown-container"
                         style={{
                             position: "absolute",
                             zIndex: "16",
                             flexDirection: "column",
                             marginTop: "57px",
                             backgroundColor: "#ffffff",
                             border: "1px solid #c5c5c5",
                         }}>
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                            const className = suggestion.active
                                ? 'suggestion-item--active'
                                : 'suggestion-item';
                            return (
                                <div
                                    {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style: {padding: "12px", cursor: "pointer"},
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

export default PlaceInput;