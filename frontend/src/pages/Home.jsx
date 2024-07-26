import {useEffect, useState} from "react";
import api from "../api";
import Item from "../components/Item";


function Home() {
    const [items, setItems] = useState([]);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        getItems()
    }, []);

    const getItems = () => {
        api
        .get("api/items/")
        .then((res) => res.data)
        .then((data) => setItems(data))
        .catch((err) => alert(err));
    }

    const deleteItem = (id) => {
        api.delete(`api/items/delete/${id}`).then((res) => {
            if (res.status === 204) {
                alert("Item deleted");
            } else {
                alert(`Error deleting item`);
            }
            getItems()
        }).catch((err) => alert(err));
    }

    const createItem = (e) => {
        e.preventDefault();
        api.post("api/items", {title, description, cost, photo, category}).then((res) => {
            if (res.status === 201) {
                alert("Item created");
            } else {
                alert("Failed to create item");
            }
        }).catch((err) => alert(err));
        getItems()
    }

    return <div>
        <div>
            {items.map((item) => <Item item={item} onDelete={deleteItem} />)}
        </div>
    </div>
}

export default Home