import Info from "../components/Order/Info.jsx";
import {useEffect, useState} from "react";
import api from "../api.js";

function Order() {
    const [user, setUser] = useState({});
    const [firstName, setFirstName] = useState(user.first_name);
    const [addPayment, setAddPayment] = useState(false);
    const [paymentMode, setPaymentMode] = useState("Cash");


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

    return (
        <div id="complete-order">
            <Info />
        </div>
    )
}

export default Order;