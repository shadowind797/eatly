import Select from "react-select";
import {useEffect, useState} from "react";
import api from "../../api.js";

function Info({address, order, user}) {
    const [addPayment, setAddPayment] = useState(false);
    const [paymentMode, setPaymentMode] = useState("Cash");
    const [paymentList, setPaymentList] = useState([]);
    const [payment, setPayment] = useState(null);
    const [paymentAlreadyExists, setPaymentAlreadyExists] = useState(false);

    const [cardNumber, setCardNumber] = useState(null);
    const [cvv, setCvv] = useState(null);
    const [dateToMonth, setDateToMonth] = useState(null);
    const [dateToYear, setDateToYear] = useState(null);
    const [cardOwnerName, setCardOwnerName] = useState(null);
    const [invalidInfo, setInvalidInfo] = useState(false)


    useEffect(() => {
        getPaymentList()
    }, []);

    const getPaymentList = () => {
        api
            .get("api/payment/")
            .then((res) => res.data)
            .then((data) => {
                let list = []
                data.map((item) => {
                    list = [...list, {value: item.id, label: `**** **** **** ${item.number.slice(15, 19)}`}]
                    setPaymentList(list);
                })
            })
            .catch((err) => alert(err));
    }

    const createPayment = () => {
        api
            .post("api/payment/add/", {number: cardNumber, cvv: cvv, date_to: `${dateToMonth}/${dateToYear}`, name: cardOwnerName})
            .then((res) => {
                if (res.status === 201) {
                    getPaymentList()
                }
                else if (res.status === 409) {
                    setPaymentAlreadyExists(true)
                }
            })
            .catch((err) => {})
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
            width: "470px",
        }),
    };

    const changePayment = (payment) => {
        setPayment(payment.value);
    }

    if (!addPayment) {
        return (
            <div id="order-info">
                <h1>Complete order</h1>
                <h4>Total cost: <span>${order.total}</span></h4>
                <h4>Name: <span>{user.first_name}</span></h4>
                <div id="payment">
                    <h4>Select payment method</h4>
                    <div id="payment-method">
                        <button onClick={() => setPaymentMode("Cash")}
                                className={paymentMode === "Cash" ? "active" : {}}></button>
                        <button></button>
                        <button></button>
                    </div>
                    <Select
                        options={paymentList}
                        styles={selectStyles}
                        placeholder='Select card'
                        onChange={changePayment}
                    />
                    <button id="add-payment" onClick={() => setAddPayment(true)}>Add payment method</button>
                </div>
                <button id="order">Order</button>
            </div>
        )
    } else if (addPayment) {
        return (
            <div id="order-info">
                <div id="invalid-card" style={invalidInfo ? {display: "block"} : {display: "none"}}>Invalid card info</div>
                <div id="new-payment">
                    <div>
                        <input
                            type="text"
                            placeholder="XXXX XXXX XXXX XXXX"
                            value={cardNumber}
                            onChange={(e) => {
                                const input = e.target.value;
                                const digitsOnly = input.replace(/\D/g, '');
                                if (Number(digitsOnly)) {
                                    const formatted = digitsOnly.match(/.{1,4}/g).join(' ');
                                    setCardNumber(formatted);
                                }
                                else {
                                    setCardNumber("");
                                }
                            }}
                        />
                        <div>
                            <input type="text" placeholder="CVV/CVC" value={cvv}
                                   onChange={(e) => {
                                       const input = e.target.value;
                                       if (Number(input)) {
                                           if (input.length <= 3) {
                                               setCvv(input);
                                           } else {
                                               setCvv(input.slice(0, 3));
                                           }
                                       } else {
                                           setCvv("");
                                       }
                                   }}/>
                            <div id="date">
                                <input type="text" placeholder="MM" value={dateToMonth}
                                       onChange={(e) => {
                                           const input = e.target.value;
                                           if (Number(input)) {
                                               if (input.length <= 2) {
                                                   if (Number(input) <= 12) {
                                                       setDateToMonth(input);
                                                   } else {
                                                       setDateToMonth("")
                                                   }
                                               } else {
                                                   setDateToMonth(input.slice(0, 2));
                                               }
                                           } else {
                                               setDateToMonth("");
                                           }
                                       }}/>
                                <p>/</p>
                                <input type="text" placeholder="YY" value={dateToYear}
                                       onChange={(e) => {
                                           const input = e.target.value;
                                           if (Number(input)) {
                                               if (input.length <= 2) {
                                                   if (Number(input) >= 24 || input.length < 2) {
                                                       setDateToYear(input);
                                                   } else {
                                                       setDateToYear("")
                                                   }
                                               } else {
                                                   setDateToYear(input.slice(0, 2));
                                               }
                                           } else {
                                               setDateToYear("");
                                           }
                                       }}/>
                            </div>
                            <input type="text" placeholder="OWNER NAME" value={cardOwnerName}
                                   onChange={(e) => {
                                       const input = e.target.value;
                                       if (!Number(input)) {
                                            for (let i = 0; i < input.length; i++) {
                                                const char = input[i];
                                               if (!Number(char)) {
                                                   setCardOwnerName(input)
                                               } else {
                                                   setCardOwnerName(cardOwnerName.slice(0, i))
                                               }
                                           }
                                       } else {
                                           setCardOwnerName("")
                                       }
                                   }}/>
                        </div>
                    </div>
                    <div className="btns">
                        <button onClick={() => setAddPayment(false)}>Cancel</button>
                        <button type="submit" onClick={() => {
                            if (cardNumber && cvv && dateToMonth && dateToYear && cardOwnerName) {
                                createPayment()
                                setAddPayment(false)
                            } else {
                                setInvalidInfo(true)
                        }}}>Add payment information
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Info;