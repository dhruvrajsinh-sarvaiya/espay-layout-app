/* 
    Developer : Kevin Ladani
    Date : 24-11-2018
    File Comment : Add Priority Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { FormGroup, Form, Input, Label, Button } from "reactstrap";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { addSLAConfiguration } from "Actions/MyAccount";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import { getDeviceInfo, getIPAddress, getHostName, getMode } from "Helpers/helpers";
import validateSLAForm from "Validations/MyAccount/sla_configuration";
import { getMenuPermissionByID } from 'Actions/MyAccount';

class AddSLAPriorityDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
                Priority: "",
                PriorityTime: "",
                Timewith: '',
                DeviceId: getDeviceInfo(),
                Mode: getMode(),
                IPAddress: '',
                HostName: getHostName(),
            },
            loading: false,
            errors: "",
            Ntf_flage: true,
            dataList: {},
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
        newObj.Ntf_flage = this.state.Ntf_flage;
        this.setState(newObj);
        this.props.drawerClose();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    showComponent = componentName => {
        this.setState({
            componentName: componentName,
            open: this.state.open ? false : true
        });
    };

    handleChange = (event) => {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    OnAddPriority = (event) => {
        event.preventDefault();
        const { errors, isValid } = validateSLAForm(this.state.data);
        this.setState({ errors: errors });
        this.setState({ err_alert: false, success_alert: false, errors: errors });
        if (isValid) {
            let self = this;
            var reqObj = Object.assign({}, this.state.data);
            getIPAddress().then(function (IPAddress) {
                reqObj.PriorityTime = reqObj.PriorityTime + " " + reqObj.Timewith;
                reqObj.IPAddress = IPAddress;
                const { Priority, PriorityTime, DeviceId, Mode, HostName } = reqObj;
                self.props.addSLAConfiguration({ Priority, PriorityTime, IPAddress, DeviceId, Mode, HostName });
            });
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('6EA66E8D-6312-64C3-30E2-25F2AC0694C6'); // get myaccount menu permission
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


        if (this.state.Ntf_flage && (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9)) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            NotificationManager.error(errMsg); //added by Bharat Jograna for errMsg
            this.setState({ Ntf_flage: false })
        } else if (this.state.Ntf_flage && nextProps.data.ReturnCode === 0) {
            NotificationManager.success(nextProps.data.ReturnMsg); //added by Bharat Jograna for success_msg
            this.setState({ data: '', open: this.state.open ? false : true, Ntf_flage: false });
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
                        response = fieldList;
                    }
                }
            }
        }
        return response;
    }

    render() {
        const { drawerClose } = this.props;
        var menuDetail = this.checkAndGetMenuAccessDetail('C326E883-7F5D-8C88-30E0-163E721AA514');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        const { loading, errors } = this.state;
        const { Timewith, Priority, PriorityTime } = this.state.data;

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.addProiority" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.props.menuLoading || loading) && <JbsSectionLoader />}
                <div className="jbs-page-content col-md-12 mx-auto">
                    <Form className="tradefrm">
                        {(menuDetail["968ec89a-32bd-617d-3bbb-6e89f71c80ac"] && menuDetail["968ec89a-32bd-617d-3bbb-6e89f71c80ac"].Visibility === "E925F86B") && //968EC89A-32BD-617D-3BBB-6E89F71C80AC
                            <FormGroup row>
                                <Label for="Priority" className="control-label col" ><IntlMessages id="my_account.priorityName" /><span className="text-danger">*</span></Label>
                                <div className="col-md-8 col-sm-8 col-xs-12">
                                    <IntlMessages id="myaccount.enterPriority">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["968ec89a-32bd-617d-3bbb-6e89f71c80ac"].AccessRight === "11E6E7B0") ? true : false} type="text" name="Priority" value={Priority} placeholder={placeholder} id="Priority" onChange={this.handleChange} />
                                        }
                                    </IntlMessages>
                                    {errors.Priority && (<span className="text-danger"><IntlMessages id={errors.Priority} /></span>)}
                                </div>
                            </FormGroup>
                        }
                        {(menuDetail["a4a11467-1770-21c3-4094-7a4ec53024a7"] && menuDetail["a4a11467-1770-21c3-4094-7a4ec53024a7"].Visibility === "E925F86B") && //a4a11467-1770-21c3-4094-7a4ec53024a7
                            <FormGroup row>
                                <Label for="PriorityTime" className="control-label col"><IntlMessages id="my_account.priorityTime" /><span className="text-danger">*</span></Label>
                                <div className="col-md-4 col-sm-4 col-xs-4">
                                    <IntlMessages id="myaccount.enterTime">
                                        {(placeholder) =>
                                            <Input disabled={(menuDetail["a4a11467-1770-21c3-4094-7a4ec53024a7"].AccessRight === "11E6E7B0") ? true : false} type="text" name="PriorityTime" value={PriorityTime} id="PriorityTime" placeholder={placeholder} onChange={this.handleChange} />
                                        }
                                    </IntlMessages>
                                    {errors.PriorityTime && (<span className="text-danger text-left"><IntlMessages id={errors.PriorityTime} /></span>)}
                                </div>
                                <div className="col-md-4 col-sm-4 col-xs-4">
                                    <Input disabled={(menuDetail["a4a11467-1770-21c3-4094-7a4ec53024a7"].AccessRight === "11E6E7B0") ? true : false} type="select" name="Timewith" className="form-control" id="Timewith" value={Timewith} onChange={this.handleChange}>
                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.hours">{(selectOption) => <option value="Hours">{selectOption}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.minutes">{(selectOption) => <option value="Minutes">{selectOption}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.days">{(selectOption) => <option value="Days">{selectOption}</option>}</IntlMessages>
                                    </Input>
                                    {errors.Timewith && (<span className="text-danger text-left"><IntlMessages id={errors.Timewith} /></span>)}
                                </div>
                            </FormGroup>
                        }
                        {Object.keys(menuDetail).length > 0 &&
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-4 col-sm-8 col-xs-12">
                                    <div className="btn_area">
                                        <Button variant="raised" color="primary" className="text-white" onClick={this.OnAddPriority}><IntlMessages id="button.add" /></Button>
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

const mapToProps = ({ slaRdcer, authTokenRdcer }) => {
    const { data, loading } = slaRdcer;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { data, loading, menuLoading, menu_rights };
}

export default connect(mapToProps, {
    addSLAConfiguration,
    getMenuPermissionByID
})(AddSLAPriorityDashboard);