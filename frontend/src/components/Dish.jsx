import React, {useEffect, useState} from "react";
import api from "../api.js";
import cat_load from "../assets/header-loading.gif";
import inCart_load from "../assets/count_load.gif";


function Dish({item}) {
    const like = `${import.meta.env.VITE_API_URL}/media/img/Heart.svg`
    const addToCart = `${import.meta.env.VITE_API_URL}/media/img/AddToCart.svg`
    const alreadyInCart = `${import.meta.env.VITE_API_URL}/media/img/tick.svg`
    const star = `${import.meta.env.VITE_API_URL}/media/img/Star.svg`

    const [category, setCategory] = useState("");
    const [style, setStyle] = useState({})
    const [inCart, setInCart] = useState(false);

    const [catLoading, setCatLoading] = useState(false)
    const [inCartLoading, setInCartLoading] = useState(false)

    useEffect(() => {
        getCats()
        checkInCart()
    }, []);

    const getCats = () => {
        setCatLoading(true)
        api
            .get("api/items/category/")
            .then((res) => res.data)
            .then((data) => {
                data.map((cat) => {
                    if (cat.id === item.category) {
                        setCategory(cat.name);
                        const categoryStyles = {
                            "Salads": {backgroundColor: "rgba(44,196,105,0.45)", color: "#309D5B"},
                            "Fast Food": {backgroundColor: "#F7C5BA", color: "#FB471D"},
                            "Desserts": {backgroundColor: "rgba(199,158,236,0.59)", color: "#dd1dfb"},
                            "Fish": {backgroundColor: "rgba(158,236,224,0.3)", color: "#24968a"},
                            "Meat": {backgroundColor: "rgba(203,135,111,0.59)", color: "#fb6b1d"},
                            "Ice": {backgroundColor: "rgba(0,149,255,0.52)", color: "#0047ff"},
                            "Asian": {backgroundColor: "rgba(238,0,255,0.32)", color: "#ff00f2"},
                        };
                        setStyle(categoryStyles[cat.name] || {backgroundColor: "#F7EDD0", color: "#DAA31A"});
                    }
                })
                setCatLoading(false)
            })
            .catch((err) => {
            });
    }

    const checkInCart = (addit) => {
        setInCartLoading(true)
        api.get("api/items/cart/check", {params: {item: item.id, extra: addit ? addit : {}}})
            .then((res) => {
                if (res.status === 200) {
                    setInCart(true)
                    setInCartLoading(false)
                } else if (res.status === 204) {
                    setInCart(false)
                    setInCartLoading(false)
                }
            })
            .catch((err) => {
                setInCartLoading(false)
            });
    }


    const createCartItem = (e) => {
        e.preventDefault();
        setInCartLoading(true)
        api.post("api/items/cart/add", {item: item.id, quantity: 1}).then((res) => {
            if (res.status === 201) {
            } else {
            }
        }).catch((err) => {
        });
        checkInCart("true")
    }

    return (
        <div className="dish">
            <img className="photo"
                 src={item.photo.includes(import.meta.env.VITE_API_URL) ? item.photo : `${import.meta.env.VITE_API_URL}${item.photo}`}
                 alt=""/><img className="like" src={like} alt=""/>
            <div className="info">
                <div className="item-cat">
                    {catLoading ? (
                        <img src={cat_load} style={{width: "70px"}} alt=""/>
                    ) : (
                        <div style={style}>{category}</div>
                    )}
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
                    {inCartLoading ? (
                        <img style={{width: "45px", marginLeft: "80px"}} src={inCart_load} alt=""/>
                    ) : (
                        <button data-testid="add-to-cart-button" onClick={inCart ? () => {
                        } : createCartItem}>
                            <img src={inCart ? alreadyInCart : addToCart} alt=""/>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dish