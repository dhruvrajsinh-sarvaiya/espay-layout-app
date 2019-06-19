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
import MatButton from "@material-ui/core/Button";
import { DashboardPageTitle } from './DashboardPageTitle';
// redux action
import { editKYCDocumentConfig } from "Actions/MyAccount";
import {
    getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode
} from "Helpers/helpers";
//Validation
const kycConfiguration = require("../../../validation/MyAccount/kyc_configuration");

class EditKYCDocumentTypeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                DocumentMasterId: 1,
                Name: "",
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

    onSubmit(event) {
        event.preventDefault();
        const { errors, isValid } = kycConfiguration(this.state.data);
        this.setState({ err_alert: false, errors: errors });

        if (isValid) {
            let self = this;
            var reqObj = Object.assign({},this.state.data);
            getIPAddress().then(function (ipAddress) {
                reqObj.IPAddress = ipAddress;
                self.props.editKYCDocumentConfig(reqObj);
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading : nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

        if (nextProps.data.ReturnCode === 1) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			this.setState({ err_alert: true, err_msg: errMsg });
		} else if (nextProps.data.ReturnCode === 0) {
            this.setState({ success_alert: true, success_msg: nextProps.data.ReturnMsg });
        }
    }

    render() {
        const { drawerClose } = this.props;
        const { err_alert, err_msg, success_msg, success_alert, loading, errors } = this.state;
        const { Name } = this.state.data;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.addKYCDocumentType" />} drawerClose={drawerClose} closeAll={this.closeAll} />
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
                            <Label for="Name" className="control-label col-md-4" ><IntlMessages id="sidebar.name" /></Label>
                            <div className="col-md-8">
                                <IntlMessages id="sidebar.plcHlderName">
                                    {(placeholder) =>
                                        <Input type="text" name="Name" value={Name} placeholder={placeholder} id="Name" onChange={this.onChange} />
                                    }
                                </IntlMessages>
                                {errors.Name && (<span className="text-danger text-left"><IntlMessages id={errors.Name} /></span>)}
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
const mapToProps = ({ kycConfigRdcer }) => {
    const response = {
        data : kycConfigRdcer.docData,
        loading : kycConfigRdcer.loading
    }

    return response;
}

export default connect(mapToProps, {
    editKYCDocumentConfig
})(EditKYCDocumentTypeForm);