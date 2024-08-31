import React, {useState, useEffect, useCallback} from "react";
import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api";
import MapMarker from "../../assets/map/map-marker.svg";

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
                zoom={address ? 16.5 : 12}
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
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{visibility: "off"}]
                        }
                    ]
                }}
            >
                {address && (
                    <Marker
                        position={{lat: lat, lng: lng}}
                        icon={{
                            url: MapMarker,
                            scaledSize: new window.google.maps.Size(55, 55)
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    );
}

export default Map;
