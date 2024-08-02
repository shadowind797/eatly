import api from "../../api.js";
import {useEffect, useState} from "react";
import Select from "react-select";
import item from "../Item.jsx";

function MakeOrder({subtotal}) {
    const [user, setUser] = useState({});
    const [coupon, setCoupon] = useState("");
    const cpImg = `${import.meta.env.VITE_API_URL}/media/img/coupon.svg`;
    const [applied, setApplied] = useState(null);
    const [firstName, setFirstName] = useState(user.first_name);
    const [addressList, setAddressList] = useState([]);
    const [addAddress, setAddAddress] = useState(false);
    const [addPayment, setAddPayment] = useState(false);
    const [paymentMode, setPaymentMode] = useState("Cash");

    const [building_address, setBuildingAddress] = useState("");
    const [entrance, setEntrance] = useState("");
    const [floor, setFloor] = useState("");
    const [flat, setFlat] = useState("");

    useEffect(() => {
        getUser()
        getAddressList()
    }, []);

    const getUser = () => {
        api
            .get("api/user/")
            .then((res) => res.data)
            .then((data) => {
                data.map((item) => {
                    setUser(item);
                })
            })
            .catch((err) => alert(err));
    }

    const getAddressList = () => {
        api
            .get("api/address/")
            .then((res) => res.data)
            .then((data) => {
                let list = []
                data.map((item) => {
                    list = [...list, {value: "some", label: `${item.house_address}, ${item.entrance} ent., ${item.floor} floor, flat ${item.flat}`}]
                    setAddressList(list);
                })
            })
            .catch((err) => alert(err));
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
        option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
            ...styles,
            backgroundColor: "#fff",
            color: isFocused ? "#6C5FBC" : "#201F1F",
            cursor: isDisabled ? 'not-allowed' : 'default',
            fontSize: "17px",
            fontWeight: "400",
            lineHeight: "117.5%", /* 23.5px */
        }),
    };

    if (!addAddress && !addPayment) {
        return (
            <div id="order">
                <div id="costs">
                    <form action={coupon ? "/checkcoupon" : ""}>
                        <div id="input">
                            <img src={cpImg} alt=""/>
                            <input type="text" placeholder="Apply Coupon" value={coupon} onChange={(e) => {
                                setCoupon(e.target.value)
                                setApplied(null)
                            }}/>
                        </div>
                        <button type="submit">Apply</button>
                    </form>
                    <h6>Subtotal: <span>${subtotal}</span></h6>
                    <h6>Delivery: <span>${(subtotal * 0.1).toFixed(2)}</span></h6>
                    <h6 className="total">Total: <span>${(subtotal * 1.1).toFixed(2)}</span></h6>
                </div>
                <div id="pay">
                    <div id="userInfo">
                        <input autoComplete="off" id="name" type="text" placeholder="How courier'll call you?"
                               value={firstName}
                               onChange={(e) => {
                                   setFirstName(e.target.value)
                               }}/>
                        <div id="address">
                            <Select
                                options={addressList}
                                styles={selectStyles}
                                placeholder='Where we should deliver your food?'
                            />
                            <button id="add-address" onClick={() => setAddAddress(true)}>Add address</button>
                        </div>
                        <div id="payment">
                            <h4>Select payment method</h4>
                            <div id="payment-method">
                                <button onClick={() => setPaymentMode("Cash")}
                                        className={paymentMode === "Cash" ? "active" : {}} ></button>
                                <button></button>
                                <button></button>
                            </div>
                            <Select
                                options={addressList}
                                styles={selectStyles}
                                placeholder='Select card'
                            />
                            <button id="add-address">Add payment method</button>
                        </div>
                        <button id="complete">Complete order</button>
                    </div>
                </div>
            </div>
        )
    }
    else if (addAddress && !addPayment) {
        return (
            <div id="order">
                <div id="new-address">
                    <form action={() => fetchAddress()}>
                        <div>
                            <input type="text" placeholder="Building"/>
                            <div>
                                <input type="text" placeholder="Entrance"/>
                                <input type="text" placeholder="Floor"/>
                                <input type="text" placeholder="Flat"/>
                            </div>
                        </div>
                        <div className="btns">
                            <button onClick={() => setAddAddress(false)}>Cancel</button>
                            <button type="submit" onClick={() => setAddAddress(false)}>Add address</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
    else if (!addAddress && addPayment) {
        return (
            <div id="order">

            </div>
        )
    }

}

export default MakeOrder