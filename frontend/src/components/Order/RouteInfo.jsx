import { useEffect, useState } from "react";
import markerTo from "../../assets/map/marker-to.svg";
import markerFrom from "../../assets/map/marker-from.svg";

function RouteInfo({ routeData, userName, restName }) {
  const [addressTo, setAddressTo] = useState("");
  const [addressFrom, setAddressFrom] = useState("");
  const [formattedDuration, setFormattedDuration] = useState("");
  const [formattedDistance, setFormattedDistance] = useState("");

  useEffect(() => {
    if (routeData) {
      setAddressFrom(routeData.routes[0].legs[0].start_address);
      setAddressTo(routeData.routes[0].legs[0].end_address);

      let totalDuration = 1000;
      let totalDistance = 0;

      routeData.routes[0].legs.forEach((leg) => {
        totalDuration += leg.duration.value;
        totalDistance += leg.distance.value;
      });

      if (totalDuration < 3600) {
        setFormattedDuration(`${(totalDuration / 60).toFixed(0)} minutes`);
      } else {
        setFormattedDuration(
          `${(totalDuration / 3600).toFixed(0)} hours ${(
            (totalDuration % 3600) /
            60
          ).toFixed(0)} minutes`
        );
      }

      setFormattedDistance(`${(totalDistance / 1000).toFixed(1)} km`);
    }
  }, [routeData]);

  return (
    <div id="route-info">
      <div id="route">
        <div id="from">
          <div className="img">
            <img src={markerFrom} alt="" />
          </div>
          <div className="info">
            <div className="name">
              <p><span>From: </span>{restName}</p>
            </div>
            <div className="address">
              <p>{addressFrom}</p>
            </div>
          </div>
        </div>
        <div id="to">
          <div className="img">
            <img src={markerTo} alt="" />
          </div>
          <div className="info">
            <div className="name">
              <p><span>To: </span>{userName}</p>
            </div>
            <div className="address">
              <p>{addressTo}</p>
            </div>
          </div>
        </div>
      </div>
      <div id="time-destination">
        <p>
          Delivery distance - <span>{formattedDistance}</span>, it will take
          about <span>{formattedDuration}</span>
        </p>
      </div>
    </div>
  );
}

export default RouteInfo;
