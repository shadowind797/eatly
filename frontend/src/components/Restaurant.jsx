import { useEffect, useState } from "react";
import star from "../assets/Star.svg";
import bookmark from "../assets/Bookmark.svg";
import PropTypes from "prop-types";

Restaurant.propTypes = {
  rest: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired,
};

function Restaurant({ rest, category }) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const categoryStyles = {
      Healthy: { backgroundColor: "rgba(44,196,105,0.45)", color: "#309D5B" },
      Trending: { backgroundColor: "#F7C5BA", color: "#FB471D" },
      Supreme: { backgroundColor: "#F7EDD0", color: "#DAA31A" },
      default: { backgroundColor: "#F7EDD0", color: "#DAA31A" },
    };

    setStyle(categoryStyles[category] || categoryStyles.default);
  }, []);

  return (
    <div className="rest-card">
      <img
        src={
          rest.image.includes(import.meta.env.VITE_API_URL)
            ? rest.image
            : `${import.meta.env.VITE_API_URL}${rest.image}`
        }
        alt=""
        className="rest-img"
      />
      <div className="info">
        <div className="cat" style={style}>
          {category}
        </div>
        <div className="text">
          <h4>{rest.name}</h4>
          <div className="widgets">
            <div className="time-rating">
              <p>{rest.items_count} dishes</p>
              <div>
                <img src={star} alt="" />
                <p>{rest.rating}</p>
              </div>
            </div>
            <button className="disabled">
              <img src={bookmark} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Restaurant;
