/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Card Widget Type 1
*/
import React from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";
import { JbsCard, JbsCardContent } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import CountUp from 'react-countup';

const CardType6 = ({ title, count, OpenTotal, TotalSettle, PartialCancel, SystemFail, TotalCancel, icon }) => (
    <JbsCard colClasses="col-sm-full">
        <JbsCardContent>
            <div className="d-flex justify-content-between">
                <div className="align-items-end">
                    <h2 className="font-weight-normal font-2x lh_100"><i className={icon}></i> {title}</h2>
                </div>
                <div className="text-right">
                    <h3 className="font-weight-normal font-2x lh_100"><CountUp separator="," start={0} end={count} /></h3>
                </div>
            </div>
        </JbsCardContent>
        <Divider />
        <JbsCardContent customClasses="pb-0">
            <div className="d-flex justify-content-between w-100 text-dark m-5 p-10">
                <div className="align-items-center">
                    <h3 className="">{<IntlMessages id="sidebar.open" />}</h3>
                    <h4 className="font-weight-bold mb-5 text-center"><CountUp separator="," start={0} end={OpenTotal} /></h4>
                </div>
                <div className="align-items-center">
                    <h3 className="">{<IntlMessages id="traderecon.list.column.button.settle" />}</h3>
                    <h4 className="font-weight-bold mb-5 text-center"><CountUp separator="," start={0} end={TotalSettle} /></h4>
                </div>
                <div className="align-items-center">
                    <h3 className="">{<IntlMessages id="button.cancel" />}</h3>
                    <h4 className="font-weight-bold mb-5 text-center"><CountUp separator="," start={0} end={TotalCancel} /></h4>
                </div>
            </div>
            <div className="d-flex justify-content-between w-100 text-dark m-5 p-10">

                <div className="align-items-start ml-20">
                    <h3 className="">{<IntlMessages id="button.partialcancel" />}</h3>
                    <h4 className="font-weight-bold mb-5 text-center"><CountUp separator="," start={0} end={PartialCancel} /></h4>
                </div>
                <div className="align-items-center mr-20">
                    <h3 className="">{<IntlMessages id="button.systemfail" />}</h3>
                    <h4 className="font-weight-bold mb-5 text-center"><CountUp separator="," start={0} end={SystemFail} /></h4>
                </div>
            </div>
        </JbsCardContent>
    </JbsCard >
);

// type checking props
CardType6.propTypes = {
    title: PropTypes.any
}

export { CardType6 };