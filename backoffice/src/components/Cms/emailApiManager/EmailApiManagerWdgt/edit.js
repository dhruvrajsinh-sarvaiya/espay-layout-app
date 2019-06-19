/* 
    Created By : Megha Kariya (actual develop by Jineshbhai)
    Date : 20-02-2019
    Description : Edit form of CMS Email API manager
*/
import React, { Component, Fragment } from "react";
import { Badge, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import Button from '@material-ui/core/Button';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { connect } from "react-redux";
import { editEmailApiRequest, getEmailApiList, getAllRequestFormat, getAllThirdPartyAPIRespose } from "Actions/EmailApiManager";
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

class EditEmailApi extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            APID: props.EmailApiDetail.APID,
            SenderID: props.EmailApiDetail.SenderID,
            SendURL: props.EmailApiDetail.SendURL,
            Priority: props.EmailApiDetail.Priority,
            RequestID: props.EmailApiDetail.RequestID,
            ServiceName: props.EmailApiDetail.ServiceName,
            UserID: props.EmailApiDetail.UserID,
            Password: props.EmailApiDetail.Password,
            ParsingDataID: props.EmailApiDetail.ParsingDataID,
            ServiceTypeID: props.type,
            ServiceID: props.EmailApiDetail.ServiceID,
            SerproID: props.EmailApiDetail.SerproID,
            SerproName: props.EmailApiDetail.SerproName,
            Status: 1,//props.EmailApiDetail.SerproName,
            errors: {},
            open: false,
            isAPICall: false,
            requestFormats: {},
            thirdPartyAPIResponses: {},
            validateBit: 2, // for 1 add 2 edit // Change By Megha Kariya (21/02/2019) : set 2 in place of 1
            fieldList: {},
            GUID: this.props.GUID,
            menudetail: [],
            Pflag: true,
        };
        this.initState = this.state; // Added By Megha Kariya (21/02/2019)
        this.onEditEmailApi = this.onEditEmailApi.bind(this);
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

        this.setState({
            APID: nextProps.EmailApiDetail.APID,
            SenderID: nextProps.EmailApiDetail.SenderID,
            SendURL: nextProps.EmailApiDetail.SendURL,
            Priority: nextProps.EmailApiDetail.Priority,
            RequestID: nextProps.EmailApiDetail.RequestID,
            ServiceName: nextProps.EmailApiDetail.ServiceName,
            UserID: nextProps.EmailApiDetail.UserID,
            Password: nextProps.EmailApiDetail.Password,
            ParsingDataID: nextProps.EmailApiDetail.ParsingDataID,
            ServiceTypeID: this.props.type,
            ServiceID: nextProps.EmailApiDetail.ServiceID,
            SerproID: nextProps.EmailApiDetail.SerproID,
            SerproName: nextProps.EmailApiDetail.SerproName,
            Status: nextProps.EmailApiDetail.status, // Change By Megha Kariya (21/02/2019)
            // Status: 1,
        });

        if (nextProps.EditResponse && typeof nextProps.EditResponse !== 'undefined' && nextProps.EditResponse.ReturnCode == 0 && this.state.isAPICall == true) {
            NotificationManager.success(<IntlMessages id="emailApiManager.Status.Success.edit" />);
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



    onEditEmailApi() {
        const {
            APID,
            SenderID,
            SendURL,
            Priority,
            RequestID,
            ServiceName,
            UserID,
            Password,
            ParsingDataID,
            ServiceTypeID,
            ServiceID,
            SerproID,
            SerproName,
            Status,
        } = this.state;

        const { errors, isValid } = validateEmailAPI(this.state);
        Object.keys(errors).forEach(function (item) {
            NotificationManager.error(<IntlMessages id={errors[item]} />);
        });
        this.setState({ isAPICall: true });
        if (isValid) {
            this.props.editEmailApiRequest({
                emailRequest:
                {
                    APID,
                    SenderID,
                    SendURL,
                    Priority,
                    RequestID,
                    ServiceName,
                    UserID,
                    Password,
                    ParsingDataID,
                    ServiceTypeID,
                    ServiceID,
                    SerproID,
                    SerproName,
                    Status,
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
        var menudetail = this.checkAndGetMenuAccessDetail(this.state.GUID === 'AB309E3D-0BBA-28E9-A2C7-3D1DB99451AA' ? 'F63D4918-2989-62EC-10F9-A842BEE20049' : '2255B961-452F-2DB5-2483-AF9F46387F30');
        const { drawerClose } = this.props;
        const requestForamts = typeof this.state.requestFormats.Result !== 'undefined' ? this.state.requestFormats.Result : [];
        const thirdPartyAPIResponses = typeof this.state.thirdPartyAPIResponses.Response !== 'undefined' ? this.state.thirdPartyAPIResponses.Response : [];
        const {
            SenderID,
            SendURL,
            Priority,
            ServiceName,
            UserID,
            Password,
            SerproName,
            Status,
            errors
        } = this.state;

        return (
            <div className="jbs-page-content">
                <div className="jbs-page-content col-md-12 mx-auto">
                    <div className="m-20 page-title d-flex justify-content-between align-items-center">
                        <div className="page-title-wrap">
                            <h2><IntlMessages id={this.state.ServiceTypeID === 2 ? "emailAPIManager.editEmailAPI" : "emailAPIManager.editSMSAPI"} /></h2>
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
                                    ? (menudetail["D339E076-68DD-043C-63BB-E9CDC8249D70"] && menudetail["D339E076-68DD-043C-63BB-E9CDC8249D70"].Visibility === "E925F86B") //D339E076-68DD-043C-63BB-E9CDC8249D70
                                    : (menudetail["61E29ACA-1F58-2194-7628-C66096588E51"] && menudetail["61E29ACA-1F58-2194-7628-C66096588E51"].Visibility === "E925F86B")) && //61E29ACA-1F58-2194-7628-C66096588E51
                                    <Col md={4}>
                                        <Label for="SenderID" sm={4}>
                                            {<IntlMessages id="emailAPIManager.label.SenderID" />}
                                        </Label>
                                        <IntlMessages id="emailAPIManager.label.SenderID">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={((this.state.ServiceTypeID === 2
                                                        ? (menudetail["D339E076-68DD-043C-63BB-E9CDC8249D70"] && menudetail["D339E076-68DD-043C-63BB-E9CDC8249D70"].AccessRight === "11E6E7B0")
                                                        : (menudetail["61E29ACA-1F58-2194-7628-C66096588E51"] && menudetail["61E29ACA-1F58-2194-7628-C66096588E51"].AccessRight === "11E6E7B0"))) ? true : false}
                                                    type="text" name="SenderID" value={SenderID}
                                                    id="SenderID" placeholder={placeholder}
                                                    onChange={this.handleChange} />
                                            }
                                        </IntlMessages>
                                    </Col>}
                                {(this.state.ServiceTypeID === 2
                                    ? (menudetail["740AFC7D-9158-2F27-9C32-C0DFFD3B46CD"] && menudetail["740AFC7D-9158-2F27-9C32-C0DFFD3B46CD"].Visibility === "E925F86B") //740AFC7D-9158-2F27-9C32-C0DFFD3B46CD
                                    : (menudetail["05AECF3D-3FB6-1457-8050-05C0B61F0ADA"] && menudetail["05AECF3D-3FB6-1457-8050-05C0B61F0ADA"].Visibility === "E925F86B")) && //05AECF3D-3FB6-1457-8050-05C0B61F0ADA
                                    <Col md={4}>
                                        <Label for="SendURL">
                                            {<IntlMessages id="emailAPIManager.label.SendURL" />}
                                        </Label>
                                        <IntlMessages id="emailAPIManager.label.SendURL">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={((this.state.ServiceTypeID === 2
                                                        ? (menudetail["740AFC7D-9158-2F27-9C32-C0DFFD3B46CD"] && menudetail["740AFC7D-9158-2F27-9C32-C0DFFD3B46CD"].AccessRight === "11E6E7B0")
                                                        : (menudetail["05AECF3D-3FB6-1457-8050-05C0B61F0ADA"] && menudetail["05AECF3D-3FB6-1457-8050-05C0B61F0ADA"].AccessRight === "11E6E7B0"))) ? true : false}
                                                    type="text" name="SendURL" value={SendURL}
                                                    id="SendURL" placeholder={placeholder}
                                                    onChange={this.handleChange} />}
                                        </IntlMessages>
                                    </Col>}
                                {(this.state.ServiceTypeID === 2
                                    ? (menudetail["BA160349-76CB-9DF9-299B-A323EADE09FA"] && menudetail["BA160349-76CB-9DF9-299B-A323EADE09FA"].Visibility === "E925F86B") //BA160349-76CB-9DF9-299B-A323EADE09FA
                                    : (menudetail["ACE6652B-1625-4E4D-50C6-079E286C3FD1"] && menudetail["ACE6652B-1625-4E4D-50C6-079E286C3FD1"].Visibility === "E925F86B")) && //ACE6652B-1625-4E4D-50C6-079E286C3FD1
                                    <Col md={4}>
                                        <Label for="Priority">
                                            {<IntlMessages id="emailAPIManager.label.Priority" />}
                                        </Label>
                                        <IntlMessages id="emailAPIManager.label.Priority">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={((this.state.ServiceTypeID === 2
                                                        ? (menudetail["BA160349-76CB-9DF9-299B-A323EADE09FA"] && menudetail["BA160349-76CB-9DF9-299B-A323EADE09FA"].AccessRight === "11E6E7B0")
                                                        : (menudetail["ACE6652B-1625-4E4D-50C6-079E286C3FD1"] && menudetail["ACE6652B-1625-4E4D-50C6-079E286C3FD1"].AccessRight === "11E6E7B0"))) ? true : false}
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
                                    ? (menudetail["45293D22-204B-1EDC-59CB-21F5123B682C"] && menudetail["45293D22-204B-1EDC-59CB-21F5123B682C"].Visibility === "E925F86B") //45293D22-204B-1EDC-59CB-21F5123B682C
                                    : (menudetail["9330FB9B-3E06-1658-6063-D125D8572C2F"] && menudetail["9330FB9B-3E06-1658-6063-D125D8572C2F"].Visibility === "E925F86B")) && //9330FB9B-3E06-1658-6063-D125D8572C2F
                                    <Col md={4}>
                                        <Label for="RequestID">
                                            {<IntlMessages id="emailAPIManager.label.RequestID" />}
                                        </Label>
                                        <div className="app-selectbox-sm">
                                            <Input
                                                disabled={((this.state.ServiceTypeID === 2
                                                    ? (menudetail["45293D22-204B-1EDC-59CB-21F5123B682C"] && menudetail["45293D22-204B-1EDC-59CB-21F5123B682C"].AccessRight === "11E6E7B0")
                                                    : (menudetail["9330FB9B-3E06-1658-6063-D125D8572C2F"] && menudetail["9330FB9B-3E06-1658-6063-D125D8572C2F"].AccessRight === "11E6E7B0"))) ? true : false}
                                                type="select" name="RequestID" value={this.state.RequestID} id="Select-2" onChange={this.handleChange}>
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
                                    ? (menudetail["A781202E-4EE5-752B-92B4-3405A27D1F0A"] && menudetail["A781202E-4EE5-752B-92B4-3405A27D1F0A"].Visibility === "E925F86B") //A781202E-4EE5-752B-92B4-3405A27D1F0A
                                    : (menudetail["FF942DB5-2391-8482-4F35-7E47803C01E1"] && menudetail["FF942DB5-2391-8482-4F35-7E47803C01E1"].Visibility === "E925F86B")) && //FF942DB5-2391-8482-4F35-7E47803C01E1
                                    <Col md={4}>
                                        <Label for="ServiceName">
                                            {<IntlMessages id="emailAPIManager.label.ServiceName" />}
                                        </Label>
                                        <IntlMessages id="emailAPIManager.label.ServiceName">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={((this.state.ServiceTypeID === 2
                                                        ? (menudetail["A781202E-4EE5-752B-92B4-3405A27D1F0A"] && menudetail["A781202E-4EE5-752B-92B4-3405A27D1F0A"].AccessRight === "11E6E7B0")
                                                        : (menudetail["FF942DB5-2391-8482-4F35-7E47803C01E1"] && menudetail["FF942DB5-2391-8482-4F35-7E47803C01E1"].AccessRight === "11E6E7B0"))) ? true : false}
                                                    type="text" name="ServiceName" value={ServiceName}
                                                    id="ServiceName" placeholder={placeholder}
                                                    onChange={this.handleChange} />}
                                        </IntlMessages>
                                    </Col>}
                                {(this.state.ServiceTypeID === 2
                                    ? (menudetail["3479D1FA-5AE2-20AE-7DEB-090924054328"] && menudetail["3479D1FA-5AE2-20AE-7DEB-090924054328"].Visibility === "E925F86B") //3479D1FA-5AE2-20AE-7DEB-090924054328
                                    : (menudetail["C12875F3-8FD8-7AFC-6A81-5D3C68DE87E9"] && menudetail["C12875F3-8FD8-7AFC-6A81-5D3C68DE87E9"].Visibility === "E925F86B")) && //C12875F3-8FD8-7AFC-6A81-5D3C68DE87E9
                                    <Col md={4}>
                                        <Label for="ParsingDataID">
                                            {<IntlMessages id="emailAPIManager.label.ParsingDataID" />}
                                        </Label>
                                        <Input
                                            disabled={((this.state.ServiceTypeID === 2
                                                ? (menudetail["3479D1FA-5AE2-20AE-7DEB-090924054328"] && menudetail["3479D1FA-5AE2-20AE-7DEB-090924054328"].AccessRight === "11E6E7B0")
                                                : (menudetail["C12875F3-8FD8-7AFC-6A81-5D3C68DE87E9"] && menudetail["C12875F3-8FD8-7AFC-6A81-5D3C68DE87E9"].AccessRight === "11E6E7B0"))) ? true : false}
                                            type="select" name="ParsingDataID" value={this.state.ParsingDataID} id="Select-2" onChange={this.handleChange}>
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
                                    ? (menudetail["7818C56A-785A-7B26-66FC-D7E150F009C0"] && menudetail["7818C56A-785A-7B26-66FC-D7E150F009C0"].Visibility === "E925F86B") //7818C56A-785A-7B26-66FC-D7E150F009C0
                                    : (menudetail["868C2ABF-3A54-19F4-552A-AA00D19F4E13"] && menudetail["868C2ABF-3A54-19F4-552A-AA00D19F4E13"].Visibility === "E925F86B")) && //868C2ABF-3A54-19F4-552A-AA00D19F4E13
                                    <Col md={4}>
                                        <Label for="SerproName">
                                            {<IntlMessages id="emailAPIManager.label.SerproName" />}
                                        </Label>
                                        <IntlMessages id="emailAPIManager.label.SerproName">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={((this.state.ServiceTypeID === 2
                                                        ? (menudetail["7818C56A-785A-7B26-66FC-D7E150F009C0"] && menudetail["7818C56A-785A-7B26-66FC-D7E150F009C0"].AccessRight === "11E6E7B0")
                                                        : (menudetail["868C2ABF-3A54-19F4-552A-AA00D19F4E13"] && menudetail["868C2ABF-3A54-19F4-552A-AA00D19F4E13"].AccessRight === "11E6E7B0"))) ? true : false}
                                                    type="text" name="SerproName" value={SerproName}
                                                    id="SerproName" placeholder={placeholder}
                                                    onChange={this.handleChange} />}
                                        </IntlMessages>
                                    </Col>}
                                {(this.state.ServiceTypeID === 2
                                    ? (menudetail["CD691831-30D0-3337-0BD7-CF9BAADC2C5E"] && menudetail["CD691831-30D0-3337-0BD7-CF9BAADC2C5E"].Visibility === "E925F86B") //CD691831-30D0-3337-0BD7-CF9BAADC2C5E
                                    : (menudetail["83168CAD-509D-3F22-6CE7-CF545E98857D"] && menudetail["83168CAD-509D-3F22-6CE7-CF545E98857D"].Visibility === "E925F86B")) && //83168CAD-509D-3F22-6CE7-CF545E98857D
                                    <Col md={4}>
                                        <Label for="UserID" sm={4}>
                                            {<IntlMessages id="emailAPIManager.label.UserID" />}
                                        </Label>
                                        <IntlMessages id="emailAPIManager.label.UserID">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={((this.state.ServiceTypeID === 2
                                                        ? (menudetail["CD691831-30D0-3337-0BD7-CF9BAADC2C5E"] && menudetail["CD691831-30D0-3337-0BD7-CF9BAADC2C5E"].AccessRight === "11E6E7B0")
                                                        : (menudetail["83168CAD-509D-3F22-6CE7-CF545E98857D"] && menudetail["83168CAD-509D-3F22-6CE7-CF545E98857D"].AccessRight === "11E6E7B0"))) ? true : false}
                                                    type="text" name="UserID" value={UserID}
                                                    id="UserID" placeholder={placeholder}
                                                    onChange={this.handleChange} />
                                            }
                                        </IntlMessages>
                                    </Col>}
                                {(this.state.ServiceTypeID === 2
                                    ? (menudetail["364A3AA6-9361-7E98-A475-704FDEA2401B"] && menudetail["364A3AA6-9361-7E98-A475-704FDEA2401B"].Visibility === "E925F86B") //364A3AA6-9361-7E98-A475-704FDEA2401B
                                    : (menudetail["FFE97E0A-1F7E-85AE-6AC6-6BF5AE9E1701"] && menudetail["FFE97E0A-1F7E-85AE-6AC6-6BF5AE9E1701"].Visibility === "E925F86B")) && //FFE97E0A-1F7E-85AE-6AC6-6BF5AE9E1701
                                    <Col md={4}>
                                        <Label for="Password">
                                            {<IntlMessages id="emailAPIManager.label.Password" />}
                                        </Label>
                                        <IntlMessages id="emailAPIManager.label.Password">
                                            {(placeholder) =>
                                                <Input
                                                    disabled={((this.state.ServiceTypeID === 2
                                                        ? (menudetail["364A3AA6-9361-7E98-A475-704FDEA2401B"] && menudetail["364A3AA6-9361-7E98-A475-704FDEA2401B"].AccessRight === "11E6E7B0")
                                                        : (menudetail["FFE97E0A-1F7E-85AE-6AC6-6BF5AE9E1701"] && menudetail["FFE97E0A-1F7E-85AE-6AC6-6BF5AE9E1701"].AccessRight === "11E6E7B0"))) ? true : false}
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
                                    ? (menudetail["BEF6CEAF-1D1C-4222-1680-AE81556B7C47"] && menudetail["BEF6CEAF-1D1C-4222-1680-AE81556B7C47"].Visibility === "E925F86B") //BEF6CEAF-1D1C-4222-1680-AE81556B7C47
                                    : (menudetail["E82BC06C-9151-9657-3879-BCBEEFB98B3B"] && menudetail["E82BC06C-9151-9657-3879-BCBEEFB98B3B"].Visibility === "E925F86B")) && //E82BC06C-9151-9657-3879-BCBEEFB98B3B
                                    <Col md={4}>
                                        <Label for="Status">
                                            {<IntlMessages id="emailAPIManager.label.Status" />}
                                        </Label>
                                        <Input
                                            disabled={((this.state.ServiceTypeID === 2
                                                ? (menudetail["BEF6CEAF-1D1C-4222-1680-AE81556B7C47"] && menudetail["BEF6CEAF-1D1C-4222-1680-AE81556B7C47"].AccessRight === "11E6E7B0")
                                                : (menudetail["E82BC06C-9151-9657-3879-BCBEEFB98B3B"] && menudetail["E82BC06C-9151-9657-3879-BCBEEFB98B3B"].AccessRight === "11E6E7B0"))) ? true : false}
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
                                onClick={() => this.onEditEmailApi()}
                                disabled={this.props.loading}
                            >
                                <IntlMessages id="emailAPIManager.button.edit" />
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
        EditResponse: EmailApiManager.EditResponse,
        loading: EmailApiManager.loading,
        error: EmailApiManager.EditError,
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
        editEmailApiRequest,
        getEmailApiList,
        getAllRequestFormat,
        getAllThirdPartyAPIRespose,
        getMenuPermissionByID,
    }
)(EditEmailApi);