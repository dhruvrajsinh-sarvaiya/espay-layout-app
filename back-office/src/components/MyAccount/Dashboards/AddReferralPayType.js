/*
 * Created By Sanjay
 * Created Date 12/02/2019
 * Component for Add Referral PayType
 */
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Form, Input, Label, FormGroup } from "reactstrap";
import Button from "@material-ui/core/Button";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { addReferralPayType } from "Actions/MyAccount";
//Validation
import validatePayTypeForm from "Validations/MyAccount/add_referral_payType"
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class AddReferralPayType extends Component {

    state = {
        open: false,
        PayTypeName: '',
        errors: "",
        flag: true,
        fieldList: {},
        menudetail: [],
        menuLoading: false,
        notificationFlag: true,
    };

    componentWillMount() {
        this.props.getMenuPermissionByID('D38850B7-8E75-49F6-2793-3E7FDB281883');

    }

    resetData = () => {
        this.setState({
            open: false,
            PayTypeName: '',
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
        this.setState({ PayTypeName: newObj.PayTypeName });
    };

    OnAddReferralPayType = (event) => {
        event.preventDefault();
        const { errors, isValid } = validatePayTypeForm(this.state);
        this.setState({ errors: errors, flag: true });
        if (isValid) {
            var reqObj = Object.assign({}, this.state);
            const { PayTypeName } = reqObj;
            this.props.addReferralPayType({ PayTypeName });
        }
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
        if ((nextProps.addReferralPayTypeData.ReturnCode === 1 && this.state.flag) || nextProps.addReferralPayTypeData.ReturnCode === 9) {
            var errMsg = nextProps.addReferralPayTypeData.ErrorCode === 1 ? nextProps.addReferralPayTypeData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.addReferralPayTypeData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
            this.setState({ flag: false })
        } else if (nextProps.addReferralPayTypeData.ReturnCode === 0 && this.state.flag) {
            NotificationManager.success(<IntlMessages id="my_account.PayTypeAdded" />);
            this.resetData();
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
                        response = fieldList;
                    }
                }
            }
        }
        return response;
    }
    render() {
        const { drawerClose, loading } = this.props;
        const { PayTypeName, errors } = this.state;
        var menuDetail = this.checkAndGetMenuAccessDetail('314A9B3B-2FDF-6034-5699-66A6C21E440F');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.AddReferralPayType" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form className="tradefrm">
                        {(menuDetail["389E5435-67FC-256D-283B-5D2BEBE77252"] && menuDetail["389E5435-67FC-256D-283B-5D2BEBE77252"].Visibility === "E925F86B") && //389E5435-67FC-256D-283B-5D2BEBE77252
                            <FormGroup row>
                                <Label for="PayType" className="control-label col text-left" ><IntlMessages id="my_account.PayType" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="my_account.PayType">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["389E5435-67FC-256D-283B-5D2BEBE77252"].AccessRight === "11E6E7B0") ? true : false} type="text" name="PayTypeName" maxLength="50" value={PayTypeName} placeholder={placeholder} id="PayTypeName" onChange={this.handleChange} />
                                        }
                                    </IntlMessages>
                                    {errors.PayTypeName && (<span className="text-danger text-left"><IntlMessages id={errors.PayTypeName} /></span>)}
                                </div>
                            </FormGroup>}
                        {Object.keys(menuDetail).length > 0 &&
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button disabled={loading} variant="raised" className="btn-primary text-white" onClick={this.OnAddReferralPayType}><IntlMessages id="button.add" /></Button>
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
    const { addReferralPayTypeData, loading } = ReferralPayTypeReducer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        addReferralPayTypeData, loading, menuLoading,
        menu_rights
    };
}

export default connect(mapToProps, {
    addReferralPayType,
    getMenuPermissionByID
})(AddReferralPayType);