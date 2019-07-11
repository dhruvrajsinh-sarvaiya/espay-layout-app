// create component for Update Coin Configuration data By Tejas Date : 8/1/2019
import React, { Component } from "react";

// used for connect component with store
import { connect } from "react-redux";

// intl messages
import IntlMessages from "Util/IntlMessages";

// import reactstrap components
import { Form, FormGroup, Label, Input, Col, Row, Button } from "reactstrap";

// import buttton
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';
// import check box and labels
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
// import button and apply style
import CloseButton from '@material-ui/core/Button';

// used for display message success-failure
import { NotificationManager } from "react-notifications";

// import for validate numeric value
import { validateOnlyNumeric } from "Validations/pairConfiguration";

//used for display loader 
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

//import actions for get list and update coin details
import { getCoinConfigurationList, updateCoinConfigurationList, AddCurrencyLogo } from 'Actions/CoinConfiguration';

//added by parth andhariya

//import for display Currency logo
import AppConfig from 'Constants/AppConfig';

// Display message when hover on tab
import Tooltip from "@material-ui/core/Tooltip";
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

// class for Update coin configuration
class UpdateCoin extends Component {
    // constructor for handle state and data
    constructor(props) {
        super(props)
        this.state = {
            updateData: false,
            CoinName: this.props.selectedData.Name,
            SmsCode: this.props.selectedData.SMSCode,
            TotSupply: this.props.selectedData.TotalSupply,
            MaxSupply: this.props.selectedData.MaxSupply,
            CirculatingSupply: this.props.selectedData.CirculatingSupply,
            IssuePrice: this.props.selectedData.IssuePrice,
            WebSiteUrl: this.props.selectedData.WebsiteUrl,
            Intro: this.props.selectedData.Introduction,
            IssueDate: this.props.selectedData.IssueDate.replace('T', ' ').split(' ')[0],
            currentDate: new Date().toISOString().slice(0, 10),
            status: this.props.selectedData.Status,
            IsBaseCurrency: this.props.selectedData.IsBaseCurrency === 1 ? true : false,
            IsDeposit: this.props.selectedData.IsDeposit === 1 ? true : false,
            IsWithdraw: this.props.selectedData.IsWithdraw === 1 ? true : false,
            IsTransaction: this.props.selectedData.IsTransaction === 1 ? true : false,
            inputs: [0],
            Explorer: this.props.selectedData.Explorer.length !== 0 ? this.props.selectedData.Explorer.map((value, key) => { return value.Data }) : [''],
            Community: this.props.selectedData.Community.length !== 0 ? this.props.selectedData.Community.map((value, key) => { return value.Data }) : [''],
            isUpdate: false,
            ServiceId: this.props.selectedData.ServiceId,
            //added by parth andhariya
            ConfigurationShowCard: props.ConfigurationShowCard,
            file: [],
            CurrencyLogoFlag: false,
            imgPreview: "",
            fieldList: {},
            notificationFlag: true,
            menudetail: [],
        }
    }
    //added by parth andhariya 
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.ConfigurationShowCard === 1 ? '3C655E15-6A4C-7B41-50C4-4D03E2AB5A85' : '3EA5320A-531C-07B9-1C3D-E4FCDD59131E'); // get Trading menu permission
    }
    // used to setup data for explorer dynamic data
    handleTextExplorer = i => e => {
        let Explorer = [...this.state.Explorer]
        Explorer[i] = e.target.value
        this.setState({
            Explorer,
            isUpdate: true
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
            Explorer,
            isUpdate: true
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
                [event.target.name]: event.target.value,
                isUpdate: true
            });
        } else if (event.target.value === "") {
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
            Community,
            isUpdate: true
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
            Community,
            isUpdate: true
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
            isUpdate: false,
        });
    }

    // used for close drawer
    handleClose = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            updateData: false,
            isUpdate: false,
        });
    };


    // Handle Checkbox for display Transaction Data
    handleChangeTransaction = event => {
        this.setState({ IsTransaction: !this.state.IsTransaction, isUpdate: true });
    };

    // Handle Checkbox for display Deposit Data
    handleChangeDeposit = event => {
        this.setState({ IsDeposit: !this.state.IsDeposit, isUpdate: true });
    };

    // Handle Checkbox for display Withdraw Data
    handleChangeWithdraw = event => {
        this.setState({ IsWithdraw: !this.state.IsWithdraw, isUpdate: true });
    };

    // Handle Checkbox for display BaseCurrency Data
    handleChangeBaseCurrency = event => {
        this.setState({ IsBaseCurrency: !this.state.IsBaseCurrency, isUpdate: true });
    };

    // used for set props data to state
    componentWillReceiveProps(nextprops) {
        if (nextprops.selectedData) {
            this.setState({
                CoinName: nextprops.selectedData.Name,
                SmsCode: nextprops.selectedData.SMSCode,
                TotSupply: nextprops.selectedData.TotalSupply,
                MaxSupply: nextprops.selectedData.MaxSupply,
                CirculatingSupply: nextprops.selectedData.CirculatingSupply,
                IssuePrice: nextprops.selectedData.IssuePrice,
                WebSiteUrl: nextprops.selectedData.WebsiteUrl,
                Intro: nextprops.selectedData.Introduction,
                IssueDate: nextprops.selectedData.IssueDate.replace('T', ' ').split(' ')[0],
                status: nextprops.selectedData.Status,
                IsBaseCurrency: nextprops.selectedData.IsBaseCurrency === 1 ? true : false,
                IsDeposit: nextprops.selectedData.IsDeposit === 1 ? true : false,
                IsWithdraw: nextprops.selectedData.IsWithdraw === 1 ? true : false,
                IsTransaction: nextprops.selectedData.IsTransaction === 1 ? true : false,
                Explorer: nextprops.selectedData.Explorer.length !== 0 ? nextprops.selectedData.Explorer.map((value, key) => { return value.Data }) : [''],
                Community: nextprops.selectedData.Community.length !== 0 ? nextprops.selectedData.Community.map((value, key) => { return value.Data }) : [''],
                ServiceId: nextprops.selectedData.ServiceId,
            })
        }
        if (nextprops.updateCoinConfiguration && nextprops.updateError.length == 0 && this.state.updateData) {
            NotificationManager.success(<IntlMessages id="coinconfig.update.currency.success" />);
            this.setState({
                updateData: false,
                open: false,
                isUpdate: false,
            })
            this.props.drawerClose();

            //added by parth andhariya
            if (this.state.ConfigurationShowCard === 1) {
                nextprops.getCoinConfigurationList({ IsMargin: 1 });
            } else {
                nextprops.getCoinConfigurationList({});
            }
            //code change by jayshreeba gohil  (13-6-2019) for handle arbitrage configuration detail
            var reqObject = {};
            if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                reqObject.IsArbitrage = this.props.IsArbitrage;
            }
            this.props.getCoinConfigurationList(reqObject);
            //end
        } else if (nextprops.updateError.length !== 0 && nextprops.updateError.ReturnCode !== 0 && this.state.updateData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.updateError.ErrorCode}`} />);
            this.setState({
                updateData: false,
                isUpdate: false,
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

    // used for call Api after validate data and set request for Update coin
    updateCoinConfigurationData = () => {
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
            ServiceId
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

        // create request for update coin
        var data = {
            Name: CoinName ? CoinName : '',
            SMSCode: SmsCode ? SmsCode : '',
            TotalSupply: TotSupply ? parseInt(TotSupply) : 0,
            MaxSupply: MaxSupply ? parseInt(MaxSupply) : 0,
            IssueDate: IssueDate ? IssueDate : '',
            CirculatingSupply: CirculatingSupply ? parseInt(CirculatingSupply) : 0,
            IssuePrice: IssuePrice ? parseFloat(IssuePrice) : 0,
            WebsiteUrl: WebSiteUrl ? WebSiteUrl : '',
            Introduction: Intro ? Intro : '',
            IsTransaction: IsTransaction ? parseInt(1) : parseInt(0),
            IsWithdraw: IsWithdraw ? parseInt(1) : parseInt(0),
            IsDeposit: IsDeposit ? parseInt(1) : parseInt(0),
            IsBaseCurrency: IsBaseCurrency ? parseInt(1) : parseInt(0),
            Status: status ? parseInt(status) : parseInt(0),
            Explorer: explorer.length != 0 ? explorer : [],
            Community: community.length != 0 ? community : [],
            ServiceId: ServiceId
        };

        if (ServiceId === '' || ServiceId == null) {
            NotificationManager.error(<IntlMessages id="coincofiguration.add.enter.serviceid" />);
        } else if (CoinName === "" || CoinName == null) {
            NotificationManager.error(<IntlMessages id="coincofiguration.add.enter.coinname" />);
        }
        else if (isScriptTag(CoinName)) {
            NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
        }
        else if (isHtmlTag(CoinName)) {
            NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
        } else if (SmsCode === "" || SmsCode == null) {
            NotificationManager.error(<IntlMessages id="coincofiguration.add.enter.smscode" />);
        } else if (isScriptTag(SmsCode)) {
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
        } else if (Intro === "" || Intro == null) {
            NotificationManager.error(<IntlMessages id="coincofiguration.add.enter.intro" />);
        }
        else if (isScriptTag(Intro)) {
            NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
        }
        else if (isHtmlTag(Intro)) {
            NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
        }
        else {
            if (WebSiteUrl !== '' && !this.validateUrl(WebSiteUrl)) {
                NotificationManager.error(<IntlMessages id="my_account.err.validUrl" />);
            } else {
                if (this.state.isUpdate) {
                    this.setState({
                        updateData: true
                    })


                    if (this.state.ConfigurationShowCard) {
                        data.IsMargin = 1
                        this.props.updateCoinConfigurationList(data);
                        //added by parth andhariya
                        this.props.AddCurrencyLogo({
                            CurrencyName: this.state.SmsCode,
                            Image: this.state.file
                        })
                    } else {
                        this.props.updateCoinConfigurationList(data);
                        //added by parth andhariya
                        this.props.AddCurrencyLogo({
                            CurrencyName: this.state.SmsCode,
                            Image: this.state.file
                        })
                    }
                } else {
                    NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.pleaseChange" />)
                }
            }
            //code change by jayshreeba gohil (13-6-2019) for handle arbitrage configuration detail
            var reqObject = {};
            if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                reqObject.IsArbitrage = this.props.IsArbitrage;
            }
            this.props.updateCoinConfigurationList(reqObject);
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
                isUpdate: true
            })
        }

    }

    // used to set state for status
    handleChangeStatus = event => {
        this.setState({
            status: event.target.value,
            isUpdate: true
        })
    }

    // used for validate Url 
    validateUrl = (url) => {

        var urlReg = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})"
        return (url.match(urlReg)) ? true : false;
    }

    // Added By Jinesh Bhatt for Reset Data On click of Cancel Button 01-02-2019
    resetData = () => {
        this.props.drawerClose();
        this.setState({
            updateData: false,
            CoinName: "",
            SmsCode: "",
            TotSupply: 0,
            MaxSupply: 0,
            CirculatingSupply: 0,
            IssuePrice: 0,
            WebSiteUrl: "",
            Intro: "",
            IssueDate: "",
            currentDate: new Date().toISOString().slice(0, 10),
            status: "",
            IsBaseCurrency: false,
            IsDeposit: false,
            IsWithdraw: false,
            IsTransaction: false,
            inputs: [0],
            Explorer: [''],
            Community: [''],
            isUpdate: false,
            ServiceId: 0,
            //added by parth andhariya
            file: [],
            CurrencyLogoFlag: false,
            imgPreview: "",
        })
    }

    //added by parth andhariya
    //for handle file slection 
    onChangeFile(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onloadend = function (e) {
            this.setState({
                imgPreview: [reader.result],
                isUpdate: true,
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
                        response = fieldList;
                    }
                }
            }
        }
        return response;
    }
    // render the component
    render() {
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail(this.props.ConfigurationShowCard === 1 ? '23D49980-6122-2CF4-40C5-8C25317F7F9A' : 'E64232D5-7332-7149-4783-4DCE71497A82'); // E64232D5-7332-7149-4783-4DCE71497A82  && margin_GUID 23D49980-6122-2CF4-40C5-8C25317F7F9A
        const { drawerClose } = this.props;
        // return the component
        return (
            <div className="m-10 p-5">
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="wallet.titleEditCoin" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>
                <Row>
                    <Col md={12}>
                        <Form className="tradefrm">
                            <FormGroup row>
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["8E9780B5-A3EB-0D1E-75E0-412EEC6C1961"] : menuDetail["46E021E3-5596-10B1-9445-C7BB5D3D8AAD"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["8E9780B5-A3EB-0D1E-75E0-412EEC6C1961"].Visibility === "E925F86B" : menuDetail["46E021E3-5596-10B1-9445-C7BB5D3D8AAD"].Visibility === "E925F86B")) && //46E021E3-5596-10B1-9445-C7BB5D3D8AAD  && margin_GUID 8E9780B5-A3EB-0D1E-75E0-412EEC6C1961
                                    <Col md={4} sm={6} xs={12}>
                                        <Row>
                                            <Label md={4} sm={4} xs={12} for="CoinName" className="d-inline">
                                                <IntlMessages id="table.Coin" /> <span className="text-danger">*</span>
                                            </Label>
                                            <Col md={8} sm={8} xs={12}>
                                                <IntlMessages id="table.Coin">
                                                    {(placeholder) =>
                                                        <Input type="text"
                                                            name="CoinName"
                                                            value={this.state.CoinName}
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["8E9780B5-A3EB-0D1E-75E0-412EEC6C1961"].AccessRight === "11E6E7B0" : menuDetail["46E021E3-5596-10B1-9445-C7BB5D3D8AAD"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.handleChangeData}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["80947EB0-5E5D-1207-A22D-ACF98A3158D3"] : menuDetail["201D6F39-46CD-4DF0-769D-BEF444E56F74"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["80947EB0-5E5D-1207-A22D-ACF98A3158D3"].Visibility === "E925F86B" : menuDetail["201D6F39-46CD-4DF0-769D-BEF444E56F74"].Visibility === "E925F86B")) && //201D6F39-46CD-4DF0-769D-BEF444E56F74  && margin_GUID 80947EB0-5E5D-1207-A22D-ACF98A3158D3
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
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["80947EB0-5E5D-1207-A22D-ACF98A3158D3"].AccessRight === "11E6E7B0" : menuDetail["201D6F39-46CD-4DF0-769D-BEF444E56F74"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.handleChangeData}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["3766AC09-3AA3-6477-66D2-C032D7D47873"] : menuDetail["3CEC0266-8619-59B4-1D58-E2F720D19758"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["3766AC09-3AA3-6477-66D2-C032D7D47873"].Visibility === "E925F86B" : menuDetail["3CEC0266-8619-59B4-1D58-E2F720D19758"].Visibility === "E925F86B")) && //3CEC0266-8619-59B4-1D58-E2F720D19758  && margin_GUID 3766AC09-3AA3-6477-66D2-C032D7D47873
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
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["3766AC09-3AA3-6477-66D2-C032D7D47873"].AccessRight === "11E6E7B0" : menuDetail["3CEC0266-8619-59B4-1D58-E2F720D19758"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.checkNumericFields}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["9C58EFC9-A54C-655F-0E70-8273508C6135"] : menuDetail["E49F9548-7634-4C23-39F4-7709125B1AE4"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["9C58EFC9-A54C-655F-0E70-8273508C6135"].Visibility === "E925F86B" : menuDetail["E49F9548-7634-4C23-39F4-7709125B1AE4"].Visibility === "E925F86B")) && //E49F9548-7634-4C23-39F4-7709125B1AE4  && margin_GUID 9C58EFC9-A54C-655F-0E70-8273508C6135
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
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["9C58EFC9-A54C-655F-0E70-8273508C6135"].AccessRight === "11E6E7B0" : menuDetail["E49F9548-7634-4C23-39F4-7709125B1AE4"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.checkNumericFields}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["E3381A98-17EA-A569-3A3D-30669A3F50F3"] : menuDetail["AADD34EF-8DB3-34A8-1BBB-351315003B6B"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["E3381A98-17EA-A569-3A3D-30669A3F50F3"].Visibility === "E925F86B" : menuDetail["AADD34EF-8DB3-34A8-1BBB-351315003B6B"].Visibility === "E925F86B")) && //AADD34EF-8DB3-34A8-1BBB-351315003B6B  && margin_GUID E3381A98-17EA-A569-3A3D-30669A3F50F3
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
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["E3381A98-17EA-A569-3A3D-30669A3F50F3"].AccessRight === "11E6E7B0" : menuDetail["AADD34EF-8DB3-34A8-1BBB-351315003B6B"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.checkNumericFields}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["0BCA18E9-7B58-5CC9-8E18-7B804FF774BB"] : menuDetail["84FCCF68-A3E5-271A-6948-11D123424BAF"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["0BCA18E9-7B58-5CC9-8E18-7B804FF774BB"].Visibility === "E925F86B" : menuDetail["84FCCF68-A3E5-271A-6948-11D123424BAF"].Visibility === "E925F86B")) && //84FCCF68-A3E5-271A-6948-11D123424BAF  && margin_GUID 0BCA18E9-7B58-5CC9-8E18-7B804FF774BB
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
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["0BCA18E9-7B58-5CC9-8E18-7B804FF774BB"].AccessRight === "11E6E7B0" : menuDetail["84FCCF68-A3E5-271A-6948-11D123424BAF"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.checkNumericFields}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["411C1BCB-23C3-711F-34F3-39DC43119935"] : menuDetail["26E206F6-6FD3-3F4E-6420-11D5A95740F5"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["411C1BCB-23C3-711F-34F3-39DC43119935"].Visibility === "E925F86B" : menuDetail["26E206F6-6FD3-3F4E-6420-11D5A95740F5"].Visibility === "E925F86B")) && //26E206F6-6FD3-3F4E-6420-11D5A95740F5  && margin_GUID 411C1BCB-23C3-711F-34F3-39DC43119935
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
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["411C1BCB-23C3-711F-34F3-39DC43119935"].AccessRight === "11E6E7B0" : menuDetail["26E206F6-6FD3-3F4E-6420-11D5A95740F5"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.handleChangeData}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["757D73C5-8EAE-9D48-59D2-C8C3FF8C5FF0"] : menuDetail["6F6D82E7-1263-60EB-2B49-A8C1E5E78B26"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["757D73C5-8EAE-9D48-59D2-C8C3FF8C5FF0"].Visibility === "E925F86B" : menuDetail["6F6D82E7-1263-60EB-2B49-A8C1E5E78B26"].Visibility === "E925F86B")) && //6F6D82E7-1263-60EB-2B49-A8C1E5E78B26  && margin_GUID 757D73C5-8EAE-9D48-59D2-C8C3FF8C5FF0
                                    <Col md={4} sm={6} xs={12}>
                                        <Row>
                                            <Label md={4} sm={4} xs={12} for="Intro" className="d-inline">
                                                <IntlMessages id="coincofiguration.intro" /> <span className="text-danger">*</span>
                                            </Label>
                                            <Col md={8} sm={8} xs={12}>
                                                <IntlMessages id="coincofiguration.intro">
                                                    {(placeholder) =>
                                                        <Input type="text"
                                                            name="Intro"
                                                            value={this.state.Intro}
                                                            disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["757D73C5-8EAE-9D48-59D2-C8C3FF8C5FF0"].AccessRight === "11E6E7B0" : menuDetail["6F6D82E7-1263-60EB-2B49-A8C1E5E78B26"].AccessRight === "11E6E7B0") ? true : false}
                                                            onChange={this.handleChangeData}
                                                            placeholder={placeholder} ></Input>
                                                    }
                                                </IntlMessages>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["FB7DE968-2416-45E0-1ECD-B5104E1531ED"] : menuDetail["E6456CB3-13CA-1FB9-32B2-628DB70161A6"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["FB7DE968-2416-45E0-1ECD-B5104E1531ED"].Visibility === "E925F86B" : menuDetail["E6456CB3-13CA-1FB9-32B2-628DB70161A6"].Visibility === "E925F86B")) && //E6456CB3-13CA-1FB9-32B2-628DB70161A6  && margin_GUID FB7DE968-2416-45E0-1ECD-B5104E1531ED
                                    <Col md={4} sm={6} xs={12}>
                                        <Row>
                                            <Label md={4} sm={4} xs={12} for="status" className="d-inline">
                                                <IntlMessages id="manageMarkets.list.form.label.status" /> <span className="text-danger">*</span>
                                            </Label>
                                            <Col md={8} sm={8} xs={12}>
                                                <Input
                                                    type="select"
                                                    name="status"
                                                    value={this.state.status}
                                                    disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["FB7DE968-2416-45E0-1ECD-B5104E1531ED"].AccessRight === "11E6E7B0" : menuDetail["E6456CB3-13CA-1FB9-32B2-628DB70161A6"].AccessRight === "11E6E7B0") ? true : false}
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
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["D47ED2E1-51B8-4419-5271-5042B65E7857"] : menuDetail["8E74BF67-0DCD-1553-8AB7-AEBA053124C3"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["D47ED2E1-51B8-4419-5271-5042B65E7857"].Visibility === "E925F86B" : menuDetail["8E74BF67-0DCD-1553-8AB7-AEBA053124C3"].Visibility === "E925F86B")) && //8E74BF67-0DCD-1553-8AB7-AEBA053124C3  && margin_GUID D47ED2E1-51B8-4419-5271-5042B65E7857
                                    <Col md={4} sm={6} xs={12}>
                                        <Row>
                                            <Label md={4} sm={4} xs={12} for="issueDate" className="d-inline">{<IntlMessages id="coincofiguration.issuedate" />}
                                                <span className="text-danger">*</span></Label>
                                            <Col md={8} sm={8} xs={12}>
                                                <Input type="date" name="IssueDate" value={this.state.IssueDate} disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["D47ED2E1-51B8-4419-5271-5042B65E7857"].AccessRight === "11E6E7B0" : menuDetail["8E74BF67-0DCD-1553-8AB7-AEBA053124C3"].AccessRight === "11E6E7B0") ? true : false} id="issueDate" placeholder="dd/mm/yyyy" onChange={this.handleChangeData} />
                                            </Col>

                                        </Row>
                                    </Col>
                                }
                            </FormGroup>
                            <FormGroup row>
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["EDBA9183-7F0E-7133-7FC4-CF7A9A28912E"] : menuDetail["50A4FA2E-A3EA-98B4-16C3-F228EE532961"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["EDBA9183-7F0E-7133-7FC4-CF7A9A28912E"].Visibility === "E925F86B" : menuDetail["50A4FA2E-A3EA-98B4-16C3-F228EE532961"].Visibility === "E925F86B")) && //50A4FA2E-A3EA-98B4-16C3-F228EE532961  && margin_GUID EDBA9183-7F0E-7133-7FC4-CF7A9A28912E
                                    <Col md={3} sm={6} xs={12}>
                                        <FormControlLabel className="coincheckbox"
                                            control={
                                                <Checkbox
                                                    checked={this.state.IsTransaction}
                                                    onChange={this.handleChangeTransaction}
                                                    disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["EDBA9183-7F0E-7133-7FC4-CF7A9A28912E"].AccessRight === "11E6E7B0" : menuDetail["50A4FA2E-A3EA-98B4-16C3-F228EE532961"].AccessRight === "11E6E7B0") ? true : false}
                                                    icon={<CheckBoxOutlineBlankIcon />}
                                                    checkedIcon={<CheckBoxIcon />}
                                                />
                                            }
                                            label={<IntlMessages id="coincofiguration.add.transaction" />}
                                        />
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["B882F5D4-9805-3CC4-7728-4941229B711E"] : menuDetail["10472B6D-4ADB-1C91-A559-56808B1C5B88"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["B882F5D4-9805-3CC4-7728-4941229B711E"].Visibility === "E925F86B" : menuDetail["10472B6D-4ADB-1C91-A559-56808B1C5B88"].Visibility === "E925F86B")) && //10472B6D-4ADB-1C91-A559-56808B1C5B88  && margin_GUID B882F5D4-9805-3CC4-7728-4941229B711E
                                    <Col md={3} sm={6} xs={12}>
                                        <FormControlLabel className="coincheckbox"
                                            control={
                                                <Checkbox
                                                    checked={this.state.IsDeposit}
                                                    onChange={this.handleChangeDeposit}
                                                    disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["B882F5D4-9805-3CC4-7728-4941229B711E"].AccessRight === "11E6E7B0" : menuDetail["10472B6D-4ADB-1C91-A559-56808B1C5B88"].AccessRight === "11E6E7B0") ? true : false}
                                                    icon={<CheckBoxOutlineBlankIcon />}
                                                    checkedIcon={<CheckBoxIcon />}
                                                />
                                            }
                                            label={<IntlMessages id="coincofiguration.add.deposit" />}
                                        />
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["B9ADFB27-3AD6-704A-3509-7EE872CF14AF"] : menuDetail["84BD6CD1-8512-31C7-1DB3-97512C0F5FED"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["B9ADFB27-3AD6-704A-3509-7EE872CF14AF"].Visibility === "E925F86B" : menuDetail["84BD6CD1-8512-31C7-1DB3-97512C0F5FED"].Visibility === "E925F86B")) && //84BD6CD1-8512-31C7-1DB3-97512C0F5FED  && margin_GUID B9ADFB27-3AD6-704A-3509-7EE872CF14AF
                                    <Col md={3} sm={6} xs={12}>
                                        <FormControlLabel className="coincheckbox"
                                            control={
                                                <Checkbox
                                                    checked={this.state.IsWithdraw}
                                                    onChange={this.handleChangeWithdraw}
                                                    disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["B9ADFB27-3AD6-704A-3509-7EE872CF14AF"].AccessRight === "11E6E7B0" : menuDetail["84BD6CD1-8512-31C7-1DB3-97512C0F5FED"].AccessRight === "11E6E7B0") ? true : false}
                                                    icon={<CheckBoxOutlineBlankIcon />}
                                                    checkedIcon={<CheckBoxIcon />}
                                                />
                                            }
                                            label={<IntlMessages id="coincofiguration.add.withdraw" />}
                                        />
                                    </Col>
                                }
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["0AC4D6A1-1800-75D2-63CA-8E4C6168306C"] : menuDetail["1544F5B4-20FC-56B9-46D8-1FA7C70C8F25"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["0AC4D6A1-1800-75D2-63CA-8E4C6168306C"].Visibility === "E925F86B" : menuDetail["1544F5B4-20FC-56B9-46D8-1FA7C70C8F25"].Visibility === "E925F86B")) && //1544F5B4-20FC-56B9-46D8-1FA7C70C8F25  && margin_GUID 0AC4D6A1-1800-75D2-63CA-8E4C6168306C
                                    <Col md={3} sm={6} xs={12}>
                                        <FormControlLabel className="coincheckbox"
                                            control={
                                                <Checkbox
                                                    checked={this.state.IsBaseCurrency}
                                                    onChange={this.handleChangeBaseCurrency}
                                                    disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["0AC4D6A1-1800-75D2-63CA-8E4C6168306C"].AccessRight === "11E6E7B0" : menuDetail["1544F5B4-20FC-56B9-46D8-1FA7C70C8F25"].AccessRight === "11E6E7B0") ? true : false}
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
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["B02B493E-6348-50A1-3A05-2BC908EF92E5"] : menuDetail["3477C90D-03B6-412B-28B8-81AE39D330B4"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["B02B493E-6348-50A1-3A05-2BC908EF92E5"].Visibility === "E925F86B" : menuDetail["3477C90D-03B6-412B-28B8-81AE39D330B4"].Visibility === "E925F86B")) && //3477C90D-03B6-412B-28B8-81AE39D330B4  && margin_GUID B02B493E-6348-50A1-3A05-2BC908EF92E5
                                    <Col md={6} sm={6} xs={12}>
                                        <Row >
                                            <Label md={4} sm={4} xs={12} for="explorer">
                                                <IntlMessages id="coincofiguration.add.explorer" />
                                            </Label>
                                            {this.state.Explorer.map((explor, index) => (

                                                <Col md={8} sm={8} xs={12} className={index !== 0 ? "offset-md-4 offset-sm-4 mt-5" : 'mt-5'} style={{ display: "inline-flex" }} key={index}>
                                                    <IntlMessages id="coincofiguration.add.explorer">
                                                        {(placeholder) =>
                                                            <Input type="text"
                                                                name="explorer"
                                                                value={explor}
                                                                disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["B02B493E-6348-50A1-3A05-2BC908EF92E5"].AccessRight === "11E6E7B0" : menuDetail["3477C90D-03B6-412B-28B8-81AE39D330B4"].AccessRight === "11E6E7B0") ? true : false}
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
                            </FormGroup>
                            <FormGroup row>
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["13895E46-A2C5-661E-8416-B9B2CC973D5E"] : menuDetail["F62E9AB2-5C2D-7BDC-2944-6594483821DA"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["13895E46-A2C5-661E-8416-B9B2CC973D5E"].Visibility === "E925F86B" : menuDetail["F62E9AB2-5C2D-7BDC-2944-6594483821DA"].Visibility === "E925F86B")) && //F62E9AB2-5C2D-7BDC-2944-6594483821DA  && margin_GUID 13895E46-A2C5-661E-8416-B9B2CC973D5E
                                    <Col md={6} sm={6} xs={12}>
                                        <Row >
                                            <Label md={4} sm={4} xs={12} for="Community">
                                                <IntlMessages id="coincofiguration.add.Community" />
                                            </Label>
                                            {this.state.Community.map((community, index) => (

                                                <Col md={8} sm={8} xs={12} className={index !== 0 ? "offset-md-4 offset-sm-4 mt-5" : 'mt-5'} style={{ display: "inline-flex" }} key={index}>
                                                    <IntlMessages id="coincofiguration.add.Community">
                                                        {(placeholder) =>
                                                            <Input type="text"
                                                                name="Community"
                                                                value={community}
                                                                disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["13895E46-A2C5-661E-8416-B9B2CC973D5E"].AccessRight === "11E6E7B0" : menuDetail["F62E9AB2-5C2D-7BDC-2944-6594483821DA"].AccessRight === "11E6E7B0") ? true : false}
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
                            </FormGroup>
                            {/* added by parth andhariya */}
                            <FormGroup row>
                                {((this.state.ConfigurationShowCard === 1 ? menuDetail["BFD2A6D4-A207-014B-6412-DF7D4170071B"] : menuDetail["87A6E2CC-916A-956F-6F7B-0619F5A15281"]) && (this.state.ConfigurationShowCard === 1 ? menuDetail["BFD2A6D4-A207-014B-6412-DF7D4170071B"].Visibility === "E925F86B" : menuDetail["87A6E2CC-916A-956F-6F7B-0619F5A15281"].Visibility === "E925F86B")) && //87A6E2CC-916A-956F-6F7B-0619F5A15281  && margin_GUID BFD2A6D4-A207-014B-6412-DF7D4170071B
                                    <Col md={6} sm={6} xs={12}>
                                        <Row>
                                            <Label className="d-inline col-md-4 col-sm-4 col-xs-12 col-form-label">
                                                <IntlMessages id="coincofiguration.CurrencyLogo" />
                                            </Label>
                                            {this.state.CurrencyLogoFlag ?
                                                <Col md={8} sm={8} xs={12} className="mt-10">
                                                    <Input
                                                        type="file"
                                                        name="file"
                                                        disabled={(this.state.ConfigurationShowCard === 1 ? menuDetail["BFD2A6D4-A207-014B-6412-DF7D4170071B"].AccessRight === "11E6E7B0" : menuDetail["87A6E2CC-916A-956F-6F7B-0619F5A15281"].AccessRight === "11E6E7B0") ? true : false}
                                                        id="File"
                                                        accept=".PNG"
                                                        onChange={e => this.onChangeFile(e)}
                                                    />
                                                    {this.state.imgPreview && <img alt=""
                                                        src={this.state.imgPreview}
                                                        height="35px"
                                                        width="35px"
                                                    />}
                                                </Col>
                                                :
                                                <Col md={8} sm={8} xs={12}>
                                                    <Tooltip
                                                        title={<IntlMessages id="coinconfiguration.clicktoupdate" />}
                                                        disableFocusListener disableTouchListener
                                                    >
                                                        <img
                                                            src={AppConfig.coinlistImageurl + '/' + this.state.SmsCode + '.png?' + Date.now()}
                                                            className="mr-10"
                                                            height="35px"
                                                            width="35px"
                                                            alt={this.state.SmsCode}
                                                            onClick={() => this.setState({ CurrencyLogoFlag: true })}
                                                            onError={(e) => {
                                                                e.target.src = require(`Assets/icon/no_image.png`) // default no img
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </Col>
                                            }
                                        </Row>
                                    </Col>
                                }
                            </FormGroup>
                            <hr />
                            {Object.keys(menuDetail).length > 0 &&
                                <FormGroup row>
                                    <div className="offset-md-5 col-md-7 offset-sm-5 col-sm-7 col-xs-12">
                                        <div className="btn_area">
                                            <Button color="primary" onClick={(e) => this.updateCoinConfigurationData(e)} disabled={this.props.loading}><IntlMessages id="liquidityprovider.tooltip.update" /></Button>
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
    updateCoinConfiguration: state.coinConfiguration.updatecoinConfigurationList,
    loading: state.coinConfiguration.updateLoading,
    updateError: state.coinConfiguration.updateError,
    //added by parth andhariya
    CurrencyLogo: state.coinConfiguration.CurrencyLogo,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getCoinConfigurationList,
        updateCoinConfigurationList,
        //added by parth andhariya
        AddCurrencyLogo,
        getMenuPermissionByID
    }
)(UpdateCoin);
