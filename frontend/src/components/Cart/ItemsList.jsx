import {useEffect, useState} from "react";
import CartItem from "./CartItem.jsx";
import api from "../../api.js";

function ItemsList({items, onChange}){

    return (
        <div id='cart-items-list' className='container'>
            {items.map((item) => <CartItem cartItem={item} onChange={onChange} key={item.id} />)}
        </div>
    )
}

export default ItemsList;