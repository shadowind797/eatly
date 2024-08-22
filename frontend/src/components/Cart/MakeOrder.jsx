import api from "../../api.js";
import {useEffect, useState} from "react";
import Select from "react-select";
import item from "../Dish.jsx";
import {Navigate} from "react-router-dom";
import price_load from "../../assets/header-loading.gif";


/**
 * MakeOrder component handles the process of making an order, including user information, address selection, and order submission.
 *
 * @param {Object} props - The properties object.
 * @param {number} props.subtotal - The subtotal amount of the order.
 * @returns {JSX.Element} The rendered component.
 */

function MakeOrder({subtotal, total_load, createOrder}) {
    const [user, setUser] = useState({});
    const [coupon, setCoupon] = useState("");
    const [couponValue, setCouponValue] = useState(1);
    const cpImg = `${import.meta.env.VITE_API_URL}/media/img/coupon.svg`;
    const [applied, setApplied] = useState(null);
    const [firstName, setFirstName] = useState(user.first_name);
    const discount = (Math.abs((subtotal * 1.1) - ((subtotal * 1.1) * couponValue))).toFixed(2)

    const [addressList, setAddressList] = useState([]);
    const [address, setAddress] = useState(null);
    const [addAddress, setAddAddress] = useState(false);
    const [addressAlreadyExists, setAddressAlreadyExists] = useState(false);

    const [building_address, setBuildingAddress] = useState("");
    const [entrance, setEntrance] = useState("");
    const [floor, setFloor] = useState("");
    const [flat, setFlat] = useState("");

    const [toComplete, setToComplete] = useState(false);
    const [noItems, setNoItems] = useState(false);
    const [noName, setNoName] = useState(false);
    const [noAddress, setNoAddress] = useState(false)
    const [alreadyExists, setAlreadyExists] = useState(false)

    const [addressLoading, setAddressLoading] = useState(false)

    useEffect(() => {
        getUser()
        getAddressList()
    }, []);

    const changeAddress = (address) => {
        setAddress(address.value);
    }

    const getTotal = () => {
        if (couponValue === 1) {
            return (subtotal * 1.1).toFixed(2)
        } else {
            return ((subtotal * 1.1).toFixed(2) - discount).toFixed(2)
        }
    }

    const getUser = () => {
        api
            .get("api/user/")
            .then((res) => res.data)
            .then((data) => {
                data.map((item) => {
                    setUser(item);
                    setFirstName(item.first_name);
                })
            })
            .catch((err) => alert(err));
    }

    const getAddressList = () => {
        setAddressLoading(true)
        api
            .get("api/address/")
            .then((res) => res.data)
            .then((data) => {
                let list = []
                data.map((item) => {
                    list = [...list, {
                        value: item.id,
                        label: `${item.house_address}, ${item.entrance} ent., ${item.floor} floor, flat ${item.flat}`
                    }]
                    setAddressList(list);
                    setAddressLoading(false)
                    setAddAddress(false)
                })
            })
            .catch((err) => alert(err));
    }

    const checkCoupon = (e) => {
        e.preventDefault();
        api
            .post("api/coupon/", {method: "apply", title: coupon})
            .then((res) => {
                if (res.status === 200) {
                    setCouponValue(res.data.value);
                    setApplied(true);
                } else {
                    setCouponValue(1);
                    setApplied(false);
                }
            })
            .catch((err) => alert(err));
    }

    const setOrderData = (e) => {
        createOrder(true)
        if (subtotal > 1) {
            if (firstName) {
                if (address) {
                    e.preventDefault()
                    api
                        .post("api/order/add/", {total: getTotal(), status: 1, address: address})
                        .then(res => {
                            if (res.status === 201) {
                                createOrder(false)
                                setToComplete(true)
                            }
                        })
                        .catch((err) => {
                            if (err.response.status === 303) {
                                createOrder(false)
                                setAlreadyExists(true)
                            }
                        })
                    api
                        .post("api/user/change/", {method: "name", name: firstName})
                        .then((res) => {
                            if (res.status === 201) {
                            } else {
                            }
                        })
                } else {
                    setNoAddress(true)
                }
            } else {
                setNoName(true)
            }
        } else {
            setNoItems(true)
        }
    }

    const createAddress = (e) => {
        e.preventDefault()
        setAddressLoading(true)
        api
            .post("api/address/add/", {house_address: building_address, entrance: entrance, floor: floor, flat: flat})
            .then((res) => {
                if (res.status === 201) {
                    getAddressList()
                } else if (res.status === 409) {
                    setAddressAlreadyExists(true)
                }
            })
            .catch((err) => {
            })
    }

    const selectStyles = {
        control: (styles, {isFocused}) => ({
            ...styles,
            color: "#e8e8e8",
            backgroundColor: '#F9F9F9',
            border: isFocused ? "2px solid #6C5FBC" : "2px solid #FFF",
            fontSize: "18px",
            fontWeight: "600",
            lineHeight: "117.5%",
            transition: "0.2s",
            width: "470px",
            height: "55px",
            borderRadius: "10px",
            ":hover": {
                border: "2px solid #6C5FBC",
            },
            "::placeholder": {
                color: "#C2C3CB",
            },
        }),
        option: (styles, {data, isDisabled, isFocused, isSelected}) => ({
            ...styles,
            backgroundColor: "#fff",
            color: isFocused ? "#6C5FBC" : "#201F1F",
            cursor: isDisabled ? 'not-allowed' : 'default',
            fontSize: "17px",
            fontWeight: "400",
            lineHeight: "117.5%", /* 23.5px */
        }),
    };


    if (toComplete) {
        return <Navigate to="/complete-order"/>
    } else if (!addAddress) {
        return (
            <div id="order">
                <div id="costs">
                    <p className="error" style={applied === false ? {display: "block"} : {display: "none"}}>Invalid
                        coupon</p>
                    <form>
                        <div id="input">
                            <img src={cpImg} alt=""/>
                            <input type="text" placeholder="Apply Coupon" value={coupon} onChange={(e) => {
                                setCoupon(e.target.value)
                                setApplied(null)
                            }}/>
                        </div>
                        <button type="submit" onClick={e => {
                            checkCoupon(e)
                        }}>Apply
                        </button>
                    </form>
                    <h6>Subtotal: {total_load ? (
                        <img src={price_load} alt=""/>) : (
                        <span>${subtotal}</span>)}
                    </h6>
                    <h6>Delivery: {total_load ? (
                        <img src={price_load} alt=""/>) : (
                        <span>${(subtotal * 0.1).toFixed(2)}</span>)}
                    </h6>
                    <h6 style={applied ? {display: "flex"} : {display: "none"}}>
                        Coupon:
                        <span style={{color: "green"}}>
                            -${discount}
                        </span>
                    </h6>
                    <h6 className="total">Total: {total_load ? (
                        <img src={price_load} alt=""/>) : (
                        <span>${getTotal()}</span>)}</h6>
                </div>
                <div id="pay">
                    <div id="userInfo">
                        <div id="nameDiv">
                            <p className="error" style={noName ? {display: "block"} : {display: "none"}}>Please enter
                                your name</p>
                            <input autoComplete="off" id="name" type="text" placeholder="How courier'll call you?"
                                   value={firstName}
                                   onChange={(e) => {
                                       setFirstName(e.target.value)
                                   }}/>
                        </div>
                        <div id="address">
                            <p className="error" style={noAddress ? {display: "block"} : {display: "none"}}>Address
                                required</p>
                            <Select
                                options={addressList}
                                styles={selectStyles}
                                placeholder='Where should we deliver your order?'
                                onChange={changeAddress}
                            />
                            <button id="add-address" onClick={() => setAddAddress(true)}>Add address</button>
                        </div>
                        <p className="error" style={noItems ? {display: "block"} : {display: "none"}}>Your cart is
                            empty</p>
                        <p className="error" style={alreadyExists ? {display: "block"} : {display: "none"}}>
                            You already have staged order. Go <a href="/complete-order">here</a> to complete it
                        </p>
                        <button id="complete" onClick={e => {
                            setOrderData(e)
                        }}>
                            Complete order
                        </button>
                    </div>
                </div>
            </div>
        )
    } else if (addAddress) {
        return (
            <div id="order">
                <div id="new-address">
                    <div id="map">
                        <p>Map'll be here</p>
                    </div>
                    <form>
                        <div id="inputs">
                            <input type="text" placeholder="Building" value={building_address}
                                   onChange={(e) => {
                                       setBuildingAddress(e.target.value)
                                   }}/>
                            <div>
                                <input type="text" placeholder="Entrance" value={entrance}
                                       onChange={(e) => {
                                           setEntrance(e.target.value)
                                       }}/>
                                <input type="text" placeholder="Floor" value={floor}
                                       onChange={(e) => {
                                           setFloor(e.target.value)
                                       }}/>
                                <input type="text" placeholder="Flat" value={flat}
                                       onChange={(e) => {
                                           setFlat(e.target.value)
                                       }}/>
                            </div>
                        </div>
                        <div className="btns">
                            <button className="cancel" onClick={() => setAddAddress(false)}>Cancel</button>
                            <button className="add" type="submit" onClick={e => {
                                createAddress(e)
                            }}>
                                {addressLoading ? "Creating address..." : "Add address"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default MakeOrder