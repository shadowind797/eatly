import CartItem from "./CartItem.jsx";
import PropTypes from "prop-types"

ItemsList.propTypes = {
  items: PropTypes.array.isRequired,
  cartItems: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
}

function ItemsList({items, cartItems, onChange}) {

    return (
        <div id='cart-items-list' className='container'>
            {items.map((item) => <CartItem dish={item} cartItem={cartItems.find(ci => ci.item_id === item.id)}
                                           onChange={onChange} key={item.id}/>)}
        </div>
    )
}

export default ItemsList;
