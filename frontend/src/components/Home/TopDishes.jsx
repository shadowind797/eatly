import Item from "../Item.jsx";
import {useEffect, useState} from "react";
import api from "../../api.js";

function TopDishes() {
    const [items, setItems] = useState([]);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        getItems()
    }, []);

    const getItems = () => {
        api
            .get("api/items/")
            .then((res) => res.data)
            .then((data) => setItems(data))
            .catch((err) => alert(err));
    }

    return (
        <div>
            {items.map((item) => <Item item={item} />)}
        </div>
    )
}

export default TopDishes;