import userImg from "../../assets/profile/profile-img.svg";
import idImg from "../../assets/profile/id.svg";
import phoneImg from "../../assets/profile/phone.svg";
import emailImg from "../../assets/profile/email.svg";
import passwordImg from "../../assets/profile/password.svg";
import logoutImg from "../../assets/profile/log-out.svg";
import deleteImg from "../../assets/profile/delete.svg";
import { useState } from "react";
import api from "../../api.js";

function PContent({ user }) {
  const [emailSended, setEmailSended] = useState(false)

  const changePassword = () => {
    api
      .post("api/password/change/", {method: "send_email"})
      .then((res) => {
        if (res.status === 200) {
          setEmailSended(true)
        }
      });
  };

  return (
    <div id="profile-content-profile">
      <div id="profile">
        <div id="profile-info">
          <div id="photo-name">
            <img id="user-img" src={userImg} alt="" />
            <div id="top-info">
              <h3>
                Username: <span>{user.username}</span>
              </h3>
              <p>
                Name:{" "}
                <span>
                  {user.first_name ? (
                    user.first_name
                  ) : (
                    <a>Provide us your name</a>
                  )}
                </span>
              </p>
            </div>
          </div>
          <div id="others">
            <div>
              <img src={idImg} alt="" />
              <p>
                ID: <span>{user.id}</span>
              </p>
            </div>
            <div>
              <img src={emailImg} alt="" />
              <p>
                Email: <span>{user.email}</span>
              </p>
            </div>
            <div>
              <img src={phoneImg} alt="" />
              <p>
                Phone: <span>{user.phone}</span>
              </p>
            </div>
          </div>
        </div>
        <div id="profile-actions">
          <button onClick={changePassword}>
            <img src={passwordImg} alt="Change password" />
            <p>Change password</p>
          </button>
          <button>
            <img src={logoutImg} alt="Log Out" />
            <p>Log Out</p>
          </button>
          <button>
            <img src={deleteImg} alt="Delete account" />
            <p>Delete account</p>
          </button>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default PContent;
