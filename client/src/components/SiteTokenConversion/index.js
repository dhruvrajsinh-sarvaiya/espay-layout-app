// component for site token conversion 11/2/2019
import React from 'react';

// used for conect store
import { connect } from 'react-redux';

// import select box 
import Select from "react-select";

//pagetitle bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// for convert languages 
import IntlMessages from 'Util/IntlMessages';

// for use jquery
import $ from 'jquery';

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

// import for design page
import { Input, Button, Form, Row, Col } from 'reactstrap';

// Method for get wallets data
import { getCurrencyList, getCurrencyData } from "Actions/Trade";

// Method for Site Token Conversion
import { getSiteToken, getSiteTokenCalculation, doSiteTokenConversion } from "Actions/SiteTokenConversion";


// import component for Card Design
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

import AppConfig from 'Constants/AppConfig';
//added by parth andhariya
import {
    getMaringWalletList
} from 'Actions/MarginTrading';
// component for SiteTokenConversion 
class SiteTokenConversion extends React.Component {

    // set State
    state = {
        selectedCurrency: "",
        selectedBalance: 0,
        netTotal: 1500,
        amount: "",
        siteTokens: [],
        selectedSiteToken: "",
        selectedSiteTokenID: 0,
        token: "",
        currencyData: [],
        wallet: [],
        selectedId: 0,
        displayError: 0,
        isFirst: 0,
        UserID: "",
        UserLabel: null,
        SiteToken: null,
        Currency: null,
        Qty: "",
        baseCurrencyName: "",
        baseCurrencyRate: "",
        isConvert: 0,
        tokenMinLimit: "",
        tokenMaxLimit: "",
        //added by parth andhariya
        siteTokenFlag: true,
        selectedSiteTokenCurrencyID: 0
    }

    // set data from recieves from props in state
    componentWillReceiveProps(nextprops) {
        // set error message  for calculation error 
        if (nextprops.calcError && nextprops.calcError.ReturnCode == 1 || nextprops.calcError.ReturnCode == 9 && this.state.displayError) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.calcError.ErrorCode}`} />);
            this.setState({
                displayError: 0,
                amount: "",
                token: "",
                Qty: ""
            })
        }

        // set error message for conversion error
        if (nextprops.conversionError && nextprops.conversionError.ReturnCode == 1 || nextprops.conversionError.ReturnCode == 9 && this.state.isConvert) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.conversionError.ErrorCode}`} />);
            this.setState({
                isConvert: 0,
                amount: "",
                token: "",
                Qty: ""
            })

            // set messsage for success in convert token 
        } else if (nextprops.conversionError.length == 0 && this.state.isConvert && nextprops.siteTokenConversion
            && nextprops.siteTokenConversion.ErrorCode == 2253 && nextprops.siteTokenConversion.ReturnCode == 0) {
            this.setState({
                selectedCurrency: "",
                selectedBalance: 0,
                netTotal: 1500,
                amount: "",
                selectedSiteToken: "",
                selectedSiteTokenID: 0,
                tokenMinLimit: "",
                tokenMaxLimit: "",
                token: "",
                selectedId: 0,
                displayError: 0,
                isFirst: 0,
                UserID: "",
                UserLabel: null,
                SiteToken: null,
                Currency: null,
                Qty: "",
                baseCurrencyName: "",
                baseCurrencyRate: "",
                isConvert: 0,
                //added by parth andhariya
                siteTokenFlag: true,
                selectedSiteTokenCurrencyID: 0
            })
            NotificationManager.success(<IntlMessages id={`sidebar.sitetokenconvert`} values={{ Param1: nextprops.siteTokenConversion.response.TrnID }} />)
        }

        // set data for token calculation suceess
        if (nextprops.siteTokenCalculation !== null && this.state.displayError) {

            if (this.state.isFirst) {
                this.setState({
                    token: parseFloat(nextprops.siteTokenCalculation.ResultQty).toFixed(8),
                    Qty: parseFloat(nextprops.siteTokenCalculation.ResultQty).toFixed(8),
                    displayError: 0,
                })
            } else {
                this.setState({
                    amount: parseFloat(nextprops.siteTokenCalculation.ResultQty).toFixed(8),
                    Qty: parseFloat(nextprops.siteTokenCalculation.ResultQty).toFixed(8),
                    displayError: 0
                })
            }

        }
        // set state for site tokens data
        if (nextprops.siteTokens && nextprops.siteTokens.length > 0) {
            this.setState({
                siteTokens: nextprops.siteTokens,
            })
            if (this.props.history.location.state.IsMargin) {
                var currencyData = []
                nextprops.siteTokens.map((currency, key) => {
                    var index = currencyData.findIndex(value => value.BaseCurrencySMSCode === currency.BaseCurrencySMSCode);
                    if (index === -1) {
                        currencyData.push(currency)
                    }
                })
                this.setState({ currencyData: currencyData })
            }
        }
        // set state for currencyData for list currency
        if (!(this.props.history.location.state.IsMargin)) {
            if (nextprops.currencyData && nextprops.currencyData.length > 0) {
                this.setState({
                    currencyData: nextprops.currencyData
                })
            }
        }

        // set state for wallet 
        if (this.props.history.location.state.IsMargin) {
            var wallet = []
            if (nextprops.walletList && nextprops.walletList.length > 0) {
                nextprops.walletList.map((walletList, key) => {
                    var index = wallet.findIndex(value => value.CoinName === walletList.CoinName);
                    if (index === -1) {
                        wallet.push(walletList)
                    }
                })
                this.setState({
                    wallet: wallet
                })
            }
            if (nextprops.siteTokens.length > 0 && this.state.siteTokenFlag && wallet.length > 0) {
                let e = {}
                nextprops.siteTokens.forEach((currency, index) => {
                    if (this.props.history.location.state.MarginWalletCurrency.CoinName === currency.BaseCurrencySMSCode) {
                        e = {
                            value: currency.BaseCurrencySMSCode,
                            currencyID: currency.BaseCurrencyID,
                            label: currency.BaseCurrencySMSCode,
                            Name: currency.BaseCurrencySMSCode,
                        }
                    }
                })
                if (e.hasOwnProperty("value") && e.value != "") {
                    setTimeout(function () {
                        e && this.onChangeSelectCurrency(e);
                    }.bind(this), 3000);
                }
                this.setState({ siteTokenFlag: false })
            }
        } else {
            if (nextprops.wallet && nextprops.wallet.length > 0) {
                this.setState({
                    wallet: nextprops.wallet
                })
            }
        }
    }

    //set amount on change of textbox
    handleChangeAmount = (event) => {
        if ($.isNumeric(event.target.value) || event.target.value == '') {
            this.setState({ amount: event.target.value });
        }
    }

    //set token  on change of textbox
    handleChangeToken = (event) => {
        if ($.isNumeric(event.target.value) || event.target.value == '') {
            this.setState({ token: event.target.value });
        }
    }

    // Clear All Data
    clearAllData = (event) => {
        event.preventDefault()
        this.setState({
            selectedCurrency: "",
            selectedBalance: 0,
            netTotal: 1500,
            amount: "",
            selectedSiteToken: "",
            selectedSiteTokenID: 0,
            tokenMinLimit: "",
            tokenMaxLimit: "",
            token: "",
            selectedId: 0,
            displayError: 0,
            isFirst: 0,
            UserID: "",
            UserLabel: null,
            SiteToken: null,
            Currency: null,
            Qty: "",
            baseCurrencyName: "",
            baseCurrencyRate: "",
            isConvert: 0,
            //added by parth andhariya
            siteTokenFlag: true,
            selectedSiteTokenCurrencyID: 0
        })
    }

    // Call ConvertToken API for Conver token
    ConvertToken = (event) => {
        event.preventDefault()

        if (this.state.amount > this.state.selectedBalance) {
            NotificationManager.error(<IntlMessages id="trading.placeorder.error.minBalance" />)
        } else if (this.state.selectedId == "" || this.state.selectedId == 0) {

            NotificationManager.error(<IntlMessages id="trading.placeorder.error.selwall" />)
        } else if (this.state.selectedSiteTokenID == "" || this.state.selectedSiteTokenID == 0) {

            NotificationManager.error(<IntlMessages id="trading.placeorder.error.seltoken" />)
        } else if (this.state.Qty == "") {

            NotificationManager.error(<IntlMessages id="trading.placeorder.error.amttkn" />)
        } else if (this.state.token < this.state.tokenMinLimit) {

            NotificationManager.error(<IntlMessages id={`sidebar.sitetoken.minlimit`} values={{ Param1: this.state.tokenMinLimit }} />)
        } else if (this.state.token > this.state.tokenMaxLimit) {

            NotificationManager.error(<IntlMessages id={`sidebar.sitetoken.maxlimit`} values={{ Param2: this.state.tokenMaxLimit }} />)
        } else {
            // Set and API Call If Required Data is available
            if (this.state.selectedId !== 0 && this.state.selectedSiteTokenID !== 0 && this.state.amount !== "") {

                const Data = {
                    SourceCurrencyID: parseFloat(this.state.selectedId),
                    SiteTokenMasterID: parseFloat(this.state.selectedSiteTokenID),
                    SourceCurrencyQty: this.state.amount ? parseFloat(this.state.amount) : 0,
                    TrnMode: 21
                }

                this.setState({
                    isConvert: 1
                })
                //added by parth andhariya 
                if (this.props.history.location.state.IsMargin) {
                    Data.IsMargin = 1;
                    this.props.doSiteTokenConversion(Data)
                } else {
                    this.props.doSiteTokenConversion(Data)
                }
            }
        }

    }

    // handle blur event for amount and call calculation 
    handleBlurAmount = (event) => {
        if (this.state.selectedSiteTokenID !== 0 && (this.state.amount !== "" || this.state.token !== "") && this.state.selectedId !== 0) {

            if (this.state.amount !== "" && this.state.amount !== "0") {
                const Data = {
                    SourceCurrencyID: parseFloat(this.state.selectedId),
                    SiteTokenMasterID: parseFloat(this.state.selectedSiteTokenID),
                    Qty: this.state.amount ? parseFloat(this.state.amount) : 0,
                    ISSiteTokenToCurrency: 0
                }

                this.setState({
                    isFirst: 1,
                    displayError: 1
                })

                //added by parth andhariya 
                if (this.props.history.location.state.IsMargin) {
                    Data.IsMargin = 1;
                    this.props.getSiteTokenCalculation(Data)
                } else {
                    this.props.getSiteTokenCalculation(Data)
                }
            } else if (this.state.token !== "" && this.state.token !== "0") {

                const Data = {
                    SourceCurrencyID: parseFloat(this.state.selectedId),
                    SiteTokenMasterID: parseFloat(this.state.selectedSiteTokenID),
                    Qty: this.state.token ? parseFloat(this.state.token) : 0,
                    ISSiteTokenToCurrency: 1
                }
                this.setState({
                    isFirst: 0,
                    displayError: 1
                })
                //added by parth andhariya 
                if (this.props.history.location.state.IsMargin) {
                    Data.IsMargin = 1;
                    this.props.getSiteTokenCalculation(Data)
                } else {
                    this.props.getSiteTokenCalculation(Data)
                }
            }
        }
    }

    // handle blur event for token and call calculation 
    handleBlurToken = (event) => {
        if (this.state.selectedId !== 0 && (this.state.amount !== "" || this.state.token !== "") && this.state.selectedSiteTokenID !== 0) {
            if (this.state.token !== "" && this.state.token !== "0") {
                const Data = {
                    SourceCurrencyID: parseFloat(this.state.selectedId),
                    SiteTokenMasterID: parseFloat(this.state.selectedSiteTokenID),
                    Qty: this.state.token ? parseFloat(this.state.token) : 0,
                    ISSiteTokenToCurrency: 1
                }
                this.setState({
                    isFirst: 0,
                    displayError: 1
                })
                //added by parth andhariya 
                if (this.props.history.location.state.IsMargin) {
                    Data.IsMargin = 1;
                    this.props.getSiteTokenCalculation(Data)
                } else {
                    this.props.getSiteTokenCalculation(Data)
                }

            } else if (this.state.amount !== "" && this.state.amount !== "0") {
                const Data = {
                    SourceCurrencyID: parseFloat(this.state.selectedId),
                    SiteTokenMasterID: parseFloat(this.state.selectedSiteTokenID),
                    Qty: this.state.amount ? parseFloat(this.state.amount) : 0,
                    ISSiteTokenToCurrency: 0
                }

                this.setState({
                    isFirst: 1,
                    displayError: 1
                })
                //added by parth andhariya 
                if (this.props.history.location.state.IsMargin) {
                    Data.IsMargin = 1;
                    this.props.getSiteTokenCalculation(Data)
                } else {
                    this.props.getSiteTokenCalculation(Data)
                }
            }
        }

    }

    //invoke after page render
    componentDidMount() {
        //added by parth andhariya
        if (this.props.history.location.state.IsMargin) {
            this.props.getSiteToken({ IsMargin: 1 })
            this.props.getMaringWalletList({});
        } else {
            this.props.getCurrencyList({})
            this.props.getSiteToken({})
            this.props.getCurrencyData({})
        }
    }

    //  Call Calculation and set selected ID on change of currency pair list
    onChangeSelectCurrency = (e) => {
        if (this.state.selectedId != e.currencyID && e.Name !== this.state.selectedSiteToken) {
            this.state.wallet.map((value, key) => {
                if (e.Name == value.CoinName && value.IsDefaultWallet) {
                    this.setState({
                        selectedBalance: value.Balance
                    })
                    if (this.state.selectedSiteTokenID !== 0) {

                        if (this.state.amount !== "" && this.state.amount !== "0" && this.state.amount) {
                            const Data = {
                                SourceCurrencyID: parseFloat(e.currencyID),
                                SiteTokenMasterID: parseFloat(this.state.selectedSiteTokenID),
                                Qty: this.state.amount ? parseFloat(this.state.amount) : 0,
                                ISSiteTokenToCurrency: 0
                            }

                            this.setState({
                                isFirst: 1,
                                displayError: 1
                            })
                            //added by parth andhariya 
                            if (this.props.history.location.state.IsMargin) {
                                Data.IsMargin = 1;
                                this.props.getSiteTokenCalculation(Data)
                            } else {
                                this.props.getSiteTokenCalculation(Data)
                            }

                        } else if (this.state.token !== "" && this.state.token !== "0") {
                            const Data = {
                                SourceCurrencyID: parseFloat(e.currencyID),
                                SiteTokenMasterID: parseFloat(this.state.selectedSiteTokenID),
                                Qty: this.state.token ? parseFloat(this.state.token) : 0,
                                ISSiteTokenToCurrency: 1
                            }
                            this.setState({
                                isFirst: 0,
                                displayError: 1
                            })
                            //added by parth andhariya 
                            if (this.props.history.location.state.IsMargin) {
                                Data.IsMargin = 1;
                                this.props.getSiteTokenCalculation(Data)
                            } else {
                                this.props.getSiteTokenCalculation(Data)
                            }
                        }
                    }
                }
            })
            this.setState({ selectedId: e.currencyID, selectedCurrency: e.Name, Currency: { label: e.label } });
        } else {
            NotificationManager.error(<IntlMessages id="sidebar.siteTokenReport.samecurrency" />)
        }
    }

    //  Call Calculation and set selected ID on change of Site Token List
    onChangeSiteTokenCurrency = (e) => {
        if (this.state.selectedSiteTokenCurrencyID != e.CurrencyID && this.state.selectedSiteTokenID != e.tokenId && this.state.selectedCurrency !== e.Name) {
            if (this.state.selectedId !== 0) {

                if (this.state.token !== "" && this.state.token !== "0" && this.state.token) {
                    const Data = {
                        SourceCurrencyID: parseFloat(this.state.selectedId),
                        SiteTokenMasterID: parseFloat(e.tokenId),
                        Qty: this.state.token ? parseFloat(this.state.token) : 0,
                        ISSiteTokenToCurrency: 1
                    }

                    this.setState({
                        isFirst: 0,
                        displayError: 1
                    })

                    //added by parth andhariya 
                    if (this.props.history.location.state.IsMargin) {
                        Data.IsMargin = 1;
                        this.props.getSiteTokenCalculation(Data)
                    } else {
                        this.props.getSiteTokenCalculation(Data)
                    }

                } else if (this.state.amount !== "" && this.state.amount !== "0") {
                    const Data = {
                        SourceCurrencyID: parseFloat(this.state.selectedId),
                        SiteTokenMasterID: parseFloat(e.tokenId),
                        Qty: this.state.amount ? parseFloat(this.state.amount) : 0,
                        ISSiteTokenToCurrency: 0
                    }

                    this.setState({
                        isFirst: 1,
                        displayError: 1
                    })
                    //added by parth andhariya 
                    if (this.props.history.location.state.IsMargin) {
                        Data.IsMargin = 1;
                        this.props.getSiteTokenCalculation(Data)
                    } else {
                        this.props.getSiteTokenCalculation(Data)
                    }
                }
            }
            this.setState({
                selectedSiteTokenID: e.tokenId,
                selectedSiteToken: e.Name,
                baseCurrencyName: e.baseName,
                baseCurrencyRate: e.baseRate,
                SiteToken: { label: e.label },
                tokenMinLimit: e.minLimit,
                tokenMaxLimit: e.maxLimit,
                // added by parth andhariya
                selectedSiteTokenCurrencyID: e.CurrencyID
            });
        } else {
            NotificationManager.error(<IntlMessages id="sidebar.siteTokenReport.samecurrency" />)
        }
    }

    //Component renders 
    render() {
        return (
            <div>
                <PageTitleBar title={<IntlMessages id="sidebar.tokenConversion" />} match={this.props.match} />
                <JbsCollapsibleCard
                    colClasses="col-sm-12 col-md-12 col-xl-6"
                    heading=''
                    fullBlock
                >
                    {(this.props.loading || this.props.CurrencyLoader || this.props.loader ||
                        this.props.loadingConversion || this.props.calcLoader) &&
                        <JbsSectionLoader />
                    }

                    <h1 className="m-10 p-0 mb-5">{<IntlMessages id="sidebar.tokenConversion.title" />}</h1>
                    <Form>

                        <Row className="m-10">
                            <Col md={4} sm={4}>
                                <IntlMessages id="sidebar.tokenConversion.cvtToken" />
                            </Col>

                            <Col md={8} sm={8}>
                                <Row>
                                    <div className="col-md-8 col-sm-8 col-8">
                                        <IntlMessages id="trading.newTrading.tokenvalue.text">
                                            {(placeholder) =>
                                                <Input type="text" value={this.state.token} name="token" id="token"
                                                    placeholder={placeholder} onChange={this.handleChangeToken}
                                                    onBlur={this.handleBlurToken}
                                                ></Input>
                                            }
                                        </IntlMessages>
                                    </div>

                                    <div className="col-md-4 col-sm-4 col-4">
                                        {this.state.siteTokens.length != 0 && <Select
                                            className="wallet-depositreactselect"
                                            options={this.state.siteTokens.map((coin, i) => ({
                                                label: (
                                                    <span>
                                                        <img
                                                            src={AppConfig.coinlistImageurl + '/' + coin.CurrencySMSCode + '.png'}
                                                            className="mr-10"
                                                            height="25px"
                                                            width="25px"
                                                            alt={coin.CurrencySMSCode}
                                                        />
                                                        {coin.CurrencySMSCode}
                                                    </span>
                                                ),
                                                Name: coin.CurrencySMSCode,
                                                tokenId: coin.ID,
                                                //added by parth andhariya
                                                CurrencyID: coin.CurrencyID,
                                                value: coin.CurrencySMSCode,
                                                baseName: coin.BaseCurrencySMSCode,
                                                baseRate: coin.Rate,
                                                minLimit: coin.MinLimit,
                                                maxLimit: coin.MaxLimit
                                            }))}
                                            onChange={e => this.onChangeSiteTokenCurrency(e)}
                                            value={this.state.SiteToken}
                                        />}
                                    </div>
                                </Row>

                            </Col>
                        </Row>

                        <Row className="m-10">
                            <Col md={4} sm={4}>
                                <IntlMessages id="sidebar.siteTokenReport.fromcurrency" />
                            </Col>

                            <Col md={8} sm={8}>
                                <Row>
                                    <div className="col-md-8 col-sm-8 col-8">
                                        <IntlMessages id="trading.orders.label.amount">
                                            {(placeholder) =>
                                                <Input type="text" value={this.state.amount} name="amount" id="amount"
                                                    placeholder={placeholder} onChange={this.handleChangeAmount}
                                                    onBlur={this.handleBlurAmount}
                                                ></Input>
                                            }
                                        </IntlMessages>
                                    </div>

                                    <div className="col-md-4 col-sm-4 col-4">
                                        {this.state.currencyData.length != 0 && <Select
                                            className="wallet-depositreactselect"
                                            options={this.state.currencyData.map((coin, i) => ({
                                                label: (
                                                    <span>
                                                        <img
                                                            src={AppConfig.coinlistImageurl + '/' + (coin.hasOwnProperty("SMSCode") ? coin.SMSCode : coin.BaseCurrencySMSCode) + '.png'}
                                                            className="mr-10"
                                                            height="25px"
                                                            width="25px"
                                                            alt={coin.hasOwnProperty("SMSCode") ? coin.SMSCode : coin.BaseCurrencySMSCode}
                                                        />
                                                        {coin.hasOwnProperty("SMSCode") ? coin.SMSCode : coin.BaseCurrencySMSCode}
                                                    </span>
                                                ),
                                                value: coin.hasOwnProperty("SMSCode") ? coin.SMSCode : coin.BaseCurrencySMSCode,
                                                currencyID: coin.hasOwnProperty("ServiceId") ? coin.ServiceId : coin.BaseCurrencyID,
                                                Name: coin.hasOwnProperty("SMSCode") ? coin.SMSCode : coin.BaseCurrencySMSCode
                                            }))}
                                            onChange={e => this.onChangeSelectCurrency(e)}
                                            value={this.state.Currency}
                                        />}
                                    </div>
                                </Row>

                            </Col>
                        </Row>

                        <Row className="m-10 mt-10">

                            <Col sm={{ size: '8', offset: '4' }} className="text-right">
                                <span><IntlMessages id="wallet.AGAvailableBalance" /> : {this.state.selectedBalance}</span>
                            </Col>

                        </Row>

                        <Row className="m-10">
                            <Col sm={4} className="text-left">
                                <IntlMessages id="sidebar.sitetoken.details" />
                            </Col>
                        </Row>
                        <Row className="m-10">
                            <div className="col-md-4 col-sm-4 col-4">
                                <IntlMessages id="sidebar.siteTokern.currenctrate" />
                            </div>

                            <div className="col-md-8 col-sm-8 col-8 text-right">
                                <span>{this.state.baseCurrencyRate !== "" ? parseFloat(this.state.baseCurrencyRate).toFixed(8) : 0} {this.state.baseCurrencyName}</span>
                            </div>
                        </Row>

                        <Row className="m-10">
                            <div className="col-md-4 col-sm-4 col-4">
                                <IntlMessages id="sidebar.siteTokenReport.minimum" />
                            </div>

                            <div className="col-md-8 col-sm-8 col-8 text-right">
                                <span>{this.state.tokenMinLimit == "" ? 0 : parseFloat(this.state.tokenMinLimit).toFixed(8)}  {this.state.selectedSiteToken}</span>
                            </div>
                        </Row>

                        <Row className="m-10">
                            <div className="col-md-4 col-sm-4 col-4">
                                <IntlMessages id="sidebar.siteTokenReport.maximum" />
                            </div>

                            <div className="col-md-8 col-sm-8 col-8 text-right">
                                <span>{this.state.tokenMaxLimit == "" ? 0 : parseFloat(this.state.tokenMaxLimit).toFixed(8)}  {this.state.selectedSiteToken}</span>
                            </div>
                        </Row>

                        <Row className="m-10">
                            <div className="col-md-4 col-sm-4 col-4">
                                <IntlMessages id="sidebar.siteTokenReport.fromcurrency" />
                            </div>

                            <div className="col-md-8 col-sm-8 col-8 text-right">
                                <span>{this.state.amount == "" ? 0 : parseFloat(this.state.amount).toFixed(8)}  {this.state.selectedCurrency}</span>
                            </div>
                        </Row>

                        <Row className="m-10">
                            <div className="col-md-4 col-sm-4 col-4">
                                <IntlMessages id="sidebar.fees" />
                            </div>

                            <div className="col-md-8 col-sm-8 col-8 text-right">
                                <span>0</span>
                            </div>
                        </Row>

                        <Row className="m-10 font-weight-bold">
                            <Col md={6}>
                                <IntlMessages id={`sidebar.sitetoken.nettotal`} values={{ Param1: this.state.selectedSiteToken }} />
                            </Col>

                            <Col md={6} className="text-right">
                                <span>{this.state.token} {this.state.selectedSiteToken}</span>
                            </Col>

                        </Row>

                        <Row className="m-10">
                            <div className="col-md-4 col-sm-4"></div>
                            <div className="col-md-4 col-sm-4 col-6">
                                <Button className="btn btn-danger"
                                    onClick={this.clearAllData}
                                >

                                    <IntlMessages id="button.cancel" /></Button>
                            </div>

                            <div className="col-md-4 col-sm-4 col-6">
                                <Button color="primary"
                                    className="text-white perverbtn"
                                    onClick={this.ConvertToken}
                                >
                                    <IntlMessages id={`sidebar.sitetoken.btn.add`}

                                        values={{ Param1: this.state.selectedCurrency, Param2: this.state.selectedSiteToken }} />
                                </Button>
                            </div>
                        </Row>

                    </Form>

                </JbsCollapsibleCard>
            </div>
        )
    }
}

// set states from props
const mapStateToProps = state => ({
    wallet: state.currency.wallets,
    currencyData: state.currency.currencyData,
    loader: state.currency.loading,
    CurrencyLoader: state.currency.currencyLoader,
    siteTokens: state.siteTokenConversion.siteToken,
    loading: state.siteTokenConversion.loading,
    calcError: state.siteTokenConversion.calulcationError,
    calcLoader: state.siteTokenConversion.loadingCalc,
    siteTokenCalculation: state.siteTokenConversion.siteTokenCalculation,
    loadingConversion: state.siteTokenConversion.loadingConversion,
    siteTokenConversion: state.siteTokenConversion.siteTokenConversion,
    conversionError: state.siteTokenConversion.conversionError,
    walletList: state.WalletManagementReducer.walletList,
});

// connect stores  and props to component
export default connect(mapStateToProps, {
    getCurrencyList,
    getSiteToken,
    getCurrencyData,
    getSiteTokenCalculation,
    doSiteTokenConversion,
    getMaringWalletList //added by parth andhariya 16-04-2019  getBaseMarketCurrency
})(SiteTokenConversion);
