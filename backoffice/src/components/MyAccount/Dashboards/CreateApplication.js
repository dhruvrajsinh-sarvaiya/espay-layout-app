// update by : Bharat Jograna(BreadCrumb)09 March 2019

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Label, Form, FormGroup, Input, Alert, Button, Col, Row, Card, CardTitle, CardText, CardImg, CardImgOverlay } from "reactstrap";

// added by Bharat Jograna for Loader and NotificationManager
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { addAppConfiguration, getAppDomainData, listActiveApplicationData, getApplicationList } from 'Actions/MyAccount';
// import { DashboardPageTitle } from './DashboardPageTitle';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Application from '../../../assets/image/application.jpg';
import {
    getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode
} from "Helpers/helpers";

//Validation
const validateApplicationConfig = require("../../../validation/MyAccount/add_Application_Config");

//BreadCrumbData
const BreadCrumbData = [
    {
        title: <IntlMessages id="sidebar.app" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.dashboard" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.adminPanel" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.appConfig" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.createApplication" />,
        link: '',
        index: 2
    }
];

class CreateAppliCation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                DomainId: '',
                AppId: '',
                AppName: '',
                DeviceId: getDeviceInfo(),
                Mode: getMode(),
                IPAddress: '',
                HostName: getHostName(),
            },
            loading: false,
            getListValue: true,
            errors: {},
            DomainData: [],
            PageIndex: 0,
            PAGE_SIZE: 100,
            ActiveApplicationList: [],
            open: false
        };
        //this.initState = this.state.data;
        this.onChange = this.onChange.bind(this);
        this.handalChange = this.handalChange.bind(this);
        this.addApplication = this.addApplication.bind(this);
        this.resetData = this.resetData.bind(this);
        this.resetOnAdd = this.resetOnAdd.bind(this);
    }
    resetOnAdd() {
        this.setState(
            {
                data:
                {
                    DomainId: '',
                    AppId: '',
                    AppName: '',
                    DeviceId: getDeviceInfo(),
                    Mode: getMode(),
                    IPAddress: '',
                    HostName: getHostName()
                },
                errors: {}
            });
    }

    resetData() {
        this.setState(
            {
                data:
                {
                    DomainId: '',
                    AppId: '',
                    AppName: '',
                    DeviceId: getDeviceInfo(),
                    Mode: getMode(),
                    IPAddress: '',
                    HostName: getHostName()
                },
                errors: {}
            });
        this.props.drawerClose();
    }

    componentWillMount() {
        this.props.getAppDomainData();
        this.getListActiveApplication();
    }

    getListApplication() {
        const reqObj = {
            PageIndex: this.state.PageIndex,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        this.props.getApplicationList(reqObj);
    }

    onChange(event) {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }
    handalChange(key, value) {
        this.setState({
            data: {
                ...this.state.data,
                [key]: value
            }
        });
    }
    addApplication(event) {
        event.preventDefault();
        const { errors, isValid } = validateApplicationConfig(this.state.data);
        this.setState({ errors: errors });
        this.setState({ err_alert: false, success_alert: false, errors: errors, get_info: 'show' });
        if (isValid) {
            var reqObj = Object.assign({}, this.state.data);
            let self = this;
            getIPAddress().then(function (ipAddress) {
                reqObj.IPAddress = ipAddress;
                self.props.addAppConfiguration(reqObj);
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        // To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }

        this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });
        if (nextProps.createAppData.ReturnCode === 1) {
            var errMsg = nextProps.createAppData.ErrorCode === 1 ? nextProps.createAppData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.createAppData.ErrorCode}`} />;

            // added by Bharat Jograna for errMsg
            NotificationManager.error(errMsg);
        } else if (nextProps.createAppData.ReturnCode === 0) {
            let success_msg = this.state.get_info === 'hide' ? '' : nextProps.createAppData.ReturnMsg;

            //added by Bharat Jograna for success_msg
            NotificationManager.success(success_msg);

            this.setState({ data: '' });
            setTimeout(function () {
                this.setState({ success_alert: false });
                this.getListApplication();
                this.resetOnAdd();
                this.props.drawerClose();
            }.bind(this), 2000);
        }

        if (nextProps.getAppDomain) {
            this.setState({
                DomainData: nextProps.getAppDomain.GetUserWiseDomainData
            })
        }
        if (Object.keys(nextProps.ActiveApplicationData).length > 0
            && nextProps.ActiveApplicationData.hasOwnProperty('GetTotalActiveApplicationList')
            && Object.keys(nextProps.ActiveApplicationData.GetTotalActiveApplicationList).length > 0) {
            this.setState({ ActiveApplicationList: nextProps.ActiveApplicationData.GetTotalActiveApplicationList });
        }
    }
    getListActiveApplication() {
        const reqObj = {
            PageIndex: this.state.PageIndex,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        this.props.listActiveApplicationData(reqObj);
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }
    render() {
        const { ActiveApplicationList } = this.state;
        const { err_alert, err_msg, success_msg, success_alert, loading, errors } = this.state;
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.createApplication" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div>
                    {loading && <JbsSectionLoader />}
                    <Form className="tradefrm">
                        <Row>
                            <Col sm="2">
                                <Label for="ApplicationName" className="control-label"><IntlMessages id="sidebar.ApplicationName" /></Label>
                            </Col>
                            <Col sm="4">
                                <Input type="text" name="AppName" maxLength="250" id="ApplicationName" onChange={this.onChange} />
                                {errors.AppName && <div className="text-danger text-left"><IntlMessages id={errors.AppName} /></div>}
                            </Col>
                            <Col sm="6" />
                        </Row>
                        <Row className="mt-10 mb-10">
                            <Col sm="2">
                                <Label for="DomainId"><IntlMessages id="sidebar.DomainName" /></Label>
                            </Col>
                            <Col sm="4">
                                <Input
                                    type="select"
                                    name="DomainId"
                                    id="DomainId"
                                    value={this.state.data.DomainId}
                                    onChange={this.onChange}
                                >
                                    <option value="">-- Select Type --</option>
                                    {this.props.getAppDomain.hasOwnProperty("GetUserWiseDomainData")
                                        && this.props.getAppDomain.GetUserWiseDomainData.length
                                        && this.props.getAppDomain.GetUserWiseDomainData.map((list, index) => (
                                            <option key={index} value={list.Id}>
                                                {list.DomainName}
                                            </option>
                                        ))}
                                </Input>
                                {errors.DomainId && <div className="text-danger text-left"><IntlMessages id={errors.DomainId} /></div>}
                            </Col>
                            <Col sm="6" />
                        </Row>
                        <div className="row">
                            {
                                ActiveApplicationList.length > 0
                                    ?
                                    <Fragment>
                                        {
                                            ActiveApplicationList.map((list, index) => {
                                                return [
                                                    <div className="col-sm-12 col-md-3 w-xs-full mb-10" key={index}>
                                                        <a className="createAppBox"
                                                            href="javascript:void(0)"
                                                            onClick={e => this.handalChange("AppId", list.Id)

                                                            }>

                                                            <Card>
                                                                <CardImg top className="img-fluid" src={Application} alt="Application" />
                                                                <CardImgOverlay className="createAppImg">
                                                                    <CardTitle>{list.ApplicationName}</CardTitle>
                                                                    <CardText>{list.Description}</CardText>
                                                                </CardImgOverlay>
                                                            </Card>

                                                        </a>
                                                    </div>
                                                ]
                                            })
                                        }
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <div className="text-center col-md-12">No record found.</div>
                                    </Fragment>
                            }
                        </div>
                        {errors.AppId && <div className="text-danger text-left"><IntlMessages id={errors.AppId} /></div>}
                        <FormGroup className="offset-md-4 mt-20">
                            <Button disabled={loading} onClick={this.addApplication} color="primary" className="mr-10"><IntlMessages id="sidebar.btnAdd" /></Button>
                            <Button onClick={this.resetData} color="danger"><IntlMessages id="sidebar.btnCancel" /></Button>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = ({ ApplicationConfig, appDashRdcer, drawerclose }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }

    const { getAppDomain, createAppData, loading } = ApplicationConfig;
    const { ActiveApplicationData } = appDashRdcer;
    return { getAppDomain, createAppData, loading, ActiveApplicationData, drawerclose };
};

export default connect(mapDispatchToProps, {
    getAppDomainData,
    listActiveApplicationData,
    addAppConfiguration,
    getApplicationList
})(CreateAppliCation);

