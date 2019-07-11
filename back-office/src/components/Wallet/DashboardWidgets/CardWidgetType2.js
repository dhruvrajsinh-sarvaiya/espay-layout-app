/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 2
*/
import React from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";
import { JbsCard, JbsCardContent, JbsCardHeading } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import CountUp from 'react-countup';

const CardWidgetType2 = ({ title, adminCount, userCount, isAdmin }) => (
    <JbsCard colClasses="col-sm-full">
        <JbsCardHeading title={title} customClasses="py-5" />
        <Divider />
        <JbsCardContent>
            <div className="d-flex justify-content-between">
                <div className={"align-items-start w-50 border-right text-center mt-20"} >
                    <h1 className={"font-weight-normal display-4"}><CountUp start={0} end={adminCount} /></h1>
                    <h1 className="px-30 font-weight-light"><IntlMessages id="walletDeshbard.admin" /></h1>
                </div>
                <div className={"align-items-end w-50 text-center mt-20"}>
                    <h1 className={"font-weight-normal display-4"}><CountUp start={0} end={userCount} /></h1>
                    <h1 className="px-30 font-weight-light mb-0"><IntlMessages id="walletDeshbard.user" /></h1>
                </div>
            </div>
        </JbsCardContent>
    </JbsCard >
);

// type checking props
CardWidgetType2.propTypes = {
    title: PropTypes.any
}

export { CardWidgetType2 };