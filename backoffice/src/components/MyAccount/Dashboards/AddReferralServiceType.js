/*
 * Created By Sanjay
 * Created Date 12/02/2019
 * Component for Add Referral ServiceType
 */
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Form, Input, Label, FormGroup } from "reactstrap";
import Button from "@material-ui/core/Button";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { addReferralServiceType } from "Actions/MyAccount";
//Validation
import validateServiceTypeForm from "Validations/MyAccount/add_referral_serviceType"
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class AddReferralServiceType extends Component {

    state = {
        open: false,
        ServiceTypeName: '',
        errors: "",
        flag: true,
        fieldList: {},
        menudetail: [],
        menuLoading: false,
        notificationFlag: true,
    };

    componentWillMount() {
        this.props.getMenuPermissionByID('D38B276F-9387-31B7-94F4-97CAB74F1F57');

    }

    resetData = () => {
        this.setState({
            open: false,
            ServiceTypeName: '',
            errors: ""
        });
        this.props.drawerClose();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    handleChange = (event) => {
        let newObj = Object.assign({}, this.state);
        newObj[event.target.name] = event.target.value;
        this.setState({ ServiceTypeName: newObj.ServiceTypeName });
    };

    OnAddReferralServiceType = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateServiceTypeForm(this.state);
        this.setState({ errors: errors, flag: true });
        if (isValid) {
            var reqObj = Object.assign({}, this.state);
            const { ServiceTypeName } = reqObj;
            this.props.addReferralServiceType({ ServiceTypeName });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading });

        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                ;
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        if ((nextProps.addReferralServiceTypeData.ReturnCode === 1 && this.state.flag) || nextProps.addReferralServiceTypeData.ReturnCode === 9) {
            var errMsg = nextProps.addReferralServiceTypeData.ErrorCode === 1 ? nextProps.addReferralServiceTypeData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.addReferralServiceTypeData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
            this.setState({ flag: false })
        } else if (nextProps.addReferralServiceTypeData.ReturnCode === 0 && this.state.flag) {
            NotificationManager.success(<IntlMessages id="my_account.ServiceAdded" />);
            this.resetData();
            this.props.drawerClose();
            this.setState({ flag: false })
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
                        return response = fieldList;
                    }
                }
            }
        } else {
            return response;
        }
    }
    render() {
        const { drawerClose, loading } = this.props;
        const { ServiceTypeName, errors } = this.state;
        var menuDetail = this.checkAndGetMenuAccessDetail('870FBFBF-4B0F-4E47-3F67-015D45E098A6');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.AddReferralServiceType" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form className="tradefrm">
                        {(menuDetail["617D7124-235A-0A51-766E-00D7C7F738E5"] && menuDetail["617D7124-235A-0A51-766E-00D7C7F738E5"].Visibility === "E925F86B") && //617D7124-235A-0A51-766E-00D7C7F738E5
                            <FormGroup row>
                                <Label for="ServiceType" className="control-label col" ><IntlMessages id="my_account.ServiceType" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.ServiceType">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["617D7124-235A-0A51-766E-00D7C7F738E5"].AccessRight === "11E6E7B0") ? true : false} type="text" name="ServiceTypeName" maxLength="50" value={ServiceTypeName} placeholder={placeholder} id="ServiceTypeName" onChange={this.handleChange} />
                                        }
                                    </IntlMessages>
                                    {errors.ServiceTypeName && (<span className="text-danger"><IntlMessages id={errors.ServiceTypeName} /></span>)}
                                </div>
                            </FormGroup>}
                        {menuDetail &&
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button disabled={loading} variant="raised" className="btn-primary text-white" onClick={this.OnAddReferralServiceType}><IntlMessages id="button.add" /></Button>
                                        <Button variant="raised" className="ml-15 btn-danger text-white" onClick={this.resetData}><IntlMessages id="button.cancel" /></Button>
                                    </div>
                                </div>
                            </FormGroup>}
                    </Form>
                </div>
            </div>
        )
    }
}

const mapToProps = ({ ReferralServiceTypeReducer, authTokenRdcer }) => {
    const { addReferralServiceTypeData, loading } = ReferralServiceTypeReducer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        addReferralServiceTypeData, loading, menuLoading,
        menu_rights
    };
}

export default connect(mapToProps, {
    addReferralServiceType,
    getMenuPermissionByID
})(AddReferralServiceType);