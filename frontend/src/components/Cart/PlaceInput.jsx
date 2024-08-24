import axios from "axios";
import PlacesAutocomplete from "@tasiodev/react-places-autocomplete"

function PlaceInput({finalAddress}) {

    const getAddressFromPlaceId = async (placeId) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${import.meta.env.VITE_MAP_KEY}`
            );
            if (response.data.results.length > 0) {
                return response.data.results[0].formatted_address;
            } else {
                return "No address found";
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            return "Error fetching address";
        }
    };

    const selectAddress = async (placeId) => {
        const address = await getAddressFromPlaceId(placeId);
        finalAddress(address); // Call the original selectAddress function with the full address
    };

    return (
        <PlacesAutocomplete
            gMapsKey={import.meta.env.VITE_MAP_KEY}
            onSelectPlace={selectAddress}
            disableMap={true}
            placeholder="Building"
            customStyles={{
                container: {},
                fieldInput: {width: '450px', paddingRight: '10px'},
                searchResultsContainer: {
                    height: '120px',
                    width: "470px",
                    flexDirection: 'column',
                    marginTop: "53px",
                    paddingTop: "7px"
                },
                searchResult: {
                    fontSize: '16px',
                    fontFamily: "Manrope",
                    fontWeight: "500",
                    height: "5px",
                    paddingBottom: "20px",
                    paddingTop: "0",
                },
            }}/>
    )
}

export default PlaceInput