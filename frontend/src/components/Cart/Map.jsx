import GoogleMapReact from "google-map-react"
import {useState, useEffect} from "react";

const Marker = props => {
    return <div className="SuperAwesomePin">Marker</div>
}

function Map({address}) {
    const [marker, setMarker] = useState(null);

    const onGoogleApiLoaded = ({map, maps}) => {
        const geocoder = new maps.Geocoder();
        geocoder.geocode({address}, (results, status) => {
            if (status === "OK" && results[0]) {
                const marker = new maps.Marker({
                    position: results[0].geometry.location,
                });
                marker.setMap(map);
                setMarker(marker);
            } else {
                console.error("Geocode was not successful for the following reason: " + status);
            }
        });
    };

    return (
        <div id="map">
            <GoogleMapReact
                bootstrapURLKeys={{key: import.meta.env.VITE_MAP_KEY, libraries: ["places"]}}
                defaultCenter={{lat: 41.316234975275385, lng: 69.24842619026026}}
                defaultZoom={address ? 14 : 11}
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
                {address && <Marker lat={onGoogleApiLoaded.lat} lng={onGoogleApiLoaded.lng}/>}
            </GoogleMapReact>
        </div>
    )
}

export default Map;