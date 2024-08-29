import {useEffect, useState} from "react";
import CartItem from "./CartItem.jsx";
import api from "../../api.js";

function ItemsList({items, cartItems, onChange}) {

    return (
        <div id='cart-items-list' className='container'>
            {items.map((item) => <CartItem dish={item} cartItem={cartItems.find(ci => ci.item_id === item.id)}
                                           onChange={onChange} key={item.id}/>)}
        </div>
    )
}

export default ItemsList;