import {useEffect, useState} from "react";
import api from "../api";
import Item from "../components/Item";
import TopRests from "../components/Home/TopRests.jsx";
import TopDishes from "../components/Home/TopDishes.jsx";
import Header from "../components/Header.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import MainDiv from "../components/Menu/MainDiv.jsx";


function Menu() {
    const [items, setItems] = useState([]);

    if (items.length === 0) {
        return (
            <div id="menu">
                <BaseHeader page="menu" />
                <Header page="menu" />
                <MainDiv setItems={setItems} />
                <TopRests/>
                <TopDishes />
            </div>
        )
    } else {
        return (
            <div id="menu">
                <BaseHeader page="menu" />
                <Header page="menu" />
                <MainDiv setItems={setItems} />
                {items.map(item => <Item item={item} key={item.id} />)}
            </div>
        )
    }
}

export default Menu
