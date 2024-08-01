import Header from "../components/Header.jsx";
import ItemsList from "../components/Cart/ItemsList.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import MakeOrder from "../components/Cart/MakeOrder.jsx";

function Cart() {
    return (
        <div id='cart'>
            <BaseHeader />
            <Header />
            <div>
                <ItemsList />
                <MakeOrder />
            </div>
        </div>
    )
}

export default Cart;
