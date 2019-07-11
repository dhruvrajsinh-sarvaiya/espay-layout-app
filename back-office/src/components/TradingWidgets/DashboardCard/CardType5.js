import React from 'react';
import PropTypes from 'prop-types';
import { JbsCard } from 'Components/JbsCard';
import CountUp from 'react-countup';

const CardType5 = ({ title, count, icon }) => (
    <JbsCard colClasses="col-sm-full">
        <h1 className="text-right mt-10 mr-10 mb-0">
        </h1>
        <div className="pt-0 p-15">
            <div className="d-flex justify-content-between">
                <div className="align-items-end cardboxicon">
                    <i className={icon}></i>
                </div>
                <div className="text-right">
                    <div className="font-weight-normal font-2x"><CountUp separator="," start={0} end={count} /></div>
                    <div className="font-weight-normal">{title}</div>
                </div>
            </div>
        </div>
    </JbsCard>
);

// type checking props
CardType5.propTypes = {
    title: PropTypes.any
}

export { CardType5 };