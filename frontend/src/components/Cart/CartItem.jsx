import {useEffect, useState} from "react";
import api from "../../api.js";

function CartItem({cartItem, onChange}){
    const [dish, setDish] = useState({});
    const [quantity, setQuantity] = useState(cartItem.quantity);
    const [deleted, setDeleted] = useState(false);
    const plus = `${import.meta.env.VITE_API_URL}/media/img/AddQuant.svg`
    const minus = `${import.meta.env.VITE_API_URL}/media/img/RemoveFromCart.svg`
    const cross = `${import.meta.env.VITE_API_URL}/media/img/cross.svg`

    useEffect(() => {
        getItems()
    }, []);

    const getItems = () => {
        api
            .get("api/items/", {params: {id: cartItem.item}})
            .then((res) => res.data)
            .then((data) => {
                data.map((item) => {
                    if (item.id === cartItem.item) {
                        setDish(item)
                    }
                })
            })
            .catch((err) => alert(err));
    }

    const deleteItem = () => {
        api.delete("api/items/cart/delete",
            {params: {id: cartItem.id}})
            .then((res) => {
                if (res.status === 202) {}
                else if (res.status === 404) {}
            }).catch((err) => {});
        setDeleted(true)
        onChange()
    }

    const addQuantity = () => {
        api.post("api/items/cart/add", {item: dish.id, quantity: quantity + 1},
                                                    {params: {method: "addQuant"}})
                                                                .then((res) => {
            if (res.status === 201) {} else {
                alert("Failed to create item");
            }
        }).catch((err) => {});
        onChange()
    }

    const removeQuantity = () => {
        if (quantity > 1) {
            api.post("api/items/cart/add", {item: dish.id, quantity: quantity - 1},
                {params: {method: "addQuant"}})
                .then((res) => {
                    if (res.status === 201) {
                    } else {
                        alert("Failed to create item");
                    }
                }).catch((err) => {
            });
        } else {
            deleteItem()
        }
        onChange()
    }

    if (deleted === false) {
        return (
            <div className="item">
                <button className="cross" onClick={() => deleteItem()}>
                    <img src={cross} alt=""/>
                </button>
                <div className="main">
                    <img src={dish.photo} alt=""/>
                    <div className="info">
                        <h4>{dish.title}</h4>
                        <h5>${dish.price}.99</h5>
                    </div>
                </div>
                <div className="quant">
                    <button onClick={() => {
                        setQuantity(quantity - 1)
                        removeQuantity()
                    }}>
                        <img src={minus} alt=""/>
                    </button>
                    <div>
                        <p>{quantity}</p>
                    </div>
                    <button onClick={() => {
                        setQuantity(quantity + 1)
                        addQuantity()
                    }}>
                        <img src={plus} alt=""/>
                    </button>
                </div>
            </div>
        )
    } else {
        return (<p></p>)
    }
}

export default CartItem