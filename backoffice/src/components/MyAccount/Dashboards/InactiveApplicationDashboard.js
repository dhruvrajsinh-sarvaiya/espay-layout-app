/* 
    Developer : Salim Deraiya
    Date : 27-11-2018
    update by Sanjay : 06-02-2019 (code for drawar), Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount Inactive Application Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { Card, Button, CardTitle, CardText, CardImg, CardBody, Input, Row, Col } from 'reactstrap';
import Pagination from "react-js-pagination";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { listInActiveApplicationData, activeApplication, getApplicationData } from 'Actions/MyAccount';
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
        title: <IntlMessages id="my_account.inactiveApplication" />,
        link: '',
        index: 2
    }
];

// Component for MyAccount Inactive Application Dashboard
class InactiveApplicationDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            PageIndex: 1,
            PAGE_SIZE: 8,
            totalCount: 0,
            InActiveApplicationList: [],
            changeStatus: {
                Id: '',
                DeviceId: getDeviceInfo(),
                Mode: getMode(),
                IPAddress: '',
                HostName: getHostName()
            }
        }
    }

    componentWillMount() {
        this.getListInActiveApplication();
    }

    componentWillReceiveProps(nextProps) {
        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        // To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }

        if (Object.keys(nextProps.InActiveApplicationData).length > 0
            && nextProps.InActiveApplicationData.hasOwnProperty('GetTotalDisactiveApplicationList')
            && Object.keys(nextProps.InActiveApplicationData.GetTotalDisactiveApplicationList).length > 0) {
            this.setState({ InActiveApplicationList: nextProps.InActiveApplicationData.GetTotalDisactiveApplicationList, totalCount: nextProps.InActiveApplicationData.TotalCount });
        }
        if (Object.keys(nextProps.activeApp).length > 0
            && nextProps.activeApp.hasOwnProperty('ReturnMsg')
            && nextProps.activeApp.ReturnCode === 0) {
            this.getListInActiveApplication();
            this.props.getApplicationData();
        }
    }

    onEnableDomain(Id) {
        const newObj = Object.assign({}, this.state.changeStatus);
        newObj.Id = Id;
        let self = this;
        getIPAddress().then(function (ipAddress) {
            newObj.IPAddress = ipAddress;
            self.props.activeApplication(newObj);
        });
    }

    getListInActiveApplication() {
        const reqObj = {
            PageIndex: this.state.PageIndex,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        this.props.listInActiveApplicationData(reqObj);
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
        this.props.listInActiveApplicationData(reqObj);
    }

    onChangeRowsPerPage = event => {
        this.setState({ PAGE_SIZE: event.target.value, PageIndex: 1 });
        const reqObj = {
            PageIndex: 1,
            PAGE_SIZE: event.target.value
        }
        this.props.listInActiveApplicationData(reqObj);
    };

    render() {
        const { InActiveApplicationList, totalCount, PageIndex, PAGE_SIZE } = this.state;
        const { drawerClose, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.customerDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {loading && <JbsSectionLoader />}
                    {
                        InActiveApplicationList.length > 0
                            ?
                            <Fragment>
                                {
                                    InActiveApplicationList.map((list, index) => {
                                        return [
                                            <div className="col-sm-12 col-md-3 w-xs-full" key={index}>
                                                <Card className="mb-20">
                                                    <CardImg top width="100%" src={Application} alt="Application" />
                                                    <CardBody>
                                                        <CardTitle>{list.ApplicationName}</CardTitle>
                                                        <CardText>{list.Description}</CardText>
                                                        <Button disabled={loading} color="success" onClick={() => this.onEnableDomain(list.Id)}><IntlMessages id="sidebar.btnEnable" /></Button>
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

    const { InActiveApplicationData, activeApp, loading } = appDashRdcer;
    return { InActiveApplicationData, activeApp, loading, drawerclose };
}

export default connect(mapStateToProps, {
    listInActiveApplicationData,
    activeApplication,
    getApplicationData
})(InactiveApplicationDashboard);
