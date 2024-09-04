import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../api.js";
import header_load from "../assets/header-loading.gif";
import logo from "../assets/Logo.svg";
import profile_icon from "../assets/Profile.svg";
import cart from "../assets/cart.svg";
import active_profile_icon from "../assets/Profile-active.svg";
import active_cart from "../assets/cart-active.svg";

Header.propTypes = {
  page: PropTypes.string.isRequired,
};

function Header({ page }) {
  const menu = [
    {
      pageName: "menu",
      slug: "/menu/",
      name: "Menu",
    },
    {
      pageName: "blog",
      slug: "/blog/",
      name: "Blog",
    },
    {
      pageName: "pricing",
      slug: "/pricing/",
      name: "Pricing",
    },
    {
      pageName: "support",
      slug: "/support/",
      name: "Contact",
    },
  ];
  const [isSticky, setIsSticky] = useState(false);
  const [pages, setPages] = useState([...menu]);
  const [loading, setLoading] = useState(false);

  const checkPage = (name) => {
    if (page === name) {
      return "active";
    } else if (
      name === "blog" ||
      name === "pricing" ||
      name === "support" ||
      name === "admin" ||
      name === "manage" ||
      name === "orders"
    ) {
      return "disabled";
    }
  };

  useEffect(() => {
    getUser();
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getUser = () => {
    setLoading(true);
    api
      .get("api/access/", { params: { access_to: "header_options" } })
      .then((res) => res.data)
      .then((data) => {
        setPages([...pages, ...data]);
        setLoading(false);
      })
      .catch(() => {});
  };

  if (loading) {
    return (
      <div className={`header ${isSticky ? "sticky-header" : ""}`}>
        <img id="load-img" src={header_load} alt="" />
      </div>
    );
  } else {
    return (
      <div className={`header ${isSticky ? "sticky-header" : ""}`}>
        <div id="first-part">
          <div id="logo">
            <a href="/">
              <img src={logo} alt="" />
              <h4>eatly</h4>
            </a>
          </div>
          <nav>
            <ul>
              {pages.map((page) => (
                <li key={page.name}>
                  <a className={checkPage(page.pageName)} href={page.slug}>
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div id="icons">
          <a href="/cart">
            <img src={page !== "cart" ? cart : active_cart} alt="" />
          </a>
          <a href="/profile">
            <img
              src={page !== "profile" ? profile_icon : active_profile_icon}
              alt=""
            />
          </a>
          <button>
            <a href="/logout/">Log Out</a>
          </button>
        </div>
      </div>
    );
  }
}

export default Header;
