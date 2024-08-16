import Header from "../components/Header.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import Footer from "../components/Footer.jsx";

function NotFound() {
    return (
        <div>
            <Header/>
            <BaseHeader/>
            <h1>404 Not Found</h1>
            <Footer/>
        </div>
    )
}

export default NotFound