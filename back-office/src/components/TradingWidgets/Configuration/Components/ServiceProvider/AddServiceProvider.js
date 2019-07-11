/**
 * Create By Sanjay 
 * Created Date 25/03/2019
 * Component For Add Service Provider
 */

import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { NotificationManager } from "react-notifications";
import Switch from '@material-ui/core/Switch';

import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { addServiceProvider, listServiceProvider } from "Actions/ServiceProvider";
// import for validate numbers in add data
import { validateOnlyAlphaNumeric } from "Validations/pairConfiguration";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const validateServiceProvider = require("../../../../../validation/ServiceProvider/service_provider_validate");

class AddServiceProvider extends Component {
    state = {
        open: false,
        data: {
            ProviderName: "",
            Status: 0
        },
        check: false,
        errors: "",
        //added by parth andhariya 
        fieldList: {},
        notificationFlag: true,
        menudetail: [],
    }
    //added by parth andhariya 
    componentWillMount() {
        this.props.getMenuPermissionByID('1C5AF084-5308-74B2-4E6B-4F79859593D7'); // get Trading menu permission
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.addServiceProviderData.ReturnCode === 0) {

            NotificationManager.success(<IntlMessages id="my_account.ServiceProviderAdded" />);
            //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
            var reqObject = {};
            if(this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                reqObject.IsArbitrage = this.props.IsArbitrage;
            }
            this.props.listServiceProvider(reqObject);
            //end
            this.resetData();

        } else if (nextProps.addServiceProviderData.ReturnCode === 1) {
            var errMsg = nextProps.addServiceProviderData.ErrorCode === 1 ? nextProps.addServiceProviderData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.addServiceProviderData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    resetData = () => {
        this.setState({
            data: {
                ProviderName: "",
                Status: 0
            },
            errors: ""
        });
        this.props.drawerClose();
    }

    handleChange = name => (event) => {
        if (validateOnlyAlphaNumeric(event.target.value) || event.target.value === '') {
            let newObj = Object.assign({}, this.state.data);
            newObj[name] = event.target.value;
            if (name === "check") {
                this.setState({ [name]: event.target.checked });
                delete newObj.check;
                if (event.target.checked === true) {
                    newObj["Status"] = 1;
                } else {
                    newObj["Status"] = 0;
                }
            }
            this.setState({ data: newObj });
        }
    }

    onClick = () => {
        this.setState({
            open: this.state.open ? false : true,
        })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    OnAddServiceProvider = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateServiceProvider(this.state.data);
        this.setState({ errors: errors });
        if (isValid) {
            
            //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
            var reqObject = this.state.data;
            if(this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                reqObject.IsArbitrage = this.props.IsArbitrage;
            }
            this.props.addServiceProvider(reqObject);
            //end

        }
    }

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
    // render component
    render() {
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail('FBBBF319-2700-1117-33A7-71A473253F9E');//FBBBF319-2700-1117-33A7-71A473253F9E
        const { drawerClose, loading_add_edit } = this.props;
        const { errors } = this.state;
        const { ProviderName } = this.state.data;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.addServiceProvider" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(loading_add_edit || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form className="m-10 tradefrm">
                        {((menuDetail["E8C713BB-9FEE-1001-403F-F2F607FE077F"]) && (menuDetail["E8C713BB-9FEE-1001-403F-F2F607FE077F"].Visibility === "E925F86B")) && //   E8C713BB-9FEE-1001-403F-F2F607FE077F
                            <FormGroup row >
                                <Label for="ProviderName" className="control-label col "><IntlMessages id="my_account.ProviderName" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.ProviderName">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["E8C713BB-9FEE-1001-403F-F2F607FE077F"].AccessRight === "11E6E7B0") ? true : false} type="text" name="ProviderName" value={ProviderName} placeholder={placeholder} id="ProviderName" onChange={this.handleChange("ProviderName")} />
                                        }
                                    </IntlMessages>
                                    {errors.ProviderName && (<span className="text-danger text-left"><IntlMessages id={errors.ProviderName} /></span>)}
                                </div>
                            </FormGroup>
                        }
                        {((menuDetail["BC395881-8104-5A4E-9A30-783B938238B2"]) && (menuDetail["BC395881-8104-5A4E-9A30-783B938238B2"].Visibility === "E925F86B")) && //BC395881-8104-5A4E-9A30-783B938238B2
                            <FormGroup row>
                                <Label for="Status" className="control-label col"><IntlMessages id="my_account.Status" /></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                            <Switch
                                    checked={this.state.check}
                                    enabled={(menuDetail["BC395881-8104-5A4E-9A30-783B938238B2"].AccessRight === "11E6E7B0") ? false : true}
                                    onChange={this.handleChange('check')}
                                    value="check"
                                    color="primary"
                                />
                                </div>
                            </FormGroup>
                        }
                        {Object.keys(menuDetail).length > 0 &&
                            <FormGroup row>
                                <div className="offset-md-5 col-md-7 offset-sm-5 col-sm-7 col-xs-12">
                                    <div className="btn_area">
                                    <Button disabled={loading_add_edit} color="primary" className="btn-primary text-white" onClick={this.OnAddServiceProvider}><IntlMessages id="button.add" /></Button>
                                    <Button className="btn-danger text-white ml-15" onClick={this.resetData}><IntlMessages id="button.cancel" /></Button>
                                </div>
                                </div>
                            </FormGroup>
                        }
                    </Form>
                </div>
            </div>
        )
    }
}

const mapToProps = ({ ServiceProviderReducer, authTokenRdcer }) => {
    const { addServiceProviderData, loading_add_edit } = ServiceProviderReducer;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { addServiceProviderData, loading_add_edit, menuLoading, menu_rights };
}

export default connect(mapToProps, {
    addServiceProvider,
    listServiceProvider,
    getMenuPermissionByID
})(AddServiceProvider);
