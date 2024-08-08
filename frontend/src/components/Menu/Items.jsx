import Item from "../Item.jsx";

function Items({ items }) {

    if (JSON.stringify(items[0]) === JSON.stringify({not_found: "no items"})) {
        return (
            <div>
                <h2>No items found.</h2>
                <p>Please try searching for something else.</p>
            </div>
        )
    } else if (items[0] !== undefined) {
        return (
            <div id="items-list" className="container">
                {items.map((item) => (
                    <Item item={item} key={item.id}/>
                ))}
            </div>
        )
    }
}

export default Items;