import React from 'react';
import PropTypes from 'prop-types';

const buttonStyles = "block mr-2 py-3 px-4 text-gray-900 rounded-xl hover:bg-gray-100 md-hover-bg-transparent transition-all duration-200 ease-in-out";

const Button = ({ onClick, children, className, disabled }) => {
    return (
        <button
            onClick={onClick}
            className={`${buttonStyles} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

Button.defaultProps = {
    onClick: () => {},
    className: '',
    disabled: false,
};

export default Button;