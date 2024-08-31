import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import markerTo from "../../assets/map/marker-to.svg";
import markerFrom from "../../assets/map/marker-from.svg";

const libraries = ["places"];

function Map({ restAddress, userAddress, setIsLoaded }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
    libraries,
    loading: "lazy",
  });

  const [lat, setLat] = useState(41.316234975275385);
  const [lng, setLng] = useState(69.24842619026026);
  const [shipTo, setShipTo] = useState("");

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const calculateDistanceAndTime = useCallback(() => {
    if (isLoaded && restAddress && shipTo) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: restAddress,
          destination: shipTo,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            setDirectionsResponse(response);
            console.log(response);
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
    if (userAddress && restAddress) {
      calculateDistanceAndTime();
    }
  }, [userAddress, restAddress]);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div id="map">
      <GoogleMap
        mapContainerStyle={{ height: "100%", width: "100%" }}
        center={{ lat, lng }}
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
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                },
              }}
            />
          </>
        )}
      </GoogleMap>
    </div>
  );
}

export default Map;
