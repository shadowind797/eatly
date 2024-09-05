import { useEffect, useState } from "react";
import TopRests from "../components/TopRests.jsx";
import TopDishes from "../components/TopDishes.jsx";
import Header from "../components/Header.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import MainDiv from "../components/Menu/MainDiv.jsx";
import Items from "../components/Menu/Items.jsx";
import Footer from "../components/Footer.jsx";
import header_load from "../assets/loading_menu.webp";

function Menu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inCartItems, setInCartItems] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [sort, setSort] = useState("rating");
  const [dir, setDir] = useState("desc");
  const [costDisabled, setCostDisabled] = useState(false);

  useEffect(() => {
    if (items) {
      updateSort(sort, dir);
    } else {
      setNewItems(items);
    }
  }, [items]);

  useEffect(() => {
    if (newItems.length > 0 && newItems[0].image) {
      setCostDisabled(true);
    } else {
      setCostDisabled(false);
    }
  }, [newItems]);

  const updateSort = (sort, dir) => {
    setSort(sort);
    setDir(dir);
    if (sort && dir && items.length > 0) {
      let sortedItems = [...items];
      if (sort === "a-z") {
        if (dir === "asc") {
          sortedItems.sort((a, b) => a.title.localeCompare(b.title));
        } else {
          sortedItems.sort((a, b) => b.title.localeCompare(a.title));
        }
      } else if (sort === "price" && sortedItems[0].photo) {
        if (dir === "asc") {
          sortedItems.sort((a, b) => a.price - b.price);
        } else {
          sortedItems.sort((a, b) => b.price - a.price);
        }
      } else if (sort === "rating") {
        if (dir === "asc") {
          sortedItems.sort((a, b) => a.rating - b.rating);
        } else {
          sortedItems.sort((a, b) => b.rating - a.rating);
        }
      }
      setNewItems(sortedItems);
    } else {
      setNewItems(items);
    }
  };

  const checkPage = () => {
    if (JSON.stringify(items) === JSON.stringify({ not_found: "no items" })) {
      return <Items type="none" items={items} cats={[]} />;
    } else if (items && items.length === 0) {
      return (
        <div>
          <TopRests />
          <TopDishes />
        </div>
      );
    } else if (items && items[0] === "load items") {
      return (
        <img
          src={header_load}
          style={{ width: "400px", margin: "auto" }}
          id="loading"
        />
      );
    } else if (newItems.length > 0 && newItems[0].photo) {
      return (
        <Items
          type="items"
          items={newItems}
          cats={categories}
          inCartItems={inCartItems}
        />
      );
    } else if (newItems.length > 0 && newItems[0].image) {
      console.log(items);
      return <Items type="rests" items={newItems} cats={categories} />;
    }
  };

  return (
    <div id="menu">
      <BaseHeader page="menu" />
      <Header page="menu" />
      <MainDiv
        setItems={setItems}
        setCategories={setCategories}
        setInCartItems={setInCartItems}
        updateSort={updateSort}
        costDisabled={costDisabled}
        item={items[0]}
      />
      {checkPage()}
      <Footer />
    </div>
  );
}

export default Menu;
