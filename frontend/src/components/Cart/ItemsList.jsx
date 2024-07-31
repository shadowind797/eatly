import {useEffect, useState} from "react";
import CartItem from "./CartItem.jsx";
import api from "../../api.js";

function ItemsList(){
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        getCartItems()
    }, []);

    const getCartItems = () => {
        api
            .get("api/items/cart/")
            .then((res) => res.data)
            .then((data) => setCartItems(data))
    }

    return (
        <div id='cart'>
            <div>
                {cartItems.map((item) => <CartItem cartItem={item} />)}
            </div>
        </div>
    )
}

export default ItemsList;