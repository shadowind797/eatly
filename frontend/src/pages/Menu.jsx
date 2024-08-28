import {useEffect, useState} from "react";
import api from "../api";
import Dish from "../components/Dish.jsx";
import TopRests from "../components/TopRests.jsx";
import TopDishes from "../components/TopDishes.jsx";
import Header from "../components/Header.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import MainDiv from "../components/Menu/MainDiv.jsx";
import Items from "../components/Menu/Items.jsx";
import Footer from "../components/Footer.jsx";
import header_load from "../assets/header-loading.gif"

function Menu() {
    const [items, setItems] = useState([]);
    const [newItems, setNewItems] = useState([]);
    const [sort, setSort] = useState("a-z");
    const [dir, setDir] = useState("asc");

    useEffect(() => {
        updateSort(sort, dir);
    }, [items]);

    const updateSort = (sort, dir) => {
        setSort(sort);
        setDir(dir);
        if (sort && dir && items.length > 0) {
            let sortedItems = [...items];
            if (sort === "a-z") {
                if (dir === "asc") {
                    sortedItems.sort((a, b) => a.title.localeCompare(b.title));
                } else {
                    sortedItems.sort((a, b) => b.title.localeCompare(a.title));
                }
            } else if (sort === "price") {
                if (dir === "asc") {
                    sortedItems.sort((a, b) => a.price - b.price);
                } else {
                    sortedItems.sort((a, b) => b.price - a.price);
                }
            } else if (sort === "rating") {
                if (dir === "asc") {
                    sortedItems.sort((a, b) => a.rating - b.rating);
                } else {
                    sortedItems.sort((a, b) => b.rating - a.rating);
                }
            }
            setNewItems(sortedItems);
        }
    };

    const checkPage = () => {
        if (items.length === 0) {
            return (
                <div>
                    <TopRests/>
                    <TopDishes/>
                </div>
            );
        } else if (items[0] === 'load items') {
            return (
                <img src={header_load} style={{width: "400px", margin: "auto"}} alt=""/>
            );
        } else if (newItems.length > 0 && newItems[0].photo) {
            return (
                <Items type="items" items={newItems}/>
            );
        } else if (newItems.length > 0 && newItems[0].image) {
            return (
                <Items type="rests" items={newItems}/>
            );
        } else if (newItems.length > 0 && JSON.stringify(newItems[0]) === JSON.stringify({not_found: "no items"})) {
            return (
                <Items type="items" items={newItems}/>
            );
        }
    }

    return (
        <div id="menu">
            <BaseHeader page="menu"/>
            <Header page="menu"/>
            <MainDiv setItems={setItems} updateSort={updateSort}/>
            {checkPage()}
            <Footer/>
        </div>
    );
}

export default Menu;