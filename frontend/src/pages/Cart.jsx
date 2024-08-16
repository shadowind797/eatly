import Header from "../components/Header.jsx";
import ItemsList from "../components/Cart/ItemsList.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import MakeOrder from "../components/Cart/MakeOrder.jsx";
import {useEffect, useState} from "react";
import api from "../api.js";
import Footer from "../components/Footer.jsx";
import items_load from "../assets/header-loading.gif";
import load from "../assets/count_load.gif";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState({});
    const [extra, setExtra] = useState(false);
    const [totalLoading, setTotalLoading] = useState(false)

    const [creatingOrder, setCreatingOrder] = useState(false)

    useEffect(() => {
        getCartItems()
    }, []);

    const getCartItems = () => {
        setTotalLoading(true)
        api
            .get("api/items/cart/")
            .then((res) => res.data)
            .then((data) => {
                setCartItems(data)
                getTotal(data)
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
                <BaseHeader/>
                <Header/>
                <div id="main">
                    <div style={creatingOrder ? {display: "none"} : {display: "flex"}}>
                        <ItemsList items={cartItems} onChange={() => {
                            getCartItems()
                        }}/>
                    </div>
                    <div id="main" style={!creatingOrder ? {display: "none"} : {display: "flex"}}>
                        <img src={load} style={{width: "500px", paddingTop: "13%", paddingLeft: "36%"}} alt=""/>
                    </div>
                    <MakeOrder createOrder={setCreatingOrder} total_load={totalLoading}
                               subtotal={total ? total.total : 0}/>
                </div>
                <Footer/>
            </div>
        )
    } else if (extra === true) {
        return (
            <div id='cart'>
                <BaseHeader/>
                <Header/>
                <div id="main">
                    <div><h1>No items</h1></div>
                </div>
                <Footer/>
            </div>
        )
    } else {
        return (
            <div id='cart'>
                <BaseHeader/>
                <Header/>
                <div id="main" style={{height: "805px"}}>
                    <img src={items_load} style={{margin: "auto", width: "400px"}} alt=""/>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default Cart;
