import api from "../api.js";
import {useEffect, useState} from "react";
import Header from "../components/Header.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import Footer from "../components/Footer.jsx";

function Admin() {
    const [couponList, setCouponList] = useState([])


    useEffect(() => {
        getCouponList()
    }, []);

    const getCouponList = () => {
        api
            .get("api/coupon/", {params: {method: "all"}})
            .then((res) => res.data)
            .then((data) => {
                setCouponList(data);
            })
            .catch((err) => alert(err));
    }

    const checkCoupon = () => {
        api
            .post("api/coupon/", {method: "apply", title: "TESTTIME2"})
            .then((res) => {
                if (res.status === 200) {
                    getCouponList()
                    return res.data
                } else {}
            })
            .then((data) => {

            })
            .catch((err) => alert(err));
    }

    const createCoupon = () => {
        api
            .post("api/coupon/add/", {title: "TESTTIME2", date_to: "2024-08-06", value: 0.9, category: 1, ea: 10, method: "create"})
            .then((res) => {
                if (res.status === 201) {
                    getCouponList()
                }
                else if (res.status === 409) {
                    setCouponAlreadyExists(true)
                }
            })
            .catch((err) => {})
    }

    return (
        <div>
            <Header />
            <BaseHeader />
            <p>Admin page</p>
            <div>{couponList.map(coupon => {
                <p>{coupon.title}</p>
            })}</div>
            <button onClick={createCoupon}>Create</button>
            <button onClick={checkCoupon}>checkCoupon</button>
            <Footer />
        </div>
    )
}

export default Admin;