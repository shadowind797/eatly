import Slider from "../slider.js"
import {useEffect} from "react";
import Plate from "../Home/Plate.jsx";

function LogSlider() {

    useEffect(() => {
        const $slider = document.getElementById("slider");
        if ($slider) {
            const slider = new Slider($slider, {
                loop: true,
                autoplay: true,
                interval: 5000,
                pauseOnHover: false,
                refresh: false,
                swipe: false,
            });
        }
    }, []);

    const ads = [
        {
            id: 1,
        },
        {
            id: 2,
        },
        {
            id: 3,
        }
    ]

    return (
        <div
            className="slider_style"
            data-slider="chiefslider"
            data-infinite="false"
            data-autoplay="false"
            id="slider"
        >
            <div className="slider__container">
                <div className="slider__wrapper">
                    <div className="slider__items">
                        {ads.map(ad => (
                            <div className="slider__item">
                                <div className="slider__item-container">
                                    <div className="slider__item-content">
                                        <Plate />
                                        <h1>Find Foods With Love</h1>
                                        <p>Eatly Is The Food Delivery Dashboard And Having
                                            More Than 2K+ Dishes Including Asian, Chinese, Italians
                                            And Many More. Our Dashboard Helps You To Manage Orders
                                            And Money.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <ol className="slider__indicators">
                <li data-slide-to="0"></li>
                <li data-slide-to="1"></li>
                <li data-slide-to="2"></li>
            </ol>
        </div>
    )
}

export default LogSlider;