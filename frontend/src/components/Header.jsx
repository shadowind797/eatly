import {useRef} from "react";


function Header({page}) {
    const logo = "http://127.0.0.1:8000/media/img/Logo.svg";
    const profile_icon = "http://127.0.0.1:8000/media/img/Profile.svg";
    const owner = true;

    const checkPage = (name) => {
        if (page === name) {
            return "active";
        }
    }

    if (owner) {
        return (
            <div className="header">
                <div id="first-part">
                    <div id="logo">
                        <a href="/">
                            <img src={logo} alt=""/>
                            <h4>eatly</h4>
                        </a>
                    </div>
                    <nav>
                    <ul>
                            <li>
                                <a className={checkPage("menu")} href="/menu">Menu</a>
                            </li>
                            <li>
                                <a className={checkPage("blog")} href="/blog">Blog</a>
                            </li>
                            <li>
                                <a className={checkPage("pricing")} href="/pricing">Pricing</a>
                            </li>
                            <li>
                                <a className={checkPage("support")} href="/support">Contact</a>
                            </li>
                            <li className="special">
                                <a className={checkPage("admin")} href="/admin">Admin</a>
                            </li>
                            <li className="special">
                                <a className={checkPage("manage")} href="/manage">Manage</a>
                            </li>
                            <li className="special">
                                <a className={checkPage("orders")} href="/orders">Orders</a>
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
                            <a className={checkPage("menu")} href="/menu">Menu</a>
                        </li>
                        <li>
                            <a className={checkPage("blog")} href="/blog">Blog</a>
                        </li>
                        <li>
                            <a className={checkPage("pricing")} href="/pricing">Pricing</a>
                        </li>
                        <li>
                            <a className={checkPage("support")} href="/support">Contact</a>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}

export default Header