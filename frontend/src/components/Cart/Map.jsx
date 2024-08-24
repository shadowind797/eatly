import GoogleMapReact from "google-map-react"
import {Wrapper} from "@googlemaps/react-wrapper";

function Map() {
    return (
        <div id="map">
            <GoogleMapReact
                bootstrapURLKeys={{key: import.meta.env.VITE_MAP_KEY, libraries: ["places"]}}
                defaultCenter={{lat: 41.316234975275385, lng: 69.24842619026026}}
                defaultZoom={11}
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
                }}
            >
            </GoogleMapReact>
        </div>
    )
}

export default Map;