import PropTypes from "prop-types";

const Toggler = ({ value, onChange }) => (
  <label className="div-toggler" htmlFor="toggler">
    <input
      id="toggler"
      type="checkbox"
      onClick={onChange}
      checked={value}
      readOnly
    />
    <span className="slider" />
    <span className="wave" />
  </label>
);

Toggler.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Toggler;
