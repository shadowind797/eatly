import { useEffect, useState } from "react";
import PContent from "./PContent.jsx";
import MEContent from "./MEContent.jsx";
import OHContent from "./OHContent.jsx";
import EPContent from "./EPContent.jsx";
import api from "../../api.js";

function ProfileContent() {
  const [user, setUser] = useState({});
  const [status, setStatus] = useState("");
  const [contentOption, setContentOption] = useState("Profile");

  useEffect(() => {
    getUser();
  }, []);

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
          7: "Customer",
        };

        setStatus(statusMap[res.data[0].status] || "");
      })
      .catch((err) => {});
  };

  return (
    <div id="profile-content">
      <div id="profile-nav">
        <h4>
          {user.username} | <span style={user.username === "shadowind" ? { color: "red" } : {}}>{status}</span>
        </h4>
        <nav>
          {[
            "Profile",
            "Orders history",
            "Manage expenses",
            "Explore Premium",
          ].map((option) => (
            <button
              key={option}
              className={contentOption === option ? "active" : ""}
              onClick={() => setContentOption(option)}
            >
              {option}
            </button>
          ))}
        </nav>
      </div>
      <div id="nav-option-content">
        {contentOption === "Profile" && <PContent user={user}/>}
        {contentOption === "Manage expenses" && <MEContent />}
        {contentOption === "Orders history" && <OHContent />}
        {contentOption === "Explore Premium" && <EPContent />}
      </div>
    </div>
  );
}

export default ProfileContent;
