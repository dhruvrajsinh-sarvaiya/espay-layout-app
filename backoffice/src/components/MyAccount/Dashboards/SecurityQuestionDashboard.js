/* 
    Developer : Kevin Ladani
    Date : 24-11-2018
    File Comment : Security Question Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { FormGroup, Form, Input, Label, Button } from "reactstrap";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import { getDeviceInfo, getIPAddress, getHostName, getMode } from "Helpers/helpers";
import { addSecurityQuestionData } from "Actions/MyAccount";
import validateSecurityQuestionDashboard from "Validations/MyAccount/security_question_dashboard"
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';

class SecurityQuestionDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                SecurityQuestion: "",
                Answer: "",
                DeviceId: getDeviceInfo(),
                Mode: getMode(),
                IPAddress: '',
                HostName: getHostName(),
            },
            get_info: 'hide',
            loading: false,
            errors: "",
            fieldList: {},
            Ntf_flag: true,
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
        this.initState = this.state;
    }

    resetData = () => {
        this.setState(this.initState);
        this.props.drawerClose();
        this.setState({
            menudetail: this.state.menudetail,
            Ntf_flag: false
        })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    handleChange = (event) => {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('5F0AC589-5861-1885-A65B-97B1DB0D7053');

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
        if (this.state.Ntf_flag && (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9)) {
            this.setState({ Ntf_flag: false })
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg); //added by Bharat Jograna for errMsg
            this.setState(this.initState);
        } else if (this.state.Ntf_flag && (nextProps.data.ReturnCode === 0)) {
            NotificationManager.success(nextProps.data.ReturnMsg); //added by Bharat Jograna for success_msg
            this.resetData();
        }
    }

    OnSave = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateSecurityQuestionDashboard(this.state.data);
        this.setState({ err_alert: false, success_alert: false, errors: errors });
        if (isValid) {
            let self = this;
            var reqObj = Object.assign({}, this.state.data);
            getIPAddress().then(function (ipAddress) {
                reqObj.IPAddress = ipAddress;
                self.props.addSecurityQuestionData(reqObj);
            });
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
                            fieldList[item.GUID] = item;
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
        const { drawerClose } = this.props;
        const { loading, errors } = this.state;
        const { SecurityQuestion, Answer } = this.state.data;
        var menuDetail = this.checkAndGetMenuAccessDetail('dda5a04e-4899-26b5-2ed5-1ac7b5222521');
        return (
            <Fragment>
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="my_account.securityQuestion" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                        <Form>
                            {(menuDetail["895904c2-17d2-12f6-9e31-4e1519f9266a"] && menuDetail["895904c2-17d2-12f6-9e31-4e1519f9266a"].Visibility === "E925F86B") && //895904C2-17D2-12F6-9E31-4E1519F9266A
                                <FormGroup row>
                                    <Label for="SecurityQuestion" className="control-label col"><IntlMessages id="my_account.question" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <IntlMessages id="myaccount.enterQuestion">
                                            {(placeholder) =>
                                                <Input disabled={(menuDetail["895904c2-17d2-12f6-9e31-4e1519f9266a"].AccessRight === "11E6E7B0") ? true : false} type="text" name="SecurityQuestion" value={SecurityQuestion} id="question" onKeyPress={this.handleChange} placeholder={placeholder} onChange={this.handleChange} />
                                            }
                                        </IntlMessages>
                                        {errors.SecurityQuestion && (<span className="text-danger"><IntlMessages id={errors.SecurityQuestion} /></span>)}
                                    </div>
                                </FormGroup>
                            }
                            {(menuDetail["de042a2e-2672-58bd-3efb-f2b7dfe51158"] && menuDetail["de042a2e-2672-58bd-3efb-f2b7dfe51158"].Visibility === "E925F86B") && //DE042A2E-2672-58BD-3EFB-F2B7DFE51158
                                <FormGroup row>
                                    <Label for="Answer" className="control-label col"><IntlMessages id="my_account.answer" /><span className="text-danger">*</span></Label>
                                    <div className="col-md-8 col-sm-8 col-xs-12">
                                        <IntlMessages id="myaccount.enterAnswer">
                                            {(placeholder) =>
                                                <Input disabled={(menuDetail["de042a2e-2672-58bd-3efb-f2b7dfe51158"].AccessRight === "11E6E7B0") ? true : false} type="text" name="Answer" value={Answer} id="Answer" placeholder={placeholder} onChange={this.handleChange} />
                                            }
                                        </IntlMessages>
                                        {errors.Answer && (<span className="text-danger"><IntlMessages id={errors.Answer} /></span>)}
                                    </div>
                                </FormGroup>
                            }
                            {menuDetail &&
                                <FormGroup row>
                                    <div className="offset-md-4 col-md-8 offset-sm-4 col-sm-8 col-xs-12">
                                        <div className="btn_area">
                                            <Button variant="raised" color="primary" className="text-white" onClick={this.OnSave}><IntlMessages id="button.save" /></Button>
                                            <Button variant="raised" className="ml-15 btn-danger text-white" onClick={this.resetData}><IntlMessages id="button.cancel" /></Button>
                                        </div>
                                    </div>
                                </FormGroup>
                            }
                        </Form>
                    </div>
                </div>
            </Fragment>
        )
    }
}

const mapToProps = ({ securityQuestionRdcer, authTokenRdcer }) => {
    const { data, loading } = securityQuestionRdcer;
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
    addSecurityQuestionData,
    getMenuPermissionByID
})(SecurityQuestionDashboard);