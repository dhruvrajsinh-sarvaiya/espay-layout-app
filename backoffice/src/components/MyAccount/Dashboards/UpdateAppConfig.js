import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Form, Input, Label, Col, Alert, Row } from "reactstrap";
import FormGroup from "@material-ui/core/FormGroup";
import MatButton from "@material-ui/core/Button";
import IntlMessages from "Util/IntlMessages";

import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { DashboardPageTitle } from './DashboardPageTitle';
import { getApplicationList, getApplicationById, getAppDomainData, getAllApplicationData, updateApplicationData } from 'Actions/MyAccount';

//Validation
const validateUpdateApplicationConfig = require("../../../validation/MyAccount/update_Application_Config");
class UpdateAppConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: null,
            errors: "",
            PageIndex: 0,
            PAGE_SIZE: 100,
            showError: false,
            showSuccess: false,
            responseMessage: "",
            check: true
        };
        this.initState = this.state;
        this.resetData = this.resetData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.OnEditApp = this.OnEditApp.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({
            check: !this.state.check
        })
    }

    resetData() {
        this.setState(this.initState);
        this.props.drawerClose();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    };

    handleChange(key, value) {
        this.setState({
            data: {
                ...this.state.data,
                [key]: value
            }
        });
    }

    getListApplication() {
        const reqObj = {
            PageIndex: this.state.PageIndex,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        this.props.getApplicationList(reqObj);
    }

    OnEditApp() {
        const dataObj = {
            ...this.state.data,
            JWTExpiration: '' + this.state.data.JWTExpiration
        }
        const { errors, isValid } = validateUpdateApplicationConfig(dataObj);
        this.setState({ errors: errors });
        if (isValid) {
            const { data } = this.state;
            var obj = {
                Id: data.Id,
                AppName: data.AppName,
                DomainId: data.DomainId,
                ClientSecret: data.ClientSecret,
                Description: data.Description,
                ApplicationLogo: data.ApplicationLogo,
                AppId: data.AppId,
                AllowedCallBackURLS: data.AllowedCallBackURLS,
                AllowedWebOrigins: data.AllowedWebOrigins,
                AllowedLogoutURLS: data.AllowedLogoutURLS,
                AllowedOriginsCORS: data.AllowedOriginsCORS,
                JWTExpiration: parseInt(data.JWTExpiration)
            }
            this.props.updateApplicationData(obj);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.ApplicationByID.UserWiseAppData) {
            this.setState({ data: nextProps.ApplicationByID.UserWiseAppData })
        }
        if (nextProps.updateAppConfigData.ReturnCode === 1) {
            this.setState({ showError: true, responseMessage: nextProps.updateAppConfigData.ReturnMsg })
            setTimeout(function () {
                this.setState({ showError: false });
            }.bind(this), 5000);
        } else if (nextProps.updateAppConfigData.ReturnCode === 0) {
            this.setState({ showSuccess: true, responseMessage: nextProps.updateAppConfigData.ReturnMsg })
            setTimeout(function () {
                this.setState({ showSuccess: false });
                this.getListApplication();
                this.props.drawerClose();
            }.bind(this), 2000);
        }
    }

    componentWillMount() {
        this.props.getAppDomainData();
        this.props.getAllApplicationData();
    }

    render() {
        const { drawerClose, loading } = this.props;
        const { errors, data, check } = this.state;
        //const { AppName, DomainName, ClientSecret, ClientID, Description, ApplicationLogo, ApplicationName, AllowedCallBackURLS, AllowedWebOrigins, AllowedLogoutURLS, AllowedOriginsCORS, JWTExpiration } = this.state.data;
        return (
            <div className="jbs-page-content">
                {loading && <JbsSectionLoader />}
                <DashboardPageTitle title={<IntlMessages id="my_account.UpdateAppConfig" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <Fragment>
                    <Alert color="danger" isOpen={this.state.showError} toggle={(e) => this.setState({ showError: false })}>
                        {this.state.responseMessage}
                    </Alert>
                    <Alert color="success" isOpen={this.state.showSuccess} toggle={(e) => this.setState({ showSuccess: false })}>
                        {this.state.responseMessage}
                    </Alert>
                </Fragment>
                {this.state.data &&
                    <Form className="tradefrm">
                        <FormGroup row className="mb-20 ">
                            <Col sm="4">
                                <Label for="AppName" className="control-label"><IntlMessages id="my_account.AppName" /></Label>
                            </Col>
                            <Col sm="8">
                                <Input
                                    type="text"
                                    name="AppName"
                                    value={data.AppName}
                                    id="AppName"
                                    maxLength="250"
                                    onChange={e =>
                                        this.handleChange(
                                            "AppName",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.AppName && (<span className="text-danger text-left"><IntlMessages id={errors.AppName} /></span>)}
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Col sm="4">
                                <Label for="DomainId" className="control-label"><IntlMessages id="my_account.Domain" /></Label>
                            </Col>
                            <Col>
                                <Input
                                    type="select"
                                    name="DomainId"
                                    value={data.DomainId}
                                    id="DomainId"
                                    onChange={e =>
                                        this.handleChange(
                                            "DomainId",
                                            e.target.value
                                        )
                                    }
                                    readOnly                                >
                                    <option value="">-- Select Type --</option>
                                    {this.props.getAppDomain.hasOwnProperty("GetUserWiseDomainData")
                                        && this.props.getAppDomain.GetUserWiseDomainData.length
                                        && this.props.getAppDomain.GetUserWiseDomainData.map((list, index) => (
                                            <option key={index} value={list.Id}>
                                                {list.DomainName}
                                            </option>
                                        ))}
                                </Input>
                                {errors.DomainId && (<span className="text-danger text-left"><IntlMessages id={errors.DomainId} /></span>)}
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Col sm="4">
                                <Label for="ClientID" className="control-label"><IntlMessages id="my_account.ClientID" /></Label>
                            </Col>
                            <Col sm="8">
                                <Input
                                    type="text"
                                    name="ClientID"
                                    value={data.ClientID}
                                    id="ClientID"
                                    readOnly
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Col sm="4">
                                <Label for="ClientSecret" className="control-label"><IntlMessages id="my_account.ClientSecret" /></Label>
                            </Col>
                            <Col sm="8">
                                <Input
                                    type={check ? 'password' : 'text'}
                                    name="ClientSecret"
                                    value={data.ClientSecret}
                                    id="ClientSecret"
                                    readOnly
                                />
                                <Label check>
                                    <Input type="checkbox" className="CheckPosition" onClick={this.handleClick} /><IntlMessages id="lable.revelMsg" />
                                </Label>
                                <Label>
                                    <IntlMessages id="lable.clientSecret" />
                                </Label>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Col sm="4">
                                <Label for="Description" className="control-label"><IntlMessages id="my_account.Description" /></Label>
                            </Col>
                            <Col sm="8">
                                <Input
                                    type="textarea"
                                    name="Description"
                                    value={data.Description}
                                    id="Description"
                                    onChange={e =>
                                        this.handleChange(
                                            "Description",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.Description && (<span className="text-danger text-left"><IntlMessages id={errors.Description} /></span>)}
                                <Label>
                                    <IntlMessages id="lable.description" />
                                </Label>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Col sm="4">
                                <Label for="ApplicationLogo" className="control-label"><IntlMessages id="my_account.ApplicationLogo" /></Label>
                            </Col>
                            <Col sm="8">
                                <Input
                                    type="text"
                                    name="ApplicationLogo"
                                    value={data.ApplicationLogo}
                                    id="ApplicationLogo"
                                    onChange={e =>
                                        this.handleChange(
                                            "ApplicationLogo",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.ApplicationLogo && (<span className="text-danger text-left"><IntlMessages id={errors.ApplicationLogo} /></span>)}
                                <Label>
                                    <IntlMessages id="lable.applicationLogo" />
                                </Label>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Col sm="4">
                                <Label for="AppId" className="control-label"><IntlMessages id="my_account.AppId" /></Label>
                            </Col>
                            <Col>
                                <Input
                                    type="select"
                                    name="AppId"
                                    value={data.AppId}
                                    id="AppId"
                                    onChange={e =>
                                        this.handleChange(
                                            "AppId",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">-- Select Type --</option>
                                    {this.props.getAllApp.hasOwnProperty("GetApplicationData")
                                        && this.props.getAllApp.GetApplicationData.length
                                        && this.props.getAllApp.GetApplicationData.map((list, index) => (
                                            <option key={index} value={list.Id}>
                                                {list.ApplicationName}
                                            </option>
                                        ))}
                                </Input>
                                {errors.AppId && (<span className="text-danger text-left"><IntlMessages id={errors.AppId} /></span>)}
                                <Label>
                                    <IntlMessages id="lable.appId" />
                                </Label>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Col sm="4">
                                <Label for="AllowedCallBackURLS" className="control-label"><IntlMessages id="my_account.AllowedCallBackURLS" /></Label>
                            </Col>
                            <Col sm="8">
                                <Input
                                    type="textarea"
                                    name="AllowedCallBackURLS"
                                    value={data.AllowedCallBackURLS}
                                    id="AllowedCallBackURLS"
                                    onChange={e =>
                                        this.handleChange(
                                            "AllowedCallBackURLS",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.AllowedCallBackURLS && (<span className="text-danger text-left"><IntlMessages id={errors.AllowedCallBackURLS} /></span>)}
                                <Label>
                                    <IntlMessages id="lable.AllowedCallBackURLS" />
                                </Label>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Col sm="4">
                                <Label for="AllowedWebOrigins" className="control-label"><IntlMessages id="my_account.AllowedWebOrigins" /></Label>
                            </Col>
                            <Col sm="8">
                                <Input
                                    type="textarea"
                                    name="AllowedWebOrigins"
                                    value={data.AllowedWebOrigins}
                                    id="AllowedWebOrigins"
                                    onChange={e =>
                                        this.handleChange(
                                            "AllowedWebOrigins",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.AllowedWebOrigins && (<span className="text-danger text-left"><IntlMessages id={errors.AllowedWebOrigins} /></span>)}
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Col sm="4">
                                <Label for="AllowedLogoutURLS" className="control-label"><IntlMessages id="my_account.AllowedLogoutURLS" /></Label>
                            </Col>
                            <Col sm="8">
                                <Input
                                    type="textarea"
                                    name="AllowedLogoutURLS"
                                    value={data.AllowedLogoutURLS}
                                    id="AllowedLogoutURLS"
                                    onChange={e =>
                                        this.handleChange(
                                            "AllowedLogoutURLS",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.AllowedLogoutURLS && (<span className="text-danger text-left"><IntlMessages id={errors.AllowedLogoutURLS} /></span>)}
                                <Label>
                                    <IntlMessages id="lable.AllowedLogoutURLS" />
                                </Label>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Col sm="4">
                                <Label for="AllowedOriginsCORS" className="control-label"><IntlMessages id="my_account.AllowedOriginsCORS" /></Label>
                            </Col>
                            <Col sm="8">
                                <Input
                                    type="textarea"
                                    name="AllowedOriginsCORS"
                                    value={data.AllowedOriginsCORS}
                                    id="AllowedOriginsCORS"
                                    onChange={e =>
                                        this.handleChange(
                                            "AllowedOriginsCORS",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.AllowedOriginsCORS && (<span className="text-danger text-left"><IntlMessages id={errors.AllowedOriginsCORS} /></span>)}
                                <Label>
                                    <IntlMessages id="lable.AllowedOriginsCORS" />
                                </Label>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Col sm="4">
                                <Label for="JWTExpiration" className="control-label"><IntlMessages id="my_account.JWTExpiration" /></Label>
                            </Col>
                            <Col sm="8">
                                <Input
                                    type="text"
                                    name="JWTExpiration"
                                    value={data.JWTExpiration}
                                    id="JWTExpiration"
                                    onChange={e =>
                                        this.handleChange(
                                            "JWTExpiration",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.JWTExpiration && (<span className="text-danger text-left"><IntlMessages id={errors.JWTExpiration} /></span>)}
                                <Label>
                                    <IntlMessages id="lable.JWTExpiration" />
                                </Label>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Label className="col-md-4" />
                            <div className="col-md-2">
                                <MatButton variant="raised" disabled={loading} className="btn-primary text-white" onClick={this.OnEditApp}><IntlMessages id="button.update" /></MatButton>
                            </div>
                            <div className="col-md-2">
                                <MatButton variant="raised" className="btn-danger text-white" onClick={this.resetData}><IntlMessages id="button.cancel" /></MatButton>
                            </div>
                        </FormGroup>
                    </Form>
                }
            </div>
        )
    }
}

const mapStateToProps = ({ ApplicationConfig }) => {
    const { ApplicationByID, getAppDomain, updateAppConfigData, getAllApp, loading } = ApplicationConfig;
    return { ApplicationByID, getAppDomain, updateAppConfigData, getAllApp, loading };
}

export default connect(mapStateToProps, {
    getApplicationById,
    getAppDomainData,
    getAllApplicationData,
    updateApplicationData,
    getApplicationList
})(UpdateAppConfig);