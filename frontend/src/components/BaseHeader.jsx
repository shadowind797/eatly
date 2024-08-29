import {useEffect, useRef, useState} from "react";
import api from "../api.js";
import header_load from "../assets/header-loading.gif";
import logo from "../assets/Logo.svg"
import profile_icon from "../assets/Profile.svg"
import cart from "../assets/cart.svg"
import active_cart from "../assets/cart-active.svg";
import active_profile_icon from "../assets/Profile-active.svg";

function BaseHeader({page}) {
    const menu = [
        {
            pageName: "menu",
            slug: "/menu/",
            name: "Menu"
        },
        {
            pageName: "blog",
            slug: "/blog/",
            name: "Blog"
        },
        {
            pageName: "pricing",
            slug: "/pricing/",
            name: "Pricing"
        },
        {
            pageName: "support",
            slug: "/support/",
            name: "Contact"
        },
    ]
    const [pages, setPages] = useState([...menu]);
    const [loading, setLoading] = useState(false)


    const checkPage = (name) => {
        if (page === name) {
            return "active";
        }
    }

    useEffect(() => {
        getUser()
    }, []);

    const getUser = () => {
        setLoading(true)
        api
            .get("api/access/", {params: {access_to: "header_options"}})
            .then((res) => res.data)
            .then((data) => {
                setPages([...pages, ...data]);
                setLoading(false)
            })
            .catch((err) => {
            });
    }

    if (loading) {
        return (
            <div className="base-header">
                <img id="load-img" src={header_load} alt=""/>
            </div>
        )
    } else {
        return (
            <div className="base-header">
                <div id="first-part">
                    <div id="logo">
                        <a href="/">
                            <img src={logo} alt=""/>
                            <h4>eatly</h4>
                        </a>
                    </div>
                    <nav>
                        <ul>
                            {pages.map((page) => (
                                <li key={page.name}>
                                    <a className={checkPage(page.pageName)} href={page.slug}>{page.name}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div id="icons">
                    <a href="/cart"><img src={page !== "cart" ? cart : active_cart} alt=""/></a>
                    <a href="/profile"><img src={page !== "profile" ? profile_icon : active_profile_icon} alt=""/></a>
                    <button>
                        <a href="/logout">Log Out</a>
                    </button>
                </div>
            </div>
        )
    }
}

export default BaseHeader