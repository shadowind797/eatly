import {Navigate} from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import api from "../api.js"
import {REFRESH_TOKEN, ACCESS_TOKEN} from "../constants.js"
import {useEffect, useState} from "react";


function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [banned, setBanned] = useState(null);

    useEffect(() => {
        auth().catch(() => {setIsAuthorized(false)});
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/api/token/refresh", {refresh: refreshToken});
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return
        }

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

        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000

        if (tokenExpiration < now) {
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    if (banned) {
        return <Navigate to="/banned" />
    } else {
        return isAuthorized ? children : <Navigate to="/login" />
    }

}

export default ProtectedRoute;