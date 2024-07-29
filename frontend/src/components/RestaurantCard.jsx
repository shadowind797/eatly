import {useEffect, useState} from "react";
import api from "../api.js";

function RestaurantCard({rest}) {
    const [category, setCategory] = useState("");
    const star = "http://127.0.0.1:8000/media/img/Star.svg"
    const bookmark = "http://127.0.0.1:8000/media/img/Bookmark.svg"

    useEffect(() => {
        getRestsCats()
    }, []);

    const getRestsCats = () => {
        api
            .get("api/restaurants/categories/")
            .then((res) => res.data)
            .then((data) => {
                data.map((restcat) => {
                    if (restcat.id === rest.category_id) {
                        setCategory(restcat.name)
                    }
                })
            })
            .catch((err) => alert(err));
    }

    return (
        <div className="rest-card">
            <img src={rest.image} alt=""/>
            <div>
                <div>{category}</div>
                <div>
                    <h4>{rest.name}</h4>
                    <div>
                        <div>
                            <p>~30min</p>
                            <div>
                                <img src={star} alt=""/>
                                <p>{rest.rating}</p>
                            </div>
                        </div>
                        <button>
                            <img src={bookmark} alt=""/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantCard;