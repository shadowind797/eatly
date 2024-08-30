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
    const [oneRestItems, setOneRestItems] = useState([]);
    const [items, setItems] = useState([]);
    const [rests, setRests] = useState([]);
    const [total, setTotal] = useState({});
    const [extra, setExtra] = useState(false);
    const [totalLoading, setTotalLoading] = useState(false)

    const [creatingOrder, setCreatingOrder] = useState(false)

    useEffect(() => {
        getCartData()
    }, []);

    const getTotal = (items, cartItems, rest) => {
        let total = 0
        cartItems.map(cartItem => {
            const matchingItem = items.find(item => item.id === cartItem.item_id && item.restaurant_id === rest);
            if (matchingItem) {
                total += (matchingItem.price + 0.99) * cartItem.quantity
            }
        });
        if (total === 0) {
            setExtra(true)
        }
        setTotal(total.toFixed(2))
    }

    const getCartData = () => {
        api
            .get("api/items/cart/data/")
            .then((res) => res.data)
            .then((data) => {
                console.log("fetch completed")
                if (data.items.length === 0) {
                    setExtra(true)
                }
                setRests(data.rests)
                setItems(data.items)
                setCartItems(data.cart_items)
                getTotal(data.items, data.cart_items, data.rests[0].id)
            })
    }

    if (cartItems.length > 0 && total > 0) {
        return (
            <div id='cart'>
                <BaseHeader page="cart"/>
                <div id="main">
                    {!creatingOrder && <ItemsList rests={rests} items={oneRestItems} cartItems={cartItems}
                                                  onChange={getCartData}/>}
                    {creatingOrder && <div style={{width: "100%"}}>
                        <img src={load} style={{width: "500px", paddingTop: "10%", paddingLeft: "36%"}} alt=""/>
                    </div>}
                    <div style={creatingOrder ? {display: "none"} : {display: "block"}}>
                        <MakeOrder rests={rests} test={test} createOrder={setCreatingOrder}
                                   total_load={totalLoading}
                                   items={items}
                                   subtotal={total ? total : 0}
                                   changeItems={setOneRestItems}
                                   updateTotal={((items, restId) => getTotal(items, cartItems, restId))}/>
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
