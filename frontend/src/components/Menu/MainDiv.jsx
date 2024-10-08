import { useState } from "react";
import api from "../../api.js";
import AdSlider from "./Slider.jsx";
import Select from "react-select";
import CatFilterOption from "./CatFilterOption.jsx";
import RangeSlider from "./RangeInput.jsx";
import PropTypes from "prop-types";

MainDiv.propTypes = {
  setItems: PropTypes.func,
  updateSort: PropTypes.func,
  setInCartItems: PropTypes.func,
  setCategories: PropTypes.func,
  costDisabled: PropTypes.bool,
  item: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

function MainDiv({
  setItems,
  item,
  updateSort,
  setInCartItems,
  setCategories,
  costDisabled,
}) {
  const categoryImgs = [
    {
      id: 1,
      src: `${import.meta.env.VITE_API_URL}/media/img/cats/category-1.svg`,
    },
    {
      id: 2,
      src: `${import.meta.env.VITE_API_URL}/media/img/cats/category-2.svg`,
    },
    {
      id: 3,
      src: `${import.meta.env.VITE_API_URL}/media/img/cats/category-3.svg`,
    },
    {
      id: 4,
      src: `${import.meta.env.VITE_API_URL}/media/img/cats/category-4.svg`,
    },
    {
      id: 5,
      src: `${import.meta.env.VITE_API_URL}/media/img/cats/category-5.svg`,
    },
    {
      id: 6,
      src: `${import.meta.env.VITE_API_URL}/media/img/cats/category-6.svg`,
    },
    {
      id: 7,
      src: `${import.meta.env.VITE_API_URL}/media/img/cats/category-7.svg`,
    },
  ];

  const [catFilter, setCatFilter] = useState("");
  const [cost, setCost] = useState(20);
  const [costFilter, setCostFilter] = useState([15, 25]);

  const [sort, setSort] = useState("rating");
  const [sortDir, setSortDir] = useState("desc");

  const [search, setSearch] = useState("");
  const [foodSearch, setFoodSearch] = useState(true);
  const [restSearch, setRestSearch] = useState(false);

  const searchItems = (e) => {
    e.preventDefault();
    setItems(["load items"]);
    setCatFilter("");
    setCost(20);
    setCostFilter([15, 25]);
    if (search.includes(" ")) {
      api
        .get("api/items/search", {
          params: {
            search: search.split(" ")[0],
            also: search.split(" ")[1],
            search_mode: getSearchMode(),
          },
        })
        .then((res) => res.data)
        .then((data) => {
          updateSort(sort, sortDir);
          setItems(data.items);
          setCategories(data.cats);
          if (data.items[0] && data.items[0].photo) {
            setInCartItems(data.in_cart);
          }
        });
    } else {
      api
        .get("api/items/search", {
          params: { search: search, search_mode: getSearchMode() },
        })
        .then((res) => res.data)
        .then((data) => {
          updateSort(sort, sortDir);
          setItems(data.items);
          setCategories(data.cats);
          if (data.items[0] && data.items[0].photo) {
            setInCartItems(data.in_cart);
          }
        });
    }
    updateSort(sort, sortDir);
  };

  const filterItems = (e) => {
    e.preventDefault();
    setItems(["load items"]);
    setSearch("");
    api
      .post("api/items/search/filters/", {
        filters: { category: catFilter, cost: costFilter },
      })
      .then((res) => res.data)
      .then((data) => {
        setItems(data.items);
        setCategories(data.cats);
        setInCartItems(data.in_cart);
        updateSort(sort, sortDir);
      });
  };

  const getSearchMode = () => {
    if (foodSearch) {
      return "food";
    } else if (restSearch) {
      setSort("rating");
      return "rests";
    }
  };

  const filterSelectOptions = [
    { label: categoryImgs[3].src, value: "Desserts" },
    { label: categoryImgs[4].src, value: "Fish" },
    { label: categoryImgs[5].src, value: "Ice" },
    { label: categoryImgs[6].src, value: "Salads" },
  ];

  const sortSelectOptions = [
    { label: "Rating", value: "rating" },
    { label: "A-Z", value: "a-z" },
    { label: "Cost", value: "price" },
  ];
  const sortDirSelectOptions = [
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];

  const selectStyles = {
    control: (styles, { isFocused }) => ({
      ...styles,
      color: "#e8e8e8",
      backgroundColor: "#F9F9F9",
      border: isFocused ? "4px solid #6C5FBC" : "2px solid #FFF",
      fontSize: "40px",
      fontWeight: "800",
      lineHeight: "100.5%",
      transition: "0.2s",
      width: "134px",
      height: "80px",
      borderRadius: "10px",
      caretColor: "transparent",
      paddingLeft: "22px",
      cursor: "pointer",
      ":hover": {
        border: "4px solid #6C5FBC",
      },
      "::placeholder": {
        color: "#C2C3CB",
      },
    }),
    option: (styles, { isDisabled, isFocused }) => ({
      ...styles,
      backgroundColor: "#fff",
      color: isFocused ? "#6C5FBC" : "#201F1F",
      cursor: isDisabled ? "not-allowed" : "default",
      fontSize: "17px",
      fontWeight: "400",
      lineHeight: "117.5%" /* 23.5px */,
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      display: "none",
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      display: "none",
    }),
  };
  const sortSelectStyles = {
    control: (styles, { isFocused }) => ({
      ...styles,
      color: "#e8e8e8",
      backgroundColor: "#F9F9F9",
      border: isFocused ? "2px solid #6C5FBC" : "2px solid #FFF",
      fontSize: "17px",
      fontWeight: "500",
      lineHeight: "130.5%",
      transition: "0.2s",
      width: "164px",
      height: "33px",
      borderRadius: "10px",
      caretColor: "transparent",
      paddingLeft: "5px",
      ":hover": {
        border: "2px solid #6C5FBC",
      },
      "::placeholder": {
        color: "#C2C3CB",
      },
    }),
    option: (styles, { isDisabled, isFocused }) => ({
      ...styles,
      backgroundColor: "#fff",
      color: isFocused ? "#6C5FBC" : "#201F1F",
      cursor: isDisabled ? "not-allowed" : "default",
      fontSize: "17px",
      fontWeight: "400",
      lineHeight: "117.5%" /* 23.5px */,
    }),
  };

  const changeCatFilter = (cat) => {
    setCatFilter(cat.value);
  };
  const changeSortMethod = (method) => {
    setSort(method.value);
    updateSort(method.value, sortDir);
  };
  const changeSortSide = (side) => {
    setSortDir(side.value);
    updateSort(sort, side.value);
  };

  return (
    <div id="main-div" className="container">
      <div id="ad-search">
        <div id="ad-slider">
          <AdSlider />
        </div>
        <div
          id="search"
          className={item === "load items" ? "disabled-filters" : ""}
        >
          <form>
            <input
              type="text"
              placeholder="Search..."
              data-testid="search-input"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <button
              type="submit"
              data-testid="search-btn"
              onClick={(e) => searchItems(e)}
            >
              Search
            </button>
          </form>
          <div id="search-btns">
            <button
              id="food-search"
              data-testid="SM-food"
              className={foodSearch ? "active" : "passive"}
              onClick={() => {
                setFoodSearch(true);
                setRestSearch(false);
              }}
            >
              Food
            </button>
            <button
              id="rest-search"
              data-testid="SM-rests"
              className={restSearch ? "active" : "passive"}
              onClick={() => {
                setFoodSearch(false);
                setRestSearch(true);
              }}
            >
              Restaurants
            </button>
          </div>
        </div>
      </div>
      <div
        id="sort-filter"
        className={item === "load items" ? "disabled-filters" : ""}
      >
        <div className="categories">
          <h4>Category</h4>
          <div className="category-filter">
            <div
              data-testid="FF_FilterBtn"
              className={
                catFilter === "Fast Food" ? "cat-div active" : "cat-div"
              }
              id="fastfood"
              onClick={() => {
                setCatFilter("Fast Food");
              }}
            >
              <img src={categoryImgs[0].src} alt="" />
              <p>Fast Food</p>
            </div>
            <div
              className={catFilter === "Asian" ? "cat-div active" : "cat-div"}
              id="asian"
              onClick={() => {
                setCatFilter("Asian");
              }}
            >
              <img src={categoryImgs[1].src} alt="" />
              <p>Asian</p>
            </div>
            <div
              className={catFilter === "Meat" ? "cat-div active" : "cat-div"}
              id="meat"
              onClick={() => {
                setCatFilter("Meat");
              }}
            >
              <img src={categoryImgs[2].src} alt="" />
              <p>Meat</p>
            </div>
            <div id="select" data-testid="filter-select">
              <p className="other">Other categories</p>
              <Select
                options={filterSelectOptions}
                styles={selectStyles}
                components={{ Option: CatFilterOption }}
                formatOptionLabel={(cat) => (
                  <div className="country-option">
                    <img
                      src={cat.label}
                      alt="country-image"
                      style={{ width: "60px", marginRight: "10px" }}
                    />
                  </div>
                )}
                placeholder="..."
                onChange={changeCatFilter}
              />
            </div>
          </div>
        </div>
        <div id="sorting">
          <h4>Sorting</h4>
          <div id="sort-selects">
            <div className="sort-select" data-testid="sort-select">
              <p>Sort method</p>
              <Select
                options={sortSelectOptions}
                styles={sortSelectStyles}
                placeholder=""
                onChange={changeSortMethod}
                defaultValue={sortSelectOptions.find(
                  (opt) => opt.value === sort
                )}
                value={sortSelectOptions.find((opt) => opt.value === sort)}
                isDisabled={costDisabled}
              />
            </div>
            <div className="sort-select" data-testid="sortside-select">
              <p>Sort direction</p>
              <Select
                options={sortDirSelectOptions}
                styles={sortSelectStyles}
                placeholder=""
                onChange={changeSortSide}
                defaultValue={sortDirSelectOptions[0]}
              />
            </div>
          </div>
        </div>
        <div id="cost-filter">
          <h4>Cost range</h4>
          <RangeSlider
            min="0"
            max="90"
            value={cost}
            onChange={(e) => {
              const input = e.target.value;
              setCost(input);
              setCostFilter([Number(input) - 5, Number(input) + 5]);
            }}
          />
          <ul>
            <li>$0</li>
            <li>$10</li>
            <li>$20</li>
            <li>$30</li>
            <li>$40</li>
            <li>$50</li>
            <li>$60</li>
            <li>$70</li>
            <li>$80</li>
            <li>$90</li>
          </ul>
        </div>
        <button data-testid="filter-btn" onClick={(e) => filterItems(e)}>
          Filter
        </button>
      </div>
    </div>
  );
}

export default MainDiv;
