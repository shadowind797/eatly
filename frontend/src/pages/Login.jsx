import Form from '../components/Form'
import {useEffect} from "react";
import useUrlParams from "../hooks/useUrlParams.jsx";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../constants.js";
import {useNavigate} from "react-router-dom";

function Login() {
    const params = useUrlParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (params.access && params.refresh) {
            localStorage.setItem(ACCESS_TOKEN, params.access)
            localStorage.setItem(REFRESH_TOKEN, params.refresh)
            navigate("/")
        }
    }, [params]);

    return <Form route="/api/token/" method="login"/>
}

export default Login