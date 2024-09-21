import PropTypes from "prop-types";

function FunctionMarker({ type }) {
  return (
    <div className={`function-marker`}>
      {type === "beta" ? (
        <div className="marker">beta</div>
      ) : (
        type === "eatly+" && (
          <div className="marker">
            eatly<p>+</p>
          </div>
        )
      )}
    </div>
  );
}

FunctionMarker.propTypes = {
  type: PropTypes.string.isRequired,
};

export default FunctionMarker;
