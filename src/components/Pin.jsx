import React, { PureComponent } from "react";
import PropTypes from "prop-types";

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
  cursor: "pointer",
  fill: "#d00",
  stroke: "none"
};

export default class Pin extends PureComponent {
  render() {
    const { size = 20, onClick, customStyle } = this.props;

    return (
      <svg
        height={size}
        viewBox="0 0 365 560"
        style={{
          ...pinStyle,
          transform: `translate(${-size / 2}px,${-size}px)`,
          ...customStyle
        }}
        onClick={onClick}
      >
        <path
          d="M182.9,551.7c0,0.1,0.2,0.3,0.2,0.3S358.3,283,358.3,194.6c0-130.1-88.8-186.7-175.4-186.9
		C96.3,7.9,7.5,64.5,7.5,194.6c0,88.4,175.3,357.4,175.3,357.4S182.9,551.7,182.9,551.7z M122.2,187.2c0-33.6,27.2-60.8,60.8-60.8
		c33.6,0,60.8,27.2,60.8,60.8S216.5,248,182.9,248C149.4,248,122.2,220.8,122.2,187.2z"
        />
      </svg>
    );
  }
}

Pin.propTypes = {
  size: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  customStyle: PropTypes.object
};
