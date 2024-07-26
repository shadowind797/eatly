import React from "react";

function Item({item, onDelete}) {
    return <div className="item">
        <img src="" alt=""/>
        <h4>{item.title}</h4>
        <div>
            <p>{item.price}</p>
            <p></p>
        </div>
        <div>
            <div>
                <h5></h5>
                <p></p>
            </div>
            <button></button>
        </div>
    </div>
}

export default Item