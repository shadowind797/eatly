import { useState, useEffect, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import PropTypes from "prop-types";
import MapMarker from "../../assets/map/map-marker.svg";
import locationMarker from "../../assets/map/select-on-map-active.svg"

const libraries = ["places"];

function Map({ address, setIsLoaded, selectMode }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
    libraries,
    loading: "lazy",
  });

  const [lat, setLat] = useState(41.316234975275385);
  const [lng, setLng] = useState(69.24842619026026);

  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude)
          setLng(position.coords.longitude)
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (selectMode) {
      getUserLocation()
    } else {
      setLat(41.316234975275385);
      setLng(69.24842619026026);
    }
  }, [selectMode])

  useEffect(() => {
    if (address) {
      geocodeAddress();
    }
  }, [address, isLoaded]);

  const geocodeAddress = useCallback(() => {
    if (isLoaded && address) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK") {
          setLat(results[0].geometry.location.lat());
          setLng(results[0].geometry.location.lng());
        } else {
          console.error(
            "Geocode was not successful for the following reason: " + status
          );
        }
      });
    }
  }, [address, isLoaded]);

  useEffect(() => {
    setIsLoaded(isLoaded);
  }, [isLoaded]);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div id="map" style={{ height: "400px", width: "100%" }}>
      <GoogleMap
        mapContainerStyle={{ height: "100%", width: "100%" }}
        center={{ lat: lat, lng: lng }}
        zoom={selectMode ? 16.5 : address ? 16.5 : 12}
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
        {lat !== 41.316234975275385 && (
          <Marker
            position={{ lat: lat, lng: lng }}
            icon={{
              url: selectMode ? locationMarker : MapMarker,
              scaledSize: new window.google.maps.Size(55, 55),
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}

Map.propTypes = {
  address: PropTypes.string.isRequired,
  setIsLoaded: PropTypes.func.isRequired,
  selectMode: PropTypes.bool.isRequired,
};

export default Map;
