import instagram from "../assets/instagram.svg";
import linkedin from "../assets/linkedin.svg";
import facebook from "../assets/facebook.svg";
import x from "../assets/x.svg";
import logo from "../assets/Logo.svg";

function Footer() {
  return (
    <div id="footer">
      <div id="up-footer">
        <div id="foot-logo">
          <a href="/">
            <img src={logo} alt="" />
            <h4 className="logo">eatly</h4>
          </a>
        </div>
        <div id="foot-nav" className="disabled">
          <ul>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/pricing">Pricing</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>
      </div>
      <div id="bot-footer">
        <div id="copy">
          <p>Made by shadowind in 2024</p>
        </div>
        <div id="contacts" className="disabled">
          <img id="inst" src={instagram} alt="" />
          <img src={linkedin} alt="" />
          <img src={facebook} alt="" />
          <img src={x} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Footer;
