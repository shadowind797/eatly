import React, {useEffect, useState} from "react";
import api from "../api.js";

function Item({item}) {
    const like = `${import.meta.env.VITE_API_URL}/media/img/Heart.svg`
    const addToCart = `${import.meta.env.VITE_API_URL}/media/img/AddToCart.svg`
    const alreadyInCart = `${import.meta.env.VITE_API_URL}/media/img/tick.svg`
    const star = `${import.meta.env.VITE_API_URL}/media/img/Star.svg`

    const [category, setCategory] = useState("");
    const [style, setStyle] = useState({})
    const [inCart, setInCart] = useState(false);

    useEffect(() => {
        getCats()
        checkInCart()
    }, []);

    const getCats = () => {
        api
            .get("api/items/category/")
            .then((res) => res.data)
            .then((data) => {
                data.map((cat) => {
                    if (cat.id === item.category) {
                        setCategory(cat.name);
                        const categoryStyles = {
                            "Salads": { backgroundColor: "rgba(44,196,105,0.45)", color: "#309D5B" },
                            "Fast Food": { backgroundColor: "#F7C5BA", color: "#FB471D" },
                            "Ice": { backgroundColor: "rgba(0,149,255,0.52)", color: "#0047ff" },
                            "Asian": { backgroundColor: "rgba(238,0,255,0.32)", color: "#ff00f2" },
                        };
                        setStyle(categoryStyles[cat.name] || { backgroundColor: "#F7EDD0", color: "#DAA31A" });
                    }
                })
            })
            .catch((err) => alert(err));
    }

    const checkInCart = (addit) => {
        api.get("api/items/cart/check", {params: {item: item.id, extra: addit ? addit : {}}})
            .then((res) => {
                if (res.status === 200) {
                    setInCart(true)
                } else if (res.status === 404) {
                    setInCart(false)
                }
            })
            .then((data) => {})
            .catch((err) => {});
    }


    const createCartItem = (e) => {
        e.preventDefault();
        api.post("api/items/cart/add", {item: item.id, quantity: 1}).then((res) => {
            if (res.status === 201) {} else {
                alert("Failed to create item");
            }
        }).catch((err) => alert(err));
        checkInCart("true")
    }

    return (
        <div className="dish">
            <img className="photo" src={item.photo.includes(import.meta.env.VITE_API_URL) ? item.photo : `${import.meta.env.VITE_API_URL}${item.photo}`} alt=""/><img className="like" src={like} alt=""/>
            <div className="info">
                <div className="item-cat">
                    <div style={style}>{category}</div>
                    <h4>{item.title}</h4>
                </div>
                <div className="time-rating">
                    <p>~30min</p>
                    <div>
                        <img src={star} alt=""/>
                        <p>{item.rating}</p>
                    </div>
                </div>
                <div className="price-add">
                    <h5>{item.price}<span>.99</span></h5>
                    <button onClick={inCart ? {} : createCartItem}>
                        <img src={inCart ? alreadyInCart : addToCart} alt=""/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Item