import Info from "../components/Order/Info.jsx";
import {useEffect, useState} from "react";
import api from "../api.js";
import Map from "../components/Order/Map.jsx";


function Order() {
    const [user, setUser] = useState({});
    const [addPayment, setAddPayment] = useState(false);
    const [paymentMode, setPaymentMode] = useState("Cash");
    const [order, setOrder] = useState({});
    const [address, setAddress] = useState({});

    useEffect(() => {
        getUser()
        getOrder()
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
            .catch((err) => {
            });
    }

    const getOrder = () => {
        api
            .get("api/order/", {params: {method: "for_complete"}})
            .then((res) => res.data)
            .then((data) => {
                setOrder(data)
            })
            .catch((err) => {
            });
    }


    return (
        <div id="complete-order">
            <Map/>
            <Info order={order} user={user}/>
        </div>
    )
}

export default Order;