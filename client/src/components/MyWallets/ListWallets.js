/* 
    Developer : Nishant Vadgama
    Date : 09-01-2019
    File Comment : wallet sharing list of all available wallets component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { Table } from "reactstrap";
import AppConfig from 'Constants/AppConfig';
import { Link } from 'react-router-dom'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
//initial state
const initState = {
    currency: "",
    showClear: false,
}
//my wallets methods...
import {
    getAllWallets,
} from 'Actions/MyWallets';
import {
    getCurrency,
} from "Actions/Withdraw";

class ListWallets extends Component {
    state = initState;
    //will mount fetch data
    componentWillMount() {
        this.props.getCurrency();
        this.props.getAllWallets();
    }
    //onchange handle 
    onChangeHandler(e, key) {
        this.setState({ [key]: e.target.value });
    }
    //apply filter
    applyFilter(e) {
        if (this.state.currency !== '') {
            this.setState({ showClear: true });
            this.props.getAllWallets(this.state.currency);
        }
    }
    //clear filter
    clearFilter(e) {
        this.setState(initState);
        this.props.getAllWallets();
    }
    //render component
    render() {
        const { walletList } = this.props;
        return (
            // <JbsCollapsibleCard
            //     colClasses="col-sm-12"
            //     fullBlock>
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12">
                        <div className="top-filter clearfix deposite-search py-20">
                            <FormGroup className="w-35 mb-0">
                                <Input type="select" name="currency" id="currency" value={this.state.currency} onChange={(e) => this.onChangeHandler(e, 'currency')}>
                                    <option value=""><IntlMessages id="wallet.selectCurrency" /></option>
                                    {this.props.currencies.length !== 0 && this.props.currencies.map((curr, index) => (
                                        <option key={index} value={curr.SMSCode}>{curr.SMSCode}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                            <FormGroup className="mb-0">
                                <Button color="primary" className={"mr-10 border-0 rounded-0 " + ((this.state.currency === "") ? "disabled" : "")} onClick={(e) => this.applyFilter(e)}><IntlMessages id="widgets.apply" /></Button>
                                {this.state.showClear && <Button color="success" className={"border-0 rounded-0 "} onClick={(e) => this.clearFilter(e)}><IntlMessages id="button.clear" /></Button>}
                            </FormGroup>
                        </div>
                    </div>
                </div>
                <Table hover bordered striped className="m-0">
                    <thead>
                        <tr className="bg-primary text-white">
                            <th className="text-left"><IntlMessages id="wallet.walletName" /></th>
                            <th className="text-left"><IntlMessages id="trading.holdingorder.label.balance" /></th>
                            <th className="text-left"><IntlMessages id="lable.coin" /></th>
                            <th className="text-left"><IntlMessages id="sidebar.colActions" /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {walletList.length !== 0 && walletList.map((wallet, key) => (
                            <tr key={key}>
                                <td>
                                    <img src={AppConfig.coinlistImageurl + '/' + wallet.CoinName + '.png'} height="20" width="20" className="mr-15" />
                                    {wallet.WalletName}
                                </td>
                                <td>{wallet.Balance.toFixed(10)}</td>
                                <td>{wallet.CoinName}</td>
                                <td>
                                    <Link
                                        to={{
                                            pathname: "/app/wallet-userlist",
                                            state: { walletID: wallet.AccWalletID }
                                        }}
                                    >
                                        <i className="ti-user" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {walletList.length === 0 && <tr>
                            <td colSpan="4" className="text-center">
                                <IntlMessages id="wallet.emptyTable" />
                            </td>
                        </tr>}
                    </tbody>
                </Table>
                {this.props.loading && <JbsSectionLoader />}
            </React.Fragment>
            // </JbsCollapsibleCard>
        );
    }
}

const mapStateToProps = ({ MyWalletsReducer, withdrawApp }) => {
    const { loading, walletList } = MyWalletsReducer;
    const { currencies } = withdrawApp;
    return { loading, walletList, currencies };
}
export default connect(mapStateToProps, {
    getAllWallets,
    getCurrency
})(ListWallets);