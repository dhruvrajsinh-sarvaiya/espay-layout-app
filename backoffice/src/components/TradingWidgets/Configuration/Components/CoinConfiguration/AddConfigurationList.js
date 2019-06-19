// create component for add Coin Configuration data By Tejas Date : 7/1/2019

import React, { Component } from "react";
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';
// used for connect component with store
import { connect } from "react-redux";

// intl messages
import IntlMessages from "Util/IntlMessages";

// import reactstrap components
import { Form, FormGroup, Label, Input, Col, Row, Button } from "reactstrap";

// import buttton
import MatButton from "@material-ui/core/Button";

// import check box and labels
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

// used for display message success-failure
import { NotificationManager } from "react-notifications";

// import for validate numeric value
import { validateOnlyNumeric } from "Validations/pairConfiguration";
//used for display loader 
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

//import actions for get list and add coin details
import {
    getCoinConfigurationList,
    addCoinConfigurationList,
    //added by parth andhariya
    AddCurrencyLogo
} from 'Actions/CoinConfiguration'

// import button and apply style
import CloseButton from '@material-ui/core/Button';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}

// class for add coin configuration
class AddCoin extends Component {
    // constructor for handle state and data
    constructor(props) {
        super(props)
        this.state = {
            addNewData: false,
            CoinName: '',
            SmsCode: '',
            TotSupply: '',
            MaxSupply: '',
            CirculatingSupply: '',
            IssuePrice: '',
            WebSiteUrl: '',
            Intro: '',
            IssueDate: new Date().toISOString().slice(0, 10),
            currentDate: new Date().toISOString().slice(0, 10),
            status: '',
            IsBaseCurrency: false,
            IsDeposit: false,
            IsWithdraw: false,
            IsTransaction: false,
            inputs: [0],
            Explorer: [''],
            Community: [''],
            addCoinConfiguration: [],
            //added by parth andhariya
            ConfigurationShowCard: props.ConfigurationShowCard,
            file: [],
            imgPreview: "",
            fieldList: {},
            notificationFlag: true,
            menudetail: [],

        }
        this.initState = this.state;
    }
    //added by parth andhariya 
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.ConfigurationShowCard === 1 ? '3C655E15-6A4C-7B41-50C4-4D03E2AB5A85' : '3EA5320A-531C-07B9-1C3D-E4FCDD59131E'); // get Trading menu permission
        // code added by Parth Andhariya for handle and check menu detail and store (17-4-2019)
        // var fieldList = {};
        // if (this.props.menuDetail.Fields && this.props.menuDetail.Fields.length) {
        //     this.props.menuDetail.Fields.forEach(function (item) {
        //         fieldList[item.GUID] = item;
        //     });
        //     this.setState({ fieldList: fieldList })
        // }
        // code end
    }
    // used to setup data for explorer dynamic data
    handleTextExplorer = i => e => {
        let Explorer = [...this.state.Explorer]
        Explorer[i] = e.target.value
        this.setState({
            Explorer
        })
    }

    // used to Delete dynamic  Explorer Component data 
    handleDeleteExplorer = i => e => {
        e.preventDefault()
        let Explorer = [
            ...this.state.Explorer.slice(0, i),
            ...this.state.Explorer.slice(i + 1)
        ]
        this.setState({
            Explorer
        })
    }

    // used to add dynamic Explorer Component data 
    addExplorer = e => {
        e.preventDefault()
        let Explorer = this.state.Explorer.concat([''])
        this.setState({
            Explorer
        })
    }

    // set state after data is only numeric
    checkNumericFields = event => {
        if (validateOnlyNumeric(event.target.value)) {
            this.setState({
                [event.target.name]: event.target.value
            });
        } else if (event.target.value == "") {
            this.setState({
                [event.target.name]: event.target.value
            });
        }
    };

    // used to setup data for Community dynamic data
    handleTextCommunity = i => e => {
        let Community = [...this.state.Community]
        Community[i] = e.target.value
        this.setState({
            Community
        })
    }

    // used to Delete dynamic  Community Component data 
    handleDeleteCommunity = i => e => {
        e.preventDefault()
        let Community = [
            ...this.state.Community.slice(0, i),
            ...this.state.Community.slice(i + 1)
        ]
        this.setState({
            Community
        })
    }

    // used to add dynamic Community Component data 
    addCommunity = e => {
        e.preventDefault()
        let Community = this.state.Community.concat([''])
        this.setState({
            Community
        })
    }

    // used for close drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    // used for close drawer
    handleClose = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            addNewData: false,
        });
    };

    // Handle Checkbox for display Transaction Data
    handleChangeTransaction = event => {
        this.setState({ IsTransaction: !this.state.IsTransaction });
    };

    // Handle Checkbox for display Deposit Data
    handleChangeDeposit = event => {
        this.setState({ IsDeposit: !this.state.IsDeposit });
    };

    // Handle Checkbox for display Withdraw Data
    handleChangeWithdraw = event => {
        this.setState({ IsWithdraw: !this.state.IsWithdraw });
    };

    // Handle Checkbox for display BaseCurrency Data
    handleChangeBaseCurrency = event => {
        this.setState({ IsBaseCurrency: !this.state.IsBaseCurrency });
    };

    // used for set props data to state
    componentWillReceiveProps(nextprops) {
        if (nextprops.addCoinConfiguration && nextprops.addError.length == 0 && this.state.addNewData) {
            //added by parth andhariya
            this.props.AddCurrencyLogo({
                CurrencyName: this.state.SmsCode,
                Image: this.state.file
            })
            //NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addCoinConfiguration.ErrorCode}`} />);
            NotificationManager.success(<IntlMessages id="coinconfig.add.currency.success" />);
            this.setState({
                addNewData: false,
                open: false
            })
            this.props.drawerClose();

            //code change by  jayshreeba gohil (14-6-2019) for handle arbitrage configuration detail
            var reqObject = {};
            if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                reqObject.IsArbitrage = this.props.IsArbitrage;
            }
            this.props.getCoinConfigurationList(reqObject);
            //end

            //added by parth andhariya
            if (this.state.ConfigurationShowCard === 1) {
                this.props.getCoinConfigurationList({ IsMargin: 1 });
            } else {

                this.props.getCoinConfigurationList({});
            }
        } else if (nextprops.addError.length !== 0 && nextprops.addError.ReturnCode !== 0 && this.state.addNewData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addError.ErrorCode}`} />);
            this.setState({
                addNewData: false
            })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    // used for call Api after validate data and set request for add coin
    addCoinConfigurationData = () => {
        const {
            CoinName,
            SmsCode,
            TotSupply,
            MaxSupply,
            CirculatingSupply,
            status,
            IssuePrice,
            WebSiteUrl,
            Intro,
            IssueDate,
            IsBaseCurrency,
            IsDeposit,
            IsWithdraw,
            IsTransaction,
            currentDate,
            //added by parth andhariya
            file
        } = this.state;

        // set explorer data 
        var explorer = [];
        if (this.state.Explorer.length !== 0) {
            this.state.Explorer.map((value, index) => {
                if (value !== '' && !this.validateUrl(value)) {
                    NotificationManager.error(<IntlMessages id="coincofiguration.add.validexplorer" />);
                } else {
                    explorer.push({ Data: value })
                }
            })
        }

        // set Community data 
        var community = [];
        if (this.state.Community.length !== 0) {
            this.state.Community.map((value, index) => {
                if (value !== '' && !this.validateUrl(value)) {
                    NotificationManager.error(<IntlMessages id="coincofiguration.add.validcommunity" />);
                } else {
                    community.push({ Data: value })
                }
            })
        }

        // create request for add coin
        var data = {
            Name: CoinName ? CoinName : '',
            SMSCode: SmsCode ? SmsCode : '',
            TotalSupply: TotSupply ? parseInt(TotSupply) : 0,
            MaxSupply: MaxSupply ? parseInt(MaxSupply) : 0,
            IssueDate: IssueDate ? IssueDate : '',
            CirculatingSupply: CirculatingSupply ? parseInt(CirculatingSupply) : 0,
            IssuePrice: IssuePrice ? parseFloat(IssuePrice) : '',
            WebsiteUrl: WebSiteUrl ? WebSiteUrl : '',
            Introduction: Intro ? Intro : '',
            IsTransaction: IsTransaction ? parseInt(1) : parseInt(0),
            IsWithdraw: IsWithdraw ? parseInt(1) : parseInt(0),
            IsDeposit: IsDeposit ? parseInt(1) : parseInt(0),
            IsBaseCurrency: IsBaseCurrency ? parseInt(1) : parseInt(0),
            Status: status ? parseInt(status) : parseInt(0),
            Explorer: explorer.length != 0 ? explorer : [],
            Community: community.length != 0 ? community : [],
            // IsMargin: 0
        };

        if (CoinName === "" || CoinName == null) {
            NotificationManager.error(<IntlMessages id="coincofiguration.add.enter.coinname" />);
        }
        else if (isScriptTag(CoinName)) {
            NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
        }
        else if (isHtmlTag(CoinName)) {
            NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
        } else if (SmsCode === "" || SmsCode == null) {
            NotificationManager.error(<IntlMessages id="coincofiguration.add.enter.smscode" />);
        }
        else if (isScriptTag(SmsCode)) {
            NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
        }
        else if (isHtmlTag(SmsCode)) {
            NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
        } else if (IssueDate === "" || IssueDate == null) {
            NotificationManager.error(<IntlMessages id="coincofiguration.add.enter.date" />);
        } else if (WebSiteUrl === "" || WebSiteUrl == null) {
            NotificationManager.error(<IntlMessages id="coincofiguration.add.enter.website" />);
        }
        else if (isScriptTag(WebSiteUrl)) {
            NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
        }
        else if (isHtmlTag(WebSiteUrl)) {
            NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
        } else if (Intro === "" || Intro == null) {
            NotificationManager.error(<IntlMessages id="coincofiguration.add.enter.intro" />);
        }
        else if (isScriptTag(Intro)) {
            NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
        }
        else if (isHtmlTag(Intro)) {
            NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
        } else if (IssueDate < currentDate) {
            NotificationManager.error(<IntlMessages id="coincofiguration.add.issuevalid" />);
        } else if (file.length === 0 || file === []) {
            NotificationManager.error(<IntlMessages id="coincofiguration.add.CurrencyLogo" />);
        }
        else {
            if (WebSiteUrl !== '' && !this.validateUrl(WebSiteUrl)) {
                NotificationManager.error(<IntlMessages id="my_account.err.validUrl" />);
            } else {
                this.setState({
                    addNewData: true
                })
                //code change by jayshreeba gohil (14-6-2019) for handle arbitrage configuration detail
                var reqObject = data;
                if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                    reqObject.IsArbitrage = this.props.IsArbitrage;
                }
                this.props.addCoinConfigurationList(reqObject);
                //end


                if (this.state.ConfigurationShowCard === 1) {
                    data.IsMargin = 1;
                    this.props.addCoinConfigurationList(data);
                } else {
                    this.props.addCoinConfigurationList(data);
                }
            }
        }
    };

    // set state for all data on change of components
    handleChangeData = event => {
        var regex = "/<(.|\n)*?>/";
        if (event.target.value === '') {
            this.setState({
                [event.target.name]: event.target.value,
            })
        } else if (!regex.match(event.target.value)) {
            this.setState({
                [event.target.name]: event.target.value,
            })
        }

    }

    // used to set state for status
    handleChangeStatus = event => {
        this.setState({
            status: event.target.value
        })
    }

    // used for validate Url 
    validateUrl = (url) => {
        var urlReg = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})"
        if (url.match(urlReg)) {
            return true
        } else {
            return false
        }
    }

    // added By Jinesh Bhatt for cancel button event
    resetData = () => {
        this.props.drawerClose();
        this.setState({
            addNewData: false,
            CoinName: '',
            SmsCode: '',
            TotSupply: '',
            MaxSupply: '',
            CirculatingSupply: '',
            IssuePrice: '',
            WebSiteUrl: '',
            Intro: '',
            IssueDate: new Date().toISOString().slice(0, 10),
            currentDate: new Date().toISOString().slice(0, 10),
            status: '',
            IsBaseCurrency: false,
            IsDeposit: false,
            IsWithdraw: false,
            IsTransaction: false,
            inputs: [0],
            Explorer: [''],
            Community: [''],
            addCoinConfiguration: [],
            //added by parth andhariya
            file: [],
            imgPreview: "",
        });
    }
    //added by parth andhariya
    //for handle file slection 
    onChangeFile(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        var url = reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            this.setState({
                imgPreview: [reader.result],
                file: file
            })
        }.bind(this);
    }
    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        var response = {};
        var index;
        const { menudetail } = this.state;
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase()) {
                    if (menudetail[index].Fields && menudetail[index].Fields.length) {
                        var fieldList = {};
                        menudetail[index].Fields.forEach(function (item) {
                            fieldList[item.GUID.toUpperCase()] = item;
                        });
                        return response = fieldList;
                    }
                }
            }
        } else {
            return response;
        }
    }
    //render the component
    render() {
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail(this.props.ConfigurationShowCard === 1 ? '9280741E-5B98-8B7B-0746-5494BB473D86' : '0919F104-5205-15F5-1F35-9F756ED424D2');//0919F104-5205-15F5-1F35-9F756ED424D2  && margin_GUID 9280741E-5B98-8B7B-0746-5494BB473D86
        // returns the component
        return (
            <div className="m-10 p-5">
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="wallet.btnAddCoin" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={() => this.resetData()}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>
                <Row>
                    <Col md={12}>
                        <Form className="tradefrm">
                            <FormGroup row>
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["A6CDCF8F-3781-8DD2-4E78-CCB9BBEE010E"] : menuDetail["8BB5A385-262F-00E4-9A09-CD7004E60A81"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["A6CDCF8F-3781-8DD2-4E78-CCB9BBEE010E"].Visibility === "E925F86B" : menuDetail["8BB5A385-262F-00E4-9A09-CD7004E60A81"].Visibility === "E925F86B")) && //8BB5A385-262F-00E4-9A09-CD7004E60A81  && margin_GUID A6CDCF8F-3781-8DD2-4E78-CCB9BBEE010E
                                    <Col md={4} sm={6} xs={12}>
                                        <Row>
                                            <Label md={4} sm={4} xs={12} for="CoinName" className="d-inline">
                                                <IntlMessages id="table.Coin" />  <span className="text-danger">*</span>
                                            </Label>
                                            <Col md={8} sm={8} xs={12}>
                                                <IntlMessages id="table.Coin">
                                                    {(placeholder) =>
                                                        <Input type="text"
                                                            name="CoinName"
                                                            value={this.state.CoinName}
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["A6CDCF8F-3781-8DD2-4E78-CCB9BBEE010E"].AccessRight === "11E6E7B0" : menuDetail["8BB5A385-262F-00E4-9A09-CD7004E60A81"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.handleChangeData}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["E6A914DA-4244-2142-0441-A646224958F3"] : menuDetail["9B069CD0-8AAF-4834-381A-EF9A88B7870D"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["E6A914DA-4244-2142-0441-A646224958F3"].Visibility === "E925F86B" : menuDetail["9B069CD0-8AAF-4834-381A-EF9A88B7870D"].Visibility === "E925F86B")) &&//9B069CD0-8AAF-4834-381A-EF9A88B7870D  && margin_GUID E6A914DA-4244-2142-0441-A646224958F3
                                    <Col md={4} sm={6} xs={12}>
                                        <Row>
                                            <Label md={4} sm={4} xs={12} for="smsCode" className="d-inline">
                                                <IntlMessages id="coincofiguration.smscode" /> <span className="text-danger">*</span>
                                            </Label>
                                            <Col md={8} sm={8} xs={12}>
                                                <IntlMessages id="coincofiguration.smscode">
                                                    {(placeholder) =>
                                                        <Input type="text"
                                                            name="SmsCode"
                                                            value={this.state.SmsCode}
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["E6A914DA-4244-2142-0441-A646224958F3"].AccessRight === "11E6E7B0" : menuDetail["9B069CD0-8AAF-4834-381A-EF9A88B7870D"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.handleChangeData}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["5EE6B8A7-6373-A463-0734-A874ECFC0A6D"] : menuDetail["BE0EDA3B-1CA5-3536-532C-8DFD858527B8"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["5EE6B8A7-6373-A463-0734-A874ECFC0A6D"].Visibility === "E925F86B" : menuDetail["BE0EDA3B-1CA5-3536-532C-8DFD858527B8"].Visibility === "E925F86B")) &&//BE0EDA3B-1CA5-3536-532C-8DFD858527B8  && margin_GUID 5EE6B8A7-6373-A463-0734-A874ECFC0A6D
                                    <Col md={4} sm={6} xs={12}>
                                        <Row>
                                            <Label md={4} sm={4} xs={12} for="TotSupply">
                                                <IntlMessages id="coincofiguration.totsupply" />
                                            </Label>
                                            <Col md={8} sm={8} xs={12}>
                                                <IntlMessages id="coincofiguration.totsupply">
                                                    {(placeholder) =>
                                                        <Input type="text"
                                                            name="TotSupply"
                                                            value={this.state.TotSupply}
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["5EE6B8A7-6373-A463-0734-A874ECFC0A6D"].AccessRight === "11E6E7B0" : menuDetail["BE0EDA3B-1CA5-3536-532C-8DFD858527B8"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.checkNumericFields}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["7EF0C86B-4C0C-1954-149D-D382B44691CD"] : menuDetail["1C811A5C-3F80-9BF2-3035-FE04DFFB3DC6"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["7EF0C86B-4C0C-1954-149D-D382B44691CD"].Visibility === "E925F86B" : menuDetail["1C811A5C-3F80-9BF2-3035-FE04DFFB3DC6"].Visibility === "E925F86B")) &&//1C811A5C-3F80-9BF2-3035-FE04DFFB3DC6  && margin_GUID 7EF0C86B-4C0C-1954-149D-D382B44691CD
                                    <Col md={4} sm={6} xs={12}>
                                        <Row>
                                            <Label md={4} sm={4} xs={12} for="MaxSupply">
                                                <IntlMessages id="coincofiguration.maxsupply" />
                                            </Label>
                                            <Col md={8} sm={8} xs={12}>
                                                <IntlMessages id="coincofiguration.maxsupply">
                                                    {(placeholder) =>
                                                        <Input type="text"
                                                            name="MaxSupply"
                                                            value={this.state.MaxSupply}
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["7EF0C86B-4C0C-1954-149D-D382B44691CD"].AccessRight === "11E6E7B0" : menuDetail["1C811A5C-3F80-9BF2-3035-FE04DFFB3DC6"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.checkNumericFields}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["ACC07C18-9E33-9A6B-5AB6-839A452C48C5"] : menuDetail["FA24C2FE-7141-69B2-4214-E7464D435F8B"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["ACC07C18-9E33-9A6B-5AB6-839A452C48C5"].Visibility === "E925F86B" : menuDetail["FA24C2FE-7141-69B2-4214-E7464D435F8B"].Visibility === "E925F86B")) &&//FA24C2FE-7141-69B2-4214-E7464D435F8B  && margin_GUID ACC07C18-9E33-9A6B-5AB6-839A452C48C5
                                    <Col md={4} sm={6} xs={12}>
                                        <Row>
                                            <Label md={4} sm={4} xs={12} for="IssuePrice">
                                                <IntlMessages id="coincofiguration.issueprice" />
                                            </Label>
                                            <Col md={8} sm={8} xs={12}>
                                                <IntlMessages id="coincofiguration.issueprice">
                                                    {(placeholder) =>
                                                        <Input type="text"
                                                            name="IssuePrice"
                                                            value={this.state.IssuePrice}
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["ACC07C18-9E33-9A6B-5AB6-839A452C48C5"].AccessRight === "11E6E7B0" : menuDetail["FA24C2FE-7141-69B2-4214-E7464D435F8B"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.checkNumericFields}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["2451AA93-4066-860C-585C-8136248C7AD4"] : menuDetail["3C1CF94A-85A1-5693-3402-E2E96FE94B64"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["2451AA93-4066-860C-585C-8136248C7AD4"].Visibility === "E925F86B" : menuDetail["3C1CF94A-85A1-5693-3402-E2E96FE94B64"].Visibility === "E925F86B")) &&//3C1CF94A-85A1-5693-3402-E2E96FE94B64  && margin_GUID 2451AA93-4066-860C-585C-8136248C7AD4
                                    <Col md={4} sm={6} xs={12}>
                                        <Row>
                                            <Label md={4} sm={4} xs={12} for="CirculatingSupply">
                                                <IntlMessages id="coincofiguration.circulatingsupply" />
                                            </Label>
                                            <Col md={8} sm={8} xs={12}>
                                                <IntlMessages id="coincofiguration.circulatingspply">
                                                    {(placeholder) =>
                                                        <Input type="text"
                                                            name="CirculatingSupply"
                                                            value={this.state.CirculatingSupply}
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["2451AA93-4066-860C-585C-8136248C7AD4"].AccessRight === "11E6E7B0" : menuDetail["3C1CF94A-85A1-5693-3402-E2E96FE94B64"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.checkNumericFields}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["402E3CD8-2104-7202-7ECA-783597618BD8"] : menuDetail["66B84E72-040F-7B45-834A-5BC127C0A35F"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["402E3CD8-2104-7202-7ECA-783597618BD8"].Visibility === "E925F86B" : menuDetail["66B84E72-040F-7B45-834A-5BC127C0A35F"].Visibility === "E925F86B")) &&//66B84E72-040F-7B45-834A-5BC127C0A35F  && margin_GUID 402E3CD8-2104-7202-7ECA-783597618BD8
                                    <Col md={4} sm={6} xs={12}>
                                        <Row>
                                            <Label md={4} sm={4} xs={12} for="WebSiteUrl" className="d-inline">
                                                <IntlMessages id="coincofiguration.wesiteurl" /><span className="text-danger">*</span>
                                            </Label>
                                            <Col md={8} sm={8} xs={12}>
                                                <IntlMessages id="coincofiguration.wesiteurl">
                                                    {(placeholder) =>
                                                        <Input type="text"
                                                            name="WebSiteUrl"
                                                            value={this.state.WebSiteUrl}
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["402E3CD8-2104-7202-7ECA-783597618BD8"].AccessRight === "11E6E7B0" : menuDetail["66B84E72-040F-7B45-834A-5BC127C0A35F"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.handleChangeData}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["0D8703DD-3654-8CE1-97AF-A69FE8A80547"] : menuDetail["8F23EC11-9034-2CCD-A6C5-0AC2144168C1"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["0D8703DD-3654-8CE1-97AF-A69FE8A80547"].Visibility === "E925F86B" : menuDetail["8F23EC11-9034-2CCD-A6C5-0AC2144168C1"].Visibility === "E925F86B")) &&//8F23EC11-9034-2CCD-A6C5-0AC2144168C1  && margin_GUID 0D8703DD-3654-8CE1-97AF-A69FE8A80547
                                    <Col md={4} sm={6} xs={12}>
                                        <Row>
                                            <Label md={4} sm={4} xs={12} for="Intro" className="d-inline">
                                                <IntlMessages id="coincofiguration.intro" />  <span className="text-danger">*</span>
                                            </Label>
                                            <Col md={8} sm={8} xs={12}>
                                                <IntlMessages id="coincofiguration.intro">
                                                    {(placeholder) =>
                                                        <Input type="text"
                                                            name="Intro"
                                                            value={this.state.Intro}
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["0D8703DD-3654-8CE1-97AF-A69FE8A80547"].AccessRight === "11E6E7B0" : menuDetail["8F23EC11-9034-2CCD-A6C5-0AC2144168C1"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.handleChangeData}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["E5FF43F0-1125-5FC7-97C2-F8B03E014BA9"] : menuDetail["389F683F-63E8-65B3-2CE6-465870D436C0"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["E5FF43F0-1125-5FC7-97C2-F8B03E014BA9"].Visibility === "E925F86B" : menuDetail["389F683F-63E8-65B3-2CE6-465870D436C0"].Visibility === "E925F86B")) &&//389F683F-63E8-65B3-2CE6-465870D436C0  && margin_GUID E5FF43F0-1125-5FC7-97C2-F8B03E014BA9
                                    <Col md={4} sm={6} xs={12}>
                                        <Row>
                                            <Label md={4} sm={4} xs={12} for="status" className="d-inline">
                                                <IntlMessages id="manageMarkets.list.form.label.status" />  <span className="text-danger">*</span>
                                            </Label>
                                            <Col md={8} sm={8} xs={12}>
                                                <Input
                                                    type="select"
                                                    name="status"
                                                    value={this.state.status}
                                                    disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["E5FF43F0-1125-5FC7-97C2-F8B03E014BA9"].AccessRight === "11E6E7B0" : menuDetail["389F683F-63E8-65B3-2CE6-465870D436C0"].AccessRight === "11E6E7B0") ? true : false}
                                                    onChange={(e) => this.handleChangeStatus(e)}
                                                >
                                                    <IntlMessages id="trading.pairconfig.placeholder.selectstatus">
                                                        {(select) =>
                                                            <option value="">{select}</option>
                                                        }
                                                    </IntlMessages>
                                                    <IntlMessages id="manageMarkets.list.column.label.status.active">
                                                        {(select) =>
                                                            <option value="1">{select}</option>
                                                        }
                                                    </IntlMessages>
                                                    <IntlMessages id="manageMarkets.list.column.label.status.inactive">
                                                        {(select) =>
                                                            <option value="0">{select}</option>
                                                        }
                                                    </IntlMessages>
                                                </Input>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["2FF07C36-66DD-A2D9-9B14-50004B771862"] : menuDetail["611829D2-0A31-4B5A-408C-418543291C50"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["2FF07C36-66DD-A2D9-9B14-50004B771862"].Visibility === "E925F86B" : menuDetail["611829D2-0A31-4B5A-408C-418543291C50"].Visibility === "E925F86B")) &&//611829D2-0A31-4B5A-408C-418543291C50  && margin_GUID 2FF07C36-66DD-A2D9-9B14-50004B771862
                                    <Col md={4} sm={6} xs={12}>
                                        <Row>
                                            <Label md={4} sm={4} xs={12} for="issueDate" className="d-inline">
                                                {<IntlMessages id="coincofiguration.issuedate" />}  <span className="text-danger">*</span>
                                            </Label>
                                            <Col md={8} sm={8} xs={12}>
                                                <Input type="date" name="IssueDate" value={this.state.IssueDate} disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["2FF07C36-66DD-A2D9-9B14-50004B771862"].AccessRight === "11E6E7B0" : menuDetail["611829D2-0A31-4B5A-408C-418543291C50"].AccessRight === "11E6E7B0") ? true : false} max={this.state.IssueDate} id="issueDate" placeholder="dd/mm/yyyy" onChange={this.handleChangeData} />
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                            </FormGroup>
                            <FormGroup row>
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["1AFAFE20-0D14-23F8-635C-AC4DBF1A592C"] : menuDetail["D9DA5710-8F27-49F1-3CBE-C26ACEF045F2"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["1AFAFE20-0D14-23F8-635C-AC4DBF1A592C"].Visibility === "E925F86B" : menuDetail["D9DA5710-8F27-49F1-3CBE-C26ACEF045F2"].Visibility === "E925F86B")) &&//D9DA5710-8F27-49F1-3CBE-C26ACEF045F2  && margin_GUID 1AFAFE20-0D14-23F8-635C-AC4DBF1A592C
                                    <Col md={3} sm={6} xs={12}>
                                        <FormControlLabel className="coincheckbox"
                                            control={
                                                <Checkbox
                                                    checked={this.state.IsTransaction}
                                                    onChange={this.handleChangeTransaction}
                                                    disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["1AFAFE20-0D14-23F8-635C-AC4DBF1A592C"].AccessRight === "11E6E7B0" : menuDetail["D9DA5710-8F27-49F1-3CBE-C26ACEF045F2"].AccessRight === "11E6E7B0") ? true : false}
                                                    icon={<CheckBoxOutlineBlankIcon />}
                                                    checkedIcon={<CheckBoxIcon />}
                                                />
                                            }
                                            label={<IntlMessages id="coincofiguration.add.transaction" />}
                                        />
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["E5174176-4233-7803-5E64-B3359E9D5062"] : menuDetail["5C6FA0C5-70E9-2697-2AFC-FCEF27990D2A"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["E5174176-4233-7803-5E64-B3359E9D5062"].Visibility === "E925F86B" : menuDetail["5C6FA0C5-70E9-2697-2AFC-FCEF27990D2A"].Visibility === "E925F86B")) &&//5C6FA0C5-70E9-2697-2AFC-FCEF27990D2A  && margin_GUID E5174176-4233-7803-5E64-B3359E9D5062
                                    <Col md={3} sm={6} xs={12}>
                                        <FormControlLabel className="coincheckbox"
                                            control={
                                                <Checkbox
                                                    checked={this.state.IsDeposit}
                                                    onChange={this.handleChangeDeposit}
                                                    disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["E5174176-4233-7803-5E64-B3359E9D5062"].AccessRight === "11E6E7B0" : menuDetail["5C6FA0C5-70E9-2697-2AFC-FCEF27990D2A"].AccessRight === "11E6E7B0") ? true : false}
                                                    icon={<CheckBoxOutlineBlankIcon />}
                                                    checkedIcon={<CheckBoxIcon />}
                                                />
                                            }
                                            label={<IntlMessages id="coincofiguration.add.deposit" />}
                                        />
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["549650A4-4501-0CB9-826D-8315BD833CA1"] : menuDetail["25601E34-6F65-6ACB-5E89-8B577D4526FB"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["549650A4-4501-0CB9-826D-8315BD833CA1"].Visibility === "E925F86B" : menuDetail["25601E34-6F65-6ACB-5E89-8B577D4526FB"].Visibility === "E925F86B")) &&//25601E34-6F65-6ACB-5E89-8B577D4526FB  && margin_GUID 549650A4-4501-0CB9-826D-8315BD833CA1
                                    <Col md={3} sm={6} xs={12}>
                                        <FormControlLabel className="coincheckbox"
                                            control={
                                                <Checkbox
                                                    checked={this.state.IsWithdraw}
                                                    onChange={this.handleChangeWithdraw}
                                                    disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["549650A4-4501-0CB9-826D-8315BD833CA1"].AccessRight === "11E6E7B0" : menuDetail["25601E34-6F65-6ACB-5E89-8B577D4526FB"].AccessRight === "11E6E7B0") ? true : false}
                                                    icon={<CheckBoxOutlineBlankIcon />}
                                                    checkedIcon={<CheckBoxIcon />}
                                                />
                                            }
                                            label={<IntlMessages id="coincofiguration.add.withdraw" />}
                                        />
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["B39D0072-8FA7-0BA4-2F35-4152320D8530"] : menuDetail["5E89CF45-0398-0F59-405D-8D60688662B9"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["B39D0072-8FA7-0BA4-2F35-4152320D8530"].Visibility === "E925F86B" : menuDetail["5E89CF45-0398-0F59-405D-8D60688662B9"].Visibility === "E925F86B")) &&//5E89CF45-0398-0F59-405D-8D60688662B9  && margin_GUID B39D0072-8FA7-0BA4-2F35-4152320D8530
                                    <Col md={3} sm={6} xs={12}>
                                        <FormControlLabel className="coincheckbox"
                                            control={
                                                <Checkbox
                                                    checked={this.state.IsBaseCurrency}
                                                    onChange={this.handleChangeBaseCurrency}
                                                    disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["B39D0072-8FA7-0BA4-2F35-4152320D8530"].AccessRight === "11E6E7B0" : menuDetail["5E89CF45-0398-0F59-405D-8D60688662B9"].AccessRight === "11E6E7B0") ? true : false}
                                                    icon={<CheckBoxOutlineBlankIcon />}
                                                    checkedIcon={<CheckBoxIcon />}
                                                />
                                            }
                                            label={<IntlMessages id="coincofiguration.add.basecurrency" />}
                                        />
                                    </Col>
                                }
                            </FormGroup>
                            <FormGroup row>
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["325DDD02-6E58-938C-0CAA-B0C7C8472072"] : menuDetail["D1234E24-53C0-0B61-7644-4EB1D96A3497"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["325DDD02-6E58-938C-0CAA-B0C7C8472072"].Visibility === "E925F86B" : menuDetail["D1234E24-53C0-0B61-7644-4EB1D96A3497"].Visibility === "E925F86B")) &&//D1234E24-53C0-0B61-7644-4EB1D96A3497  && margin_GUID 325DDD02-6E58-938C-0CAA-B0C7C8472072
                                    <Col md={6} sm={6} xs={12}>
                                        <Row >
                                            <Label md={4} sm={4} xs={12} for="explorer">
                                                <IntlMessages id="coincofiguration.add.explorer" />
                                            </Label>
                                            {this.state.Explorer.map((explor, index) => (
                                                <Col md={8} sm={8} xs={12} className={index !== 0 ? "offset-md-4 mt-5" : 'mt-5'} style={{ display: "inline-flex" }} key={index}>
                                                    <IntlMessages id="coincofiguration.add.explorer">
                                                        {(placeholder) =>
                                                            <Input type="text"
                                                                name="explorer"
                                                                value={explor}
                                                                disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["325DDD02-6E58-938C-0CAA-B0C7C8472072"].AccessRight === "11E6E7B0" : menuDetail["D1234E24-53C0-0B61-7644-4EB1D96A3497"].AccessRight === "11E6E7B0") ? true : false}
                                                                onChange={this.handleTextExplorer(index)}
                                                                placeholder={placeholder} ></Input>
                                                        }
                                                    </IntlMessages>
                                                    {index === 0 ?
                                                        <button className="mt-10" onClick={this.addExplorer}><i className="fa fa-plus-square"></i></button>
                                                        : <button className="mt-10" onClick={this.handleDeleteExplorer(index)}><i className="fa fa-remove"></i></button>
                                                    }
                                                </Col>
                                            ))}
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["B17387FA-6C99-755B-4D6A-48EA9D0967C6"] : menuDetail["A7132F4D-872F-1D97-2FDB-67C5448B0552"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["B17387FA-6C99-755B-4D6A-48EA9D0967C6"].Visibility === "E925F86B" : menuDetail["A7132F4D-872F-1D97-2FDB-67C5448B0552"].Visibility === "E925F86B")) &&//A7132F4D-872F-1D97-2FDB-67C5448B0552  && margin_GUID B17387FA-6C99-755B-4D6A-48EA9D0967C6
                                    <Col md={6} sm={6} xs={12}>
                                        <Row >
                                            <Label md={4} sm={4} xs={12} for="Community">
                                                <IntlMessages id="coincofiguration.add.Community" />
                                            </Label>
                                            {this.state.Community.map((community, index) => (
                                                <Col md={8} sm={8} xs={12} className={index != 0 ? "offset-md-4 mt-5" : 'mt-5'} style={{ display: "inline-flex" }} key={index}>
                                                    <IntlMessages id="coincofiguration.add.Community">
                                                        {(placeholder) =>
                                                            <Input type="text"
                                                                name="Community"
                                                                value={community}
                                                                disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["B17387FA-6C99-755B-4D6A-48EA9D0967C6"].AccessRight === "11E6E7B0" : menuDetail["A7132F4D-872F-1D97-2FDB-67C5448B0552"].AccessRight === "11E6E7B0") ? true : false}
                                                                onChange={this.handleTextCommunity(index)}
                                                                placeholder={placeholder} ></Input>
                                                        }
                                                    </IntlMessages>
                                                    {index === 0 ?
                                                        <button className="mt-10" onClick={this.addCommunity}><i className="fa fa-plus-square"></i></button>
                                                        : <button className="mt-10" onClick={this.handleDeleteCommunity(index)}><i className="fa fa-remove"></i></button>
                                                    }
                                                </Col>
                                            ))}
                                        </Row>
                                    </Col>
                                }
                                {/* added by parth andhariya */}
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["961C8F8E-04B7-74DC-1E1F-F61F24160E86"] : menuDetail["C5981B8E-A32F-85CB-A3C7-CC18F9B461C3"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["961C8F8E-04B7-74DC-1E1F-F61F24160E86"].Visibility === "E925F86B" : menuDetail["C5981B8E-A32F-85CB-A3C7-CC18F9B461C3"].Visibility === "E925F86B")) &&//C5981B8E-A32F-85CB-A3C7-CC18F9B461C3  && margin_GUID 961C8F8E-04B7-74DC-1E1F-F61F24160E86
                                    <Col md={12} sm={12} xs={12}>
                                        <Row>
                                            <Label className="d-inline col-md-2 col-sm-2 col-xs-12 col-form-label">
                                                <IntlMessages id="coincofiguration.CurrencyLogo" /><span className="text-danger">*</span>
                                            </Label>
                                            <Col md={10} sm={10} xs={12} className="mt-10">
                                                <Input
                                                    type="file"
                                                    name="file"
                                                    disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["961C8F8E-04B7-74DC-1E1F-F61F24160E86"].AccessRight === "11E6E7B0" : menuDetail["C5981B8E-A32F-85CB-A3C7-CC18F9B461C3"].AccessRight === "11E6E7B0") ? true : false}
                                                    id="File"
                                                    accept=".PNG"
                                                    onChange={e => this.onChangeFile(e)}
                                                />
                                                {/* Only show first image, for now. */}
                                                {this.state.imgPreview && <img alt=""
                                                    src={this.state.imgPreview}
                                                    height="35px"
                                                    width="35px"
                                                />}
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                            </FormGroup>
                            <hr />
                            {menuDetail &&
                                <FormGroup row>
                                    <div className="offset-md-5 col-md-7 offset-sm-5 col-sm-7 col-xs-12">
                                        <div className="btn_area">
                                            <Button variant="raised" color="primary" onClick={(e) => this.addCoinConfigurationData(e)} disabled={this.props.loading}><IntlMessages id="liquidityprovider.list.button.save" /></Button>
                                            <Button color="danger" className="ml-15" onClick={() => this.resetData()} disabled={this.props.loading}><IntlMessages id="sidebar.pairConfiguration.button.cancel" /></Button>
                                        </div>
                                    </div>
                                </FormGroup>
                            }
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}

// used for set state and props (get props from reducer)
const mapStateToProps = state => ({
    addCoinConfiguration: state.coinConfiguration.addcoinConfigurationList,
    loading: state.coinConfiguration.addLoading,
    addError: state.coinConfiguration.addError,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});
// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getCoinConfigurationList,
        addCoinConfigurationList,
        //added by parth andhariya
        AddCurrencyLogo,
        getMenuPermissionByID
    }
)(AddCoin);
