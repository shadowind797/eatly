import Plate from "./Plate.jsx";


function MainDiv() {
    const trustpilot = `${import.meta.env.VITE_API_URL}/media/img/trustpilot.png`
    const five_stars = `${import.meta.env.VITE_API_URL}/media/img/5_stars.svg`

    return (
        <div id="main-div" className="container">
            <div id="first">
                <div id="info">
                    <div id="up-header">
                        <div></div>
                        <h4>OVER 20M USERS</h4>
                    </div>
                    <h1>Enjoy Foods All Over The <span>World</span></h1>
                    <p>
                        EatLy help you set saving goals, earn cash back offers,
                        Go to disclaimer for more details and get paychecks up
                        to two days early. Get a <span>$20 bonus</span>.
                    </p>
                </div>
                <div id="get-started">
                    <div className="btns">
                        <button className="get">
                            <a href="/menu">Get Started</a>
                        </button>
                        <button className="pro">
                            <a href="/pricing">Go Pro</a>
                        </button>
                    </div>
                    <div id="trustpilot">
                        <img src={trustpilot} alt=""/>
                        <div>
                            <img src={five_stars} alt=""/>
                            <h5>160K+</h5>
                        </div>
                    </div>
                </div>
            </div>
            <Plate />
        </div>
    )
}

export default MainDiv