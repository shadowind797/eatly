import { components } from 'react-select';

const CatFilterOption = (props) => {
    return (
        <components.Option {...props}>
            <img src={props.data.label} alt="" style={{ width: 20, height: 20, marginRight: 10 }} />
            {props.data.value}
        </components.Option>
    );
};

export default CatFilterOption;