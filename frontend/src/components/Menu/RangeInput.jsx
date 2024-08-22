const RangeSlider = (props) => {
    const percentage = 100 * (props.value - props.min) / (props.max - props.min);
    const rangerStyle = {
        background: `linear-gradient(90deg, #6C5FBC ${percentage}%, ${props.secondaryBgColor ? props.secondaryBgColor : '#ededed'} ${percentage + 0.1}%)`
    };

    return (
        <input className={`range-slider-input ${props.customClasses ? props.customClasses : ''}`} style={rangerStyle}
               type='range' value={props.value} min={props.min} max={props.max} onChange={props.onChange}
               disabled={props.disabled}/>
    );
}

export default RangeSlider;