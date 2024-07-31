import Header from "../components/Header.jsx";
import {useEffect, useState} from "react";
import CartItem from "../components/Cart/CartItem.jsx";
import api from "../api.js";
import RestaurantCard from "../components/RestaurantCard.jsx";
import ItemsList from "../components/Cart/ItemsList.jsx";
import BaseHeader from "../components/BaseHeader.jsx";

function Cart() {
        return (
        <div id='cart'>
            <BaseHeader />
            <Header />
            <ItemsList />
        </div>
    )
}

export default Cart;
