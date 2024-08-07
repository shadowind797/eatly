import {useState} from "react";
import api from "../../api.js";
import AdSlider from "./Slider.jsx";
import Select from "react-select";
import CatFilterOption from "./CatFilterOption.jsx";

function MainDiv({ setItems }) {
    const categoryImgs = [
        {id: 1, src: `${import.meta.env.VITE_API_URL}/media/img/cats/category-1.svg`},
        {id: 2, src: `${import.meta.env.VITE_API_URL}/media/img/cats/category-2.svg`},
        {id: 3, src: `${import.meta.env.VITE_API_URL}/media/img/cats/category-3.svg`},
        {id: 4, src: `${import.meta.env.VITE_API_URL}/media/img/cats/category-4.svg`},
        {id: 5, src: `${import.meta.env.VITE_API_URL}/media/img/cats/category-5.svg`},
        {id: 6, src: `${import.meta.env.VITE_API_URL}/media/img/cats/category-6.svg`},
        {id: 7, src: `${import.meta.env.VITE_API_URL}/media/img/cats/category-7.svg`},
    ]

    const [catFilter, setCatFilter] = useState("")
    const [costFilter, setCostFilter] = useState([0, 1000]);
    const [ratingFilter, setRatingFilter] = useState(0);

    const [search, setSearch] = useState("");
    const [foodSearch, setFoodSearch] = useState(true);
    const [restSearch, setRestSearch] = useState(false);


    const searchItems = (e) => {
        e.preventDefault();
        if (search.includes(" ")) {
            api
                .get("api/items/search",
                    {params: {search: search.split( " ")[0], also: search.split(" ")[1], search_mode: getSearchMode()}})
                .then((res) => res.data)
                .then((data) => setItems(data))
                .catch((err) => alert(err));
        } else {
            api
                .get("api/items/search", {params: {search: search, search_mode: getSearchMode()}})
                .then((res) => res.data)
                .then((data) => setItems(data))
                .catch((err) => alert(err));
        }
    }

    const filterItems = (e) => {
        e.preventDefault();
            api
                .post("api/items/search/filters/", {filters: {category: catFilter, cost: costFilter, rating: ratingFilter}})
                .then((res) => res.data)
                .then((data) => setItems(data))
                .catch((err) => alert(err));
    }

    const getSearchMode = () => {
        if (foodSearch) {
            return "food";
        } else if (restSearch) {
            return "rests";
        }
    }

    const filterSelectOptions = [
        {label: categoryImgs[3].src, value: "Deserts"},
        {label: categoryImgs[4].src, value: "Fish"},
        {label: categoryImgs[5].src, value: "Ice"},
        {label: categoryImgs[6].src, value: "Salads"},
    ]

    const selectStyles = {
        control: (styles, {isFocused}) => ({
            ...styles,
            color: "#e8e8e8",
            backgroundColor: '#F9F9F9',
            border: isFocused ? "2px solid #6C5FBC" : "2px solid #FFF",
            fontSize: "40px",
            fontWeight: "800",
            lineHeight: "100.5%",
            transition: "0.2s",
            width: "124px",
            height: "80px",
            borderRadius: "10px",
            caretColor: "transparent",
            paddingRight: "30px",
            paddingLeft: "30px",
            ":hover": {
                border: "2px solid #6C5FBC",
            },
            "::placeholder": {
                color: "#C2C3CB",
            },
        }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
            ...styles,
            backgroundColor: "#fff",
            color: isFocused ? "#6C5FBC" : "#201F1F",
            cursor: isDisabled ? 'not-allowed' : 'default',
            fontSize: "17px",
            fontWeight: "400",
            lineHeight: "117.5%", /* 23.5px */
        }),
        dropdownIndicator: (styles) => ({
            ...styles,
            display: 'none',
        }),
        indicatorSeparator: (styles) => ({
            ...styles,
            display: 'none',
        }),
    };

    return (
        <div id="main-div" className="container">
            <div id="ad-search">
                <div id="ad-slider">
                    <AdSlider/>
                </div>
                <div id="search">
                    <form>
                        <input type="text" placeholder="Search..." value={search} onChange={e => {
                            setSearch(e.target.value);
                        }}/>
                        <button type="submit" onClick={e => searchItems(e)}>Search</button>
                    </form>
                    <div id="search-btns">
                        <button id="food-search" className={foodSearch ? "active" : "passive"} onClick={() => {
                            setFoodSearch(true);
                            setRestSearch(false);
                        }}>Food
                        </button>
                        <button id="rest-search" className={restSearch ? "active" : "passive"} onClick={() => {
                            setFoodSearch(false);
                            setRestSearch(true);
                        }}>Restaurants
                        </button>
                    </div>
                </div>
            </div>
            <div id="sort-filter">
                <div className="categories">
                    <h4>Category</h4>
                    <div className="category-filter">
                        <div className="cat-div" id="fastfood">
                            <img src={categoryImgs[0].src} alt=""/>
                            <p>Fast Food</p>
                        </div>
                        <div className="cat-div" id="asian">
                            <img src={categoryImgs[1].src} alt=""/>
                            <p>Asian</p>
                        </div>
                        <div className="cat-div" id="meat">
                            <img src={categoryImgs[2].src} alt=""/>
                            <p>Meat</p>
                        </div>
                        <div>
                        <Select
                                options={filterSelectOptions}
                                styles={selectStyles}
                                components={{ Option: CatFilterOption }}
                                placeholder='...'
                                onChange={[]}
                            />
                        </div>
                    </div>
                </div>
                <div></div>
                <div></div>
                <button onClick={e => filterItems(e)}>Filter</button>
            </div>
        </div>
    )
}

export default MainDiv