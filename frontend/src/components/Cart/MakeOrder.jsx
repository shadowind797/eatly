import api from "../../api.js";
import {useEffect, useRef, useState} from "react";
import Select from "react-select";
import item from "../Dish.jsx";
import {Navigate} from "react-router-dom";
import price_load from "../../assets/header-loading.gif";
import Map from "./Map.jsx";
import PlaceInput from "./PlaceInput.jsx";
import cpImg from "../../assets/coupon.svg"

function MakeOrder({subtotal, total_load, createOrder, test, rests, changeItems, items, updateTotal}) {
    const [user, setUser] = useState({});
    const [coupon, setCoupon] = useState("");
    const [couponValue, setCouponValue] = useState(1);
    const [applied, setApplied] = useState(null);
    const [firstName, setFirstName] = useState(user.first_name || "");
    const discount = (Math.abs((subtotal * 1.1) - ((subtotal * 1.1) * couponValue))).toFixed(2)
    const [phone, setPhone] = useState(user.phone || "")
    const [restaurant, setRestaurant] = useState(rests[0].id);
    const [restList, setRestList] = useState([])

    const [addressList, setAddressList] = useState([]);
    const [address, setAddress] = useState(null);
    const [addAddress, setAddAddress] = useState(false);
    const [addressAlreadyExists, setAddressAlreadyExists] = useState(false);

    const [buildingAddress, setBuildingAddress] = useState("");
    const [entrance, setEntrance] = useState("");
    const [floor, setFloor] = useState("");
    const [flat, setFlat] = useState("");

    const [toComplete, setToComplete] = useState(false);
    const [noItems, setNoItems] = useState(false);
    const [noName, setNoName] = useState(false);
    const [noAddress, setNoAddress] = useState(false)
    const [noPhone, setNoPhone] = useState(false)
    const [noRest, setNoRest] = useState(false)
    const [alreadyExists, setAlreadyExists] = useState(false)
    const [noBuilding, setNoBuilding] = useState(false)

    const [addressLoading, setAddressLoading] = useState(false)
    const [mapLoading, setMapLoading] = useState(false)
    const [couponLoading, setCouponLoading] = useState(false)

    useEffect(() => {
        if (restaurant) {
            const oneRestItems = items.filter(item => item.restaurant_id === restaurant)
            changeItems(oneRestItems)
            updateTotal(oneRestItems, restaurant)
        }
    }, [restaurant])

    useEffect(() => {
        getUser()
        getAddressList()
    }, []);

    useEffect(() => {
        if (rests) {
            let list = []
            rests.map((item) => {
                list = [...list, {
                    value: item.id,
                    label: item.name
                }]
            })
            setRestList(list);
        }
    }, [rests])

    const changeAddress = (address) => {
        setAddress(address.value);
    }

    const changeRest = (rest) => {
        setRestaurant(rest.value);
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
                    setPhone(item.phone);
                })
            })
            .catch((err) => {
            });
    }

    const checkAddressFormat = address => {
        let formattedAddress = address.house_address
        if (address.entrance.length > 0) {
            formattedAddress += `, ${address.entrance} ent.`
        }
        if (address.floor.length > 0) {
            formattedAddress += `, ${address.floor} floor`
        }
        if (address.flat.length > 0) {
            formattedAddress += `, flat ${address.flat}`
        }
        return formattedAddress
    }

    const getAddressList = (add) => {
        api
            .get("api/address/")
            .then((res) => res.data)
            .then((data) => {
                let list = []
                data.map((item) => {
                    list = [...list, {
                        value: item.id,
                        label: checkAddressFormat(item)
                    }]
                    setAddressList(list);
                })
                if (add) {
                    setAddAddress(false)
                    setAddressLoading(false)
                }
            })
            .catch((err) => {
            });
    }

    const checkCoupon = (e) => {
        e.preventDefault();
        setCouponLoading(true)
        api
            .post("api/coupon/", {method: "apply", title: coupon})
            .then((res) => {
                if (res.status === 200) {
                    setCouponValue(res.data.value);
                    setApplied(true);
                    setCouponLoading(false);
                } else {
                    setCouponValue(1);
                    setApplied(false);
                    setCouponLoading(false);
                }
            })
            .catch((err) => {
            });
    }

    const setOrderData = (e) => {
        createOrder(true)
        if (subtotal > 1) {
            if (firstName) {
                if (address) {
                    e.preventDefault()
                    api
                        .post("api/order/add/", {rest_id: restaurant, status: 1, address: address, coupon: coupon})
                        .then(res => {
                            if (res.status === 201) {
                                createOrder(false)
                                setToComplete(true)
                            } else if (res.status === 303) {
                                createOrder(false)
                                setAlreadyExists(true)
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
                    createOrder(false)
                }
            } else {
                setNoName(true)
                createOrder(false)
            }
        } else {
            setNoItems(true)
            createOrder(false)
        }
    }

    const createAddress = (e) => {
        e.preventDefault()
        setAddressLoading(true)
        if (buildingAddress.length > 0) {
            api
                .post("api/address/add/", {
                    house_address: buildingAddress,
                    entrance: entrance,
                    floor: floor,
                    flat: flat
                })
                .then((res) => {
                    if (res.status === 201) {
                        getAddressList(true)
                    } else if (res.status === 409) {
                        setAddressAlreadyExists(true)
                        setAddressLoading(false)
                    }
                })
                .catch((err) => {
                    if (err.response.status === 409) {
                        setAddressAlreadyExists(true)
                        setAddressLoading(false)
                    }
                })
        } else {
            setNoBuilding(true)
            setAddressLoading(false)
        }
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
                        }}>{couponLoading ? "Applying..." : "Apply"}
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
                        {phone.length > 0 ? <div id="address" data-testid="address-select">
                            {noAddress && <p className="error">Address required</p>}
                            <div id="nameDiv">
                                {noName && <p className="error">Please enter your name</p>}
                                <input autoComplete="off" id="name" type="text" placeholder="How courier'll call you?"
                                       value={firstName}
                                       onChange={(e) => {
                                           setFirstName(e.target.value)
                                       }}/>
                            </div>
                            <div id="phoneDiv">
                                {noPhone && <p className="error">Please provide us phone number</p>}
                                <input autoComplete="off" id="name" type="phone" placeholder="Phone number"
                                       value={phone}
                                       onChange={(e) => {
                                           setPhone(e.target.value)
                                       }}/>
                            </div>
                        </div> : <div className="input-load">Loading...</div>}
                        {restList.length > 0 ? <div id="restDiv">
                            {noRest && <p className="error">Please select restaurant to deliver from</p>}
                            <Select
                                options={restList}
                                styles={selectStyles}
                                placeholder='From which restaurant you want to order?'
                                onChange={changeRest}
                                defaultValue={restList[0]}
                            />
                        </div> : <div className="input-load">Loading...</div>}
                        {addressList.length > 0 ? <div id="address" data-testid="address-select">
                            {noAddress && <p className="error">Address required</p>}
                            <Select
                                options={addressList}
                                styles={selectStyles}
                                placeholder='Where should we deliver your order?'
                                onChange={changeAddress}
                            />
                            <button id="add-address" onClick={() => setAddAddress(true)}>Add address</button>
                        </div> : <div className="input-load">Loading...</div>}
                        {noItems && <p className="error">Your cart is empty</p>}
                        {alreadyExists &&
                            <p className="error">You already have staged order. Go <a href="/complete-order">here</a> to
                                complete it</p>}
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
                    <Map address={buildingAddress} setIsLoaded={setMapLoading}/>
                    {addressAlreadyExists &&
                        <p className="error" style={{paddingBottom: "4px"}}>You already add this address</p>}
                    {mapLoading && (
                        <div id="place-input">
                            {noBuilding &&
                                <p className="error" style={{paddingBottom: "4px"}}>Building address is required</p>}
                            <PlaceInput finalAddress={(a) => {
                                setBuildingAddress(a)
                            }}/>
                        </div>
                    )}
                    <form>
                        <div id="inputs">
                            {test && <input type="text" placeholder="Building" value={buildingAddress}
                                            onChange={(e) => {
                                                setBuildingAddress(e.target.value)
                                            }}/>}
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
                            <button className="cancel" onClick={() => {
                                setBuildingAddress("")
                                setEntrance("")
                                setFloor("")
                                setFlat("")
                                setAddAddress(false)
                                setNoBuilding(false)
                                setAddressAlreadyExists(false)
                            }}>Cancel
                            </button>
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