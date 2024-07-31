import {useEffect, useRef, useState} from "react";
import {Navigate} from "react-router-dom";
import api from "../api.js";


function Header({page}) {
    const logo = "http://127.0.0.1:8000/media/img/Logo.svg";
    const profile_icon = "http://127.0.0.1:8000/media/img/Profile.svg";
    const cart = "http://127.0.0.1:8000/media/img/cart.svg";
    const owner = true;
    const [isSticky, setIsSticky] = useState(false);
    const [pages, setPages] = useState([]);

    const checkPage = (name) => {
        if (page === name) {
            return "active";
        }
    }

    useEffect(() => {
        getUser()
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsSticky(scrollPosition > 0); // Добавляем класс, если прокрутка больше 0
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const getUser = () => {
        api
            .get("api/user/")
            .then((res) => res.data)
            .then((data) => {
                data.map((item) => {
                    if (item.status === 2) {
                        setPages(menu.slice(0, 5))
                    } else if (item.status === 3) {
                        const first = menu.slice(0, 6);
                        const last = first.toSpliced(4, 1);
                        setPages(last)
                    } else if (item.status === 4) {
                        setPages(menu.toSpliced( 4, 2));
                    } else if (item.status === 5 || item.status === 6) {
                        setPages(menu.slice(0, 4));
                    } else {
                        setPages(menu);
                        console.log(item.status)
                    }
                })
            })
            .catch((err) => alert(err));
    }

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
        {
            pageName: "admin",
            slug: "/admin/",
            name: "Admin"
        },
        {
            pageName: "manage",
            slug: "/manage/",
            name: "Manage"
        },
        {
            pageName: "orders",
            slug: "/orders/",
            name: "Orders"
        }
    ]

    return (
        <div className={`header ${isSticky ? 'sticky-header' : ''}`}>
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
                            <li  key={page.name}>
                                <a className={checkPage(page.pageName)} href={page.slug}>{page.name}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div id="icons">
                <a href="/cart/"><img src={cart} alt=""/></a>
                <img src={profile_icon} alt=""/>
                <button>
                    <a href="/logout/">Log Out</a>
                </button>
            </div>
        </div>
    )
}

export default Header