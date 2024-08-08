import { useEffect, useState } from "react";
import api from "../api";
import Item from "../components/Item";
import TopRests from "../components/Home/TopRests.jsx";
import TopDishes from "../components/Home/TopDishes.jsx";
import Header from "../components/Header.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import MainDiv from "../components/Menu/MainDiv.jsx";
import Items from "../components/Menu/Items.jsx";

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

    if (items.length === 0) {
        return (
            <div id="menu">
                <BaseHeader page="menu" />
                <Header page="menu" />
                <MainDiv setItems={setItems} updateSort={updateSort} />
                <TopRests />
                <TopDishes />
            </div>
        );
    } else if (items.length > 0) {
        return (
            <div id="menu">
                <BaseHeader page="menu" />
                <Header page="menu" />
                <MainDiv setItems={setItems} updateSort={updateSort} />
                <Items items={newItems}/>
            </div>
        );
    }
}

export default Menu;