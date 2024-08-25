import React, {useState, useEffect, useCallback} from "react";
import {GoogleMap, useLoadScript, Marker as GoogleMarker} from "@react-google-maps/api";
import MapMarker from "../../assets/map-marker.svg";

const libraries = ["places"];

function Map({address, setIsLoaded}) {
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
        libraries,
        loading: "lazy",
    });

    const [lat, setLat] = useState(41.316234975275385);
    const [lng, setLng] = useState(69.24842619026026);

    const geocodeAddress = useCallback(() => {
        if (isLoaded && address) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({address}, (results, status) => {
                if (status === "OK") {
                    setLat(results[0].geometry.location.lat());
                    setLng(results[0].geometry.location.lng());
                } else {
                    console.error("Geocode was not successful for the following reason: " + status);
                }
            });
        }
    }, [address, isLoaded]);

    useEffect(() => {
        setIsLoaded(isLoaded)
    }, [isLoaded]);

    useEffect(() => {
        if (address) {
            geocodeAddress();
        }
    }, [address, isLoaded]);

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps";

    return (
        <div id="map" style={{height: "400px", width: "100%"}}>
            <GoogleMap
                mapContainerStyle={{height: "100%", width: "100%"}}
                center={{lat, lng}}
                zoom={address ? 17 : 12}
                options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    keyboardShortcuts: false,
                    clickableIcons: false,
                    scrollwheel: false,
                    gestureHandling: 'none',
                }}
            >
                <GoogleMarker
                    position={{lat: lat + 0.00035, lng: lng - 0.0003}}
                    icon={{
                        url: MapMarker,
                        scaledSize: 55
                    }}
                    visible={address.length > 0 && true}
                />
            </GoogleMap>
        </div>
    );
}

export default Map;