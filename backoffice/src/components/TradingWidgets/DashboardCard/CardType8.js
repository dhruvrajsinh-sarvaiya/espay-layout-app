import React from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import CountUp from 'react-countup';

// Used To Display Progressbar on Buy/Sell Button
import CircularProgress from '@material-ui/core/CircularProgress';

const CardType8 = ({ title, count, icon, bgClass, clickEvent, data, createCount, createTitle,getData,refresh }) => (
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
        {/* <Divider />
        <div className="clearfix py-10 px-20">
            <div className="float-left"><IntlMessages id="sidebar.viewDetails" /></div>
            <div className="float-right"><i className="material-icons">keyboard_arrow_right</i></div>
        </div> */}
    </JbsCard>
);

// type checking props
CardType8.propTypes = {
    title: PropTypes.any
}

export { CardType8 };