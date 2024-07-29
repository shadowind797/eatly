import Home from "../Home.jsx";

function Plate() {
    const grafic = "http://127.0.0.1:8000/media/img/vectors/grafic.svg"
    const lines = "http://127.0.0.1:8000/media/img/vectors/lines.svg"
    const point = "http://127.0.0.1:8000/media/img/vectors/point.svg"
    const chicken_hell = "http://127.0.0.1:8000/media/img/food/ChikenHellPro.png"

    return (
        <div id="second">
            <img src={chicken_hell} alt="" className="plate"/>
            <div className="bg"></div>
            <div className="grafic">
                <nav id="up">
                    <p className="main">Main</p><p>Weekly</p><p>Monthly</p><p>Yearly</p>
                </nav>
                <div>
                    <img className="g" src={grafic} alt=""/>
                    <img className="l" src={lines} alt=""/>
                    <img className="p" src={point} alt=""/>
                </div>
                <nav id="down">
                    <p className="main">2 days</p><p>4 days</p><p>10 days</p>
                </nav>
            </div>
            <div className="chicken-hell">
                <div>
                    <img src={chicken_hell} alt=""/>
                    <div>
                        <h4>Chicken Hell</h4>
                        <h5>On The Way</h5>
                    </div>
                </div>
                <p>3:09 PM</p>
            </div>
        </div>
    )
}

export default Plate