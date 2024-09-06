/* eslint-disable react/prop-types */
import { components } from "react-select";

const RestSelectOption = (props) => {
  return (
    <components.Option {...props}>
      <img
        src={`${import.meta.env.VITE_API_URL}/media${props.data.logo}`}
        alt=""
        style={{ width: 20, height: 20, marginRight: 10 }}
      />
      {props.data.label}
    </components.Option>
  );
};

export default RestSelectOption;
