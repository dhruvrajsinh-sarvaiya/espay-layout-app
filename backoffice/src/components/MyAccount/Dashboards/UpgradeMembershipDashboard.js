/* 
    Developer : Kevin Ladani
    Date : 27-11-2018
    File Comment : Upgrade Membership Component
*/
import React, { Component, Fragment } from 'react';
import IntlMessages from "Util/IntlMessages";
import 'rc-drawer/assets/index.css';
import MatButton from "@material-ui/core/Button";
import { Button } from "reactstrap";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { DashboardPageTitle } from './DashboardPageTitle';

const membershipList = [
    {
        "typeId": "Basic",
        "plan_type": "Basic",
        "Price": 0,
        "Description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        "LevelName": "Basic",
        "DepositFee": "0",
        "Withdrawalfee": "0.007",
        "Tradingfee": "0.01",
        "WithdrawalLimit": "2"
    },
    {
        "typeId": "Standard",
        "plan_type": "Standard",
        "Price": 2.99,
        "Description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        "LevelName": "Standard",
        "DepositFee": "0",
        "Withdrawalfee": "0.005",
        "Tradingfee": "0.07",
        "WithdrawalLimit": "100"
    },
    {
        "typeId": "Premuim",
        "plan_type": "Premuim",
        "Price": 9.99,
        "Description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        "LevelName": "Premuim",
        "DepositFee": "0",
        "Withdrawalfee": "0.003",
        "Tradingfee": "0.05",
        "WithdrawalLimit": "0"
    },
];

const MembershipButton = ({ plan_type }) => {
    let ButtonLevel = "";

    if (plan_type === "Basic") {
        ButtonLevel = <Button color="success" className="btn-block btn-lg"><IntlMessages id="sidebar.basic" /></Button>;
    } else {
        ButtonLevel = <Button color="primary" className="btn-block btn-lg"><IntlMessages id="my_account.upgradeMembershipLevel" /></Button>;
    }
    return ButtonLevel;
};

class UpgradeMembershipDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            err_msg: '',
            loading: false
        };
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }
    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
        });
    }

    render() {
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.upgradeMembership" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="mt-20  mx-auto row">
                    {membershipList.map((list, key) => (
                        <div className="col-md-4" key={key}>
                            <JbsCollapsibleCard customClasses="text-center border border-solid border-dark">
                                <div className="pricing-icon">
                                    <i className="zmdi zmdi-laptop zmdi-hc-5x"></i>
                                </div>
                                <div className={`text-center pl-10`}>
                                    <h3 className="display-4 font-weight-light">{list.typeId}</h3>
                                    <div>
                                        <span className="pricing-main"><sup></sup>{list.Price}</span>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-2" />
                                        <div className="col-sm-8">
                                            <h4 style={{ minHeight: "50px" }}>{list.Description}</h4>
                                        </div>
                                        <div className="col-sm-2" />
                                    </div>

                                    <div className="mt-30">
                                        <div className="w-75 mx-auto">
                                            <MembershipButton plan_type={list.typeId} />
                                        </div>
                                    </div>

                                    <div className="mt-20 text-left row">
                                        <div className="offset-sm-2 col-sm-3 offset-md-2 col-md-6 pl-20">
                                            {<IntlMessages id="my_account.membershipLevel.depositFees" />}
                                        </div>
                                        <div className="col-md-4 col-sm-2">{list.DepositFee}</div>
                                    </div>
                                    <div className="mt-20 text-left row">
                                        <div className="offset-sm-2 col-sm-6 offset-md-2 col-md-6 pl-20">
                                            {<IntlMessages id="my_account.membershipLevel.withdarwlFees" />}
                                        </div>
                                        <div className="col-md-4 col-sm-4">{list.Withdrawalfee}</div>
                                    </div>
                                    <div className="mt-20 text-left row">
                                        <div className="offset-sm-2 col-sm-6 offset-md-2 col-md-6 pl-20">
                                            {<IntlMessages id="my_account.membershipLevel.tradingFees" />}
                                        </div>
                                        <div className="col-md-4 col-sm-4">{list.Tradingfee}</div>
                                    </div>
                                    <div className="mt-20 text-left row mb-20">
                                        <div className="offset-sm-2 col-sm-6 offset-md-2 col-md-6 pl-20">
                                            {<IntlMessages id="my_account.membershipLevel.withdrawalLimit" />}
                                        </div>
                                        <div className="col-md-4 col-sm-4">{list.WithdrawalLimit} BTC</div>
                                    </div>
                                </div>
                            </JbsCollapsibleCard>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export { UpgradeMembershipDashboard };