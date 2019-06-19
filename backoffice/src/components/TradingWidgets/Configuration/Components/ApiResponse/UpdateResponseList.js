// component for update response list By Tejas
import React, { Component } from 'react';

// used for connect store
import { connect } from "react-redux";

// used for design
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Row,
    Col
} from "reactstrap";
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';
// import button and set style
import CloseButton from '@material-ui/core/Button';

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

//Action Import for Payment Method  Report Add And Update
import {
    updateThirdPartyApiResponseList,
    getThirdPartyApiResponse
} from "Actions/ApiResponseConfig";

//used for display loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
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

//class for update api response list
class UpdateResponseList extends Component {

    //constructor and define default state
    constructor(props) {
        super(props);
        this.state = {
            updateData: false,
            balanceRegex: this.props.selectedData.BalanceRegex,
            statusMsgRegex: this.props.selectedData.StatusMsgRegex,
            responseCodeRegex: this.props.selectedData.ResponseCodeRegex,
            errorCodeRegex: this.props.selectedData.ErrorCodeRegex,
            trnRefNoRegex: this.props.selectedData.TrnRefNoRegex,
            oprTrnRefNoRegex: this.props.selectedData.OprTrnRefNoRegex,
            param1Regex: this.props.selectedData.Param1Regex,
            param2Regex: this.props.selectedData.Param2Regex,
            param3Regex: this.props.selectedData.Param3Regex,
            statusRegex: this.props.selectedData.StatusRegex,
            id: this.props.selectedData.Id,
            isUpdate: false,
            selectedStatus: this.props.selectedData.Status,
            //added by parth andhariya 
            fieldList: {},
            notificationFlag: true,
            menudetail: [],
        };
    }
    //added by parth andhariya 
    //added by parth andhariya 
    componentWillMount() {
        this.props.getMenuPermissionByID('B69F6C37-49C0-A714-12C3-3AD51F4E62E3'); // get Trading menu permission
        // code added by parth andhariya for handle and check menu detail and store (18-4-2019)
        // var fieldList = {};
        // if (this.props.menuDetail.Fields && this.props.menuDetail.Fields.length) {
        //     this.props.menuDetail.Fields.forEach(function (item) {
        //         fieldList[item.GUID] = item;
        //     });
        //     this.setState({
        //         fieldList: fieldList
        //     });
        // }
        // code end
    }
    // close all drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            isUpdate: false
        });
    }

    // used for close drawer
    handleClose = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            isUpdate: false
        });
    };

    //set state for parsing data on change of  dropdown
    onChangeParsingData(e) {
        this.setState({
            parsingDataID: e.target.value,
            isUpdate: true
        });
    }

    //set state for app type  data on change of  dropdown
    onChangeAppType(e) {
        this.setState({
            appType: e.target.value,
            isUpdate: true
        });
    }

    // invoke when component is about to get props
    componentWillReceiveProps(nextprops) {
        // set state of select data for update
        if (nextprops.selectedData && this.state.updateData == false) {
            this.setState({
                balanceRegex: nextprops.selectedData.BalanceRegex,
                statusMsgRegex: nextprops.selectedData.StatusMsgRegex,
                responseCodeRegex: nextprops.selectedData.ResponseCodeRegex,
                errorCodeRegex: nextprops.selectedData.ErrorCodeRegex,
                trnRefNoRegex: nextprops.selectedData.TrnRefNoRegex,
                oprTrnRefNoRegex: nextprops.selectedData.OprTrnRefNoRegex,
                param1Regex: nextprops.selectedData.Param1Regex,
                param2Regex: nextprops.selectedData.Param2Regex,
                param3Regex: nextprops.selectedData.Param3Regex,
                statusRegex: nextprops.selectedData.StatusRegex,
                id: nextprops.selectedData.Id,
                selectedStatus: nextprops.selectedData.Status
            })
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

        /// display success or failure message when call api for Update APi response and close drawer
        if (nextprops.updateResponseList && nextprops.updateResponseList.ReturnCode == 0 && this.state.updateData) {
            NotificationManager.success(<IntlMessages id="apiresponse.update.currency.success" />);
            this.setState({
                updateData: false,
                open: false,
                isUpdate: false
            })
            this.props.drawerClose();
            //code change by jayshreeba Gohil (17-6-2019) for handle arbitrage configuration detail
            var reqObject = {};
            if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                reqObject.IsArbitrage = this.props.IsArbitrage;
            }
            this.props.getThirdPartyApiResponse(reqObject);
            //end
            this.props.getThirdPartyApiResponse({});
        } else if (nextprops.updateError.length !== 0 && nextprops.updateError.ReturnCode !== 0 && this.state.updateData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.updateError.ErrorCode}`} />);
            this.setState({
                updateData: false,
                isUpdate: false
            })
        }
    }

    // request for update API Response and call Api
    updateAPIProviderData = () => {
        if (this.state.isUpdate) {
            const {
                balanceRegex,
                statusMsgRegex,
                statusRegex,
                responseCodeRegex,
                errorCodeRegex,
                trnRefNoRegex,
                oprTrnRefNoRegex,
                param1Regex,
                param2Regex,
                param3Regex,
                id,
                selectedStatus
            } = this.state;

            const data = {
                BalanceRegex: balanceRegex,
                StatusRegex: statusRegex,
                StatusMsgRegex: statusMsgRegex,
                ResponseCodeRegex: responseCodeRegex,
                ErrorCodeRegex: errorCodeRegex,
                TrnRefNoRegex: trnRefNoRegex,
                OprTrnRefNoRegex: oprTrnRefNoRegex,
                Param1Regex: param1Regex,
                Param2Regex: param2Regex,
                Param3Regex: param3Regex,
                Id: id,
                Status: selectedStatus
            };

            if (statusMsgRegex === "" || statusMsgRegex == null) {
                NotificationManager.error(<IntlMessages id="sidebar.apiresponse.list.lable.enter.statusMsgRegex" />);
            }
            else if (isScriptTag(statusMsgRegex)) {
                NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
              }
              else if (isHtmlTag(statusMsgRegex)) {
                NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
            }
            else if (isScriptTag(balanceRegex)) {
                NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
              }
              else if (isHtmlTag(balanceRegex)) {
                NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
              }
              else if (isScriptTag(responseCodeRegex)) {
                NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
              }
              else if (isHtmlTag(responseCodeRegex)) {
                NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
            }
            else if (isScriptTag(errorCodeRegex)) {
                NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
              }
              else if (isHtmlTag(errorCodeRegex)) {
                NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
            }
            else if (isScriptTag(trnRefNoRegex)) {
                NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
              }
              else if (isHtmlTag(trnRefNoRegex)) {
                NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
            }
            else if (isScriptTag(oprTrnRefNoRegex)) {
                NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
              }
              else if (isHtmlTag(oprTrnRefNoRegex)) {
                NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
            }
            else if (isScriptTag(param1Regex) ||isScriptTag(param2Regex) ||isScriptTag(param3Regex)) {
                NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
              }
              else if (isHtmlTag(param1Regex)||isHtmlTag(param2Regex) ||isHtmlTag(param3Regex)) {
                NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
              }
            else {
                this.setState({
                    updateData: true
                })
                this.props.updateThirdPartyApiResponseList(data);
            }
             //code change by jayshreeba Gohil (17-6-2019) for handle arbitrage configuration detail
             var reqObject = data;
             if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                 reqObject.IsArbitrage = this.props.IsArbitrage;
             }
             this.props.updateThirdPartyApiResponseList(reqObject);
        } else {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.pleaseChange" />)
        }
    };

    // set state for Textboxes
    handleChangeData = event => {
        this.setState({
            [event.target.name]: event.target.value,
            isUpdate: true
        })
    }
    // Added By Jinesh Bhatt For cancel Button Event Handle Date : 04-02-2019
    resetData = () => {
        this.props.drawerClose();
        this.setState({
            updateData: false,
            balanceRegex: "",
            statusMsgRegex: "",
            responseCodeRegex: "",
            errorCodeRegex: "",
            trnRefNoRegex: "",
            oprTrnRefNoRegex: "",
            param1Regex: "",
            param2Regex: "",
            param3Regex: "",
            statusRegex: "",
            id: "",
            isUpdate: false,
            selectedStatus: 0
        });
    };

    // set staus on change of drop down
    handleChangeStatus = event => {
        this.setState({ selectedStatus: event.target.value, isUpdate: true });
    };

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
    // renders the component
    render() {
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail('B58C3E73-36CA-473F-366E-52563E7475BE');//B58C3E73-36CA-473F-366E-52563E7475BE
        // returns the component
        return (
            <div className="m-10 p-5">
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="apiresponse.list.title.updatelist" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>

                <Row>
                    <Col md={12}>
                        <Form className="m-10 tradefrm">
                            <FormGroup>
                                <Row>
                                    {((menuDetail["0244E3DC-A1A5-A005-7D8B-7943107B58E2"]) && (menuDetail["0244E3DC-A1A5-A005-7D8B-7943107B58E2"].Visibility === "E925F86B")) && //0244E3DC-A1A5-A005-7D8B-7943107B58E2
                                        <Col md={6} sm={6} >
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.balanceRegex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.balanceRegex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["0244E3DC-A1A5-A005-7D8B-7943107B58E2"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="balanceRegex"
                                                        value={this.state.balanceRegex}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["402894F4-18AB-3D30-1204-56E4B1A25E30"]) && (menuDetail["402894F4-18AB-3D30-1204-56E4B1A25E30"].Visibility === "E925F86B")) && //402894F4-18AB-3D30-1204-56E4B1A25E30
                                        <Col md={6} sm={6} >
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.statusMsgRegex" /><span className="text-danger">*</span>
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.statusMsgRegex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["402894F4-18AB-3D30-1204-56E4B1A25E30"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="statusMsgRegex"
                                                        value={this.state.statusMsgRegex}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                </Row>
                            </FormGroup>

                            <FormGroup>
                                <Row>
                                    {((menuDetail["6645C1BD-2815-7076-01E7-15D9C65C20EE"]) && (menuDetail["6645C1BD-2815-7076-01E7-15D9C65C20EE"].Visibility === "E925F86B")) && //6645C1BD-2815-7076-01E7-15D9C65C20EE
                                        <Col md={6} sm={6} >
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.responseCodeRegex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.responseCodeRegex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["6645C1BD-2815-7076-01E7-15D9C65C20EE"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="responseCodeRegex"
                                                        value={this.state.responseCodeRegex}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["8B5E5DC7-9BD0-29B5-3F8A-9FE839DD778C"]) && (menuDetail["8B5E5DC7-9BD0-29B5-3F8A-9FE839DD778C"].Visibility === "E925F86B")) && //8B5E5DC7-9BD0-29B5-3F8A-9FE839DD778C
                                        <Col md={6} sm={6} >
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.errorCodeRegex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.errorCodeRegex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["8B5E5DC7-9BD0-29B5-3F8A-9FE839DD778C"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="errorCodeRegex"
                                                        value={this.state.errorCodeRegex}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                </Row>
                            </FormGroup>

                            <FormGroup>
                                <Row>
                                    {((menuDetail["33EE7459-5FB1-057F-5097-29B1925A82DA"]) && (menuDetail["33EE7459-5FB1-057F-5097-29B1925A82DA"].Visibility === "E925F86B")) && //33EE7459-5FB1-057F-5097-29B1925A82DA
                                        <Col md={6} sm={6} >
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.trnRefNoRegex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.trnRefNoRegex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["33EE7459-5FB1-057F-5097-29B1925A82DA"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="trnRefNoRegex"
                                                        value={this.state.trnRefNoRegex}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["4D172E47-3EAF-8083-74F3-A10034B60F72"]) && (menuDetail["4D172E47-3EAF-8083-74F3-A10034B60F72"].Visibility === "E925F86B")) && //4D172E47-3EAF-8083-74F3-A10034B60F72
                                        <Col md={6} sm={6} >
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.oprTrnRefNoRegex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.oprTrnRefNoRegex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["4D172E47-3EAF-8083-74F3-A10034B60F72"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="oprTrnRefNoRegex"
                                                        value={this.state.oprTrnRefNoRegex}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    {((menuDetail["A14A64AB-001C-7810-4576-C457229E6295"]) && (menuDetail["A14A64AB-001C-7810-4576-C457229E6295"].Visibility === "E925F86B")) && //A14A64AB-001C-7810-4576-C457229E6295
                                        <Col md={6} sm={6} >
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.param1Regex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.param1Regex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["A14A64AB-001C-7810-4576-C457229E6295"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="param1Regex"
                                                        value={this.state.param1Regex}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["603F7761-A6C7-8CC4-0D20-976C3F040F1F"]) && (menuDetail["603F7761-A6C7-8CC4-0D20-976C3F040F1F"].Visibility === "E925F86B")) && //603F7761-A6C7-8CC4-0D20-976C3F040F1F
                                        <Col md={6} sm={6} >
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.param2Regex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.param2Regex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["603F7761-A6C7-8CC4-0D20-976C3F040F1F"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="param2Regex"
                                                        value={this.state.param2Regex}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    {((menuDetail["D6FE363A-7A64-677A-327A-62C96D5F44D5"]) && (menuDetail["D6FE363A-7A64-677A-327A-62C96D5F44D5"].Visibility === "E925F86B")) && //D6FE363A-7A64-677A-327A-62C96D5F44D5
                                        <Col md={6} sm={6} >
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.param3Regex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.param3Regex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["D6FE363A-7A64-677A-327A-62C96D5F44D5"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="param3Regex"
                                                        value={this.state.param3Regex}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["A0E47B4B-6968-A431-8D8C-42E0F612207C"]) && (menuDetail["A0E47B4B-6968-A431-8D8C-42E0F612207C"].Visibility === "E925F86B")) && //A0E47B4B-6968-A431-8D8C-42E0F612207C
                                        <Col md={6} sm={6} >
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.statusRegex" /><span className="text-danger">*</span>
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.statusRegex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["A0E47B4B-6968-A431-8D8C-42E0F612207C"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="statusRegex"
                                                        value={this.state.statusRegex}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    {((menuDetail["5256BF46-6C76-449E-66AE-401DC3659E3A"]) && (menuDetail["5256BF46-6C76-449E-66AE-401DC3659E3A"].Visibility === "E925F86B")) && //5256BF46-6C76-449E-66AE-401DC3659E3A
                                      <Col md={6} sm={6}>
                                            <Label  for="status">
                                                <IntlMessages id="manageMarkets.list.form.label.status" />
                                            </Label>
                                                <Input
                                                    disabled={(menuDetail["5256BF46-6C76-449E-66AE-401DC3659E3A"].AccessRight === "11E6E7B0") ? true : false}
                                                    type="select"
                                                    name="status"
                                                    value={this.state.selectedStatus}
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
                                                    <IntlMessages id="sidebar.btnDisable">
                                                        {(select) =>
                                                            <option value="9">{select}</option>
                                                        }
                                                    </IntlMessages>
                                                </Input>
                                            </Col>
                                    }
                                </Row>
                            </FormGroup>
                            <hr />
                            {menuDetail &&
                                <FormGroup row>
                                    <Label sm={4}></Label>
                                    <Col sm={2}>
                                        <Button
                                            variant="raised"
                                            color="primary"
                                            className="text-white"
                                            onClick={() => this.updateAPIProviderData()}
                                            disabled={this.props.loading}
                                        >
                                            <IntlMessages id="liquidityprovider.tooltip.update" />
                                        </Button>
                                    </Col>
                                    <Col sm={2}>
                                        <Button
                                            variant="raised"
                                            color="danger"
                                            className="text-white ml-15"
                                            onClick={() => this.resetData()}
                                            disabled={this.props.loading}
                                        >
                                            <IntlMessages id="sidebar.pairConfiguration.button.cancel" />
                                        </Button>
                                    </Col>
                                </FormGroup>
                            }
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}

//// map states to props when changed in states from reducer
const mapStateToProps = state => ({
    updateResponseList: state.thirdPartyApiResponse.updateResponseList,
    loading: state.thirdPartyApiResponse.updateLoading,
    updateError: state.thirdPartyApiResponse.updateError,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        updateThirdPartyApiResponseList,
        getThirdPartyApiResponse,
        getMenuPermissionByID
    }
)(UpdateResponseList);