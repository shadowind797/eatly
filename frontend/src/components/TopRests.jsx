import {useEffect, useState} from "react";
import Restaurant from "./Restaurant.jsx";
import api from "../api.js";
import header_load from "../assets/header-loading.gif"
import ViewAll from "../assets/view-all.svg"

function TopRests() {
    const [rests, setRests] = useState([]);
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getRests()
    }, []);

    const getRests = () => {
        setLoading(true)
        api
            .get("api/restaurants/", {params: {method: "top"}})
            .then((res) => res.data)
            .then((data) => {
                setRests(data.items)
                setCats(data.cats)
                setLoading(false)
            })
            .catch((err) => {
            });
    }

    const getCategory = (categoryId) => {
        const cat = cats.find((cat) => cat.id === categoryId) || {name: ""}
        return cat.name;
    }

    if (loading) {
        return (
            <div id="top-rests" className="container">
                <h2>Our Top <span>Restaurants</span></h2>
                <img src={header_load} style={{width: "300px"}} alt=""/>
            </div>
        )
    } else {
        return (
            <div id="top-rests" className="container">
                <h2>Our Top <span>Restaurants</span></h2>
                <div id="tops">
                    {rests.map((rest) => <Restaurant rest={rest}
                                                     key={rest.id}
                                                     category={getCategory(rest.category_id)}/>)}
                </div>
                <div className="view-all">
                    <a href="#">
                        <p>View All</p>
                        <img src={ViewAll} alt=""/>
                    </a>
                </div>
            </div>
        )
    }
}

export default TopRests