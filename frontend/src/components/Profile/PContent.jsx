import userImg from "../../assets/profile/profile-img.svg";
import idImg from "../../assets/profile/id.svg";
import phoneImg from "../../assets/profile/phone.svg";
import emailImg from "../../assets/profile/email.svg";
import passwordImg from "../../assets/profile/password.svg";
import logoutImg from "../../assets/profile/log-out.svg";
import deleteImg from "../../assets/profile/delete.svg";
import logo from "../../assets/Logo.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api.js";
import PropTypes from 'prop-types';

PContent.propTypes = {
  user: PropTypes.object.isRequired,
  orders: PropTypes.array.isRequired,
  osl: PropTypes.array.isRequired,
};

function PContent({ user, orders, osl }) {
  const [emailSent, setEmailSent] = useState(false);
  const [emailSendConfirm, setEmailSendConfirm] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailAlreadySent, setEmailAlreadySent] = useState(false);
  const navigate = useNavigate();

  const getOrderStatus = (stId) => {
    return osl.map((status) => {
      if (status.id === stId) {
        return status.name;
      }
    });
  };

  const changePassword = () => {
    setEmailSending(true);
    api
      .post("api/password/change/", { method: "send_email" })
      .then((res) => {
        if (res.status === 200) {
          setEmailSent(true);
          setEmailSending(false);
          setEmailSendConfirm(false);
        }
      })
      .catch((err) => {
        if (err.response.status === 405) {
          setEmailAlreadySent(true);
          setEmailSending(false);
          setEmailSendConfirm(false);
        }
      });
  };

  return (
    <div id="profile-content-profile">
      <div id="first">
        <div
          id="profile"
        >
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
            <button
              id="change-pass"
              onClick={() => setEmailSendConfirm(true)}
            >
              <img src={passwordImg} alt="Change password" />
              <p>Change password</p>
            </button>
            <button
              id="logout"
              onClick={() => navigate("/logout")}
            >
              <img src={logoutImg} alt="Log out" />
              <p>Log out</p>
            </button>
            <button id="delete-acc">
              <img src={deleteImg} alt="Delete account" />
              <p>Delete account</p>
            </button>
          </div>
        </div>
        {emailSendConfirm && (
          <div id="pass-change-confirm">
            <div id="logo">
              <img src={logo} alt="" />
              <h1>eatly</h1>
            </div>
            <p>
              We will send to you confirmation email to provide you pass-reset
              link.
            </p>
            <h4>Continue?</h4>
            <div id="btns">
              <button id="cancel" onClick={() => setEmailSendConfirm(false)}>
                Cancel
              </button>
              <button
                id="emailSendConfirm"
                onClick={() => {
                  changePassword();
                }}
              >
                {emailSending ? "Sending..." : "Send email"}
              </button>
            </div>
          </div>
        )}
        {emailAlreadySent && (
          <div id="pass-change-confirm">
            <div id="logo">
              <img src={logo} alt="" />
              <h1>eatly</h1>
            </div>
            <p>
              We detect that you already has sent email. If link in mail doesn't
              work try to receive it later
            </p>
            <h4 style={{ fontSize: "17px" }}>
              Please check "Spam" folder or try to resend email later
            </h4>
            <div id="btns" style={{ paddingTop: "20px" }}>
              <button id="send" onClick={() => setEmailAlreadySent(false)}>
                OK
              </button>
            </div>
          </div>
        )}
        {emailSent && (
          <div id="pass-change-confirm">
            <div id="logo">
              <img src={logo} alt="" />
              <h1>eatly</h1>
            </div>
            <p style={{ color: "#aaa3d8", paddingTop: "10px" }}>
              We sent email to {user.email}. Please follow the instructions in
              it
            </p>
            <div id="btns" style={{ paddingTop: "65px" }}>
              <button id="send" onClick={() => setEmailSent(false)}>
                OK
              </button>
            </div>
          </div>
        )}
        <h2>Your latest orders</h2>
        <div id="last-orders">
          {orders.map((order) => (
            <div id="order-card" key={order.id}>
              <div className="head">
                <p>{order.created}</p>
                <p className="last">{getOrderStatus(order.status)}</p>
              </div>
              <div className="info">
                <div id="rest">
                  <img src="" alt="" />
                  <h3>{order.rest}</h3>
                </div>
                <h3>{order.items_count} dishes</h3>
                <h3 className="order-total">${order.total}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div id="statistics">
        <div>
          <h2>Unlock spending statistics</h2>
          <h3><span id="wt">with</span> EATLY <span id="prem">Premium</span></h3>
        </div>
      </div>
    </div>
  );
}

export default PContent;
