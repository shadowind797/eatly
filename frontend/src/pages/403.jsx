import Header from "../components/Header.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import Footer from "../components/Footer.jsx";

function Forbidden() {
    return (
        <div>
            <Header/>
            <BaseHeader/>
            <h1>403 Forbidden</h1>
            <Footer/>
        </div>
    )
}

export default Forbidden