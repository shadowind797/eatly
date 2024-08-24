import {useState} from "react";
import PlacesAutocomplete from "@tasiodev/react-places-autocomplete"

function PlaceInput({setAddress, address, selectAddress}) {

    return (
        <PlacesAutocomplete
            gMapsKey={import.meta.env.VITE_MAP_KEY}
            onSelectPlace={selectAddress}
            onChange={setAddress}
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