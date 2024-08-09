import {useEffect, useRef, useState} from "react";
import {Navigate} from "react-router-dom";
import api from "../api.js";


function BaseHeader({page}) {
    const logo = `${import.meta.env.VITE_API_URL}/media/img/Logo.svg`;
    const profile_icon = `${import.meta.env.VITE_API_URL}/media/img/Profile.svg`;
    const cart = `${import.meta.env.VITE_API_URL}/media/img/cart.svg`;
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


    const checkPage = (name) => {
        if (page === name) {
            return "active";
        }
    }

    useEffect(() => {
        getUser()
    }, []);

    const getUser = () => {
        api
            .get("api/access/", {params: {access_to: "header_options"}})
            .then((res) => res.data)
            .then((data) => {
                setPages([...pages, ...data]);
            })
            .catch((err) => {});
    }

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
                <a href="/cart/"><img src={cart} alt=""/></a>
                <a href="/profile/"><img src={profile_icon} alt=""/></a>
                <button>
                <a href="/logout/">Log Out</a>
                </button>
            </div>
        </div>
    )
}

export default BaseHeader