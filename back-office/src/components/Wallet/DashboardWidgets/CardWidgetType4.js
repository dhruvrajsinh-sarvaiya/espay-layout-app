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
import { Line } from 'react-chartjs-2';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
const smallStar = {
    height: '28px',
    width: '28px'
}
const options = {
    legend: {
        display: false
    },
    scales: {
        xAxes: [{
            display: false
        }],
        yAxes: [{
            display: false
        }]
    }
};
const CardWidgetType4 = ({ title, isDefault, grandTotal, TotalWallets, TotalUsers, data, clickEvent, changeDefault }) => (
    <JbsCard customClasses="bg-dark" colClasses="col-sm-full">
        <div className="jbs-block-title py-5 pl-10">
            <h4 className="text-white">
                <IconButton onClick={changeDefault} style={smallStar}>
                    <i className={classnames('zmdi zmdi-star', { 'text-warning': isDefault })}></i>
                </IconButton>
                {title}
            </h4>
        </div>
        <Divider />
        <a href="javascript:void(0)" onClick={clickEvent} className="w-100">
            <JbsCardContent customClasses="pb-0">
                <div className="d-flex justify-content-between w-100 text-white">
                    <div className="align-items-start">
                        <span className="">{<IntlMessages id="table.balance" />}</span>
                        <h3 className="font-weight-bold mb-0">{grandTotal}</h3>
                    </div>
                    <div className="align-items-center">
                        <span className="">{<IntlMessages id="walletDeshbard.wallets" />}</span>
                        <h3 className="font-weight-bold mb-0">{TotalWallets}</h3>
                    </div>
                    <div className="align-items-end">
                        <span className="">{<IntlMessages id="sidebar.users" />}</span>
                        <h3 className="font-weight-bold mb-0">{TotalUsers}</h3>
                    </div>
                </div>
            </JbsCardContent>
            <Line data={data} options={options} height={60} />
        </a>
    </JbsCard >
);

// type checking props
CardWidgetType4.propTypes = {
    title: PropTypes.any
}

export { CardWidgetType4 };