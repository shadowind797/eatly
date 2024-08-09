import Header from "../components/Header.jsx";
import MainDiv from "../components/Home/MainDiv.jsx";
import MobileApp from "../components/Home/MobileApp.jsx";
import TopRests from "../components/Home/TopRests.jsx";
import TopDishes from "../components/Home/TopDishes.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import Footer from "../components/Footer.jsx";


function Home() {
    return (
        <div id="home">
            <BaseHeader page="home" />
            <Header page="home"/>
            <MainDiv />
            <MobileApp />
            <TopRests />
            <TopDishes />
            <Footer />
        </div>
    )
}

export default Home