import { Navigate } from "react-router-dom";
import api from "../api.js";
import { useEffect, useState } from "react";

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
    return <div>Loading...</div>;
  } else if (access === true) {
    return children;
  } else if (access === false) {
    return <Navigate to="/forbidden" />;
  }
}

export default SuperProtectedRoute;
