/* 
    Developer : Kevin Ladani
    Date : 30-11-2018
    File Comment : MyAccount Add Admin Dashboard Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import "rc-drawer/assets/index.css";
import { Form, Input, Label } from "reactstrap";
import FormGroup from "@material-ui/core/FormGroup";
import MatButton from "@material-ui/core/Button";
import { DashboardPageTitle } from './DashboardPageTitle';
// redux action
import { addAdminData, getAdminData } from "Actions/MyAccount";
//Validation
const validateAddAdminDashboard = require("../../../validation/MyAccount/add_admin_dashboard");

// Component for MyAccount Add Admin Dashboard
class AddAdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                fullName: "",
                email: "",
                mobileno: "",
                password: "",
                confirmPassword: "",
                type: "",
                status: "",
            },
            errors: ""
        };
        this.initState = this.state;
        this.resetData = this.resetData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.OnAddAdmin = this.OnAddAdmin.bind(this);
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

    showComponent = componentName => {
        this.setState({
            componentName: componentName,
            open: !this.state.open
        });
    };

    handleChange(event) {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    OnAddAdmin() {
        const { errors, isValid } = validateAddAdminDashboard(this.state.data);
        this.setState({ errors: errors });
        if (isValid) {
            this.props.addAdminData(this.state.data);
            this.props.getAdminData();
            //this.props.drawerClose();
        }
    }
    render() {
        const { drawerClose } = this.props;
        const { errors } = this.state;
        const { fullName, email, mobileno, password, confirmPassword, type, status } = this.state.data;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.addAdmin" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form className="tradefrm">
                        <FormGroup row className="mb-20 ">
                            <Label for="fullName" className="control-label col-md-4" ><IntlMessages id="my_account.common.fullname" /></Label>
                            <div className="col-md-8">
                                <IntlMessages id="myaccount.enterFullname">
                                    {(placeholder) =>
                                        <Input type="text" name="fullName" value={fullName} placeholder={placeholder} id="fullName" onChange={this.handleChange} />
                                    }
                                </IntlMessages>
                                {errors.fullName && (<span className="text-danger text-left"><IntlMessages id={errors.fullName} /></span>)}
                            </div>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Label for="email" className="control-label col-md-4"><IntlMessages id="my_account.common.email" /></Label>
                            <div className="col-md-8">
                                <IntlMessages id="myaccount.enterEmailId">
                                    {(placeholder) =>
                                        <Input type="email" name="email" value={email} id="email" placeholder={placeholder} onChange={this.handleChange} />
                                    }
                                </IntlMessages>
                                {errors.email && (<span className="text-danger text-left"><IntlMessages id={errors.email} /></span>)}
                            </div>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Label for="mobileno" className="control-label col-md-4 "><IntlMessages id="my_account.common.mobileno" /></Label>
                            <div className="col-md-8">
                                <IntlMessages id="myaccount.enterMobile">
                                    {(placeholder) =>
                                        <Input type="text" name="mobileno" value={mobileno} id="mobileno" placeholder={placeholder} onChange={this.handleChange} />
                                    }
                                </IntlMessages>
                                {errors.mobileno && (<span className="text-danger text-left"><IntlMessages id={errors.mobileno} /></span>)}
                            </div>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Label for="password" className="control-label col-md-4 "><IntlMessages id="my_account.common.password" /></Label>
                            <div className="col-md-8">
                                <IntlMessages id="myaccount.enterpassword">
                                    {(placeholder) =>
                                        <Input type="text" name="password" value={password} id="password" placeholder={placeholder} onChange={this.handleChange} />
                                    }
                                </IntlMessages>
                                {errors.password && (<span className="text-danger text-left"><IntlMessages id={errors.password} /></span>)}
                            </div>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Label for="confirmPassword" className="control-label col-md-4 "><IntlMessages id="my_account.common.confirmPassword" /></Label>
                            <div className="col-md-8">
                                <IntlMessages id="myaccount.enterConfirmPassword">
                                    {(placeholder) =>
                                        <Input type="text" name="confirmPassword" value={confirmPassword} id="confirmPassword" placeholder={placeholder} onChange={this.handleChange} />
                                    }
                                </IntlMessages>
                                {errors.confirmPassword && (<span className="text-danger text-left"><IntlMessages id={errors.confirmPassword} /></span>)}
                            </div>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Label for="type" className="control-label col-md-4 "><IntlMessages id="my_account.common.type" /></Label>
                            <div className="col-md-8">
                                <Input type="select" name="type" value={type} id="type" onChange={this.handleChange}                                >
                                    <option value="">Please Select</option>
                                    <option value="1">Administrator</option>
                                    <option value="2">User</option>
                                    <option value="3">Operator</option>
                                </Input>
                                {errors.type && (<span className="text-danger text-left"><IntlMessages id={errors.type} /></span>)}
                            </div>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Label for="status" className="control-label col-md-4 "><IntlMessages id="my_account.common.status" /></Label>
                            <div className="col-md-8">
                                <Input type="select" name="status" value={status} id="status" onChange={this.handleChange}                                >
                                    <option value="">Please Select</option>
                                    <option value="1">Active</option>
                                    <option value="2">InActive</option>
                                </Input>
                                {errors.status && (<span className="text-danger text-left"><IntlMessages id={errors.status} /></span>)}
                            </div>
                        </FormGroup>
                        <FormGroup row className="mb-20 ">
                            <Label className="col-md-4" />
                            <div className="col-md-2">
                                <MatButton variant="raised" className="btn-primary text-white" onClick={this.OnAddAdmin}><IntlMessages id="button.add" /></MatButton>
                            </div>
                            <div className="col-md-2">
                                <MatButton variant="raised" className="btn-danger text-white" onClick={this.resetData}><IntlMessages id="button.cancel" /></MatButton>
                            </div>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        );
    }
}

const mapToProps = ({ adminDashRdcer }) => {
    const { data, loading } = adminDashRdcer;
    return { data, loading };
}

export default connect(mapToProps, {
    addAdminData,
    getAdminData
})(AddAdminDashboard);