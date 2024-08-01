import {useEffect, useState} from "react";
import api from "../../api.js";

function CartItem({cartItem}){
    const [dish, setDish] = useState({});
    const [quantity, setQuantity] = useState(cartItem.quantity);
    const [deleted, setDeleted] = useState(false);

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
    }

    const addQuantity = () => {
        api.post("api/items/cart/add", {item: dish.id, quantity: quantity + 1},
                                                    {params: {method: "addQuant"}})
                                                                .then((res) => {
            if (res.status === 201) {} else {
                alert("Failed to create item");
            }
        }).catch((err) => {});
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
    }

    if (deleted === false) {
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
    } else {
        return (<p></p>)
    }
}

export default CartItem