import React, {useEffect, useState} from "react";
import api from "../api.js";
import cat_load from "../assets/header-loading.gif";

function Restaurant({rest, category}) {
    const [style, setStyle] = useState({});
    const star = `${import.meta.env.VITE_API_URL}/media/img/Star.svg`
    const bookmark = `${import.meta.env.VITE_API_URL}/media/img/Bookmark.svg`
    const [catLoading, setCatLoading] = useState(false)

    useEffect(() => {
        const categoryStyles = {
            "Healthy": {backgroundColor: "rgba(44,196,105,0.45)", color: "#309D5B"},
            "Trending": {backgroundColor: "#F7C5BA", color: "#FB471D"},
            "Supreme": {backgroundColor: "#F7EDD0", color: "#DAA31A"},
            default: {backgroundColor: "#F7EDD0", color: "#DAA31A"},
        };

        setStyle(categoryStyles[category] || categoryStyles.default);
    }, []);

    return (
        <div className="rest-card">
            <img
                src={rest.image.includes(import.meta.env.VITE_API_URL) ? rest.image : `${import.meta.env.VITE_API_URL}${rest.image}`}
                alt="" className="rest-img"/>
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

export default Restaurant;