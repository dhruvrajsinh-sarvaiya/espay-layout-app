/**
 * Jbs Card
 */
import React from 'react';

// jbs card heading
import { JbsCardHeading } from './JbsCardHeading'

const JbsCard = ({ children, customClasses, heading, headingCustomClasses, colClasses }) => (
    <div className={colClasses && colClasses}>
        <div className={`jbs-block ${customClasses ? customClasses : ''}`}>
            {heading &&
                <JbsCardHeading
                    title={heading}
                    customClasses={headingCustomClasses}
                />
            }
            {children}
        </div>
    </div>
);

export { JbsCard };
