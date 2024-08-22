import {useEffect, useState} from "react";
import RestaurantCard from "./RestaurantCard.jsx";
import api from "../api.js";
import header_load from "../assets/header-loading.gif"

function TopRests() {
    const [rests, setRests] = useState([]);
    const ViewAll = `${import.meta.env.VITE_API_URL}/media/img/view-all.svg`
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
                setRests(data)
                setLoading(false)
            })
            .catch((err) => {
            });
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
                    {rests.map((rest) => <RestaurantCard rest={rest} key={rest.id}/>)}
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