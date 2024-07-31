import api from "../../api.js";
import {useEffect} from "react";

function MakeOrder(props) {

    useEffect(() => {
        getUser()
    }, []);

    const getUser = () => {
        api
            .get("api/user/")
            .then((res) => res.data)
            .then((data) => {})
            .catch((err) => alert(err));
    }


    return (
        <div id="order">

        </div>
    )
}

export default MakeOrder