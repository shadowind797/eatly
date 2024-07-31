import {Navigate} from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import api from "../api.js"
import {REFRESH_TOKEN, ACCESS_TOKEN} from "../constants.js"
import {useEffect, useState} from "react";


function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [banned, setBanned] = useState(false);

    useEffect(() => {
        auth().catch(() => {setIsAuthorized(false)});
    }, [])

    const auth = async () => {
        api
            .get("api/access/", {params: {access_to: "site"}})
            .then((res) => res.data)
            .then((data) => {})
            .catch((error) => {
                if (error.response.status === 403)
                    setBanned(true);
                else if (error.response.status === 401)
                    setIsAuthorized(false);
            });
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    if (banned) {
        return <Navigate to="/banned" />
    } else {
        return <Navigate to="/login" />
    }

}

export default ProtectedRoute;