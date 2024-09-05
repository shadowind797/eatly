import phone from "../../assets/phone.png";
import screen from "../../assets/Screenshot.png";
import arrow from "../../assets/arrow-right.svg";

function MobileApp() {
  return (
    <div id="MobileApp">
      <div id="counts">
        <div>
          <h4>10K+</h4>
          <p>Satisfied Costumers</p>
          <p>All Great Over The World</p>
        </div>
        <div id="s">
          <h4>4M</h4>
          <p>Healthy Dishes Sold</p>
          <p>Including Milk Shakes Smooth</p>
        </div>
        <div>
          <h4>100%</h4>
          <p>Reliable Customer Support</p>
          <p>We Provide Great Experiences</p>
        </div>
      </div>
      <div id="mobile" className="container">
        <div className="phone">
          <img src={phone} alt="" className="f" />
          <img src={screen} alt="" className="s" />
        </div>
        <div className="info">
          <h2>
            Premium <span>Quality</span> For Your Health
          </h2>
          <div>
            <p>
              &bull; Premium quality food is made with ingredients that are
              packed with essential vitamins, minerals.
            </p>
            <p>
              &bull; These foods promote overall wellness by support healthy
              digestion and boosting immunity
            </p>
          </div>
          <button className="disabled" disabled={true}>
            <p>Download</p>
            <img src={arrow} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileApp;
