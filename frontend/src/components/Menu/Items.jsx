import Dish from "../Dish.jsx";
import Restaurant from "../Restaurant.jsx";
import no_items from "../../assets/no-items-menu.svg";
import PropTypes from "prop-types";

function Items({ items, type, cats, inCartItems }) {
  const getCategory = (categoryId) => {
    const cat = cats.find((cat) => cat.id === categoryId) || { name: "" };
    return cat.name;
  };

  const checkInCart = (itemId) => {
    const isInCart = inCartItems.find((item) => item.item === itemId);

    return isInCart !== undefined;
  };

  if (JSON.stringify(items[0]) === JSON.stringify({ not_found: "no items" })) {
    return (
      <div id="no-items">
        <img src={no_items} style={{ width: "200px" }} alt="" />
        <h2>No items found</h2>
        <p>Please, try searching for something else</p>
      </div>
    );
  } else if (items[0] !== undefined) {
    if (type === "items") {
      return (
        <div id="items-list" className="container" data-testid="filtered-items">
          {items.map((item) => (
            <Dish
              item={item}
              category={getCategory(item.category)}
              key={item.id}
              inCart={checkInCart(item.id)}
            />
          ))}
        </div>
      );
    } else if (type === "rests") {
      return (
        <div id="items-list" className="container">
          {items.map((item) => (
            <Restaurant
              rest={item}
              key={item.id}
              category={getCategory(item.category_id)}
            />
          ))}
        </div>
      );
    }
  }
}

Items.propTypes = {
  items: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  cats: PropTypes.array.isRequired,
  inCartItems: PropTypes.array.isRequired,
};


export default Items;
