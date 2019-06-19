/* 
    Developer : Salim Deraiya
    Date : 27-11-2018
    update by Sanjay : 06-02-2019 (code for drawar)
    File Comment : MyAccount Add Application Dashboard Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Label, Form, FormGroup, Input, Alert, Button } from "reactstrap";

// added by Bharat Jograna for Loader and NotificationManager
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";

import { addApplication, getApplicationData } from 'Actions/MyAccount';
import { DashboardPageTitle } from './DashboardPageTitle';
import {
    getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode
} from "Helpers/helpers";

//Validation
const validateApplication = require("../../../validation/MyAccount/add_Application");

// Component for MyAccount Add Application Dashboard
class AddApplicationDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                ApplicationName: '',
                Description: '',
                DeviceId: getDeviceInfo(),
                Mode: getMode(),
                IPAddress: '',
                HostName: getHostName(),
            },
            loading: false,
            errors: {},
            open: false
        };
        this.initState = this.state;
        this.onChange = this.onChange.bind(this);
        this.addApplication = this.addApplication.bind(this);
        this.resetData = this.resetData.bind(this);
    }

    resetData() {
        this.setState(this.initState);
        this.props.drawerClose();
    }

    onChange(event) {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    addApplication(event) {
        event.preventDefault();
        const { errors, isValid } = validateApplication(this.state.data);
        this.setState({ errors: errors });
        this.setState({ err_alert: false, success_alert: false, errors: errors, get_info: 'show' });
        if (isValid) {
            var reqObj = Object.assign({}, this.state.data);
            let self = this;
            getIPAddress().then(function (ipAddress) {
                reqObj.IPAddress = ipAddress;
                self.props.addApplication(reqObj);
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });
        if (nextProps.addApplicationData.ReturnCode === 1) {
            var errMsg = nextProps.addApplicationData.ErrorCode === 1 ? nextProps.addApplicationData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.addApplicationData.ErrorCode}`} />;
            // added by Bharat Jograna for errMsg
            NotificationManager.error(errMsg);
        } else if (nextProps.addApplicationData.ReturnCode === 0) {
            let success_msg = this.state.get_info === 'hide' ? '' : nextProps.addApplicationData.ReturnMsg;
            //added by Bharat Jograna for success_msg
            NotificationManager.success(success_msg);
            this.setState({ data: '' });
            this.props.getApplicationData();
            this.resetData();
            this.props.drawerClose();
        }
    }


    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    render() {
        const { ApplicationName, Description } = this.state.data;
        const { loading, errors } = this.state;
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.addApplication" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="w-xs-full">
                    {loading && <JbsSectionLoader />}

                    <Form className="tradefrm">
                        <FormGroup className="row">
                            <Label for="ApplicationName" className="control-label col-md-4"><IntlMessages id="sidebar.ApplicationName" /></Label>
                            <div className="col-md-8">
                                <Input type="text" name="ApplicationName" value={ApplicationName} maxLength="250" id="ApplicationName" onChange={this.onChange} />
                                {errors.ApplicationName && <div className="text-danger text-left"><IntlMessages id={errors.ApplicationName} /></div>}
                            </div>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label for="Description" className="control-label col-md-4"><IntlMessages id="sidebar.Description" /></Label>
                            <div className="col-md-8">
                                <Input type="textarea" name="Description" value={Description} maxLength="250" id="Description" onChange={this.onChange} />
                                {errors.Description && <div className="text-danger text-left"><IntlMessages id={errors.Description} /></div>}
                            </div>
                        </FormGroup>
                        <FormGroup className="offset-md-4">
                            <Button disabled={loading} onClick={this.addApplication} color="primary" className="mr-10"><IntlMessages id="sidebar.btnAdd" /></Button>
                            <Button onClick={this.resetData} color="danger"><IntlMessages id="sidebar.btnCancel" /></Button>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        );
    }
}

const mapPropsToState = ({ appDashRdcer }) => {
    const { addApplicationData, loading } = appDashRdcer;
    return { addApplicationData, loading };
}


export default connect(mapPropsToState, {
    addApplication,
    getApplicationData
})(AddApplicationDashboard);