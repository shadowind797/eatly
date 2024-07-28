import React from "react";

function Item({item, onDelete}) {
    return <div className="item">
        <img src={item.photo} alt=""/>
        <h4>{item.title}</h4>
        <div>
            <p>{item.price}</p>
            <p></p>
        </div>
        <div>
            <div>
                <p></p>
                <p></p>
            </div>
            <button></button>
        </div>
    </div>
}

export default Item