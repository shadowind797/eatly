import Select from "react-select";
import {useEffect, useState} from "react";
import api from "../../api.js";
import {Navigate} from "react-router-dom";
import info_load from "../../assets/header-loading.gif";
import load from "../../assets/count_load.gif";

function Info({order, user}) {
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

    const [loading, setLoading] = useState(false)
    const [newCardLoading, setNewCardLoading] = useState(false)

    const [orderExists, setOrderExists] = useState(false)

    useEffect(() => {
        getPaymentList()
    }, []);

    const updateOrder = (e) => {
        e.preventDefault();
        setOrderExists(false)
        if (!payment && paymentMode === "Card via Internet") {
            setCardRequired(true);
        } else {
            setLoading(true)
            api
                .post("api/order/add/", {
                    id: order.id,
                    payment: paymentMode === "Card via Internet" ? payment : paymentMode,
                    status: 2
                })
                .then(res => {
                    if (res.status === 205) {
                        setLoading(false)
                        setOrdered(true);
                    }
                })
                .catch((err) => {
                    setOrderExists(true)
                    setLoading(false)
                });
            api.delete("api/items/cart/delete", {params: {method: "clear"}})
                .then((res) => {
                    if (res.status === 202) {
                    } else if (res.status === 404) {
                    }
                })
                .catch((err) => {
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
                setCardNumber("")
                setCvv("")
                setDateToMonth("")
                setDateToYear("")
                setCardOwnerName("")
                setNewCardLoading(false)
                setAddPayment(false)
            })
            .catch((err) => {
            });
    }

    const createPayment = (e) => {
        e.preventDefault()
        setNewCardLoading(true)
        setPaymentAlreadyExists(false)
        api
            .post("api/payment/add/", {
                number: cardNumber,
                cvv: cvv,
                date_to: `${dateToMonth}/${dateToYear}`,
                name: cardOwnerName
            })
            .then((res) => {
                if (res.status === 201) {
                    getPaymentList()
                } else if (res.status === 409) {
                    setPaymentAlreadyExists(true)
                    setNewCardLoading(false)
                }
            })
            .catch((err) => {
                if (err.response.status === 409) {
                    setPaymentAlreadyExists(true)
                    setNewCardLoading(false)
                }
            })
    }

    const cancelOrder = (e) => {
        e.preventDefault()
        setLoading(true)
        api
            .post("api/order/cancel/", {id: order.id, status: order.status})
            .then(res => {
                if (res.status === 200) {
                    setCanceled(true)
                    setLoading(false)
                } else {
                    setCancelErr(true)
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
        option: (styles, {data, isDisabled, isFocused, isSelected}) => ({
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

    if (loading) {
        return (
            <img src={load} style={{width: "500px", paddingTop: "13%", paddingLeft: "36%"}} alt=""/>
        )
    } else if (ordered) {
        return <Navigate to="/"/>
    } else if (canceled) {
        return <Navigate to="/cart"/>
    } else if (!addPayment && !loading) {
        return (
            <div id="order-info">
                <h1>Complete order</h1>
                <div id="counts">
                    <h4>Total cost: {order.total === undefined ? (
                        <img src={info_load} style={{width: "100px"}} alt=""/>) : (
                        <span>${order.total}</span>)}</h4>
                    <h4>Name: {user.first_name === undefined ? (
                        <img src={info_load} style={{width: "100px"}} alt=""/>) : (
                        <span>{user.first_name}</span>)}</h4>
                    <h4>Payment: {loading ? (<img src={info_load} style={{width: "100px"}} alt=""/>) : (
                        <span>{paymentMode}</span>)}</h4>
                </div>
                <div id="payment">
                    <h3>Select payment method</h3>
                    <div id="payment-method">
                        <button onClick={() => setPaymentMode("Cash")}
                                className={paymentMode === "Cash" ? "active" : {}}>
                            <img src={cash} alt=""/>
                        </button>
                        <button data-testid="web-card"
                                onClick={() => setPaymentMode("Card via Internet")}
                                className={paymentMode === "Card via Internet" ? "active" : {}}>
                            <img src={card_internet} alt=""/>
                        </button>
                        <button onClick={() => setPaymentMode("Card to courier")}
                                className={paymentMode === "Card to courier" ? "active" : {}}>
                            <img src={card_courier} alt=""/>
                        </button>
                        <div id="card-select" data-testid="payment-select"
                             style={paymentMode === "Card via Internet" ?
                                 {display: "flex", flexDirection: "column", gap: "5px"} :
                                 {display: "none"}}>
                            <p className="error" style={cardRequired ? {display: "block"} : {display: "none"}}>Payment
                                card is required</p>
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
                {orderExists ? (<p className="error">You already have confirmed order</p>) : (<p></p>)}
                <div id="btns">
                    <button id="cancel" onClick={e => cancelOrder(e)}>
                        Cancel
                    </button>
                    <button id="order" onClick={e => updateOrder(e)}>Order</button>
                </div>
                <p style={cancelErr ? {display: "block"} : {display: "none"}}></p>
            </div>
        )
    } else if (addPayment && !loading) {
        return (
            <div id="order-info">
                <div id="new-payment">
                    <h1>Add payment card</h1>
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
                    <p id="invalid-card" style={invalidInfo ? {display: "block"} : {display: "none"}}>Invalid card
                        info</p>
                    <p id="invalid-card" style={paymentAlreadyExists ? {display: "block"} : {display: "none"}}>
                        Card already exists
                    </p>
                    <div className="btns">
                        <button id="cancel" onClick={() => setAddPayment(false)}>Cancel</button>
                        <button id="add-payment" onClick={e => {
                            if (cardNumber &&
                                cvv &&
                                dateToMonth &&
                                dateToYear &&
                                cardOwnerName &&
                                cardNumber.length === 19) {
                                createPayment(e)
                            } else {
                                setInvalidInfo(true)
                            }
                        }}>
                            {newCardLoading ? "Creating card..." : "Add card"}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Info;