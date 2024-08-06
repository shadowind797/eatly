import {useEffect, useState} from "react";
import api from "../api";
import Item from "../components/Item";
import TopRests from "../components/Home/TopRests.jsx";
import TopDishes from "../components/Home/TopDishes.jsx";
import Header from "../components/Header.jsx";
import BaseHeader from "../components/BaseHeader.jsx";


function Menu() {
    const [items, setItems] = useState([]);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");

    const [search, setSearch] = useState("");
    const [foodSearch, setFoodSearch] = useState(true);
    const [restSearch, setRestSearch] = useState(false);


    const searchItems = () => {
        if (search.includes(" ")) {
            api
                .get("api/items/search",
                    {params: {search: search.split( " ")[0], also: search.split(" ")[1], search_mode: getSearchMode()}})
                .then((res) => res.data)
                .then((data) => setItems(data))
                .catch((err) => alert(err));
        } else {
            api
                .get("api/items/search", {params: {search: search, search_mode: getSearchMode()}})
                .then((res) => res.data)
                .then((data) => setItems(data))
                .catch((err) => alert(err));
        }
    }

    const filterItems = () => {
        if (search.includes(" ")) {
            api
                .post("api/items/search/filters", {filters: [], search_mode: getSearchMode()})
                .then((res) => res.data)
                .then((data) => setItems(data))
                .catch((err) => alert(err));
        } else {
            api
                .post("api/items/search/filters", {filters: [], search_mode: getSearchMode()})
                .then((res) => res.data)
                .then((data) => setItems(data))
                .catch((err) => alert(err));
        }
    }

    const getSearchMode = () => {
        if (foodSearch) {
            return "food";
        } else if (restSearch) {
            return "rests";
        }
    }

    if (items.length === 0) {
        return (
            <div>
                <BaseHeader />
                <Header />
                <div>
                    <div id="search-input">
                        <input type="text" placeholder="search" value={search} onChange={e => {
                            setSearch(e.target.value);
                        }}/>
                        <button onClick={searchItems}>Search</button>
                    </div>
                    <div id="search-btns">
                        <button className={foodSearch ? "active" : "passive"} onClick={() => {
                            setFoodSearch(true);
                            setRestSearch(false)
                        }}>Food</button>
                        <button className={restSearch ? "active" : "passive"} onClick={() => {
                            setFoodSearch(false);
                            setRestSearch(true)
                        }}>Restaurants</button>
                    </div>
                </div>
                <TopRests/>
                <TopDishes />
            </div>
        )
    } else {
        return (
            <div>
                <BaseHeader />
                <Header />
                <div>
                    <div id="search-input">
                        <input type="text" placeholder="search" value={search} onChange={e => {
                            setSearch(e.target.value);
                        }}/>
                        <button onClick={searchItems}>Search</button>
                    </div>
                    <div id="search-btns">
                        <button className={foodSearch ? "active" : "passive"} onClick={() => {
                            setFoodSearch(true);
                            setRestSearch(false)
                        }}>Food</button>
                        <button className={restSearch ? "active" : "passive"} onClick={() => {
                            setFoodSearch(false);
                            setRestSearch(true)
                        }}>Restaurants</button>
                    </div>
                </div>
                {items.map(item => <Item item={item} key={item.id} />)}
            </div>
        )
    }
}

export default Menu
