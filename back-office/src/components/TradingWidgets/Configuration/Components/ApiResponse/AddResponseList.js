// Component for Add Response Record in API Response By Tejas

// import necessary component for create component
import React, { Component } from 'react';

// used for connect component
import { connect } from "react-redux";

// used for design
import { Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";

// import button and set style 
import CloseButton from '@material-ui/core/Button';
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';
//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

//Action Import for Payment Method  Report Add And Update
import {
    addThirdPartyApiResponseList,
    getThirdPartyApiResponse
} from "Actions/ApiResponseConfig";

// used for display loader
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

// class for add response list component
class AddResponseList extends Component {

    // constructor and define default state
    constructor(props) {
        super(props);
        this.state = {
            addNewData: false,
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
            selectedStatus: "",
            //added by parth andhariya 
            fieldList: {},
            notificationFlag: true,
            menudetail: [],
        };
    }
    //added by parth andhariya 
    componentWillMount() {
        this.props.getMenuPermissionByID('B69F6C37-49C0-A714-12C3-3AD51F4E62E3'); // get Trading menu permission
    }
    // close drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    // used for handle close 
    handleClose = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    };

    // set state for parsing data on change of dropdown
    onChangeParsingData(e) {
        this.setState({
            parsingDataID: e.target.value,
        });
    }

    // set state for App type on change of dropdown
    onChangeAppType(e) {
        this.setState({
            appType: e.target.value,
        });
    }

    // invoke when component is about to get props
    componentWillReceiveProps(nextprops) {
        // set state for app type list
        if (nextprops.appTypeList) {
            this.setState({
                appTypeList: nextprops.appTypeList
            })
        }
        /// display success or failure message when call api for add APi response and close drawer
        if (nextprops.addResponseList && nextprops.addError.length == 0 && this.state.addNewData) {
            NotificationManager.success(<IntlMessages id="apiresponse.add.currency.success" />);
            this.setState({
                addNewData: false,
                open: false
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

    // request for add API Response and call Api
    addAPIResponseData = () => {
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
            Status: selectedStatus ? parseInt(selectedStatus) : parseInt(0)
        };
        if (isScriptTag(balanceRegex)) {
            NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
          }
          else if (isHtmlTag(balanceRegex)) {
            NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
        }
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
        else if (isScriptTag(statusRegex)) {
            NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
          }
          else if (isHtmlTag(statusRegex)) {
            NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
          }
        else {
            this.setState({
                addNewData: true
            })
              //code change by jayshreeba Gohil (17-6-2019) for handle arbitrage configuration detail
              var reqObject = data;
              if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                  reqObject.IsArbitrage = this.props.IsArbitrage;
              }
              this.props.addThirdPartyApiResponseList(reqObject);
              //end
            this.props.addThirdPartyApiResponseList(data);
        }
    };

    // set state for Textboxes
    handleChangeData = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    // added By jinesh bhatt for cancel  button event 04-02-2019
    resetData = () => {
        this.props.drawerClose();
        this.setState({
            addNewData: false,
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
            selectedStatus: 0
        });
    };

    // set staus on change of drop down
    handleChangeStatus = event => {
        this.setState({ selectedStatus: event.target.value });
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
                         response = fieldList;
                    }
                }
            }
        }
            return response;
    }
    // renders the component
    render() {
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail('3F430D1D-70C9-14E5-916E-D68BA2AF6DE2');//3F430D1D-70C9-14E5-916E-D68BA2AF6DE2
        // return component
        return (
            <div className="m-10 p-5">
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="apiresponse.list.title.addnewlist" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={() => this.resetData()}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>
                <Row>
                    <Col md={12}>
                        <Form className="m-10 tradefrm">
                            <FormGroup>
                                <Row>
                                    {((menuDetail["A5E0C314-A3EF-77FB-83EB-BC9721174A9C"]) && (menuDetail["A5E0C314-A3EF-77FB-83EB-BC9721174A9C"].Visibility === "E925F86B")) && //A5E0C314-A3EF-77FB-83EB-BC9721174A9C
                                        <Col md={6} sm={6}>
                                            <Label className="control-label col">
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.balanceRegex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.balanceRegex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["A5E0C314-A3EF-77FB-83EB-BC9721174A9C"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="balanceRegex"
                                                        value={this.state.balanceRegex}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["035B7DD9-5962-7AA9-6295-BCE967C6169C"]) && (menuDetail["035B7DD9-5962-7AA9-6295-BCE967C6169C"].Visibility === "E925F86B")) && //035B7DD9-5962-7AA9-6295-BCE967C6169C
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.statusMsgRegex" /><span className="text-danger">*</span>
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.statusMsgRegex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["035B7DD9-5962-7AA9-6295-BCE967C6169C"].AccessRight === "11E6E7B0") ? true : false}
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
                                    {((menuDetail["9BF36D61-9A05-4669-6DE0-C3EC3FEA53EE"]) && (menuDetail["9BF36D61-9A05-4669-6DE0-C3EC3FEA53EE"].Visibility === "E925F86B")) && //9BF36D61-9A05-4669-6DE0-C3EC3FEA53EE
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.responseCodeRegex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.responseCodeRegex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["9BF36D61-9A05-4669-6DE0-C3EC3FEA53EE"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="responseCodeRegex"
                                                        value={this.state.responseCodeRegex}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["084DF765-9DE4-A239-3B1F-F69EC20E3144"]) && (menuDetail["084DF765-9DE4-A239-3B1F-F69EC20E3144"].Visibility === "E925F86B")) && //084DF765-9DE4-A239-3B1F-F69EC20E3144
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.errorCodeRegex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.errorCodeRegex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["084DF765-9DE4-A239-3B1F-F69EC20E3144"].AccessRight === "11E6E7B0") ? true : false}
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
                                    {((menuDetail["C0C8BD7F-2F46-0500-1526-9089E5C22586"]) && (menuDetail["C0C8BD7F-2F46-0500-1526-9089E5C22586"].Visibility === "E925F86B")) && //C0C8BD7F-2F46-0500-1526-9089E5C22586
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.trnRefNoRegex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.trnRefNoRegex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["C0C8BD7F-2F46-0500-1526-9089E5C22586"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="trnRefNoRegex"
                                                        value={this.state.trnRefNoRegex}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["4F0D4A7E-1724-A122-4711-DD422017310E"]) && (menuDetail["4F0D4A7E-1724-A122-4711-DD422017310E"].Visibility === "E925F86B")) && //4F0D4A7E-1724-A122-4711-DD422017310E
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.oprTrnRefNoRegex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.oprTrnRefNoRegex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["4F0D4A7E-1724-A122-4711-DD422017310E"].AccessRight === "11E6E7B0") ? true : false}
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
                                    {((menuDetail["D46BF286-8DDC-2897-5D63-4CA488327B42"]) && (menuDetail["D46BF286-8DDC-2897-5D63-4CA488327B42"].Visibility === "E925F86B")) && //D46BF286-8DDC-2897-5D63-4CA488327B42
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.param1Regex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.param1Regex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["D46BF286-8DDC-2897-5D63-4CA488327B42"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="param1Regex"
                                                        value={this.state.param1Regex}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["7C0626C2-8857-1916-438D-0199C75F4A9C"]) && (menuDetail["7C0626C2-8857-1916-438D-0199C75F4A9C"].Visibility === "E925F86B")) && //7C0626C2-8857-1916-438D-0199C75F4A9C
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.param2Regex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.param2Regex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["7C0626C2-8857-1916-438D-0199C75F4A9C"].AccessRight === "11E6E7B0") ? true : false}
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
                                    {((menuDetail["44FFF484-1B0F-22DA-44DF-2DA3CDC3413D"]) && (menuDetail["44FFF484-1B0F-22DA-44DF-2DA3CDC3413D"].Visibility === "E925F86B")) && //44FFF484-1B0F-22DA-44DF-2DA3CDC3413D
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.param3Regex" />
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.param3Regex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["44FFF484-1B0F-22DA-44DF-2DA3CDC3413D"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="param3Regex"
                                                        value={this.state.param3Regex}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["F1452D77-2C88-2A91-A058-E35752E9382D"]) && (menuDetail["F1452D77-2C88-2A91-A058-E35752E9382D"].Visibility === "E925F86B")) && //F1452D77-2C88-2A91-A058-E35752E9382D
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="sidebar.apiresponse.list.lable.enter.statusRegex" /><span className="text-danger">*</span>
                                            </Label>
                                            <IntlMessages id="sidebar.apiresponse.list.lable.enter.statusRegex">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["F1452D77-2C88-2A91-A058-E35752E9382D"].AccessRight === "11E6E7B0") ? true : false}
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
                                    {((menuDetail["E798DDCE-4FDE-1F1C-4A2B-1CDC0D6004CA"]) && (menuDetail["E798DDCE-4FDE-1F1C-4A2B-1CDC0D6004CA"].Visibility === "E925F86B")) && //E798DDCE-4FDE-1F1C-4A2B-1CDC0D6004CA
                                       <Col md={6} sm={6}>
                                            <Label  for="status">
                                                <IntlMessages id="manageMarkets.list.form.label.status" />
                                            </Label>
                                                <Input
                                                    disabled={(menuDetail["E798DDCE-4FDE-1F1C-4A2B-1CDC0D6004CA"].AccessRight === "11E6E7B0") ? true : false}
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
                            {/* Code Added By jinesh bhatt for add cancel button and change button alignment to center date : 04-02-2019*/}
                            <hr />
                            {Object.keys(menuDetail).length > 0 &&
                                <FormGroup row>
                                    <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                        <div className="btn_area">
                                        <Button
                                            variant="raised"
                                            color="primary"
                                            className="text-white"
                                            onClick={() => this.addAPIResponseData()}
                                            disabled={this.props.loading}
                                        >
                                            <IntlMessages id="sidebar.pairConfiguration.button.add" />
                                        </Button>

                                        <Button
                                            variant="raised"
                                            color="danger"
                                            className="text-white ml-15"
                                            onClick={() => this.resetData()}
                                            disabled={this.props.loading}
                                        >
                                            <IntlMessages id="sidebar.pairConfiguration.button.cancel" />
                                        </Button>
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

//// map states to props when changed in states from reducer
const mapStateToProps = state => ({
    addResponseList: state.thirdPartyApiResponse.addResponseList,
    loading: state.thirdPartyApiResponse.addLoading,
    addError: state.thirdPartyApiResponse.addError,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        addThirdPartyApiResponseList,
        getThirdPartyApiResponse,
        getMenuPermissionByID
    }
)(AddResponseList);