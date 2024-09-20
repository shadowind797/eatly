import { useEffect, useState } from "react";
import PContent from "./PContent.jsx";
import MEContent from "./MEContent.jsx";
import OHContent from "./OHContent.jsx";
import EPContent from "./EPContent.jsx";
import api from "../../api.js";
import Settings from './Settings.jsx'

function ProfileContent() {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [orderStatusList, setOrderStatusList] = useState([]);
  const [status, setStatus] = useState("");
  const [contentOption, setContentOption] = useState("Profile");
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    getUser();
    getOrders("orders-last");
  }, []);

  const getOrders = (method) => {
    setOrderLoading(true);
    api
      .get(`api/profile/orders/`, { params: { method: method } })
      .then((res) => res.data)
      .then((data) => {
        setOrders(data.orders);
        setOrderStatusList(data.statuses);
        setOrderLoading(false);
      })
      .catch(() => {});
  };

  const getUser = () => {
    api
      .get("api/user/")
      .then((res) => {
        setUser(res.data[0]);
        const statusMap = {
          1: "OWNER",
          2: "Admin",
          3: "Manager",
          4: "Courier",
          5: "Basic user",
          6: "Premium user",
          7: "Partner",
        };

        setStatus(statusMap[res.data[0].status] || "");
      })
      .catch(() => {});
  };

  return (
    <div id="profile-content">
      <div id="profile-nav">
        <h4>
          {user.username} |{" "}
          <span style={user.username === "shadowind" ? { color: "red" } : {}}>
            {status}
          </span>
        </h4>
        <nav>
          {[
            "Profile",
            "Settings",
            "Orders history",
            "Manage expenses",
            "Explore Premium",
          ].map((option) => (
            <button
              key={option}
              className={option === contentOption ? "active" : ""}
              onClick={() => setContentOption(option)}
            >
              {option}
            </button>
          ))}
        </nav>
      </div>
      <div id="nav-option-content">
        {contentOption === "Profile" && (
          <PContent
            user={user}
            orders={orders}
            osl={orderStatusList}
            ordersLoad={orderLoading}
          />
        )}
        {contentOption === "Manage expenses" && <MEContent />}
        {contentOption === "Settings" && <Settings />}
        {contentOption === "Orders history" && <OHContent />}
        {contentOption === "Explore Premium" && <EPContent />}
      </div>
    </div>
  );
}

export default ProfileContent;
