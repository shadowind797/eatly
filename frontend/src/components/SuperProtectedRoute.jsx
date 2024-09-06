import { Navigate } from "react-router-dom";
import api from "../api.js";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Loading from "./Loading.jsx";

SuperProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  access_to: PropTypes.string.isRequired,
};

function SuperProtectedRoute({ children, access_to }) {
  const [access, setAccess] = useState(null);

  useEffect(() => {
    auth().catch(() => {
      setAccess(false);
    });
  }, []);

  const auth = async () => {
    api
      .get("api/access/", { params: { access_to: access_to } })
      .then((res) => {
        if (res.status === 200) {
          setAccess(true);
        }
      })
      .catch((error) => {
        if (error.response.status === 403) setAccess(false);
      });
  };

  if (access === null) {
    return <Loading />;
  } else if (access === true) {
    return children;
  } else if (access === false) {
    return <Navigate to="/forbidden?reason=no_permissions" />;
  }
}

export default SuperProtectedRoute;
