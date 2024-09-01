import BaseHeader from "../components/BaseHeader";
import Footer from "../components/Footer";
import Header from "../components/Header";
import useUrlParams from "../hooks/useUrlParams.jsx";
import { useState, useEffect } from "react";
import NotFound from "./404";
import api from "../api.js";

import hide_pass from "../assets/eye-off.svg";
import show_pass from "../assets/eye-show.svg";

function ChangePassword() {
  const params = useUrlParams();
  const [changeKey, setChangeKey] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [invalidkey, setInvalidKey] = useState(false);
  const [changed, setChanged] = useState(false);
  const [passwordsArentMatch, setPasswordsArentMatch] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const [passState, setPassState] = useState("password");

  useEffect(() => {
    if (params.key) {
      setChangeKey(params.key);
      setNotFound(false);
    } else {
      setNotFound(true);
    }
  }, [params]);

  const changePassword = (e) => {
    e.preventDefault();
    if (newPassword === newPassword2) {
      api
        .post("api/password/change/", {
          key: params.key,
          method: "change",
          new: newPassword,
        })
        .then((res) => {
          if (res.status === 202) {
            setChanged(true);
          }
        })
        .catch((err) => {
          if (err.response.status === 403) {
            setInvalidKey(true);
            setPasswordsArentMatch(false)
          }
        });
    } else {
      setPasswordsArentMatch(true);
    }
  };

  const fields = [
    {
      id: 4,
      placeholder: "NEW PASSWORD",
      type: "password",
      value: newPassword,
      onChange: (e) => {
        setNewPassword(e.target.value);
      },
    },
    {
      id: 5,
      placeholder: "REPEAT NEW PASSWORD",
      type: "password",
      value: newPassword2,
      onChange: (e) => {
        setNewPassword2(e.target.value);
      },
    },
  ];

  if (notFound) {
    return <NotFound />;
  } else {
    return (
      <div id="pass-change">
        <BaseHeader />
        <Header />
        {!changed ? (
          <div id="new-pass-form">
            <form onSubmit={changePassword}>
              <h1>Change password</h1>
              <div id="inputs">
                {fields.map((field) => (
                  <div id="input" key={field.id}>
                    <input
                      value={field.value}
                      onChange={field.onChange}
                      type={
                        field.placeholder === "NEW PASSWORD"
                          ? passState
                          : field.type
                      }
                      placeholder={field.placeholder}
                    />
                    {field.placeholder === "NEW PASSWORD" && (
                      <img
                        src={passState === "password" ? show_pass : hide_pass}
                        style={
                          newPassword
                            ? {
                                width: "30px",
                                cursor: "pointer",
                              }
                            : { display: "none" }
                        }
                        onClick={() => {
                          const passType =
                            passState === "password" ? "text" : "password";
                          setPassState(passType);
                        }}
                        alt=""
                      />
                    )}
                  </div>
                ))}
              </div>
              <div id="action">
                <p className="auth-error">
                  {passwordsArentMatch
                    ? "Passworrds aren't match"
                    : invalidkey ? "Invalid pass-change key. Are you using the last link?.." : ""}
                </p>
                <button type="submit">Change</button>
              </div>
            </form>
          </div>
        ) : (
          <div id="pass-changed">
            <h4>Password succesfully changed</h4>
          </div>
        )}
        <Footer />
      </div>
    );
  }
}

export default ChangePassword;
