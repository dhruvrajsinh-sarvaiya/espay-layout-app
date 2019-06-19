import React from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "Util/IntlMessages";
import { JbsCard, JbsCardContent } from 'Components/JbsCard';
import Divider from '@material-ui/core/Divider';
import CountUp from 'react-countup';

const CardType7 = ({ title, count, icon, TotalBuy, TotalSell }) => (
    <JbsCard colClasses="col-sm-full">
        <JbsCardContent>
            <div className="d-flex justify-content-between">
                <div className="align-items-end">
                    <h1 className="display-3 font-weight-light"><i className={icon}></i></h1>
                </div>
                <div className="text-right">
                    <h1 className="font-weight-normal font-2x lh_100"><CountUp separator="," start={0} end={count} /></h1>
                    <h2 className="fs-18 d-block font-weight-normal m-0 lh_100">{title}</h2>
                </div>
            </div>
            <Divider />
            <div className="d-flex justify-content-between w-100 text-dark m-5 p-10">
                <div className="align-items-start">
                    <h3 className="">{<IntlMessages id="sidebar.tradingLedger.filterLabel.type.buy" />}</h3>
                    <h4 className="font-weight-bold mb-5"><CountUp separator="," start={0} end={TotalBuy} /></h4>
                </div>
                <div className="align-items-end">
                    <h3 className="">{<IntlMessages id="sidebar.tradingLedger.filterLabel.type.sell" />}</h3>
                    <h4 className="font-weight-bold mb-5"><CountUp separator="," start={0} end={TotalSell} /></h4>
                </div>
            </div>
        </JbsCardContent>
    </JbsCard>
);

// type checking props
CardType7.propTypes = {
    title: PropTypes.any
}

export { CardType7 };