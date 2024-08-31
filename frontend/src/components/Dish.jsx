import React, {useEffect, useState} from "react";
import api from "../api.js";
import inCart_load from "../assets/count_load.gif";
import like from "../assets/Heart.svg"
import addToCart from "../assets/AddToCart.svg"
import alreadyInCart from "../assets/tick.svg"
import star from "../assets/Star.svg"

function Dish({item, category, inCart}) {
    const [style, setStyle] = useState({})

    const [itemInCart, setInCart] = useState(false)
    const [inCartLoading, setInCartLoading] = useState(false)

    useEffect(() => {
        const categoryStyles = {
            "Salads": {backgroundColor: "rgba(44,196,105,0.45)", color: "#309D5B"},
            "Fast Food": {backgroundColor: "#F7C5BA", color: "#FB471D"},
            "Desserts": {backgroundColor: "rgba(199,158,236,0.59)", color: "#dd1dfb"},
            "Fish": {backgroundColor: "rgba(158,236,224,0.3)", color: "#24968a"},
            "Meat": {backgroundColor: "rgba(203,135,111,0.59)", color: "#fb6b1d"},
            "Ice": {backgroundColor: "rgba(0,149,255,0.52)", color: "#0047ff"},
            "Asian": {backgroundColor: "rgba(238,0,255,0.32)", color: "#ff00f2"},
        };
        setStyle(categoryStyles[category] || {backgroundColor: "#F7EDD0", color: "#DAA31A"});
    }, []);

    const setCartStyle = (type) => {
        if (itemInCart || inCart) {
            return type === "img" ? alreadyInCart : () => {
            };
        } else {
            return type === "img" ? addToCart : e => createCartItem(e);
        }
    }

    const createCartItem = (e) => {
        e.preventDefault();
        setInCartLoading(true)
        api.post("api/items/cart/add", {item: item.id, quantity: 1}).then((res) => {
            if (res.status === 201) {
                setInCart(true)
                setInCartLoading(false)
            } else {
            }
        }).catch((err) => {
        });
    }

    return (
        <div className="dish">
            <img className="photo"
                 src={item.photo.includes(import.meta.env.VITE_API_URL) ? item.photo : `${import.meta.env.VITE_API_URL}${item.photo}`}
                 alt=""/>
            <img className="like" src={like} alt=""/>
            <div className="info">
                <div className="item-cat">
                    <div style={style}>{category}</div>
                    <h4>{item.title}</h4>
                </div>
                  <div className="time-rating">
                      <p className="rest">{item.rest_name}</p>
                      <div>
                          <p data-testid="item-rate">{item.rating}</p>
                          <img src={star} alt=""/>
                      </div>
                  </div>
                  <div className="price-add">
                      <h5 data-testid="item-cost">{item.price}<span>.99</span></h5>
                      {inCartLoading ? (
                          <img style={{width: "45px", marginLeft: "80px"}} src={inCart_load} alt=""/>
                      ) : (
                          <button data-testid="add-to-cart-button" onClick={setCartStyle("btn")}>
                              <img src={setCartStyle("img")} alt=""/>
                          </button>
                      )}
                  </div>
            </div>
        </div>
    )
}

export default Dish
