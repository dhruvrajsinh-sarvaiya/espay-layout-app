/* 
    Created By : Megha Kariya (actual develop by Jineshbhai)
    Date : 20-02-2019
    Description : Add form of CMS Email API manager
*/
import React, { Component, Fragment } from "react";
import { Badge, Col, Row, Form, FormGroup, Input, Label } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import Button from '@material-ui/core/Button';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { connect } from "react-redux";
import { addEmailApiRequest, getEmailApiList, getAllRequestFormat, getAllThirdPartyAPIRespose } from "Actions/EmailApiManager";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

const validateEmailAPI = require("../../../../validation/EmailApiManager/editEmailApi");

const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
};

class AddEmailAPI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            SenderID: "",
            SendURL: "",
            Priority: "",
            RequestID: "",
            ServiceName: "",
            UserID: "",
            Password: "",
            ParsingDataID: "",
            ServiceTypeID: props.type,
            SerproName: "",
            Status: "",
            errors: {},
            open: false,
            isAPICall: false,
            requestFormats: {},
            thirdPartyAPIResponses: {},
            validateBit: 1, // for 1 add 2 edit
            GUID: this.props.GUID,
            menudetail: [],
            Pflag: true,
        };
        this.initState = this.state; // Added By Megha Kariya (21/02/2019)
        this.onAddEmailApi = this.onAddEmailApi.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.showComponent = this.showComponent.bind(this);
        this.closeAll = this.closeAll.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.props.getAllRequestFormat({});
        this.props.getAllThirdPartyAPIRespose({});
    }

    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.GUID);
    }

    componentWillReceiveProps(nextProps) {

        if (this.state.GUID !== this.props.GUID) {
            this.props.getMenuPermissionByID(this.props.GUID);
            this.setState({ GUID: this.props.GUID })
        }

        // update menu details if not set 
        if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });

            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    this.props.drawerClose();
                }, 2000);
            }
            this.setState({ Pflag: false })
        }

        if (nextProps.AddResponse && typeof nextProps.AddResponse !== 'undefined' && nextProps.AddResponse.ReturnCode == 0 && this.state.isAPICall == true) {
            NotificationManager.success(<IntlMessages id="emailApiManager.Status.Success.add" />);
            this.setState({
                open: false,
                isAPICall: false
            });
            this.setState(this.initState); // Added By Megha Kariya (21/02/2019)
            this.props.drawerClose();

            this.props.getEmailApiList({ type: this.state.ServiceTypeID });
        }
        if (nextProps.RequestFormatResponse.length !== 0 && nextProps.ThirdPartyAPIResponse.length !== 0) {
            this.setState({
                requestFormats: nextProps.RequestFormatResponse,
                thirdPartyAPIResponses: nextProps.ThirdPartyAPIResponse,
            })
        } else if (nextProps.RequestFormatResponse.length === 0 && nextProps.ThirdPartyAPIResponse.length !== 0) {
            this.props.getAllRequestFormat({});
        } else if (nextProps.RequestFormatResponse.length !== 0 && nextProps.ThirdPartyAPIResponse.length === 0) {
            this.props.getAllThirdPartyAPIRespose({});
        } else {
            this.props.getAllRequestFormat({});
            this.props.getAllThirdPartyAPIRespose({});
        }

    }

    onAddEmailApi() {
        const {
            SenderID,
            SendURL,
            Priority,
            RequestID,
            ServiceName,
            UserID,
            Password,
            ParsingDataID,
            ServiceTypeID,
            SerproName,
            Status,
        } = this.state;

        const { errors, isValid } = validateEmailAPI(this.state);

        Object.keys(errors).forEach(function (item) {
            NotificationManager.error(<IntlMessages id={errors[item]} />);
        });

        this.setState({ isAPICall: true });

        if (isValid) {
            this.props.addEmailApiRequest({
                emailRequest:
                {
                    SenderID,
                    SendURL,
                    Priority,
                    RequestID,
                    ServiceName,
                    UserID,
                    Password,
                    ParsingDataID,
                    ServiceTypeID,
                    SerproName,
                    Status
                }
            });
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    toggleDrawer = () => {
        /* this.setState({
            open: !this.state.open,
            componentName:''
        }) */
        // Added By Megha Kariya (21/02/2019)
        this.setState(
            this.initState
        );
        this.props.drawerClose();
    };

    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
        });
    };

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    };
    changeDefault = (index) => {
        this.setState({
            defaultIndex: index
        });
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


    render() {
        var menudetail = this.checkAndGetMenuAccessDetail(this.state.GUID === 'AB309E3D-0BBA-28E9-A2C7-3D1DB99451AA' ? 'B76C950D-1A71-5B48-6874-4DAE30B012DE' : '6FF225B6-45D0-5E71-22B3-E6ACF2748AB2');
        const { drawerClose } = this.props;
        const requestForamts = typeof this.state.requestFormats.Result !== 'undefined' ? this.state.requestFormats.Result : [];
        const thirdPartyAPIResponses = typeof this.state.thirdPartyAPIResponses.Response !== 'undefined' ? this.state.thirdPartyAPIResponses.Response : [];
        const {
            SenderID,
            SendURL,
            Priority,
            RequestID,
            ServiceName,
            UserID,
            Password,
            ParsingDataID,
            SerproName,
            Status,
        } = this.state;

        return (
            <div className="jbs-page-content">
                <div className="jbs-page-content col-md-12 mx-auto">
                    <div className="m-20 page-title d-flex justify-content-between align-items-center">
                        <div className="page-title-wrap">
                            <h2><IntlMessages id={this.state.ServiceTypeID === 2 ? "emailAPIManager.addEmailAPI" : "emailAPIManager.addSMSAPI"} /></h2>
                        </div>
                        <div className="page-title-wrap">
                            <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab"
                                mini onClick={this.toggleDrawer}><i className="zmdi zmdi-mail-reply"></i></Button> {/* Changed By Megha Kariya (21/02/2019) */}
                            <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini
                                onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                        </div>
                    </div>
                    {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}

                    <Form className="tradefrm">
                        <FormGroup>
                            <Row>
                                {(this.state.ServiceTypeID === 2
                                    ? (menudetail["A648646D-76DB-10C0-69CB-442D64350DFD"] && menudetail["A648646D-76DB-10C0-69CB-442D64350DFD"].Visibility === "E925F86B") //A648646D-76DB-10C0-69CB-442D64350DFD
                                    : (menudetail["4C10A798-8762-0BEE-71ED-68911EB02A35"] && menudetail["4C10A798-8762-0BEE-71ED-68911EB02A35"].Visibility === "E925F86B")) && //4C10A798-8762-0BEE-71ED-68911EB02A35
                                    <Col md={4}>
                                        <Label for="SenderID" sm={4}>
                                            {<IntlMessages id="emailAPIManager.label.SenderID" />}
                                        </Label>
                                        <IntlMessages id="emailAPIManager.label.SenderID">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={((this.state.ServiceTypeID === 2
                                                        ? (menudetail["A648646D-76DB-10C0-69CB-442D64350DFD"] && menudetail["A648646D-76DB-10C0-69CB-442D64350DFD"].AccessRight === "11E6E7B0")
                                                        : (menudetail["4C10A798-8762-0BEE-71ED-68911EB02A35"] && menudetail["4C10A798-8762-0BEE-71ED-68911EB02A35"].AccessRight === "11E6E7B0"))) ? true : false}
                                                    type="text" name="SenderID" value={SenderID}
                                                    id="SenderID" placeholder={placeholder}
                                                    onChange={this.handleChange} />
                                            }
                                        </IntlMessages>
                                    </Col>}
                                {(this.state.ServiceTypeID === 2
                                    ? (menudetail["004C743F-41F2-29F3-4E6D-28F29F160AF7"] && menudetail["004C743F-41F2-29F3-4E6D-28F29F160AF7"].Visibility === "E925F86B") //004C743F-41F2-29F3-4E6D-28F29F160AF7
                                    : (menudetail["58D36860-3BC1-3DCB-6E90-85A5415F357A"] && menudetail["58D36860-3BC1-3DCB-6E90-85A5415F357A"].Visibility === "E925F86B")) && //58D36860-3BC1-3DCB-6E90-85A5415F357A
                                    <Col md={4}>
                                        <Label for="SendURL">
                                            {<IntlMessages id="emailAPIManager.label.SendURL" />}
                                        </Label>
                                        <IntlMessages id="emailAPIManager.label.SendURL">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={((this.state.ServiceTypeID === 2
                                                        ? (menudetail["004C743F-41F2-29F3-4E6D-28F29F160AF7"] && menudetail["004C743F-41F2-29F3-4E6D-28F29F160AF7"].AccessRight === "11E6E7B0")
                                                        : (menudetail["58D36860-3BC1-3DCB-6E90-85A5415F357A"] && menudetail["58D36860-3BC1-3DCB-6E90-85A5415F357A"].AccessRight === "11E6E7B0"))) ? true : false}
                                                    type="text" name="SendURL" value={SendURL}
                                                    id="SendURL" placeholder={placeholder}
                                                    onChange={this.handleChange} />}
                                        </IntlMessages>
                                    </Col>}
                                {(this.state.ServiceTypeID === 2
                                    ? (menudetail["DC54230D-11D4-91CA-9F9E-E2F4950E709F"] && menudetail["DC54230D-11D4-91CA-9F9E-E2F4950E709F"].Visibility === "E925F86B") //DC54230D-11D4-91CA-9F9E-E2F4950E709F
                                    : (menudetail["25C36F1F-8545-9B26-67B5-5E100D4D44EF"] && menudetail["25C36F1F-8545-9B26-67B5-5E100D4D44EF"].Visibility === "E925F86B")) && //25C36F1F-8545-9B26-67B5-5E100D4D44EF
                                    <Col md={4}>
                                        <Label for="Priority">
                                            {<IntlMessages id="emailAPIManager.label.Priority" />}
                                        </Label>
                                        <IntlMessages id="emailAPIManager.label.Priority">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={((this.state.ServiceTypeID === 2
                                                        ? (menudetail["DC54230D-11D4-91CA-9F9E-E2F4950E709F"] && menudetail["DC54230D-11D4-91CA-9F9E-E2F4950E709F"].AccessRight === "11E6E7B0")
                                                        : (menudetail["25C36F1F-8545-9B26-67B5-5E100D4D44EF"] && menudetail["25C36F1F-8545-9B26-67B5-5E100D4D44EF"].AccessRight === "11E6E7B0"))) ? true : false}
                                                    type="text" name="Priority" value={Priority}
                                                    id="Priority" placeholder={placeholder}
                                                    onChange={this.handleChange} />}
                                        </IntlMessages>
                                    </Col>}
                            </Row>
                        </FormGroup>

                        <FormGroup>
                            <Row>
                                {(this.state.ServiceTypeID === 2
                                    ? (menudetail["A231644D-7A14-7292-1059-EE388F283C24"] && menudetail["A231644D-7A14-7292-1059-EE388F283C24"].Visibility === "E925F86B") //A231644D-7A14-7292-1059-EE388F283C24
                                    : (menudetail["A558C227-38EF-3A21-1450-D2AE77A17437"] && menudetail["A558C227-38EF-3A21-1450-D2AE77A17437"].Visibility === "E925F86B")) && //A558C227-38EF-3A21-1450-D2AE77A17437
                                    <Col md={4}>
                                        <Label for="RequestID">
                                            {<IntlMessages id="emailAPIManager.label.RequestID" />}
                                        </Label>
                                        <div className="app-selectbox-sm">
                                            <Input
                                                disabled={((this.state.ServiceTypeID === 2
                                                    ? (menudetail["A231644D-7A14-7292-1059-EE388F283C24"] && menudetail["A231644D-7A14-7292-1059-EE388F283C24"].AccessRight === "11E6E7B0")
                                                    : (menudetail["A558C227-38EF-3A21-1450-D2AE77A17437"] && menudetail["A558C227-38EF-3A21-1450-D2AE77A17437"].AccessRight === "11E6E7B0"))) ? true : false}
                                                type="select" name="RequestID" value={RequestID} id="Select-2" onChange={this.handleChange}>
                                                <IntlMessages id="emailAPIManager.label.RequestID">
                                                    {(selectCurrency) =>
                                                        <option value="">{selectCurrency}</option>
                                                    }
                                                </IntlMessages>
                                                {requestForamts.map((format, key) =>
                                                    <option key={key} value={format.RequestID}>{format.RequestName}</option>
                                                )}
                                            </Input>
                                        </div>
                                    </Col>}
                                {(this.state.ServiceTypeID === 2
                                    ? (menudetail["94394994-1092-2E46-9989-1047E3445F6D"] && menudetail["94394994-1092-2E46-9989-1047E3445F6D"].Visibility === "E925F86B") //94394994-1092-2E46-9989-1047E3445F6D
                                    : (menudetail["9301754A-1DBE-A237-4672-5B554D9445B2"] && menudetail["9301754A-1DBE-A237-4672-5B554D9445B2"].Visibility === "E925F86B")) && //9301754A-1DBE-A237-4672-5B554D9445B2
                                    <Col md={4}>
                                        <Label for="ServiceName">
                                            {<IntlMessages id="emailAPIManager.label.ServiceName" />}
                                        </Label>
                                        <IntlMessages id="emailAPIManager.label.ServiceName">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={((this.state.ServiceTypeID === 2
                                                        ? (menudetail["94394994-1092-2E46-9989-1047E3445F6D"] && menudetail["94394994-1092-2E46-9989-1047E3445F6D"].AccessRight === "11E6E7B0")
                                                        : (menudetail["9301754A-1DBE-A237-4672-5B554D9445B2"] && menudetail["9301754A-1DBE-A237-4672-5B554D9445B2"].AccessRight === "11E6E7B0"))) ? true : false}
                                                    type="text" name="ServiceName" value={ServiceName}
                                                    id="ServiceName" placeholder={placeholder}
                                                    onChange={this.handleChange} />}
                                        </IntlMessages>
                                    </Col>}
                                {(this.state.ServiceTypeID === 2
                                    ? (menudetail["E4C0EBD8-659D-542B-42AF-6893AB951A44"] && menudetail["E4C0EBD8-659D-542B-42AF-6893AB951A44"].Visibility === "E925F86B") //E4C0EBD8-659D-542B-42AF-6893AB951A44
                                    : (menudetail["23DCEC79-3FEE-A3BA-2CD2-B9DD916B2E2C"] && menudetail["23DCEC79-3FEE-A3BA-2CD2-B9DD916B2E2C"].Visibility === "E925F86B")) && //23DCEC79-3FEE-A3BA-2CD2-B9DD916B2E2C
                                    <Col md={4}>
                                        <Label for="ParsingDataID">
                                            {<IntlMessages id="emailAPIManager.label.ParsingDataID" />}
                                        </Label>
                                        <Input
                                            disabled={((this.state.ServiceTypeID === 2
                                                ? (menudetail["E4C0EBD8-659D-542B-42AF-6893AB951A44"] && menudetail["E4C0EBD8-659D-542B-42AF-6893AB951A44"].AccessRight === "11E6E7B0")
                                                : (menudetail["23DCEC79-3FEE-A3BA-2CD2-B9DD916B2E2C"] && menudetail["23DCEC79-3FEE-A3BA-2CD2-B9DD916B2E2C"].AccessRight === "11E6E7B0"))) ? true : false}
                                            type="select" name="ParsingDataID" value={ParsingDataID} id="Select-2" onChange={this.handleChange}>
                                            <IntlMessages id="emailAPIManager.label.ParsingDataID">
                                                {(ParsingDataID) =>
                                                    <option value="">{ParsingDataID}</option>
                                                }
                                            </IntlMessages>
                                            {thirdPartyAPIResponses.map((response, key) =>
                                                <option key={key} value={response.Id}>{response.ResponseCodeRegex}</option>
                                            )}
                                        </Input>
                                    </Col>}
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                {(this.state.ServiceTypeID === 2
                                    ? (menudetail["0D46F1B0-993F-8135-3705-C0E60515019D"] && menudetail["0D46F1B0-993F-8135-3705-C0E60515019D"].Visibility === "E925F86B") //0D46F1B0-993F-8135-3705-C0E60515019D
                                    : (menudetail["2EA7EF09-0226-921E-137A-C92C59BFA002"] && menudetail["2EA7EF09-0226-921E-137A-C92C59BFA002"].Visibility === "E925F86B")) && //2EA7EF09-0226-921E-137A-C92C59BFA002
                                    <Col md={4}>
                                        <Label for="SerproName">
                                            {<IntlMessages id="emailAPIManager.label.SerproName" />}
                                        </Label>
                                        <IntlMessages id="emailAPIManager.label.SerproName">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={((this.state.ServiceTypeID === 2
                                                        ? (menudetail["0D46F1B0-993F-8135-3705-C0E60515019D"] && menudetail["0D46F1B0-993F-8135-3705-C0E60515019D"].AccessRight === "11E6E7B0")
                                                        : (menudetail["2EA7EF09-0226-921E-137A-C92C59BFA002"] && menudetail["2EA7EF09-0226-921E-137A-C92C59BFA002"].AccessRight === "11E6E7B0"))) ? true : false}
                                                    type="text" name="SerproName" value={SerproName}
                                                    id="SerproName" placeholder={placeholder}
                                                    onChange={this.handleChange} />}
                                        </IntlMessages>
                                    </Col>}
                                {(this.state.ServiceTypeID === 2
                                    ? (menudetail["64E47C8A-4817-501A-A469-E9379F1F4A3D"] && menudetail["64E47C8A-4817-501A-A469-E9379F1F4A3D"].Visibility === "E925F86B") //64E47C8A-4817-501A-A469-E9379F1F4A3D
                                    : (menudetail["BCCC7443-8DB0-67E1-4A1D-A8A419378E15"] && menudetail["BCCC7443-8DB0-67E1-4A1D-A8A419378E15"].Visibility === "E925F86B")) && //BCCC7443-8DB0-67E1-4A1D-A8A419378E15
                                    <Col md={4}>
                                        <Label for="UserID" sm={4}>
                                            {<IntlMessages id="emailAPIManager.label.UserID" />}
                                        </Label>
                                        <IntlMessages id="emailAPIManager.label.UserID">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={((this.state.ServiceTypeID === 2
                                                        ? (menudetail["64E47C8A-4817-501A-A469-E9379F1F4A3D"] && menudetail["64E47C8A-4817-501A-A469-E9379F1F4A3D"].AccessRight === "11E6E7B0")
                                                        : (menudetail["BCCC7443-8DB0-67E1-4A1D-A8A419378E15"] && menudetail["BCCC7443-8DB0-67E1-4A1D-A8A419378E15"].AccessRight === "11E6E7B0"))) ? true : false}
                                                    type="text" name="UserID" value={UserID}
                                                    id="UserID" placeholder={placeholder}
                                                    onChange={this.handleChange} />
                                            }
                                        </IntlMessages>
                                    </Col>}
                                {(this.state.ServiceTypeID === 2
                                    ? (menudetail["0B97B1F3-3C96-2D40-03BB-57EC86A2954D"] && menudetail["0B97B1F3-3C96-2D40-03BB-57EC86A2954D"].Visibility === "E925F86B") //0B97B1F3-3C96-2D40-03BB-57EC86A2954D
                                    : (menudetail["9601DF66-01FD-5EF7-A45C-C6D2789A9176"] && menudetail["9601DF66-01FD-5EF7-A45C-C6D2789A9176"].Visibility === "E925F86B")) && //9601DF66-01FD-5EF7-A45C-C6D2789A9176
                                    <Col md={4}>
                                        <Label for="Password">
                                            {<IntlMessages id="emailAPIManager.label.Password" />}
                                        </Label>
                                        <IntlMessages id="emailAPIManager.label.Password">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={((this.state.ServiceTypeID === 2
                                                        ? (menudetail["0B97B1F3-3C96-2D40-03BB-57EC86A2954D"] && menudetail["0B97B1F3-3C96-2D40-03BB-57EC86A2954D"].AccessRight === "11E6E7B0")
                                                        : (menudetail["9601DF66-01FD-5EF7-A45C-C6D2789A9176"] && menudetail["9601DF66-01FD-5EF7-A45C-C6D2789A9176"].AccessRight === "11E6E7B0"))) ? true : false}
                                                    type="password" name="Password"
                                                    // value={Password} //Added By Bharat Jograna
                                                    id="Password" placeholder={placeholder}
                                                    onChange={this.handleChange} />}
                                        </IntlMessages>
                                    </Col>}
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                {(this.state.ServiceTypeID === 2
                                    ? (menudetail["57B1FABE-4549-3EC6-4525-702C8DBC54C4"] && menudetail["57B1FABE-4549-3EC6-4525-702C8DBC54C4"].Visibility === "E925F86B") //57B1FABE-4549-3EC6-4525-702C8DBC54C4
                                    : (menudetail["B0E52BAB-3434-2E8C-5300-1A0C86308DC8"] && menudetail["B0E52BAB-3434-2E8C-5300-1A0C86308DC8"].Visibility === "E925F86B")) && //B0E52BAB-3434-2E8C-5300-1A0C86308DC8
                                    <Col md={4}>
                                        <Label for="Status">
                                            {<IntlMessages id="emailAPIManager.label.Status" />}
                                        </Label>
                                        <Input
                                            disabled={((this.state.ServiceTypeID === 2
                                                ? (menudetail["57B1FABE-4549-3EC6-4525-702C8DBC54C4"] && menudetail["57B1FABE-4549-3EC6-4525-702C8DBC54C4"].AccessRight === "11E6E7B0")
                                                : (menudetail["B0E52BAB-3434-2E8C-5300-1A0C86308DC8"] && menudetail["B0E52BAB-3434-2E8C-5300-1A0C86308DC8"].AccessRight === "11E6E7B0"))) ? true : false}
                                            type="select" name="Status" value={Status} id="Select-2" onChange={this.handleChange}>
                                            <IntlMessages id="emailAPIManager.label.Status">
                                                {(Status) =>
                                                    <option value="">{Status}</option>
                                                }
                                            </IntlMessages>
                                            <IntlMessages id="emailAPIManager.label.Status.enable">
                                                {(enable) =>
                                                    <option value="1">{enable}</option>
                                                }
                                            </IntlMessages>
                                            <IntlMessages id="emailAPIManager.label.Status.disable">
                                                {(disable) =>
                                                    <option value="0">{disable}</option>
                                                }
                                            </IntlMessages>
                                        </Input>
                                    </Col>}
                            </Row>
                        </FormGroup>
                    </Form>

                    {(menudetail) &&
                        <Row>
                            <Button
                                variant="raised"
                                color="primary"
                                className="text-white mr-10"
                                onClick={() => this.onAddEmailApi()}
                                disabled={this.props.loading}
                            >
                                <IntlMessages id="emailAPIManager.button.add" />
                            </Button>
                            {/* Added By Megha Kariya (21/02/2019) */}
                            <Button
                                className="text-white text-bold btn mr-10 btn bg-danger text-white"
                                variant="raised"
                                onClick={this.toggleDrawer}
                                disabled={this.props.loading}
                            >
                                <IntlMessages id="emailAPIManager.button.cancel" />
                            </Button>
                        </Row>}
                </div>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ EmailApiManager, authTokenRdcer }) => {
    const response = {
        AddResponse: EmailApiManager.AddResponse,
        loading: EmailApiManager.loading,
        error: EmailApiManager.AddError,
        RequestFormatResponse: EmailApiManager.RequestFormatResponse,
        ThirdPartyAPIResponse: EmailApiManager.ThirdPartyAPIResponse,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
    };
    return response;
};

export default connect(
    mapStateToProps,
    {
        addEmailApiRequest,
        getEmailApiList,
        getAllRequestFormat,
        getAllThirdPartyAPIRespose,
        getMenuPermissionByID,
    }
)(AddEmailAPI);