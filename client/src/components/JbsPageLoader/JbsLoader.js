/**
 * Jbs Loader
 */
import React from 'react';
import Loader from 'react-loader-spinner'

const JbsLoader = () => (
    <div className="d-flex justify-content-center loader-overlay">
        <Loader type="Ball-Triangle" color="#5D92F4" />
    </div>
);

export default JbsLoader;
