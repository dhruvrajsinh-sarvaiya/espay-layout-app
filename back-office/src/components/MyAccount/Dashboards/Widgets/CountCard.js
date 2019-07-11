/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React from 'react';
import PropTypes from 'prop-types';
import { JbsCard, JbsCardContent } from 'Components/JbsCard';
import CountUp from 'react-countup';

const CountCard = ({ title, count, icon, bgClass, clickEvent, data, createCount, createTitle }) => (
    <JbsCard colClasses="col-sm-full">
        <JbsCardContent>
            <div className="d-flex justify-content-between">
                <div className="align-items-end">
                    <h1 className="accountcommoncard display-4 font-weight-light"><i className={icon}></i></h1>
                </div>
                <div className="text-right">
                    <h1 className="font-weight-bold font-2x lh_100"><CountUp separator="," start={0} end={count} /></h1>
                    <h2 className="fs-18 d-block font-weight-normal m-0 lh_100">{title}</h2>
                </div>
            </div>
        </JbsCardContent>
    </JbsCard>
);

// type checking props
CountCard.propTypes = {
    title: PropTypes.any
}

export { CountCard };