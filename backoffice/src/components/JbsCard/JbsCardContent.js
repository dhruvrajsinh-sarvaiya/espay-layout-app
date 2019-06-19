/**
 * Jbs Card Content
 */
import React from 'react';

const JbsCardContent = ({ children, customClasses, noPadding }) => (
    <div className={`${noPadding ? 'jbs-full-block' : 'jbs-block-content'} ${customClasses ? customClasses : ''}`}>
        {children}
    </div>
);

export { JbsCardContent };
