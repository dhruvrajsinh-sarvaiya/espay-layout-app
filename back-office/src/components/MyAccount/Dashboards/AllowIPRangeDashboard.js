/* 
    Developer : Kevin Ladani
    Date : 24-11-2018
    File Comment : Allow IP Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { FormGroup, Form, Input, Label, Button } from "reactstrap";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import { addIPRangeData } from "Actions/MyAccount";
import { getDeviceInfo, getIPAddress, getHostName, getMode } from "Helpers/helpers";
import validateIPProfilingDashboard from "Validations/MyAccount/ip_profiling_dashboard"
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
class AllowIPRangeDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                StartIp: "",
                EndIp: "",
                DeviceId: getDeviceInfo(),
                Mode: getMode(),
                IPAddress: '',
                HostName: getHostName(),
            },
            loading: false,
            errors: "",
            Ntf_flage: true,
            fieldList: {},
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
        this.initState = this.state;
    }

    resetData = () => {
        let newObj = Object.assign({}, this.initState);
        newObj.menudetail = this.state.menudetail;
        this.setState(newObj);
        this.props.drawerClose();
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
        this.props.getMenuPermissionByID('8BEDCE52-9C43-99B7-6A01-BAD136DD77A3');
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
    }

    OnSave = (event) => {
        event.preventDefault();
        let ipvalue = this.state.data.StartIp.split(".");
        let EndIpValue = ipvalue[0] + "." + ipvalue[1] + "." + ipvalue[2] + "." + this.state.data.EndIp;
        const { errors, isValid } = validateIPProfilingDashboard(this.state.data);
        this.setState({ err_alert: false, success_alert: false, errors: errors });
        if (isValid) {
            let self = this;
            var reqObj = Object.assign({}, this.state.data);
            getIPAddress().then(function (ipAddress) {
                reqObj.IPAddress = ipAddress;
                reqObj.Mode = getMode();
                reqObj.DeviceId = getDeviceInfo();
                reqObj.HostName = getHostName();
                reqObj.EndIp = EndIpValue;
                self.props.addIPRangeData(reqObj);
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
        const { drawerClose } = this.props;
        const { loading, errors } = this.state;
        const { StartIp, EndIp } = this.state.data;
        var menuDetail = this.checkAndGetMenuAccessDetail('124AEB2C-5701-7B6B-3E88-E822C9009B9D');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <Fragment>
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.allowIPRange" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="jbs-page-content col-md-12 mx-auto">
                        {(this.props.menuLoading || loading) && <JbsSectionLoader />}
                        <Form className="tradefrm">
                            <FormGroup row>
                                {(menuDetail["CB54F01C-3070-A454-07BF-36E0A1A95CD1"] && menuDetail["CB54F01C-3070-A454-07BF-36E0A1A95CD1"].Visibility === "E925F86B") && //CB54F01C-3070-A454-07BF-36E0A1A95CD1
                                    <Label for="StartIp" className="control-label col"><IntlMessages id="my_account.startIp" /><span className="text-danger">*</span></Label>
                                }
                                {(menuDetail["CB54F01C-3070-A454-07BF-36E0A1A95CD1"] && menuDetail["CB54F01C-3070-A454-07BF-36E0A1A95CD1"].Visibility === "E925F86B") && //CB54F01C-3070-A454-07BF-36E0A1A95CD1
                                    <div className="col-md-7 col-sm-6 col-xs-12">
                                        <IntlMessages id="my_account.startIp">
                                            {(placeholder) =>
                                                <Input disabled={(menuDetail["CB54F01C-3070-A454-07BF-36E0A1A95CD1"].AccessRight === "11E6E7B0") ? true : false} type="text" name="StartIp" maxLength="15" value={StartIp} placeholder={placeholder} id="StartIp" onChange={this.handleChange} />
                                            }
                                        </IntlMessages>
                                    </div>
                                }
                                <div className="col-md-1 col-sm-1 col-xs-12 demo d-xs-none"></div>
                                {(menuDetail["8D5384CC-1A52-69AE-5FBD-BE1C6D2D2790"] && menuDetail["8D5384CC-1A52-69AE-5FBD-BE1C6D2D2790"].Visibility === "E925F86B") && //8D5384CC-1A52-69AE-5FBD-BE1C6D2D2790
                                    <div className="col-md-2 col-sm-3 col-xs-12">
                                        <IntlMessages id="my_account.endIp">
                                            {(placeholder) =>
                                                <Input disabled={(menuDetail["8D5384CC-1A52-69AE-5FBD-BE1C6D2D2790"].AccessRight === "11E6E7B0") ? true : false} type="text" name="EndIp" maxLength="3" value={EndIp} id="EndIp" placeholder={placeholder} onChange={this.handleChange} />
                                            }
                                        </IntlMessages>
                                    </div>
                                }
                            </FormGroup>
                            {(errors.StartIp || errors.EndIp) &&
                                <FormGroup row className="mb-20">
                                    <Label className="col-md-2" />
                                    {(menuDetail["CB54F01C-3070-A454-07BF-36E0A1A95CD1"] && menuDetail["CB54F01C-3070-A454-07BF-36E0A1A95CD1"].Visibility === "E925F86B") && //CB54F01C-3070-A454-07BF-36E0A1A95CD1
                                        <div className="col-md-4">
                                            {errors.StartIp && (<span className="text-danger text-left"><IntlMessages id={errors.StartIp} /></span>)}
                                        </div>
                                    }
                                    <Label className="col-md-2" />
                                    {(menuDetail["8D5384CC-1A52-69AE-5FBD-BE1C6D2D2790"] && menuDetail["8D5384CC-1A52-69AE-5FBD-BE1C6D2D2790"].Visibility === "E925F86B") && //8D5384CC-1A52-69AE-5FBD-BE1C6D2D2790
                                        <div className="col-md-4">
                                            {errors.EndIp && (<span className="text-danger text-left"><IntlMessages id={errors.EndIp} /></span>)}
                                        </div>
                                    }
                                </FormGroup>}
                            {Object.keys(menuDetail).length > 0 &&
                                <FormGroup className="offset-md-2 col-md-10 offset-sm-2 col-sm-10 col-xs-12 p-0">
                                    <div className="btn_area">
                                        <Button variant="raised" color="primary" className="text-white" onClick={this.OnSave}><IntlMessages id="button.add" /></Button>
                                        <Button variant="raised" className="ml-15 btn-danger text-white" onClick={this.resetData}><IntlMessages id="button.cancel" /></Button>
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

const mapToProps = ({ ipProfilingRdcer, authTokenRdcer }) => {
    const { data, loading } = ipProfilingRdcer;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { data, loading, menuLoading, menu_rights };
}

export default connect(mapToProps, {
    addIPRangeData,
    getMenuPermissionByID
})(AllowIPRangeDashboard);