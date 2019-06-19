/* 
    Developer : Salim Deraiya
    Date : 27-11-2018
    update by Sanjay : 06-02-2019 (code for drawar), Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount Total Application Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { Card, Button, CardTitle, CardText, CardImg, CardBody, Alert, Input, Row, Col } from 'reactstrap';
import Pagination from "react-js-pagination";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { listApplicationData, activeApplication, inactiveApplication, getApplicationData } from 'Actions/MyAccount';
// import { DashboardPageTitle } from './DashboardPageTitle';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Application from '../../../assets/image/application.jpg';
import {
    getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode
} from "Helpers/helpers";

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
        title: <IntlMessages id="sidebar.applicationDashboard" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.totalApplication" />,
        link: '',
        index: 2
    }
];

// Component for MyAccount Total Application Dashboard
class TotalApplicationDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            PageIndex: 1,
            PAGE_SIZE: 8,
            totalCount: 0,
            TotalApplicationList: [],
            changeStatus: {
                Id: '',
                DeviceId: getDeviceInfo(),
                Mode: getMode(),
                IPAddress: '',
                HostName: getHostName(),
            },
            err_msg: '',
            err_alert: true,
            success_msg: '',
            success_alert: true,
            errors: {}
        }
    }

    componentWillMount() {
        this.getListApplication();
    }

    componentWillReceiveProps(nextProps) {
        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        // To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }

        this.setState({ err_msg: '', err_alert: false, success_msg: '', success_alert: false });

        if (nextProps.activeApp.ReturnCode === 1) {
            var errMsgActive = nextProps.activeApp.ErrorCode === 1 ? nextProps.activeApp.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.activeApp.ErrorCode}`} />;
            this.setState({ err_alert: true, err_msg: errMsgActive });
        } else if (nextProps.activeApp.ReturnCode === 0) {
            this.setState({ success_msg: nextProps.activeApp.ReturnMsg, success_alert: true });
            this.getListApplication();
            this.props.getApplicationData();
        }

        if (nextProps.inActiveApp.ReturnCode === 1) {
            var errMsgInActive = nextProps.inActiveApp.ErrorCode === 1 ? nextProps.inActiveApp.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.inActiveApp.ErrorCode}`} />;
            this.setState({ err_alert: true, err_msg: errMsgInActive });
        } else if (nextProps.inActiveApp.ReturnCode === 0) {
            this.setState({ success_msg: nextProps.inActiveApp.ReturnMsg, success_alert: true });
            this.getListApplication();
            this.props.getApplicationData();
        }

        if (Object.keys(nextProps.ListTotalApplicationData).length > 0
            && nextProps.ListTotalApplicationData.hasOwnProperty('GetTotalApplicationList')
            && Object.keys(nextProps.ListTotalApplicationData.GetTotalApplicationList).length > 0) {
            this.setState({ TotalApplicationList: nextProps.ListTotalApplicationData.GetTotalApplicationList, totalCount: nextProps.ListTotalApplicationData.TotalCount });
        }
    }

    onEnableDomain(Id) {
        this.setState({ err_alert: false, success_alert: false });
        const newObj = Object.assign({}, this.state.changeStatus);
        newObj.Id = Id;
        let self = this;
        getIPAddress().then(function (ipAddress) {
            newObj.IPAddress = ipAddress;
            self.props.activeApplication(newObj);
        });
    }

    onDisableDomain(Id) {
        this.setState({ err_alert: false, success_alert: false });
        const newObj = Object.assign({}, this.state.changeStatus);
        newObj.Id = Id;
        let self = this;
        getIPAddress().then(function (ipAddress) {
            newObj.IPAddress = ipAddress;
            self.props.inactiveApplication(newObj);
        });
    }

    getListApplication() {
        const reqObj = {
            PageIndex: this.state.PageIndex,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        this.props.listApplicationData(reqObj);
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    }

    handlePageChange = (pageNumber) => {
        const reqObj = {
            PageIndex: pageNumber,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        this.setState({ PageIndex: pageNumber });
        this.props.listApplicationData(reqObj);
    }

    onChangeRowsPerPage = event => {
        this.setState({ PAGE_SIZE: event.target.value, PageIndex: 1 });
        const reqObj = {
            PageIndex: 1,
            PAGE_SIZE: event.target.value
        }
        this.props.listApplicationData(reqObj);
    };

    render() {
        const { TotalApplicationList, err_alert, err_msg, success_msg, success_alert, totalCount, PageIndex, PAGE_SIZE } = this.state;
        const { drawerClose, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.customerDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {success_msg && <div className="alert_area">
                    <Alert color="success" isOpen={success_alert} toggle={this.onDismiss}>{success_msg}</Alert>
                </div>}
                {err_msg && <div className="alert_area">
                    <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{err_msg}</Alert>
                </div>}
                <div className="row">
                    {loading && <JbsSectionLoader />}
                    {
                        TotalApplicationList.length > 0
                            ?
                            <Fragment>
                                {
                                    TotalApplicationList.map((list, index) => {
                                        return [
                                            <div className="col-sm-12 col-md-3 w-xs-full mb-10" key={index}>
                                                <div className="card-hight-common">
                                                    <Card className="mb-20">
                                                        <CardImg top width="100%" src={Application} alt="Application" />
                                                        <CardBody>
                                                            <CardTitle>{list.ApplicationName}</CardTitle>
                                                            <CardText>{list.Description}</CardText>
                                                            <Fragment>
                                                                {
                                                                    list.Status
                                                                        ?
                                                                        <Button color="danger" onClick={() => this.onDisableDomain(list.Id)}><IntlMessages id="sidebar.btnDisable" /></Button>
                                                                        :
                                                                        <Button color="success" onClick={() => this.onEnableDomain(list.Id)}><IntlMessages id="sidebar.btnEnable" /></Button>
                                                                }
                                                            </Fragment>
                                                        </CardBody>
                                                    </Card>
                                                </div>
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
                {totalCount > 0 &&
                    <Row>
                        <Col sm={4}><div className="m-15"><IntlMessages id="pagination.totalCount" /> {totalCount}</div></Col>
                        <Col sm={8}>
                            <ul className="text-right m-15 paginationmain">
                                <li className="pagerecord">
                                    <ul>
                                        <li><IntlMessages id="pagination.rowPerPage" /></li>
                                        <li><Input type="select" name="rowPerPage" value={PAGE_SIZE} onChange={this.onChangeRowsPerPage}>
                                            <option>8</option>
                                            <option>24</option>
                                            <option>64</option>
                                            <option>80</option>
                                        </Input>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Pagination
                                        hideDisabled
                                        prevPageText={<span aria-hidden="true" class="ti-angle-left"></span>}
                                        nextPageText={<span aria-hidden="true" class=" ti-angle-right"></span>}
                                        firstPageText={<span aria-hidden="true" class="ti-angle-double-left"></span>}
                                        lastPageText={<span aria-hidden="true" class="ti-angle-double-right"></span>}
                                        activePage={PageIndex}
                                        itemsCountPerPage={PAGE_SIZE}
                                        totalItemsCount={totalCount}
                                        pageRangeDisplayed={5}
                                        onChange={this.handlePageChange}
                                    />
                                </li>
                                <li className="pagerecord">
                                    <span>{PageIndex > 1 ? (1) + (PAGE_SIZE * (PageIndex - 1)) + ' - ' + ((PAGE_SIZE * PageIndex) > totalCount ? (totalCount) : (PAGE_SIZE * PageIndex)) : (1) + ' - ' + ((PAGE_SIZE * PageIndex) > totalCount ? (totalCount) : (PAGE_SIZE * PageIndex))} of {totalCount} Records</span>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                }
            </div >
        );
    }
}

const mapStateToProps = ({ appDashRdcer, drawerclose }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }

    const { ListTotalApplicationData, activeApp, inActiveApp, loading } = appDashRdcer;
    return { ListTotalApplicationData, activeApp, inActiveApp, loading, drawerclose };
}

export default connect(mapStateToProps, {
    listApplicationData,
    activeApplication,
    inactiveApplication,
    getApplicationData
})(TotalApplicationDashboard);
