import Header from "../components/Header.jsx";
import ItemsList from "../components/Cart/ItemsList.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import MakeOrder from "../components/Cart/MakeOrder.jsx";
import {useEffect, useState} from "react";
import api from "../api.js";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);


    useEffect(() => {
        getCartItems()
    }, []);

    const getCartItems = () => {
        api
            .get("api/items/cart/")
            .then((res) => res.data)
            .then((data) => {
                setCartItems(data)
                getTotal(data)
            })
    }

    const getTotal = (cartI) => {
        api
            .post("api/items/", {data: {items: cartI, method: "for_total"}})
            .then((res) => res.data)
            .then((data) => setTotal(data))
            .catch((err) => alert(err));
    }


    if (cartItems.length > 0 && total.total > 0) {
        return (
            <div id='cart'>
                <BaseHeader />
                <Header />
                <div id="main">
                    <ItemsList items={cartItems} onChange={() => {getCartItems()}}/>
                    <MakeOrder itemsC={cartItems} subtotal={total.total}/>
                </div>
            </div>
        )
    }
}

export default Cart;
