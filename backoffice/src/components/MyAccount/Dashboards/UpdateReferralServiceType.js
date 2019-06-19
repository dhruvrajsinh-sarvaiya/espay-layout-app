/**
 * Created By Sanjay
 * Created Date 13/02/2019
 * Component For Update Referrla Service Type 
 */
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Form, Input, Label, FormGroup } from "reactstrap";
import Button from "@material-ui/core/Button";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { updateReferralServiceType, getReferralServiceTypeData } from "Actions/MyAccount";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//Validation
import validateServiceTypeForm from "Validations/MyAccount/add_referral_serviceType"
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class UpdateReferralServiceType extends Component {

    state = {
        open: false,
        data: {},
        errors: "",
        flag: true,
        fieldList: {},
        menudetail: [],
        menuLoading: false,
        notificationFlag: true,
    };

    componentWillMount() {
        this.props.getMenuPermissionByID('222122D7-672F-1821-7E7F-76B2A3030182');
    }

    resetData = () => {
        this.setState({
            open: false,
            data: {},
            errors: ""
        });
        this.props.drawerClose();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false, flag: false });
    };

    handleChange = (event) => {
        this.setState({
            data: {
                ...this.state.data,
                ServiceTypeName: event.target.value
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading });

        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        if (nextProps.getReferralServiceTypeDataById.ReturnCode === 0) {
            this.setState({ data: nextProps.getReferralServiceTypeDataById.ReferralServiceTypeObj });
        }
        if (nextProps.editReferralServiceTypeData.ReturnCode === 0) {
            NotificationManager.success(<IntlMessages id="my_account.ServiceUpdated" />);
            this.props.getReferralServiceTypeData();
            this.resetData();
        } else if ((nextProps.editReferralServiceTypeData.ReturnCode === 1 && this.state.flag) || nextProps.editReferralServiceTypeData.ReturnCode === 9) {
            var errMsg = nextProps.editReferralServiceTypeData.ErrorCode === 1 ? nextProps.editReferralServiceTypeData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.editReferralServiceTypeData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
            this.setState({ flag: false })
        }
    }

    OnEditReferralServiceType = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateServiceTypeForm(this.state.data);
        this.setState({ errors: errors, flag: true });
        if (isValid) {
            this.props.updateReferralServiceType(this.state.data);
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
        const { drawerClose, edit_loading } = this.props;
        const { errors } = this.state;
        const { ServiceTypeName } = this.state.data;
        var menuDetail = this.checkAndGetMenuAccessDetail('B0A48096-2D44-3A10-5A18-0F9EF5862116');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.editReferralServiceType" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || edit_loading) && <JbsSectionLoader />}
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form className="tradefrm">
                        {(menuDetail["D3361C38-4E35-87E7-25E0-19BF4AD2622A"] && menuDetail["D3361C38-4E35-87E7-25E0-19BF4AD2622A"].Visibility === "E925F86B") && //D3361C38-4E35-87E7-25E0-19BF4AD2622A
                            <FormGroup row>
                                <Label for="ServiceType" className="control-label col" ><IntlMessages id="my_account.ServiceType" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.ServiceType">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["D3361C38-4E35-87E7-25E0-19BF4AD2622A"].AccessRight === "11E6E7B0") ? true : false} type="text" name="ServiceTypeName" value={ServiceTypeName} placeholder={placeholder} id="ServiceType" onChange={this.handleChange} />
                                        }
                                    </IntlMessages>
                                    {errors.ServiceTypeName && (<span className="text-danger"><IntlMessages id={errors.ServiceTypeName} /></span>)}
                                </div>
                            </FormGroup>}
                        {menuDetail &&
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button disabled={edit_loading} variant="raised" className="btn-primary text-white" onClick={this.OnEditReferralServiceType}><IntlMessages id="sidebar.btnEdit" /></Button>
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
    const { editReferralServiceTypeData, getReferralServiceTypeDataById, edit_loading } = ReferralServiceTypeReducer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        editReferralServiceTypeData, getReferralServiceTypeDataById, edit_loading, menuLoading,
        menu_rights
    };
}

export default connect(mapToProps, {
    updateReferralServiceType,
    getReferralServiceTypeData,
    getMenuPermissionByID
})(UpdateReferralServiceType);