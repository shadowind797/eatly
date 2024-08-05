import api from "../api.js";
import {useEffect, useState} from "react";

function Admin() {
    const [couponList, setCouponList] = useState([])


    useEffect(() => {
        getCouponList()
    }, []);

    const getCouponList = () => {
        api
            .get("api/coupon/")
            .then((res) => res.data)
            .then((data) => {
                setCouponList(data);
            })
            .catch((err) => alert(err));
    }

    const createCoupon = () => {
        api
            .post("api/coupon/add/", {title: "", valid_to: "", value: 1.1})
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
        <div>Admin page</div>
    )
}

export default Admin;