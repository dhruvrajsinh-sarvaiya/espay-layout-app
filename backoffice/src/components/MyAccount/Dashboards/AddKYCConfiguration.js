/* 
    Developer : Kevin Ladani
    Date : 30-11-2018
    File Comment : MyAccount Add Admin Dashboard Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import "rc-drawer/assets/index.css";
import { Form, FormGroup, Label, Button, Input, Alert } from "reactstrap";
import LinearProgress from '@material-ui/core/LinearProgress';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import MatButton from "@material-ui/core/Button";
import { DashboardPageTitle } from './DashboardPageTitle';
// redux action
// import { addKYCDocumentConfig } from "Actions/MyAccount";
import {
    getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode
} from "Helpers/helpers";
//Validation
const kycConfiguration = require("../../../validation/MyAccount/kyc_configuration");

class KYCConfigurationDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                FullName: true,
                IdentityCardNumber: true,
                ResidentAddressProof: '',
                GovernmentIssuedIdentification: '',
                PhotoVerification: true,
                // Name: '',
                DeviceId: getDeviceInfo(),
                Mode: getMode(),
                IPAddress: '', //getIPAddress(),
                HostName: getHostName()
            },
            err_msg: '',
            err_alert: true,
            success_msg: '',
            success_alert: true,
            loading: false,
            errors: {}
        };
        this.initState = this.state;

        this.onDismiss = this.onDismiss.bind(this);
        this.resetData = this.resetData.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onDismiss() {
        this.setState({ err_alert: false, success_alert: false });
    }

    resetData() {
        this.setState(this.initState);
    }

    handleToggle(key) {
        console.log('Testing :', key);
		/* let items = this.state.items;
		items[key].status = !items[key].status;
		this.setState({ items }); */
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    };

    showComponent = componentName => {
        this.setState({
            componentName: componentName,
            open: !this.state.open
        });
    };

    onChange(event) {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    componentWillReceiveProps(nextProps) {
        // console.log("Nextprops :",nextProps);
        this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

        if (nextProps.data.ReturnCode === 1) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            this.setState({ err_alert: true, err_msg: errMsg });
        } else if (nextProps.data.ReturnCode === 0) {
            this.setState({ success_alert: true, success_msg: nextProps.data.ReturnMsg });
        }
    }

    onSubmit(event) {
        event.preventDefault();
        const { errors, isValid } = kycConfiguration(this.state.data);
        this.setState({ err_alert: false, errors: errors });

        if (isValid) {
            let self = this;
            var reqObj = Object.assign({}, this.state.data);
            getIPAddress().then(function (ipAddress) {
                reqObj.IPAddress = ipAddress;
                // self.props.addKYCDocumentConfig(reqObj);
            });
        }
    }

    render() {
        const { drawerClose } = this.props;
        const { err_alert, err_msg, success_msg, success_alert, loading, errors } = this.state;
        const { FullName, IdentityCardNumber, ResidentAddressProof, GovernmentIssuedIdentification, PhotoVerification } = this.state.data;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.addKYCConfiguration" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="jbs-page-content col-md-12 mx-auto">
                    {loading && <div><LinearProgress color="secondary" /></div>}
                    {success_msg && <div className="alert_area">
                        <Alert color="success" isOpen={success_alert} toggle={this.onDismiss}>{success_msg}</Alert>
                    </div>}
                    {err_msg && <div className="alert_area">
                        <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{err_msg}</Alert>
                    </div>}
                    <Form>
                        <FormGroup row className="mb-20 ">
                            <Label for="FullName" className="control-label col-md-4" ><IntlMessages id="sidebar.asPerDocumentName" /></Label>
                            <div className="col-md-8">
                                <Switch onChange={() => this.handleToggle(FullName)} checked={FullName} />
                                {errors.FullName && (<span className="text-danger text-left"><IntlMessages id={errors.FullName} /></span>)}
                            </div>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Label for="IdentityCardNumber" className="control-label col-md-4" ><IntlMessages id="sidebar.identityCardNumber" /></Label>
                            <div className="col-md-8">
                                <Switch onChange={() => this.handleToggle(IdentityCardNumber)} checked={IdentityCardNumber} />
                                {errors.IdentityCardNumber && (<span className="text-danger text-left"><IntlMessages id={errors.IdentityCardNumber} /></span>)}
                            </div>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Label for="ResidentAddressProof" className="control-label col-md-4" ><IntlMessages id="sidebar.ResidentAddressProof" /></Label>
                            <div className="col-md-8">
                                <div className="ds-block">
                                    <div className="form-check form-check-inline">
                                        <Checkbox color="primary" name="ResidentAddressProof" value="1" onChange={this.handleAreaOfInterestChange} /> Electricity Bill
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <Checkbox color="primary" name="ResidentAddressProof" value="1" onChange={this.handleAreaOfInterestChange} /> Pan Card
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <Checkbox color="primary" name="ResidentAddressProof" value="1" onChange={this.handleAreaOfInterestChange} /> Aadhar Card
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <Checkbox color="primary" name="ResidentAddressProof" value="1" onChange={this.handleAreaOfInterestChange} /> Ration Card
                                    </div>
                                </div>
                                {errors.ResidentAddressProof && (<span className="text-danger text-left"><IntlMessages id={errors.ResidentAddressProof} /></span>)}
                            </div>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Label for="GovernmentIssuedIdentification" className="control-label col-md-4" ><IntlMessages id="sidebar.GovernmentIssuedIdentification" /></Label>
                            <div className="col-md-8">
                                <div className="ds-block">
                                    <div className="form-check form-check-inline">
                                        <Checkbox color="primary" name="GovernmentIssuedIdentification" value="1" onChange={this.handleAreaOfInterestChange} /> Electricity Bill
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <Checkbox color="primary" name="GovernmentIssuedIdentification" value="1" onChange={this.handleAreaOfInterestChange} /> Pan Card
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <Checkbox color="primary" name="GovernmentIssuedIdentification" value="1" onChange={this.handleAreaOfInterestChange} /> Aadhar Card
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <Checkbox color="primary" name="GovernmentIssuedIdentification" value="1" onChange={this.handleAreaOfInterestChange} /> Ration Card
                                    </div>
                                </div>
                                {errors.GovernmentIssuedIdentification && (<span className="text-danger text-left"><IntlMessages id={errors.GovernmentIssuedIdentification} /></span>)}
                            </div>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Label for="PhotoVerification" className="control-label col-md-4" ><IntlMessages id="sidebar.PhotoVerification" /></Label>
                            <div className="col-md-8">
                                <Switch onChange={() => this.handleToggle(PhotoVerification)} checked={PhotoVerification} />
                                {errors.PhotoVerification && (<span className="text-danger text-left"><IntlMessages id={errors.PhotoVerification} /></span>)}
                            </div>
                        </FormGroup>
                        <div className="mb-20 row">
                            <div className="offset-md-4 pl-15">
                                <Button variant="raised" color="primary" className="mr-10" onClick={this.onSubmit}><IntlMessages id="button.add" /></Button>
                                <Button variant="raised" color="danger" onClick={this.resetData}><IntlMessages id="button.cancel" /></Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

//MapStateToProps
/* const mapToProps = ({ kycConfigRdcer }) => {
    const response = {
        data : kycConfigRdcer.docData,
        loading : kycConfigRdcer.loading
    }
    return response;
}

export default connect(mapToProps, {
    addKYCDocumentConfig
})(KYCConfigurationDashboard); */

export default KYCConfigurationDashboard;