import Info from "../components/Order/Info.jsx";
import { useEffect, useState } from "react";
import api from "../api.js";
import Map from "../components/Order/Map.jsx";
import Loading from "../components/Loading.jsx";

function Order() {
  const [user, setUser] = useState({});
  const [order, setOrder] = useState({});

  useEffect(() => {
    getUser();
    getOrder();
  }, []);

  const getUser = () => {
    api
      .get("api/user/")
      .then((res) => res.data)
      .then((data) => {
        data.map((item) => {
          setUser(item);
        });
      })
      .catch(() => {});
  };

  const getOrder = () => {
    api
      .get("api/order/", { params: { method: "for_complete" } })
      .then((res) => res.data)
      .then((data) => {
        setOrder(data);
      })
      .catch(() => {});
  };

  if (order.address_obj) {
    return (
      <div id="complete-order">
        <Map
          restAddress={order.rest_address}
          userAddress={order.address_obj}
          restName={order.rest_name}
          userName={user.first_name}
        />
        <Info order={order} user={user} />
      </div>
    );
  } else {
    return <Loading />;
  }
}

export default Order;
