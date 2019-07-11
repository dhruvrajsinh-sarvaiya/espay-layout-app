/* 
    Developer : Nishant Vadgama
    File Comment : Transaction Types card page
    Date : 04-12-2018
*/
import React, { Component } from "react";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Button from "@material-ui/core/Button";
import IntlMessages from "Util/IntlMessages";
import {
    BlockWidget,
} from './DashboardWidgets';

import Transaction from './TransactionTypes/Transaction';
import Withdrawal from './TransactionTypes/Withdrawal';
const components = {
    0: Transaction,
    3: Withdrawal
};

const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};
// dynamic component binding
const dynamicComponent = (TagName) => {
    return (components.hasOwnProperty(TagName)) ? React.createElement(components[TagName]) : '';
};


export default class TransactionTypes extends Component {
    state = {
        open: false,
        componentId: null
    };
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            componentId: null
        });
    };
    onCardClick(id) {
        this.setState({
            componentId: id
        });
    }
    render() {
        const transactionTypeData = [
            {
                value: 248,
                type: "Transaction"
            },
            {
                value: 42,
                type: "Buy Trade"
            },
            {
                value: 38,
                type: "Sell Trade"
            },
            {
                value: 14,
                type: "Withdraw"
            },
            {
                value: 7,
                type: "Shopping Cart"
            },
            {
                value: 58,
                type: "Deposit"
            },
            {
                value: 145,
                type: "Ganerate Address"
            },
            {
                value: 172,
                type: "Topup"
            },
            {
                value: 65,
                type: "Charge"
            },
            {
                value: 247,
                type: "Commission"
            }
        ];

        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="walletDeshbard.trnTypes" /></h2>
                    </div>
                    <div className="page-title-wrap">
                        <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                        <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                    </div>
                </div>
                <div className="row mb-20">
                    <JbsCollapsibleCard
                        colClasses="col-sm-12 w-12-full"
                    >

                        <BlockWidget
                            colClasses="mt-20"
                            title={<IntlMessages id="wallet.types" />}
                            data={transactionTypeData}
                            clickEvent={(e) => this.onCardClick(e)}
                        />
                    </JbsCollapsibleCard>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        {this.state.componentId !== null &&
                            dynamicComponent(
                                this.state.componentId
                            )}
                    </div>
                </div>
            </div>
        );
    }
}
