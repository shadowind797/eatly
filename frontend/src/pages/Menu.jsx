import {useEffect, useState} from "react";
import api from "../api";
import Item from "../components/Item";
import TopRests from "../components/Home/TopRests.jsx";
import TopDishes from "../components/Home/TopDishes.jsx";


function Menu() {
    const [items, setItems] = useState([]);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");

    const [search, setSearch] = useState("");
    const [foodSearch, setFoodSearch] = useState(true);
    const [restSearch, setRestSearch] = useState(false);


    const searchItems = () => {
        api
            .get("api/items/search", {params: {search: search, search_method: getSearchMethod()}})
            .then((res) => res.data)
            .then((data) => setItems(data))
            .catch((err) => alert(err));
    }

    const getSearchMethod = () => {
        if (foodSearch) {
            return "food";
        } else if (restSearch) {
            return "restaurants";
        }
    }

    return (
        <div>
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
}

export default Menu
