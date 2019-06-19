/*
 * Created By Sanjay
 * Created Date 12/02/2019
 * Component For Update Referral PayType
 */
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Form, Input, Label, FormGroup } from "reactstrap";
import Button from "@material-ui/core/Button";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { updateReferralPayType, getReferralPayTypeData } from "Actions/MyAccount";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//Validation
import validatePayTypeForm from "Validations/MyAccount/add_referral_payType"
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class UpdateReferralPayType extends Component {

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
        this.props.getMenuPermissionByID('23D81ECB-65FE-93DF-548F-EE1C9EDF09BF');

    }

    resetData = () => {
        this.setState({
            open: false,
            data: {},
            errors: "",
        });
        this.props.drawerClose();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

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
        if (nextProps.getReferralPayTypeDataById.ReturnCode === 0) {
            this.setState({ data: nextProps.getReferralPayTypeDataById.ReferralPayTypeObj });
        }
        if (nextProps.editReferralPayTypeData.ReturnCode === 0) {
            NotificationManager.success(<IntlMessages id="my_account.PaytypeUpdated" />);
            this.props.getReferralPayTypeData();
            this.resetData();
        } else if ((nextProps.editReferralPayTypeData.ReturnCode === 1 && this.state.flag) || nextProps.editReferralPayTypeData.ReturnCode === 9) {
            var errMsg = nextProps.editReferralPayTypeData.ErrorCode === 1 ? nextProps.editReferralPayTypeData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.editReferralPayTypeData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
            this.setState({ flag: false })
        }
    }

    handleChange = (event) => {
        this.setState({
            data: {
                ...this.state.data,
                PayTypeName: event.target.value
            }
        });
    }

    OnEditReferralPayType = (event) => {
        event.preventDefault();
        const { errors, isValid } = validatePayTypeForm(this.state.data);
        this.setState({ errors: errors, flag: true });
        if (isValid) {
            this.props.updateReferralPayType(this.state.data);
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
        const { PayTypeName } = this.state.data;
        var menuDetail = this.checkAndGetMenuAccessDetail('0A0529D2-8D0D-70C6-0EAD-A5FF374C1E4A');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.editReferralPayType" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {edit_loading && <JbsSectionLoader />}
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form className="tradefrm">
                        {(menuDetail["C7646EA5-1080-25CC-0149-C683811D5F22"] && menuDetail["C7646EA5-1080-25CC-0149-C683811D5F22"].Visibility === "E925F86B") && //C7646EA5-1080-25CC-0149-C683811D5F22
                            <FormGroup row>
                                <Label for="PayType" className="control-label col text-left" ><IntlMessages id="my_account.PayType" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.PayType">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["C7646EA5-1080-25CC-0149-C683811D5F22"].AccessRight === "11E6E7B0") ? true : false} type="text" name="PayTypeName" maxLength="50" value={PayTypeName} placeholder={placeholder} id="PayTypeName" onChange={this.handleChange} />
                                        }
                                    </IntlMessages>
                                    {errors.PayTypeName && (<span className="text-danger text-left"><IntlMessages id={errors.PayTypeName} /></span>)}
                                </div>
                            </FormGroup>}
                        {menuDetail &&
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button disabled={edit_loading} variant="raised" className="btn-primary text-white" onClick={this.OnEditReferralPayType}><IntlMessages id="sidebar.btnEdit" /></Button>
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

const mapToProps = ({ ReferralPayTypeReducer, authTokenRdcer }) => {
    const { editReferralPayTypeData, getReferralPayTypeDataById, edit_loading } = ReferralPayTypeReducer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        editReferralPayTypeData, getReferralPayTypeDataById, edit_loading, menuLoading,
        menu_rights
    };
}

export default connect(mapToProps, {
    updateReferralPayType,
    getReferralPayTypeData,
    getMenuPermissionByID
})(UpdateReferralPayType);