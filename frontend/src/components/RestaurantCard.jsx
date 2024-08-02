import {useEffect, useState} from "react";
import api from "../api.js";

function RestaurantCard({rest}) {
    const [style, setStyle] = useState({});
    const [category, setCategory] = useState("");
    const star = `${import.meta.env.VITE_API_URL}/media/img/Star.svg`
    const bookmark = `${import.meta.env.VITE_API_URL}/media/img/Bookmark.svg`

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
                        if (restcat.name === "Healthy") {
                            setStyle({backgroundColor: "rgba(44,196,105,0.45)", color: "#309D5B"});
                        } else if (restcat.name === "Trending") {
                            setStyle({backgroundColor: "#F7C5BA", color: "#FB471D"})
                        } else {
                            setStyle({backgroundColor: "#F7EDD0", color: "#DAA31A"})
                        }
                    }
                })
            })
            .catch((err) => alert(err));
    }

    return (
        <div className="rest-card">
            <img src={rest.image} alt="" className="rest-img"/>
            <div className="info">
                <div className="cat" style={style}>{category}</div>
                <div className="text">
                    <h4>{rest.name}</h4>
                    <div className="widgets">
                        <div className="time-rating">
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