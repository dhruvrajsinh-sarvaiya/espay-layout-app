/**
 * Our Loactions Widget
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Input } from 'reactstrap';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { Table } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import classNames from 'classnames';

import { Scrollbars } from 'react-custom-scrollbars';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Badge } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AppConfig from 'Constants/AppConfig';
// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

// Import component for internationalization
import IntlMessages from 'Util/IntlMessages';

import {
    getAllBalance,
    getWalletsBalance
} from 'Actions/FundBalances';

const buttonSizeSmall = {
    maxHeight: "36px",
    minHeight: "36px",
    maxWidth: "36px"
};

const BalanceWidget = ({ coin, balance, getDetails, wallets, loading }) => (
    <div className={classNames("social-card my-10 mx-5 balancecard")}>
        <span className={`social-icon`}>
            <img
                // src={getImage}
                src={AppConfig.coinlistImageurl + '/' + coin + '.png'}
                style={{ width: "65px" }}
                alt={coin}
                className="rounded-circle"
                onError={(e) => {
                    e.target.src = require(`Assets/icon/default.png`) // default img
                }}
            />
        </span>
        <span className="w-60">
            <span className="font-weight-bold">{parseFloat(balance).toFixed(8)}</span>
            <span className="fs-14">{coin}</span>
        </span>
        <span className="w-20">
            <UncontrolledDropdown nav className="list-inline-item  Fundbalencepopup">
                <DropdownToggle nav className="p-0">
                    <IconButton className="" aria-label="bell" onClick={getDetails}>
                        <i className="zmdi zmdi-eye"></i>
                    </IconButton>
                </DropdownToggle>
                <DropdownMenu right>
                    <div className="dropdown-content">
                        <div className="dropdown-top d-flex justify-content-between rounded-top bg-primary py-10">
                            <span className="text-white font-weight-bold">
                                <IntlMessages id="wallet.wallets" />
                            </span>
                        </div>
                        <Scrollbars className="jbs-scroll" autoHeight autoHeightMin={100} autoHeightMax={280}>
                            {loading && <JbsSectionLoader />}
                            <ul className="list-unstyled dropdown-list">
                                {wallets && wallets.map((wallet, key) => (
                                    <li key={key}>
                                        <div className="media">
                                            <div className="media-body pt-5">
                                                <div className="d-flex justify-content-between">
                                                    <h5 className="mb-5 text-primary">{wallet.Wallet.WalletName}</h5>
                                                </div>
                                                <div className="col-sm-12 justify-content-between d-flex">
                                                    <span className="w-50 mx-5">
                                                        <span className="font-weight-bold text-center">{parseFloat(wallet.Wallet.Balance.ShadowBalance).toFixed(8)}</span>
                                                        <span className="fs-14 badge badge-danger">{<IntlMessages id="wallet.lien" />}</span>
                                                    </span>
                                                    <span className="w-50 mx-5">
                                                        <span className="font-weight-bold text-center">{parseFloat(wallet.Wallet.Balance.StackingBalance).toFixed(8)}</span>
                                                        <span className="fs-14 badge badge-warning">{<IntlMessages id="wallet.stack" />}</span>
                                                    </span>
                                                </div>
                                                <div className="col-sm-12 justify-content-between d-flex">
                                                    <span className="w-50 mx-5">
                                                        <span className="font-weight-bold text-center">{parseFloat(wallet.Wallet.Balance.UnClearedBalance).toFixed(8)}</span>
                                                        <span className="fs-14 badge badge-info">{<IntlMessages id="wallet.pending" />}</span>
                                                    </span>
                                                    <span className="w-50 mx-5">
                                                        <span className="font-weight-bold text-center">{parseFloat(wallet.Wallet.Balance.AvailableBalance).toFixed(8)}</span>
                                                        <span className="fs-14 badge badge-success">{<IntlMessages id="wallet.available" />}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Scrollbars>
                    </div>
                </DropdownMenu>
            </UncontrolledDropdown>
        </span>
    </div>
);

const initState = {
    TotalBalance: 0.0,
    DailyLimit: 0.0,
    UsedLimit: 0.0,
    balanceList: [],
    hideZero: false,
    search: '',
    isSearch: false,
    filterList: [],
}

class FundBalances extends Component {
    //set initial state...
    constructor(props) {
        super(props);
        this.state = {
            TotalBalance: 0.0,
            DailyLimit: 0.0,
            UsedLimit: 0.0,
            balanceList: [],
            hideZero: false,
            search: '',
            isSearch: false,
            filterList: [],
            hubConnection: this.props.location.state.hubConnection,
        };
    }
    //toggle switch action...
    handleToggle() {
        this.setState({
            hideZero: !this.state.hideZero
        });
    }
    //get image icons...
    getImage(coin) {
        try {
            return require(`Assets/icon/${coin.toLowerCase()}.png`);
        } catch (e) {
            return require(`Assets/icon/default.png`);
        }
    }
    //on search type...
    onChangeSearch(e) {
        var updatedList = this.state.balanceList;
        updatedList = updatedList.filter(function (coin) {
            return coin.WalletType.toLowerCase().search(e.target.value.toLowerCase()) !== -1;
        });
        this.setState({ search: e.target.value, filterList: updatedList });
    }
    //will mount data binding...
    componentWillMount() {
        this.props.getAllBalance();
        //refresh balance on update
        this.state.hubConnection.on('RecieveWalletBal', (walletBalance) => {
            // console.log("response from signalr RecieveWalletBal", walletBalance);
            try {
                walletBalance = JSON.parse(walletBalance);
                //refresh balance call 
                if (walletBalance.Data.hasOwnProperty('CoinName')) {
                    this.setState({ filterList: [] }, () => this.props.getAllBalance());
                }
            } catch (error) {
                // console.log("response from signalr RecieveWalletBal", error);
            }
        });
    }
    //will recieve props update states...
    componentWillReceiveProps(nextprops) {
        //assign first time
        if (!this.state.filterList.length
            && nextprops.allBalance.hasOwnProperty("Response")
            && nextprops.allBalance.Response.length) {
            this.setState({
                balanceList: nextprops.allBalance.Response,
                filterList: nextprops.allBalance.Response,
                TotalBalance: nextprops.allBalance.TotalBalance,
                DailyLimit: nextprops.allBalance.DailyLimit,
                UsedLimit: nextprops.allBalance.UsedLimit,
            });
        }
    }
    //refresh balance 
    refreshBalance = () => {
        this.setState(initState);
        this.props.getAllBalance();
    }

    render() {
        return (
            <div className="fnd_blnc_area">
                {this.props.loading && <JbsSectionLoader />}
                <div className="row d-flex justify-content-between">
                    <div className="w-20 d-flex pl-20 pb-10 justify-content-between srch_area">
                        <div className="search-wrapper w-80 pr-10">
                            <IntlMessages id="widgets.search">
                                {(placeholder) =>
                                    <Input type="search" className="search-input-lg" placeholder={placeholder + ".."} value={this.state.search} onChange={(e) => this.onChangeSearch(e)} />
                                }
                            </IntlMessages>
                        </div>
                        <div className="w-20">
                            <IconButton color="primary" aria-label="Refresh" style={buttonSizeSmall} onClick={(e) => this.refreshBalance()}>
                                <i className="zmdi zmdi-refresh"></i>
                            </IconButton>
                        </div>
                    </div>
                    <div className="pr-20 pt-10 rht_prt">
                        {<IntlMessages id="wallet.estimatedValue" />}：<span className="font-weight-bold">{parseFloat(this.state.TotalBalance).toFixed(8)}</span> BTC
                    </div>
                </div>
                <div className="row d-flex justify-content-between">
                    <div className="w-40 float-left pb-10 hide_blnc">
                        <Switch onChange={() => this.handleToggle()} checked={this.state.hideZero} /> {<IntlMessages id="wallet.hidezerobal" />}
                    </div>
                    <div className="pr-20 pt-10 rht_prt">
                        {<IntlMessages id="wallet.24limit" />}：{parseFloat(this.state.DailyLimit).toFixed(8)} BTC,  {<IntlMessages id="wallet.inUse" />}：{parseFloat(this.state.UsedLimit).toFixed(8)} BTC
                    </div>
                </div>
                <div className="row">
                    {this.state.filterList.map((coin, key) => {
                        return (
                            <div
                                className={classNames({ fundbalancedivcard_darkmode: this.props.darkMode }, { "col-sm-6 col-md-3 col-lg-3 w-xs-half-block": (this.state.hideZero && coin.Balance != 0) }, { "col-sm-6 col-md-3 col-lg-3 w-xs-half-block": (!this.state.hideZero) }
                                )}
                                key={key}
                            >
                                {(this.state.hideZero) ?
                                    coin.Balance != 0 && <BalanceWidget
                                        coin={coin.WalletType}
                                        balance={coin.Balance}
                                        // getImage={this.getImage(coin.WalletType)}
                                        getDetails={(e) => this.props.getWalletsBalance(coin.WalletType)}
                                        wallets={this.props.wallets}
                                        loading={this.props.subLoading}
                                    />
                                    :
                                    <BalanceWidget
                                        coin={coin.WalletType}
                                        balance={coin.Balance}
                                        // getImage={this.getImage(coin.WalletType)}
                                        getDetails={(e) => this.props.getWalletsBalance(coin.WalletType)}
                                        wallets={this.props.wallets}
                                        loading={this.props.subLoading}
                                    />
                                }
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

// connect props for dispatch actions
const mapDispatchToProps = ({ fundBalanceReducer, settings }) => {
    const { darkMode } = settings;
    const { allBalance, wallets, loading, subLoading } = fundBalanceReducer;
    return { allBalance, wallets, loading, subLoading, darkMode };
}

export default connect(mapDispatchToProps, {
    getAllBalance,
    getWalletsBalance
})(FundBalances);