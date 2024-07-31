import {useEffect, useState} from "react";
import api from "../../api.js";

function CartItem({cartItem}){
    const [dish, setDish] = useState({});
    const [quantity, setQuantity] = useState(cartItem.quantity);

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

    const addQuantity = () => {
        api.post("api/items/cart/add", {item: dish.id, quantity: quantity + 1},
                                                    {params: {method: "addQuant"}})
                                                                .then((res) => {
            if (res.status === 201) {} else {
                alert("Failed to create item");
            }
        }).catch((err) => alert(err));
    }

    const removeQuantity = () => {
        api.post("api/items/cart/add", {item: dish.id, quantity: quantity - 1},
            {params: {method: "addQuant"}})
            .then((res) => {
                if (res.status === 201) {} else {
                    alert("Failed to create item");
                }
            }).catch((err) => alert(err));
    }

    return (
        <div>
            <img src={dish.photo} alt=""/>
            <p>{quantity}</p>
            <button onClick={() => {
                setQuantity(quantity + 1)
                addQuantity()
            }}>addItem
            </button>
            <button onClick={() => {
                setQuantity(quantity - 1)
                removeQuantity()
            }}>removeItem
            </button>
        </div>
    )
}

export default CartItem