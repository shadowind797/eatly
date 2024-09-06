import CartItem from "./CartItem.jsx";
import PropTypes from "prop-types";

ItemsList.propTypes = {
  items: PropTypes.array.isRequired,
  cartItems: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  rest: PropTypes.object,
};

function ItemsList({ items, cartItems, onChange, rest }) {
  return (
    <div>
      <div id="rest-name">
        <img src={rest ? `${import.meta.env.VITE_API_URL}/media${rest.logo}` : ""} alt="" />
        <h2>
          {rest && rest.name} - <span>{items && items.length} dishes</span>
        </h2>
      </div>
      <div id="cart-items-list" className="container">
        {items.map((item) => (
          <CartItem
            dish={item}
            cartItem={cartItems.find((ci) => ci.item_id === item.id)}
            onChange={onChange}
            key={item.id}
          />
        ))}
      </div>
    </div>
  );
}

export default ItemsList;
