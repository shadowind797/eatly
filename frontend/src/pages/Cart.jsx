import ItemsList from "../components/Cart/ItemsList.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import MakeOrder from "../components/Cart/MakeOrder.jsx";
import {useEffect, useState} from "react";
import api from "../api.js";
import empty_cart from "../assets/empty-cart.svg"
import items_load from "../assets/header-loading.gif";
import load from "../assets/count_load.gif";

function Cart({test}) {
    const [cartItems, setCartItems] = useState([]);
    const [oneRestCartItems, setOneRestCartItems] = useState([]);
    const [items, setItems] = useState([]);
    const [rests, setRests] = useState([]);
    const [total, setTotal] = useState({});
    const [extra, setExtra] = useState(false);
    const [totalLoading, setTotalLoading] = useState(false)

    const [creatingOrder, setCreatingOrder] = useState(false)

    useEffect(() => {
        getCartData()
    }, []);

    const getCartData = () => {
        setTotalLoading(true)
        api
            .get("api/restaurants/", {params: {method: "cart"}})
            .then((res) => res.data)
            .then((data) => {
                setRests(data.rests)
                setItems(data.items)
                setCartItems(data.cart_items)
                getTotal(data.cart_items)
            })
    }
    const getTotal = (cartI) => {
        setTotalLoading(true)
        api
            .post("api/items/", {items: cartI, method: "for_total"})
            .then((res) => {
                if (res.status === 200) {
                    return res.data
                } else {
                    setExtra(true)
                    setTotalLoading(false)
                }
            })
            .then((data) => {
                setTotal(data)
                setTotalLoading(false)
            })
            .catch((err) => {
            });
    }

    if (cartItems.length > 0 && total.total > 0) {
        return (
            <div id='cart'>
                <BaseHeader page="cart"/>
                <div id="main">
                    {!creatingOrder && <ItemsList rests={rests} items={oneRestCartItems} cartItems={cartItems}
                                                  onChange={getCartData}/>}
                    {creatingOrder && <div style={{width: "100%"}}>
                        <img src={load} style={{width: "500px", paddingTop: "10%", paddingLeft: "36%"}} alt=""/>
                    </div>}
                    <div style={creatingOrder ? {display: "none"} : {display: "block"}}>
                        <MakeOrder rests={rests} test={test} style createOrder={setCreatingOrder}
                                   total_load={totalLoading}
                                   items={items}
                                   subtotal={total ? total.total : 0}
                                   changeItems={setOneRestCartItems}/>
                    </div>
                </div>
            </div>
        )
    } else if (extra === true) {
        return (
            <div id='cart'>
                <BaseHeader page="cart"/>
                <div id="main">
                    <div id="empty">
                        <img src={empty_cart} alt=""/>
                        <h1>You don't add any dishes in your cart</h1>
                        <h2>You can do it in <a href="/menu">menu</a></h2>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div id='cart'>
                <BaseHeader page="cart"/>
                <div id="main" style={{height: "805px"}}>
                    <img src={items_load} style={{margin: "auto", width: "400px"}} alt=""/>
                </div>
            </div>
        )
    }
}

export default Cart;
