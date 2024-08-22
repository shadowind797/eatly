import Slider from "../slider.js"
import {useEffect} from "react";

function AdSlider() {

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
            bg: `url('${import.meta.env.VITE_API_URL}/media/img/ads/bg1.png')`,
            img: `${import.meta.env.VITE_API_URL}/media/img/ads/img1.png`,
            text1: "50% OFF",
            text2: "WEEKEND"
        },
        {
            id: 2,
            bg: `url('${import.meta.env.VITE_API_URL}/media/img/ads/bg1.png')`,
            img: `${import.meta.env.VITE_API_URL}/media/img/ads/img1.png`,
            text1: "50% OFF",
            text2: "WEEKEND"
        },
        {
            id: 3,
            bg: `url('${import.meta.env.VITE_API_URL}/media/img/ads/bg1.png')`,
            img: `${import.meta.env.VITE_API_URL}/media/img/ads/img1.png`,
            text1: "50% OFF",
            text2: "WEEKEND"
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
                            <div className="slider__item" key={ad.id}>
                                <div className="slider__item-container">
                                    <div style={{backgroundImage: ad.bg}} className="slider__item-content">
                                        <h2>{ad.text1}</h2>
                                        <h3>{ad.text2}</h3>
                                        <img src={ad.img} alt={ad.text1}/>
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

export default AdSlider;