import api from "../api.js";
import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import Footer from "../components/Footer.jsx";

function Admin() {
  const [couponList, setCouponList] = useState([]);
  const [couponAlreadyExists, setCouponAlreadyExists] = useState(false);

  useEffect(() => {
    getCouponList();
  }, []);

  const getCouponList = () => {
    api
      .get("api/coupon/", { params: { method: "all" } })
      .then((res) => res.data)
      .then((data) => {
        setCouponList(data);
      })
      .catch((err) => alert(err));
  };

  const checkCoupon = () => {
    api
      .post("api/coupon/", { method: "apply", title: "FORTEST" })
      .then((res) => {
        if (res.status === 200) {
          getCouponList();
          return res.data;
        }
      });
  };

  const createCoupon = () => {
    api
      .post("api/coupon/add/", {
        title: "FORTEST",
        date_to: "2099-12-31",
        value: 0.9,
        category: 1,
        ea: 9999,
        method: "create",
      })
      .then((res) => {
        if (res.status === 201) {
          getCouponList();
        } else if (res.status === 409) {
          setCouponAlreadyExists(true);
        }
      })
      .catch(() => {});
  };

  return (
    <div>
      <Header page="admin" />
      <BaseHeader page="admin" />
      <p>Admin page</p>
      <div>
        {couponList.map((coupon) => {
          <p>{coupon.title}</p>;
        })}
      </div>
      <button onClick={createCoupon}>Create</button>
      <button onClick={checkCoupon}>checkCoupon</button>
      {couponAlreadyExists && <p>Already exists</p>}
      <Footer />
    </div>
  );
}

export default Admin;
