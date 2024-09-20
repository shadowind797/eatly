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
import { themes } from "../../contexts/ThemeContext";

Map.propTypes = {
  restAddress: PropTypes.string.isRequired,
  userAddress: PropTypes.object.isRequired,
  userName: PropTypes.string.isRequired,
  restName: PropTypes.string.isRequired,
};

function Map({ restAddress, userAddress, userName, restName }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
    language: "en",
  });

  const [shipTo, setShipTo] = useState("");
  const currentTime = new Date();
  const departureTime = new Date(currentTime.getTime() + 10 * 60 * 1000);

  const getTheme = () => {
    const theme = `${window?.localStorage?.getItem("theme")}`;
    if (Object.values(themes).includes(theme)) return theme;
  
    const userMedia = window.matchMedia("(prefers-color-scheme: light)");
    if (userMedia.matches) return themes.light;
  
    return themes.light;
  };
  const darkMapTheme = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#242f3e",
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#746855",
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#242f3e",
        },
      ],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#d59563",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#d59563",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#263c3f",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#6b9a76",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: "#38414e",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#212a37",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#9ca5b3",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: "#746855",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#1f2835",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#f3d19c",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [
        {
          color: "#2f3948",
        },
      ],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#d59563",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#17263c",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#515c6d",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#17263c",
        },
      ],
    },
  ];
  const lightMapTheme = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];

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
          },
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
          styles={[]}
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
            styles: getTheme() === "light" ? lightMapTheme : darkMapTheme,
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
