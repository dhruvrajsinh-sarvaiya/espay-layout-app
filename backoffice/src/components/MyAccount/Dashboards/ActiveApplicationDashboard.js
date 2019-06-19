/* 
    Developer : Salim Deraiya
    Date : 27-11-2018
    update by Sanjay : 06-02-2019 (code for drawar), Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount Active Application Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { Card, Button, CardTitle, CardText, CardImg, CardBody, Input, Row, Col } from 'reactstrap';
import Pagination from "react-js-pagination";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { listActiveApplicationData, inactiveApplication, getApplicationData } from 'Actions/MyAccount';
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
        title: <IntlMessages id="my_account.activeApplication" />,
        link: '',
        index: 2
    }
];

// Component for MyAccount Active Application Dashboard
class ActiveApplicationDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            PageIndex: 1,
            PAGE_SIZE: 8,
            totalCount: 0,
            ActiveApplicationList: [],
            changeStatus: {
                Id: '',
                DeviceId: getDeviceInfo(),
                Mode: getMode(),
                IPAddress: '',
                HostName: getHostName(),
            }
        }
    }

    componentWillMount() {
        this.getListActiveApplication();
    }

    componentWillReceiveProps(nextProps) {
        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        // To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }

        if (Object.keys(nextProps.ActiveApplicationData).length > 0
            && nextProps.ActiveApplicationData.hasOwnProperty('GetTotalActiveApplicationList')
            && Object.keys(nextProps.ActiveApplicationData.GetTotalActiveApplicationList).length > 0) {
            this.setState({ ActiveApplicationList: nextProps.ActiveApplicationData.GetTotalActiveApplicationList, totalCount: nextProps.ActiveApplicationData.TotalCount });
        }
        if (Object.keys(nextProps.inActiveApp).length > 0
            && nextProps.inActiveApp.hasOwnProperty('ReturnMsg')
            && nextProps.inActiveApp.ReturnCode === 0) {
            this.getListActiveApplication();
            this.props.getApplicationData();
        }
    }

    onDismiss() {
        this.setState({ err_alert: false, success_alert: false });
    }

    getListActiveApplication() {
        const reqObj = {
            PageIndex: this.state.PageIndex,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        this.props.listActiveApplicationData(reqObj);
    }

    onDisableDomain(Id) {
        const newObj = Object.assign({}, this.state.changeStatus);
        newObj.Id = Id;
        let self = this;
        getIPAddress().then(function (ipAddress) {
            newObj.IPAddress = ipAddress;
            self.props.inactiveApplication(newObj);
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    handlePageChange = (pageNumber) => {
        const reqObj = {
            PageIndex: pageNumber,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        this.setState({ PageIndex: pageNumber });
        this.props.listActiveApplicationData(reqObj);
    }

    onChangeRowsPerPage = event => {
        this.setState({ PAGE_SIZE: event.target.value, PageIndex: 1 });
        const reqObj = {
            PageIndex: 1,
            PAGE_SIZE: event.target.value
        }
        this.props.listActiveApplicationData(reqObj);
    };

    render() {
        const { ActiveApplicationList, totalCount, PageIndex, PAGE_SIZE } = this.state;
        const { drawerClose, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.customerDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {loading && <JbsSectionLoader />}
                    {
                        ActiveApplicationList.length > 0
                            ?
                            <Fragment>
                                {
                                    ActiveApplicationList.map((list, index) => {
                                        return [
                                            <div className="col-sm-12 col-md-3 w-xs-full" key={index}>
                                                <Card className="mb-20">
                                                    <CardImg top width="100%" src={Application} alt="Active Application" />
                                                    <CardBody>
                                                        <CardTitle>{list.ApplicationName}</CardTitle>
                                                        <CardText>{list.Description}</CardText>
                                                        <Button disabled={loading} color="danger" onClick={() => this.onDisableDomain(list.Id)}><IntlMessages id="sidebar.btnDisable" /></Button>
                                                    </CardBody>
                                                </Card>
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
            </div>
        );
    }
}

const mapStateToProps = ({ appDashRdcer, drawerclose }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }

    const { ActiveApplicationData, inActiveApp, loading } = appDashRdcer;
    return { ActiveApplicationData, inActiveApp, loading, drawerclose };
}

export default connect(mapStateToProps, {
    listActiveApplicationData,
    inactiveApplication,
    getApplicationData
})(ActiveApplicationDashboard);
