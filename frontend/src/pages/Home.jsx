import Header from "../components/Header.jsx";
import MainDiv from "../components/Home/MainDiv.jsx";
import MobileApp from "../components/Home/MobileApp.jsx";
import TopRests from "../components/Home/TopRests.jsx";
import TopDishes from "../components/Home/TopDishes.jsx";


function Home() {
    return (
        <div id="home">
            <Header page="home"/>
            <MainDiv />
            <MobileApp />
            <TopRests />
            <TopDishes />
        </div>
    )
}

export default Home