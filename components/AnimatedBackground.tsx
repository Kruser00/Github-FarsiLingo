import React from 'react';

const AnimatedBackground: React.FC = () => {
    return (
        <div className="background-shapes" aria-hidden="true">
            <div className="shape shape1"></div>
            <div className="shape shape2"></div>
            <div className="shape shape3"></div>
            <div className="shape shape4"></div>
        </div>
    );
};

export default AnimatedBackground;