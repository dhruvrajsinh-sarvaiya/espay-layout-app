// update by : Bharat Jograna(BreadCrumb)09 March 2019

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Col, Row } from 'reactstrap';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { getApplicationList, getApplicationById } from 'Actions/MyAccount';
// import { DashboardPageTitle } from './DashboardPageTitle';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { Card } from '@material-ui/core';
import { CustomFooter } from './Widgets';

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
        title: <IntlMessages id="my_account.ListApplication" />,
        link: '',
        index: 2
    }
];

//Component for MyAccount List Of All Application 
class ListApplications extends Component {
    state = {
        open: false,
        PageIndex: 1,
        PAGE_SIZE: 10,
        totalCount: 0,
        ApplicationList: [],
        //viewData: null,
        componentName: '',
        listGet: true
    }

    showComponent = (componentName, Id) => {
        this.props.getApplicationById(Id);
        this.setState({
            componentName: componentName,
            open: !this.state.open
        });
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

        if (Object.keys(nextProps.getApplicationListData).length > 0
            && nextProps.getApplicationListData.hasOwnProperty('TotalUserApplicationList')
            && Object.keys(nextProps.getApplicationListData.TotalUserApplicationList).length > 0) {
            this.setState({ ApplicationList: nextProps.getApplicationListData.TotalUserApplicationList, totalCount: nextProps.getApplicationListData.TotalCount });
        }
    }

    onDismiss() {
        this.setState({ err_alert: false, success_alert: false });
    }

    getListApplication() {
        const reqObj = {
            PageIndex: this.state.PageIndex,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        this.props.getApplicationList(reqObj);
    }

    onClick = () => {
        this.setState({
            open: !this.state.open,
        })
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
        this.props.getApplicationList(reqObj);
    }

    onChangeRowsPerPage = event => {
        this.setState({ PAGE_SIZE: event.target.value, PageIndex: 1 });
        const reqObj = {
            PageIndex: 1,
            PAGE_SIZE: event.target.value
        }
        this.props.getApplicationList(reqObj);
    };

    render() {
        const { ApplicationList, componentName, open, viewData, totalCount, PageIndex, PAGE_SIZE } = this.state;
        const { drawerClose, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.ListApplication" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {loading && <JbsSectionLoader />}
                {
                    ApplicationList.length > 0
                        ?
                        <Fragment>
                            {
                                ApplicationList.map((list, index) => {
                                    return [
                                        <Card>
                                            <ListGroup key={index}>
                                                <ListGroupItem>
                                                    <ListGroupItemHeading onClick={(e) => this.showComponent('UpdateAppConfig', list.Id)}>{list.ApplicationName}</ListGroupItemHeading>
                                                    <Row>
                                                        <Col sm="6">
                                                            <ListGroupItemText>
                                                                {list.MasterApplicationName}
                                                            </ListGroupItemText>
                                                        </Col>
                                                        <Col sm="6">
                                                            <ListGroupItemText>
                                                                {list.ClientSecret}
                                                            </ListGroupItemText>
                                                        </Col>
                                                    </Row>
                                                </ListGroupItem>
                                            </ListGroup>
                                        </Card>
                                    ]
                                })
                            }
                        </Fragment>
                        :
                        <Fragment>
                            <div className="text-center col-md-12">No record found.</div>
                        </Fragment>
                }
                <CustomFooter count={totalCount} page={PageIndex} rowsPerPage={PAGE_SIZE} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                <Drawer
                    width="50%"
                    handler={null}
                    open={open}
                    onMaskClick={this.onClick}
                    className={null}
                    placement="right"
                    level={null}
                    getContainer={null}
                    showMask={false}
                    height="100%"
                >
                    {componentName !== '' &&
                        <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} pagedata={viewData} props={this.props} />}
                </Drawer>
            </div>
        )
    }
}


const mapStateToProps = ({ ApplicationConfig, drawerclose }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }

    const { getApplicationListData, ApplicationByID, loading } = ApplicationConfig;
    return { getApplicationListData, ApplicationByID, loading, drawerclose };
}

export default connect(mapStateToProps, {
    getApplicationList,
    getApplicationById
})(ListApplications);
