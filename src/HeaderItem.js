import React from 'react';

export const HeaderItem = ({ children, style }) => {
    const finalStyle = { padding: '0 19px 0 19px', ...style};

    return (
        <div style={finalStyle}>
            {children}
        </div>
    )
};
