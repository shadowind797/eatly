import { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import PropTypes from "prop-types";
import markerTo from "../../assets/map/marker-to.svg";
import markerFrom from "../../assets/map/marker-from.svg";
import RouteInfo from "./RouteInfo";

Map.propTypes = {
  restAddress: PropTypes.string.isRequired,
  userAddress: PropTypes.object.isRequired,
  userName: PropTypes.string.isRequired,
  restName: PropTypes.string.isRequired,
}

function Map({ restAddress, userAddress, userName, restName }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
    language: "en",
  });

  const [shipTo, setShipTo] = useState("");
  const currentTime = new Date();
  const departureTime = new Date(currentTime.getTime() + 10 * 60 * 1000);

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const calculateDistanceAndTime = useCallback(() => {
    if (isLoaded && restAddress && shipTo) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: restAddress,
          destination: shipTo,
          travelMode: window.google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: departureTime,
          }
        },
        (response, status) => {
          if (status === "OK") {
            setDirectionsResponse(response);
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );
    }
  }, [isLoaded, restAddress, shipTo]);

  useEffect(() => {
    setShipTo(userAddress.building);
  }, [userAddress]);

  useEffect(() => {
    if (shipTo && restAddress) {
      calculateDistanceAndTime();
    }
  }, [isLoaded]);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div id="order-route">
      <div id="map">
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          zoom={12}
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
            gestureHandling: "none",
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          {directionsResponse && (
            <>
              <Marker
                position={{
                  lat: directionsResponse.routes[0].legs[0].start_location.lat(),
                  lng: directionsResponse.routes[0].legs[0].start_location.lng(),
                }}
                icon={{
                  url: markerFrom,
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
              <Marker
                position={{
                  lat: directionsResponse.routes[0].legs[0].end_location.lat(),
                  lng: directionsResponse.routes[0].legs[0].end_location.lng(),
                }}
                icon={{
                  url: markerTo,
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
              <DirectionsRenderer
                directions={directionsResponse}
                options={{
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: "#6C5FBC",
                    strokeOpacity: 1,
                    strokeWeight: 4,
                  },
                }}
              />
            </>
          )}
        </GoogleMap>
      </div>
      <RouteInfo
        routeData={directionsResponse}
        userName={userName}
        restName={restName}
      />
    </div>
  );
}

export default Map;
