import api from "../../api.js";
import {useEffect, useState} from "react";

function MakeOrder({itemsC, subtotal}) {
    const [user, setUser] = useState({});
    const [cart, setCart] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        getUser()
    }, []);

    const getUser = () => {
        api
            .get("api/user/")
            .then((res) => res.data)
            .then((data) => {
                data.map((item) => {
                    setUser(item);
                })
            })
            .catch((err) => alert(err));
    }

    return (
        <div id="order">
            <p>{subtotal}</p>
        </div>
    )
}

export default MakeOrder