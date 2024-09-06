import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api.js";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants.js";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Loading from './Loading.jsx'

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [banned, setBanned] = useState(null);
  const [banDetail, setBanDetail] = useState("");

  useEffect(() => {
    auth().catch(() => {
      setIsAuthorized(false);
    });
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    api
      .get("api/access/", { params: { access_to: "site" } })
      .then((response) => {
        if (response.status === 200) {
          setBanned(false)
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          setBanned(true);
          setBanDetail(error.response.data.detail);
        } else if (error.response.status === 401) setIsAuthorized(false);
      });

    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null || banned === null) {
    return <Loading />;
  }

  if (banned) {
    return <Navigate to={`/forbidden?reason=banned&detail=${banDetail}`} />;
  } else {
    return isAuthorized ? (
      banned === false && children
    ) : (
      <Navigate to="/login" />
    );
  }
}

export default ProtectedRoute;
