import Item from "../Item.jsx";
import {useEffect, useState} from "react";
import api from "../../api.js";

function TopDishes() {
    const [items, setItems] = useState([]);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const ViewAll = "http://127.0.0.1:8000/media/img/view-all.svg"

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

    const topFood = items.sort((a, b) => (b.rating - a.rating))
    const slicedFood = topFood.slice(0, 5);

    return (
        <div id="top-dishes" className="container">
            <h2>Our Top <span>Dishes</span></h2>
            <div className="tops">
                {slicedFood.map((item) => <Item item={item}/>)}
            </div>
            <div className="view-all">
                <a href="#">
                    <p>View All</p>
                    <img src={ViewAll} alt=""/>
                </a>
            </div>
        </div>
    )
}

export default TopDishes;