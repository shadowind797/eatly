import React, {useEffect, useState} from "react";
import api from "../api.js";

function Item({item}) {
    const like = "http://127.0.0.1:8000/media/img/Heart.svg"
    const addToCart = "http://127.0.0.1:8000/media/img/AddToCart.svg"
    const star = "http://127.0.0.1:8000/media/img/Star.svg"

    const [category, setCategory] = useState("");
    const [style, setStyle] = useState({})

    useEffect(() => {
        getRestsCats()
    }, []);

    const getRestsCats = () => {
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

    return (
        <div className="dish">
            <img src={item.photo} alt=""/><img className="like" src={like} alt=""/>
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
                    <button>
                        <img src={addToCart} alt=""/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Item