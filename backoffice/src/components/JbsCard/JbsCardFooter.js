/**
 * Jbs Card Footer
 */
import React from 'react';

const JbsCardFooter = ({ children, customClasses }) => (
    <div className={`jbs-block-footer ${customClasses ? customClasses : ''}`}>
        {children}
    </div>
);

export { JbsCardFooter };
