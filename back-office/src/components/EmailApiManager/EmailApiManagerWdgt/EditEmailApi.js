/**
 * CreatedBy : Jinesh Bhatt
 * Date : 08-01-2019
 * Edit Email API
 */
import React, { Component } from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import Button from '@material-ui/core/Button';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { connect } from "react-redux";
import { editEmailApiRequest, getEmailApiList, getAllRequestFormat, getAllThirdPartyAPIRespose } from "Actions/EmailApiManager";
import { NotificationManager } from "react-notifications";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
const validateEmailAPI = require("../../../validation/EmailApiManager/editEmailApi");
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
            validateBit: 1, // for 1 add 2 edit
        };
        this.onEditEmailApi = this.onEditEmailApi.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.props.getAllRequestFormat({});
        this.props.getAllThirdPartyAPIRespose({});
    }

    componentWillReceiveProps(nextProps) {
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
            Status: 1,
        });

        if ( nextProps.EditResponse !== undefined && nextProps.EditResponse &&  nextProps.EditResponse.ReturnCode == 0 && this.state.isAPICall == true) {
            NotificationManager.success(<IntlMessages id="emailApiManager.Status.Success.edit" />);
            this.setState({
                open: false,
                isAPICall: false
            });
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
        this.setState({
            open: this.state.open ? false : true,
            componentName: ''
        })
    };

    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: this.state.open ? false : true,
        });
    };

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    changeDefault = (index) => {
        this.setState({ defaultIndex: index });
    };

    render() {
        const { drawerClose } = this.props;
        const requestForamts = typeof this.state.requestFormats.Result !== 'undefined' ? this.state.requestFormats.Result : [];
        const thirdPartyAPIResponses = typeof this.state.thirdPartyAPIResponses.Response !== 'undefined' ? this.state.thirdPartyAPIResponses.Response : [];
        const {
            SenderID,
            SendURL,
            Priority,
            ServiceName,
            UserID,
            SerproName,
            Status,
        } = this.state;
        return (
            <React.Fragment>
                <JbsCollapsibleCard>
                    <div className="m-20 page-title d-flex justify-content-between align-items-center">
                        <div className="page-title-wrap">
                            <h2><IntlMessages id={this.state.ServiceTypeID === 2 ? "emailAPIManager.editEmailAPI" : "emailAPIManager.editSMSAPI"} /></h2>
                        </div>
                        <div className="page-title-wrap">
                            <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab"
                                mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
                            <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini
                                onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                        </div>
                    </div>
                    {this.props.loading && <JbsSectionLoader />}
                    <Row>
                        <Col md={12}>
                            <Form className="m-10">
                                <FormGroup>
                                    <Row>
                                        <Col md={4}>
                                            <Label for="SenderID" sm={4}>
                                                {<IntlMessages id="emailAPIManager.label.SenderID" />}
                                            </Label>
                                            <IntlMessages id="emailAPIManager.label.SenderID">
                                                {(placeholder) =>
                                                    <Input type="text" name="SenderID" value={SenderID}
                                                        id="SenderID" placeholder={placeholder}
                                                        onChange={this.handleChange} />
                                                }
                                            </IntlMessages>
                                        </Col>
                                        <Col md={4}>
                                            <Label for="SendURL">
                                                {<IntlMessages id="emailAPIManager.label.SendURL" />}
                                            </Label>
                                            <IntlMessages id="emailAPIManager.label.SendURL">
                                                {(placeholder) =>
                                                    <Input type="text" name="SendURL" value={SendURL}
                                                        id="SendURL" placeholder={placeholder}
                                                        onChange={this.handleChange} />}
                                            </IntlMessages>
                                        </Col>
                                        <Col md={4}>
                                            <Label for="Priority">
                                                {<IntlMessages id="emailAPIManager.label.Priority" />}
                                            </Label>
                                            <IntlMessages id="emailAPIManager.label.Priority">
                                                {(placeholder) =>
                                                    <Input type="text" name="Priority" value={Priority}
                                                        id="Priority" placeholder={placeholder}
                                                        onChange={this.handleChange} />}
                                            </IntlMessages>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Col md={4}>
                                            <Label for="RequestID">
                                                {<IntlMessages id="emailAPIManager.label.RequestID" />}
                                            </Label>
                                            <div className="app-selectbox-sm">
                                                <Input type="select" name="RequestID" value={this.state.RequestID} id="Select-2" onChange={this.handleChange}>
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
                                        </Col>
                                        <Col md={4}>
                                            <Label for="ServiceName">
                                                {<IntlMessages id="emailAPIManager.label.ServiceName" />}
                                            </Label>
                                            <IntlMessages id="emailAPIManager.label.ServiceName">
                                                {(placeholder) =>
                                                    <Input type="text" name="ServiceName" value={ServiceName}
                                                        id="ServiceName" placeholder={placeholder}
                                                        onChange={this.handleChange} />}
                                            </IntlMessages>
                                        </Col>
                                        <Col md={4}>
                                            <Label for="ParsingDataID">
                                                {<IntlMessages id="emailAPIManager.label.ParsingDataID" />}
                                            </Label>
                                            <Input type="select" name="ParsingDataID" value={this.state.ParsingDataID} id="Select-2" onChange={this.handleChange}>
                                                <IntlMessages id="emailAPIManager.label.ParsingDataID">
                                                    {(ParsingDataID) =>
                                                        <option value="">{ParsingDataID}</option>
                                                    }
                                                </IntlMessages>
                                                {thirdPartyAPIResponses.map((response, key) =>
                                                    <option key={key} value={response.Id}>{response.ResponseCodeRegex}</option>
                                                )}
                                            </Input>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Col md={4}>
                                            <Label for="SerproName">
                                                {<IntlMessages id="emailAPIManager.label.SerproName" />}
                                            </Label>
                                            <IntlMessages id="emailAPIManager.label.SerproName">
                                                {(placeholder) =>
                                                    <Input type="text" name="SerproName" value={SerproName}
                                                        id="SerproName" placeholder={placeholder}
                                                        onChange={this.handleChange} />}
                                            </IntlMessages>
                                        </Col>
                                        <Col md={4}>
                                            <Label for="UserID" sm={4}>
                                                {<IntlMessages id="emailAPIManager.label.UserID" />}
                                            </Label>
                                            <IntlMessages id="emailAPIManager.label.UserID">
                                                {(placeholder) =>
                                                    <Input type="text" name="UserID" value={UserID}
                                                        id="UserID" placeholder={placeholder}
                                                        onChange={this.handleChange} />
                                                }
                                            </IntlMessages>
                                        </Col>
                                        <Col md={4}>
                                            <Label for="Password">
                                                {<IntlMessages id="emailAPIManager.label.Password" />}
                                            </Label>
                                            <IntlMessages id="emailAPIManager.label.Password">
                                                {(placeholder) =>
                                                    <Input type="password" name="Password"
                                                        // value={Password} //Added By Bharat Jograna
                                                        id="Password" placeholder={placeholder}
                                                        onChange={this.handleChange} />}
                                            </IntlMessages>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Col md={4}>
                                            <Label for="Status">
                                                {<IntlMessages id="emailAPIManager.label.Status" />}
                                            </Label>
                                            <Input type="select" name="Status" value={Status} id="Select-2" onChange={this.handleChange}>
                                                <IntlMessages id="emailAPIManager.label.Status">
                                                    {(lblStatus) =>
                                                        <option value="">{lblStatus}</option>
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
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </Form>
                            <Row>
                                <Col md={2} className="offset-md-10">
                                    <Button
                                        variant="raised"
                                        color="primary"
                                        className="text-white"
                                        onClick={() => this.onEditEmailApi()}
                                        disabled={this.props.loading}
                                    >
                                        <IntlMessages id="emailAPIManager.button.edit" />
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </JbsCollapsibleCard>
            </React.Fragment>
        );
    }
}

// map state to props
const mapStateToProps = ({ EmailApiManager }) => {
    const response = {
        EditResponse: EmailApiManager.EditResponse,
        loading: EmailApiManager.loading,
        error: EmailApiManager.EditError,
        RequestFormatResponse: EmailApiManager.RequestFormatResponse,
        ThirdPartyAPIResponse: EmailApiManager.ThirdPartyAPIResponse
    };
    return response;
};

export default connect(mapStateToProps,{
    editEmailApiRequest,
    getEmailApiList,
    getAllRequestFormat,
    getAllThirdPartyAPIRespose
})(EditEmailApi);