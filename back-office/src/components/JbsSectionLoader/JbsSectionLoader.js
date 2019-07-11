/**
 * Jbs Section Loader
 */
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const JbsSectionLoader = () => (
    <div className="d-flex justify-content-center loader-overlay">
        <CircularProgress />
    </div>
);

export default JbsSectionLoader;
