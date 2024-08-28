import Dish from "./Dish.jsx";
import {useEffect, useState} from "react";
import api from "../api.js";
import header_load from "../assets/header-loading.gif"


function TopDishes() {
    const [items, setItems] = useState([]);
    const ViewAll = `${import.meta.env.VITE_API_URL}/media/img/view-all.svg`
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([]);
    const [inCartItems, setInCartItems] = useState([]);

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
                setItems(data.items)
                setCategories(data.cats)
                setInCartItems(data.in_cart)
            })
            .catch((err) => {
            });
    }

    const getCategory = (categoryId) => {
        const cat = categories.find((cat) => cat.id === categoryId) || {name: ""}
        return cat.name;
    }

    const checkInCart = (itemId) => {
        const isInCart = inCartItems.find((item) => item.item === itemId)

        return isInCart !== undefined;
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
                    {items.map((item) => <Dish item={item}
                                               category={getCategory(item.category)}
                                               key={item.id}
                                               inCart={checkInCart(item.id)}/>)}
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