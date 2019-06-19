/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
//import CountUp from 'react-countup';

const SimpleCard = ({ title, count, icon, bgClass, clickEvent, data, createCount, createTitle }) => (
    <JbsCard colClasses="col-sm-full">
        <JbsCardContent customClasses="pb-0">
            <div className="d-flex justify-content-between">
                <div className="align-items-end">
                    <h1 className="display-4 font-weight-normal"><i className={icon}></i></h1>
                </div>
                <div className="text-right">
                    { /* Addded by Jayesh for display modified date into card */ }
                    <h4 className="fs-18 d-block font-weight-bold">{count}</h4>
                    <h2 className="fs-18 d-block font-weight-normal pt-10">{title}</h2>
                    {/* <h1 className="font-weight-normal">{title}</h1> */}
                </div>
            </div>
        </JbsCardContent>
        <Divider />
        <div className="clearfix py-10 px-20">
            <div className="float-left"><IntlMessages id="sidebar.viewDetails" /></div>
            <div className="float-right"><i className="material-icons">keyboard_arrow_right</i></div>
        </div>
    </JbsCard>
);

// type checking props
SimpleCard.propTypes = {
    title: PropTypes.any
}

export { SimpleCard };