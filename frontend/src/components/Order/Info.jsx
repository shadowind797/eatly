import Select from "react-select";
import {useEffect, useState} from "react";
import api from "../../api.js";
import {Navigate} from "react-router-dom";

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

    const [canceled, setCanceled] = useState(false)
    const [cancelErr, setCancelErr] = useState(false)
    const [ordered, setOrdered] = useState(false)
    const [cardRequired, setCardRequired] = useState(false)

    const cash = `${import.meta.env.VITE_API_URL}/media/img/cash.svg`
    const card_internet = `${import.meta.env.VITE_API_URL}/media/img/internet.svg`
    const card_courier = `${import.meta.env.VITE_API_URL}/media/img/card.svg`


    useEffect(() => {
        getPaymentList()
    }, []);

    const updateOrder = (e) => {
        e.preventDefault();
        if (!payment && paymentMode === "Card via Internet") {
            setCardRequired(true);
        } else {
            api
                .post("api/order/add/", {
                    id: order.id,
                    payment: paymentMode === "Card via Internet" ? payment : paymentMode,
                    status: 2
                })
                .then(res => {
                    if (res.status === 205) {
                        setOrdered(true);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
            api.delete("api/items/cart/delete", { params: { method: "clear" } })
                .then((res) => {
                    if (res.status === 202) {
                        // Handle success
                    } else if (res.status === 404) {
                        // Handle not found
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    const getPaymentList = () => {
        api
            .get("api/payment/")
            .then((res) => res.data)
            .then((data) => {
                let list = []
                data.map((item) => {
                    list = [...list, {value: item.number, label: `**** **** **** ${item.number.slice(15, 19)}`}]
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

    const cancelOrder = (e) => {
        e.preventDefault()
        api
            .post("api/order/cancel/", {id: order.id, status: order.status})
            .then(res => {
                if (res.status === 200) {
                    setCanceled(true)
                } else {
                    setCancelErr(true)
                }
            })
            .catch((err) => {
                if (err.response.status === 303) {
                    setAlreadyExists(true)
                }
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
            width: "300px",
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

    if (ordered) {
        return <Navigate to="/" />
    } else if (canceled) {
        return <Navigate to="/cart" />
    } else if (!addPayment) {
        return (
            <div id="order-info">
                <h1>Complete order</h1>
                <div id="counts">
                    <h4>Total cost: <span>${order.total}</span></h4>
                    <h4>Name: <span>{user.first_name}</span></h4>
                    <h4>Payment: <span>{paymentMode}</span></h4>
                </div>
                <div id="payment">
                    <h3>Select payment method</h3>
                    <div id="payment-method">
                        <button onClick={() => setPaymentMode("Cash")}
                                className={paymentMode === "Cash" ? "active" : {}}>
                            <img src={cash} alt=""/>
                        </button>
                        <button onClick={() => setPaymentMode("Card via Internet")}
                                className={paymentMode === "Card via Internet" ? "active" : {}}>
                            <img src={card_internet} alt=""/>
                        </button>
                        <button onClick={() => setPaymentMode("Card to courier")}
                                className={paymentMode === "Card to courier" ? "active" : {}}>
                            <img src={card_courier} alt=""/>
                        </button>
                        <div id="card-select"
                             style={paymentMode === "Card via Internet" ?
                                 {display: "flex", flexDirection: "column", gap: "5px"} :
                                 {display: "none"}}>
                            <p className="error" style={cardRequired ? {display: "block"} : {display: "none"}}>Payment card is required</p>
                            <Select
                                options={paymentList}
                                styles={selectStyles}
                                placeholder='Select card'
                                onChange={changePayment}
                            />
                            <p id="add-payment" onClick={() => setAddPayment(true)}>Add payment card</p>
                        </div>
                    </div>
                </div>
                <div id="btns">
                    <button id="cancel" onClick={e => cancelOrder(e)}>
                        Cancel
                    </button>
                    <button id="order" onClick={e => updateOrder(e)}>Order</button>
                </div>
                <p style={cancelErr ? {display: "block"} : {display: "none"}}></p>
            </div>
        )
    } else if (addPayment) {
        return (
            <div id="order-info">
                <div id="new-payment">
                    <h1>Add payment card</h1>
                    <p id="invalid-card" style={invalidInfo ? {display: "block"} : {display: "none"}}>Invalid card
                        info</p>
                    <div id="card-info">
                        <input
                            type="text"
                            placeholder="XXXX XXXX XXXX XXXX"
                            value={cardNumber}
                            onChange={(e) => {
                                const input = e.target.value;
                                const digitsOnly = input.replace(/\D/g, '');
                                if (input.length <= 19) {
                                    if (Number(digitsOnly)) {
                                        const formatted = digitsOnly.match(/.{1,4}/g).join(' ');
                                        setCardNumber(formatted);
                                    } else {
                                        setCardNumber("");
                                    }
                                } else {
                                    setCardNumber(input.slice(0, 19));
                                }
                            }
                            }
                        />
                        <div id="date-name">
                            <div id="cvv-date">
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
                        <button id="cancel" onClick={() => setAddPayment(false)}>Cancel</button>
                        <button id="add-payment" type="submit" onClick={() => {
                            if (cardNumber && cvv && dateToMonth && dateToYear && cardOwnerName && cardNumber.length === 19) {
                                createPayment()
                                setAddPayment(false)
                            } else {
                                setInvalidInfo(true)
                            }
                        }}>Add card
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Info;