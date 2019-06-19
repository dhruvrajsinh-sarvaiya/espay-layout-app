/**
 * Jbs Card Title
 */
/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

const JbsCardHeading = ({ title, customClasses }) => (
    <div className={`jbs-block-title ${customClasses ? customClasses : ''}`}>
        <h4>{title}</h4>
    </div>
);

// type checking props
JbsCardHeading.propTypes = {
    title: PropTypes.any
}

export { JbsCardHeading };