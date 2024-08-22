import Dish from "./Dish.jsx";
import {useEffect, useState} from "react";
import api from "../api.js";
import header_load from "../assets/header-loading.gif"


function TopDishes() {
    const [items, setItems] = useState([]);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const ViewAll = `${import.meta.env.VITE_API_URL}/media/img/view-all.svg`
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getItems()
    }, []);

    const getItems = () => {
        setLoading(true)
        api
            .get("api/items/", {params: {method: "top"}})
            .then((res) => res.data)
            .then((data) => {
                setLoading(false)
                setItems(data)
            })
            .catch((err) => alert(err));
    }

    if (loading) {
        return (
            <div id="top-dishes" className="container">
                <h2>Our Top <span>Dishes</span></h2>
                <img src={header_load} style={{width: "300px"}} alt=""/>
            </div>
        )
    } else {
        return (
            <div id="top-dishes" className="container">
                <h2>Our Top <span>Dishes</span></h2>
                <div className="tops">
                    {items.map((item) => <Dish item={item} key={item.id}/>)}
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
}

export default TopDishes;