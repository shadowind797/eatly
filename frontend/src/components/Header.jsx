import {useRef} from "react";


function Header() {
    const logo = "http://127.0.0.1:8000/media/img/Logo.svg";
    const profile_icon = "http://127.0.0.1:8000/media/img/Profile.svg";
    const owner = true;

    if (owner) {
        return (
            <div className="header">
                <div id="first-part">
                    <div id="logo">
                        <img src={logo} alt=""/>
                        <h4>eatly</h4>
                    </div>
                    <nav>
                        <ul>
                            <li>
                                <a href="/menu">Menu</a>
                            </li>
                            <li>
                                <a href="/blog">Blog</a>
                            </li>
                            <li>
                                <a href="/pricing">Pricing</a>
                            </li>
                            <li>
                                <a href="/support">Contact</a>
                            </li>
                            <li className="special">
                                <a href="/admin">Admin</a>
                            </li>
                            <li className="special">
                                <a href="/manage">Manage</a>
                            </li>
                            <li className="special">
                                <a href="/orders">Orders</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div id="profile">
                    <img src={profile_icon} alt=""/>
                    <button>
                        <a href="logout/">Log Out</a>
                    </button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="header">
                <div id="logo">
                    <img src={logo} alt=""/>
                    <h4>eatly</h4>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a href="">Menu</a>
                        </li>
                        <li>
                            <a href="">Blog</a>
                        </li>
                        <li>
                            <a href="">Pricing</a>
                        </li>
                        <li>
                            <a href="">Contact</a>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}

export default Header