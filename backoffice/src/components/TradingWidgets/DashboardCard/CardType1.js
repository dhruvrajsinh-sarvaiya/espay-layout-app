import React from 'react';
import PropTypes from 'prop-types';
import { JbsCard, JbsCardContent } from 'Components/JbsCard';
import CountUp from 'react-countup';

const CardType1 = ({ title, count, icon }) => (
    <JbsCard colClasses="col-sm-full">
        <JbsCardContent>
            <div className="d-flex justify-content-between">
                <div className="align-items-end cardboxicon">
                    <i className={icon}></i>
                </div>
                <div className="text-right">
                    <div className="font-weight-normal font-2x"><CountUp separator="," start={0} end={count} /></div>
                    <div className="font-weight-normal">{title}</div>
                </div>
            </div>
        </JbsCardContent>
    </JbsCard>
);

// type checking props
CardType1.propTypes = {
    title: PropTypes.any
}

export { CardType1 };