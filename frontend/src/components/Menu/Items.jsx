import Dish from "../Dish.jsx";
import RestaurantCard from "../RestaurantCard.jsx";
import no_items from "../../assets/no-items-menu.svg"

function Items({items, type}) {

    if (JSON.stringify(items[0]) === JSON.stringify({not_found: "no items"})) {
        return (
            <div id="no-items">
                <img src={no_items} style={{width: "200px"}} alt=""/>
                <h2>No items found</h2>
                <p>Please, try searching for something else</p>
            </div>
        )
    } else if (items[0] !== undefined) {
        if (type === "items") {
            return (
                <div id="items-list" className="container" data-testid="filtered-items">
                    {items.map((item) => (
                        <Dish item={item} key={item.id}/>
                    ))}
                </div>
            )
        } else if (type === "rests") {
            return (
                <div id="items-list" className="container">
                    {items.map((item) => (
                        <RestaurantCard rest={item} key={item.id}/>
                    ))}
                </div>
            )
        }
    }
}

export default Items;