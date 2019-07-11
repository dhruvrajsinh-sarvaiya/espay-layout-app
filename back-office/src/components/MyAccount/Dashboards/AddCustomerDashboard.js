/* 
    Developer : Kevin Ladani
    Date : 30-11-2018
    File Comment : MyAccount Add Customer Dashboard Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import { FormGroup, Form, Input, Label, Button } from "reactstrap";
import $ from "jquery";
import PhoneInput from 'react-phone-number-input';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import 'react-phone-number-input/style.css';
import { addCustomers, getCustomerRptData } from "Actions/MyAccount";
import { getDeviceInfo, getIPAddress, getHostName, getMobileNoWithCountryCode } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
import validateAddCustomer from "Validations/MyAccount/add_customer";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';

//Component for MyAccount Add Customer Dashboard
class AddCustomerDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                username: '',
                firstname: '',
                lastname: '',
                email: '',
                mobile: '',
                deviceId: getDeviceInfo(),
                mode: 'Web',
                ipAddress: '', //getIPAddress(),
                hostName: getHostName(),
                CountryCode: ''
            },
            tem_mobile: '',
            CountryCode: AppConfig.defaultCountryCode,
            loading: false,
            open: true,
            isButtonDisabled: false,
            errors: {},
            Ntf_flage: true,
            fieldList: {},// Added by Saloni For Field Prmission
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
            recallapi: false,

        };
        this.initState = this.state;
    }

    resetData = () => {
        let newObj = Object.assign({}, this.initState);
        newObj.menudetail = this.state.menudetail;
        newObj.recallapi = true;
        this.setState(newObj);
        this.props.drawerClose();
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('416D2A26-5B4C-1D31-6EA9-4001191D4571'); // get customer menu permission
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.recallapi) {
            this.props.getMenuPermissionByID('416D2A26-5B4C-1D31-6EA9-4001191D4571'); // get customer menu permission
        }
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            }

            else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
        }

        if (this.state.Ntf_flage && (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9)) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg); //added by Bharat Jograna for errMsg
            this.setState({ isButtonDisabled: false, Ntf_flage: false });
        } else if (this.state.Ntf_flage && nextProps.data.ReturnCode === 0) {
            NotificationManager.success(nextProps.reply_data.ReturnMsg); //added by Bharat Jograna for success_msg
            this.setState(this.initState, { isButtonDisabled: false, Ntf_flage: false });
            this.props.getCustomerRptData(0, AppConfig.totalRecordDisplayInList);
            this.props.drawerClose();
        }
    }

    onCountryChange(mobile) {
        var countryCode = $('#countryCode select').val();
        this.setState({ CountryCode: countryCode });
        if (typeof mobile !== 'undefined') {
            this.setState({ tem_mobile: mobile });
        } else {
            this.setState({ tem_mobile: '' })
        }
    }

    onChange = (event) => {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    onSubmit = (event) => {
        event.preventDefault();
        this.setState({
            data: {
                ...this.state.data,
                mobile: this.state.tem_mobile + '',
                countryCode: this.state.CountryCode,
            }
        })

        setTimeout(() => {
            const { errors, isValid } = validateAddCustomer(this.state.data);
            this.setState({ errors: errors });

            if (isValid) {
                this.setState({ isButtonDisabled: true })
                var mObj = getMobileNoWithCountryCode(this.state.tem_mobile);

                let customerObj = Object.assign({}, this.state.data);
                customerObj['mobile'] = mObj.mobile;

                let self = this;
                getIPAddress().then(function (ipAddress) {
                    customerObj['ipAddress'] = ipAddress;
                    self.props.addCustomers(customerObj);
                });
            }
        }, 100)
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
        const { drawerClose, } = this.props;
        const { tem_mobile, loading, errors, CountryCode, } = this.state;
        const { username, firstname, lastname, email } = this.state.data;
        var menuDetail = this.checkAndGetMenuAccessDetail('43625463-1854-8A81-064A-1FA92F52847B');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.addCustomer" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form className="tradefrm">
                        {(menuDetail['E8D60580-10F4-519C-4712-82C9CDF56BBF'] && menuDetail['E8D60580-10F4-519C-4712-82C9CDF56BBF'].Visibility === "E925F86B") &&  //E8D60580-10F4-519C-4712-82C9CDF56BBF
                            <FormGroup row>
                                <Label for="firstName" className="control-label col"><IntlMessages id="my_account.common.firstName" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="myaccount.enterFirstName">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail['E8D60580-10F4-519C-4712-82C9CDF56BBF'].AccessRight === "11E6E7B0") ? true : false} type="text" value={firstname} name="firstname" id="firstname" className="has-input input-md" placeholder={placeholder} onChange={this.onChange} />
                                        }
                                    </IntlMessages>
                                    {errors.firstname && (<span className="text-danger text-left"><IntlMessages id={errors.firstname} /></span>)}
                                </div>
                            </FormGroup>
                        }
                        {(menuDetail['2D08B279-0375-302C-7DBE-AE04F32D9353'] && menuDetail['2D08B279-0375-302C-7DBE-AE04F32D9353'].Visibility === "E925F86B") && //2D08B279-0375-302C-7DBE-AE04F32D9353
                            <FormGroup row>
                                <Label for="lastName" className="control-label col"><IntlMessages id="my_account.common.lastName" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="myaccount.enterLastName">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail['2D08B279-0375-302C-7DBE-AE04F32D9353'].AccessRight === "11E6E7B0") ? true : false} type="text" value={lastname} name="lastname" id="lastname" className="has-input input-md" placeholder={placeholder} onChange={this.onChange} />
                                        }
                                    </IntlMessages>
                                    {errors.lastname && (<span className="text-danger text-left"><IntlMessages id={errors.lastname} /></span>)}
                                </div>
                            </FormGroup>
                        }
                        {(menuDetail["A867103F-36C2-264E-172D-D3B6B22F34B1"] && menuDetail["A867103F-36C2-264E-172D-D3B6B22F34B1"].Visibility === "E925F86B") && //A867103F-36C2-264E-172D-D3B6B22F34B1
                            <FormGroup row >
                                <Label for="userName" className="control-label col "><IntlMessages id="my_account.common.userName" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="myaccount.enterUsername">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["A867103F-36C2-264E-172D-D3B6B22F34B1"].AccessRight === "11E6E7B0") ? true : false} type="text" value={username} name="username" id="username" className="has-input input-md" placeholder={placeholder} onChange={this.onChange} />
                                        }
                                    </IntlMessages>
                                    {errors.username && (<span className="text-danger text-left"><IntlMessages id={errors.username} /></span>)}
                                </div>
                            </FormGroup>
                        }
                        {(menuDetail["3935B838-90CA-2873-18B0-0C3739BC6CB6"] && menuDetail["3935B838-90CA-2873-18B0-0C3739BC6CB6"].Visibility === "E925F86B") && //3935B838-90CA-2873-18B0-0C3739BC6CB6
                            <FormGroup row >
                                <Label for="email" className="control-label col"><IntlMessages id="my_account.common.email" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <IntlMessages id="myaccount.enterEmailAdd">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["3935B838-90CA-2873-18B0-0C3739BC6CB6"].AccessRight === "11E6E7B0") ? true : false} type="email" value={email} name="email" id="email" className="has-input input-md" placeholder={placeholder} onChange={this.onChange} />
                                        }
                                    </IntlMessages>
                                    {errors.email && (<span className="text-danger text-left"><IntlMessages id={errors.email} /></span>)}
                                </div>
                            </FormGroup>
                        }
                        {(menuDetail["6333C516-7212-0F94-1A35-203542723DD1"] && menuDetail["6333C516-7212-0F94-1A35-203542723DD1"].Visibility === "E925F86B") && //6333C516-7212-0F94-1A35-203542723DD1
                            <FormGroup row>
                                <Label for="mobileNumber" className="control-label col"><IntlMessages id="my_account.common.mobileNumber" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-9 col-xs-12" id="countryCode">
                                    <IntlMessages id="myaccount.enterMobileNo">
                                        {(placeholder) =>
                                            <PhoneInput disabled={(menuDetail["6333C516-7212-0F94-1A35-203542723DD1"].AccessRight === "11E6E7B0") ? true : false} className="has-input input-lg img-flag Organization_addcustomer" name="tem_mobile" id="tem_mobile" country={CountryCode} limitMaxLength={true} international={false} placeholder={placeholder} value={tem_mobile} onChange={(e) => this.onCountryChange(e)} />
                                        }
                                    </IntlMessages>
                                    {errors.mobile && (<span className="text-danger text-left"><IntlMessages id={errors.mobile} /></span>)}
                                </div>
                            </FormGroup>
                        }
                        {Object.keys(menuDetail).length > 0 &&
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button variant="raised" color="primary" disabled={this.state.isButtonDisabled} className="text-white" onClick={this.onSubmit}><IntlMessages id="button.add" /></Button>
                                        <Button variant="raised" className="ml-15 btn-danger text-white" onClick={this.resetData}><IntlMessages id="button.cancel" /></Button>
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

const mapToProps = ({ costomers, authTokenRdcer }) => {
    const { data, loading } = costomers;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        data, loading, menuLoading,
        menu_rights
    };
}

export default connect(mapToProps, {
    addCustomers,
    getMenuPermissionByID,
    getCustomerRptData
})(AddCustomerDashboard);