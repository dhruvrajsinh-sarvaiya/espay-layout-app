/* 
    Developer : Kevin Ladani
    Date : 17-01-2019
    File Comment : MyAccount View Password Policy Configuration Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { Label, Form, FormGroup, Input, Button } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import IntlMessages from "Util/IntlMessages";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { updatePasswordPolicyData, getPasswordPolicyData } from 'Actions/MyAccount';
import { getDeviceInfo, getIPAddress, getHostName, getMode } from "Helpers/helpers";
import validatePasswordPolicy from "Validations/MyAccount/password_policy"
import AppConfig from 'Constants/AppConfig';
import { getMenuPermissionByID } from 'Actions/MyAccount';

//Component for MyAccount Edit Password Policy Configuration Dashboard
class EditPasswordPolicyConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                Id: "",
                PwdExpiretime: "",
                MaxfppwdDay: "",
                MaxfppwdMonth: "",
                LinkExpiryTime: "",
                OTPExpiryTime: "",
                CreatedDate: "",
                UserId: "",
            },
            Getdata: {
                PageIndex: 0,
                PAGE_SIZE: AppConfig.totalRecordDisplayInList,
            },
            DeviceId: getDeviceInfo(),
            IPAddress: '',
            Mode: getMode(),
            HostName: getHostName(),
            loading: false,
            getListValue: true,
            errors: {},
            handle_flag: true,
            flag: true,
            flagPageData: true,
            pageValue: 0,
            fieldList: {},
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        }
        this.initState = this.state;
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    resetData = () => {
        let newObj = Object.assign({}, this.initState);
        newObj.menudetail = this.state.menudetail;
        newObj.handle_flag = this.state.handle_flag;
        this.setState(newObj);
        this.props.drawerClose();
    }

    onChange = (event) => {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    onSubmit = (event) => {
        event.preventDefault();
        const { DeviceId, Mode, HostName } = this.state;
        const { errors, isValid } = validatePasswordPolicy(this.state.data);
        this.setState({ errors: errors });
        const { Id, PwdExpiretime, MaxfppwdDay, MaxfppwdMonth, LinkExpiryTime, OTPExpiryTime } = this.state.data;
        if (isValid) {
            let self = this;
            getIPAddress().then(function (IPAddress) {
                self.props.updatePasswordPolicyData({ Id, PwdExpiretime, MaxfppwdDay, MaxfppwdMonth, LinkExpiryTime, OTPExpiryTime, DeviceId, IPAddress, Mode, HostName });
            });
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('1B44B4D9-3ACA-1387-09D7-3063EA2076A0');
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });

        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }

        if ((nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) && this.state.handle_flag) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg); //added by Bharat Jograna for errMsg
            this.setState({ handle_flag: false });
        } else if (nextProps.data.ReturnCode === 0 && this.state.handle_flag) {
            this.setState({ handle_flag: false });
            NotificationManager.success(nextProps.data.ReturnMsg); //added by Bharat Jograna for success_msg
            setTimeout(() => this.props.getPasswordPolicyData(this.state.Getdata), 2000);
            this.props.drawerClose();
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
        var menuDetail = this.checkAndGetMenuAccessDetail('C0ABC7D9-38A4-0F58-92C8-D4C5853C9A1E');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        const { PwdExpiretime, MaxfppwdDay, MaxfppwdMonth, LinkExpiryTime, OTPExpiryTime } = this.state.data;
        const { loading, errors } = this.state;
        const { drawerClose } = this.props;

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.editPasswordPolicy" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.props.menuLoading || loading) && <JbsSectionLoader />}
                <div>
                    <Form className="tradefrm">
                        {(menuDetail["65E0AC15-2BF8-68F5-7777-CFC330866506"] && menuDetail["65E0AC15-2BF8-68F5-7777-CFC330866506"].Visibility === "E925F86B") && //65E0AC15-2BF8-68F5-7777-CFC330866506
                            <FormGroup className="row">
                                <Label for="PwdExpiretime" className="control-label col"><IntlMessages id="my_account.expireTime" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-8 col-xs-12">
                                    <Input disabled={(menuDetail["65E0AC15-2BF8-68F5-7777-CFC330866506"].AccessRight === "11E6E7B0") ? true : false} type="text" name="PwdExpiretime" value={PwdExpiretime} id="PwdExpiretime" onChange={this.onChange} />
                                    {errors.PwdExpiretime && <div className="text-danger text-left"><IntlMessages id={errors.PwdExpiretime} /></div>}
                                </div>
                            </FormGroup>
                        }
                        {(menuDetail["E0636D03-0A63-4893-426A-32B7659C22E9"] && menuDetail["E0636D03-0A63-4893-426A-32B7659C22E9"].Visibility === "E925F86B") && //E0636D03-0A63-4893-426A-32B7659C22E9
                            <FormGroup className="row">
                                <Label for="MaxfppwdDay" className="control-label col"><IntlMessages id="my_account.forgotPassword" /><span className="text-danger">*</span></Label>
                                <div className="col-md-4 col-sm-4 col-xs-4">
                                    <Input disabled={(menuDetail["E0636D03-0A63-4893-426A-32B7659C22E9"].AccessRight === "11E6E7B0") ? true : false} type="text" name="MaxfppwdDay" value={MaxfppwdDay} id="MaxfppwdDay" placeholder="Days" onChange={this.onChange} />
                                    {errors.MaxfppwdDay && <div className="text-danger text-left"><IntlMessages id={errors.MaxfppwdDay} /></div>}
                                </div>
                                <div className="col-md-4 col-sm-4 col-xs-4">
                                    <Input disabled={(menuDetail["E0636D03-0A63-4893-426A-32B7659C22E9"].AccessRight === "11E6E7B0") ? true : false} type="text" name="MaxfppwdMonth" value={MaxfppwdMonth} id="MaxfppwdMonth" placeholder="Months" onChange={this.onChange} />
                                    {errors.MaxfppwdMonth && <div className="text-danger text-left"><IntlMessages id={errors.MaxfppwdMonth} /></div>}
                                </div>
                            </FormGroup>
                        }
                        {(menuDetail["FC938126-5167-14E8-6BEA-2823CDA30EDC"] && menuDetail["FC938126-5167-14E8-6BEA-2823CDA30EDC"].Visibility === "E925F86B") && //FC938126-5167-14E8-6BEA-2823CDA30EDC
                            <FormGroup className="row">
                                <Label for="LinkExpiryTime" className="control-label col"><IntlMessages id="my_account.linkExpireTime" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-8 col-xs-12">
                                    <Input disabled={(menuDetail["FC938126-5167-14E8-6BEA-2823CDA30EDC"].AccessRight === "11E6E7B0") ? true : false} type="text" name="LinkExpiryTime" value={LinkExpiryTime} id="LinkExpiryTime" onChange={this.onChange} />
                                    {errors.LinkExpiryTime && <div className="text-danger text-left"><IntlMessages id={errors.LinkExpiryTime} /></div>}
                                </div>
                            </FormGroup>
                        }
                        {(menuDetail["DACA4803-A4F0-93EA-7E72-B4CD47197F11"] && menuDetail["DACA4803-A4F0-93EA-7E72-B4CD47197F11"].Visibility === "E925F86B") && //DACA4803-A4F0-93EA-7E72-B4CD47197F11
                            <FormGroup className="row">
                                <Label for="OTPExpiryTime" className="control-label col"><IntlMessages id="my_account.otpExpireTime" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-8 col-xs-12">
                                    <Input disabled={(menuDetail["DACA4803-A4F0-93EA-7E72-B4CD47197F11"].AccessRight === "11E6E7B0") ? true : false} type="text" name="OTPExpiryTime" value={OTPExpiryTime} id="OTPExpiryTime" onChange={this.onChange} />
                                    {errors.OTPExpiryTime && <div className="text-danger text-left"><IntlMessages id={errors.OTPExpiryTime} /></div>}
                                </div>
                            </FormGroup>
                        }
                        {Object.keys(menuDetail).length > 0 &&
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-4 col-sm-8 col-xs-12">
                                    <div className="btn_area">
                                        <Button variant="raised" onClick={this.onSubmit} color="primary"><IntlMessages id="sidebar.btnEdit" /></Button>
                                        <Button variant="raised" onClick={this.resetData} color="danger" className="ml-15"><IntlMessages id="sidebar.btnCancel" /></Button>
                                    </div>
                                </div>
                            </FormGroup>
                        }
                    </Form>
                </div>
            </div>
        );
    }
}

const mapPropsToState = ({ passwordPolicyRdcer, authTokenRdcer }) => {
    const { data, loading } = passwordPolicyRdcer;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { data, loading, menuLoading, menu_rights };
}

export default connect(mapPropsToState, {
    updatePasswordPolicyData, getPasswordPolicyData,
    getMenuPermissionByID
})(EditPasswordPolicyConfig);