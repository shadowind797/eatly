import {useEffect, useState} from "react";
import api from "../../api.js";
import count_load from "../../assets/count_load.gif";
import plus from "../../assets/AddQuant.svg"
import minus from "../../assets/RemoveFromCart.svg"
import cross from "../../assets/cross.svg"


function CartItem({dish, cartItem, onChange}) {
    const [quantity, setQuantity] = useState(cartItem.quantity);
    const [deleted, setDeleted] = useState(false);

    const [itemLoad, setItemLoad] = useState(false)
    const [countLoad, setCountLoad] = useState(false)

    const deleteItem = () => {
        setItemLoad(true)
        api.delete("api/items/cart/delete",
            {params: {id: cartItem.id}})
            .then((res) => {
                if (res.status === 202) {
                    onChange()
                    setDeleted(true)
                    setItemLoad(false)
                } else if (res.status === 404) {
                }
            }).catch((err) => {
        });
    }

    const addQuantity = () => {
        setCountLoad(true)
        api.post("api/items/cart/add", {item: dish.id, quantity: quantity + 1},
            {params: {method: "addQuant"}})
            .then((res) => {
                if (res.status === 201) {
                    onChange()
                    setCountLoad(false)
                } else {
                    alert("Failed to create item");
                }
            }).catch((err) => {
        });
    }

    const removeQuantity = () => {
        setCountLoad(true)
        if (quantity > 1) {
            api.post("api/items/cart/add", {item: dish.id, quantity: quantity - 1},
                {params: {method: "addQuant"}})
                .then((res) => {
                    if (res.status === 201) {
                        onChange()
                        setCountLoad(false)
                    } else {
                        alert("Failed to create item");
                    }
                }).catch((err) => {
            });
        } else {
            deleteItem()
        }
    }

    if (deleted === false && !itemLoad) {
        return (
            <div className="item">
                <button data-testid="cross" className="cross" onClick={deleteItem}>
                    <img src={cross} alt=""/>
                </button>
                <div className="main">
                    <img src={`${import.meta.env.VITE_API_URL}/media/${dish.photo}`} alt=""/>
                    <div className="info">
                        <h4>{dish.title}</h4>
                        <h5>${dish.price}.99</h5>
                    </div>
                </div>
                <div className="quant">
                    <button data-testid="minus" onClick={() => {
                        setQuantity(quantity - 1)
                        removeQuantity()
                    }}>
                        <img src={minus} alt=""/>
                    </button>
                    <div>
                        <p>{countLoad ? (
                            <img style={{width: "60px", marginLeft: "10px"}} src={count_load} alt=""/>) : quantity}</p>
                    </div>
                    <button data-testid="plus" onClick={() => {
                        setQuantity(quantity + 1)
                        addQuantity()
                    }}>
                        <img src={plus} alt=""/>
                    </button>
                </div>
            </div>
        )
    } else if (itemLoad) {
        return (
            <div className="item">
                <img src={count_load} style={{width: "100px"}} alt=""/>
            </div>
        )
    }
}

export default CartItem