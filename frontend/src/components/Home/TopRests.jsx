import {useEffect, useState} from "react";
import RestaurantCard from "../RestaurantCard.jsx";
import api from "../../api.js";

function TopRests() {
    const [rests, setRests] = useState([]);

    useEffect(() => {
        getRests()
    }, []);

    const getRests = () => {
        api
            .get("api/restaurants/")
            .then((res) => res.data)
            .then((data) => setRests(data))
            .catch((err) => alert(err));
    }

    const topRests = rests.sort((a, b) => (b.rating - a.rating))
    const slicedRests = topRests.slice(0, 3);

    return (
        <div id="top-rests" className="container">
            <h2>Our Top <span>Restaurants</span></h2>
            <div id="tops">
                {slicedRests.map((rest) => <RestaurantCard rest={rest} />)}
            </div>
        </div>
    )
}

export default TopRests