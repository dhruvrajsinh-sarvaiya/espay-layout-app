/* 
    Developer : Kevin Ladani
    Date : 24-12-2018
        update by Sanjay : 06-02-2019 (code for drawar), Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount List InActive Domain Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { Badge, Alert } from 'reactstrap';
//DataTable
import MUIDataTable from "mui-datatables";
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
// import { DashboardPageTitle } from './DashboardPageTitle';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { CustomFooter } from './Widgets';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { listInActiveDomainData, activeDomain, getDomainData } from 'Actions/MyAccount';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    changeDateFormat,
    getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode
} from "Helpers/helpers";

//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colAliasName" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colDomainName" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colUserName" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colUpdatedDt" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colAction" />,
        options: {
            filter: false,
            sort: false,
        }
    }
];

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
        index: 3
    },
    {
        title: <IntlMessages id="sidebar.organizationInfo" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.domainDashboard" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.listInActiveDomains" />,
        link: '',
        index: 0
    }
];

// Component for MyAccount List Domain Dashboard
class ListInActiveDomainDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewData: '',
            open: false,
            componentName: '',
            data: [],
            getData: {
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
            loading: false,
            errors: {},
            PageIndex: 1,
            PAGE_SIZE: 10,
            totalCount: 0
        }
        this.onDismiss = this.onDismiss.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    onClick = () => {
        this.setState({
            open: !this.state.open,
        })
    }

    showComponent = (componentName, viewData) => {
        this.setState({
            viewData: viewData,
            componentName: componentName,
            open: !this.state.open
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    componentWillMount() {
        this.getListInActiveDomain();
    }

    getListInActiveDomain() {
        const reqObj = {
            PageIndex: this.state.PageIndex,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        this.props.listInActiveDomainData(reqObj);
    }

    componentWillReceiveProps(nextProps) {
        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        // To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open4 === false) {
            this.setState({ open: false });
        }

        this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

        if (nextProps.ext_flag) {
            if (nextProps.data.ReturnCode === 1) {
                var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
                this.setState({ err_alert: true, err_msg: errMsg });
            } else if (nextProps.data.ReturnCode === 0) {
                this.setState({ success_msg: nextProps.data.ReturnMsg, success_alert: true, loading: true });
                this.getListInActiveDomain();
                this.props.getDomainData();
            }
        }
        else if (nextProps.hasOwnProperty('data') && nextProps.data.hasOwnProperty('GetTotalDisactiveDomainList') && Object.keys(nextProps.data.GetTotalDisactiveDomainList).length > 0) {
            this.setState({ data: nextProps.data.GetTotalDisactiveDomainList, totalCount: nextProps.data.TotalCount });
        }
    }

    onDismiss() {
        this.setState({ err_alert: false, success_alert: false });
    }

    onEnableDomain(Id) {
        let self = this;
        var newObj = Object.assign({}, this.state.getData);
        newObj.Id = Id;
        getIPAddress().then(function (ipAddress) {
            newObj.IPAddress = ipAddress;
            self.props.activeDomain(newObj);
        });
    }

    handlePageChange(pageNumber) {
        this.setState({ PageIndex: pageNumber });
        this.props.listInActiveDomainData({
            PageIndex: pageNumber,
            PAGE_SIZE: this.state.PAGE_SIZE
        });
    }

    onChangeRowsPerPage = event => {
        this.setState({ PAGE_SIZE: event.target.value, PageIndex: 1 });
        this.props.listInActiveDomainData({
            PageIndex: 1,
            PAGE_SIZE: event.target.value
        });
    };

    render() {
        const { componentName, open, viewData, data, err_alert, err_msg, success_msg, success_alert, totalCount, PageIndex, PAGE_SIZE } = this.state;
        const { drawerClose, loading } = this.props;

        const options = {
            filterType: "select",
            responsive: "scroll",
            selectableRows: false,
            serverSide: data.length !== 0 ? true : false,
            page: PageIndex,
            count: totalCount,
            rowsPerPage: PAGE_SIZE,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customFooter: (
                count,
                page,
                rowsPerPage
            ) => {
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                switch (action) {
                    case 'changeRowsPerPage':
                        this.setState({
                            PageIndex: tableState.page,
                            PAGE_SIZE: tableState.rowsPerPage,
                        });
                        this.getListInActiveDomain();
                        break;
                    case 'changePage':
                        this.setState({
                            PageIndex: tableState.page,
                            PAGE_SIZE: tableState.rowsPerPage,
                        });
                        this.getListInActiveDomain();
                        break;
                }
            }
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.listInActiveDomains" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {success_msg && <div className="alert_area">
                    <Alert color="success" isOpen={success_alert} toggle={this.onDismiss}>{success_msg}</Alert>
                </div>}
                {err_msg && <div className="alert_area">
                    <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{err_msg}</Alert>
                </div>}
                {loading && <CircularProgress className="progress-primary" thickness={2} />}
                <div className="StackingHistory">
                    <MUIDataTable
                        title={<IntlMessages id="sidebar.listInActiveDomains" />}
                        columns={columns}
                        data={
                            data.map((lst, key) => {
                                return [
                                    lst.Id,
                                    lst.AliasName,
                                    lst.DomainName,
                                    lst.UserName,
                                    <Badge color="danger" onClick={() => this.onEnableDomain(lst.Id)} style={{ 'cursor': 'pointer' }}>
                                        <IntlMessages id="sidebar.inactive" />
                                    </Badge>,
                                    <span className="date">{lst.CreatedDate !== 'null' ? changeDateFormat(lst.CreatedDate, 'YYYY-MM-DD HH:mm:ss') : '-'}</span>,
                                    <span className="date">{lst.UpdatedDate !== 'null' ? changeDateFormat(lst.UpdatedDate, 'YYYY-MM-DD HH:mm:ss') : '-'}</span>,
                                    <Fragment>
                                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ViewDomainDashboard', lst)} className="text-dark"><i className="zmdi zmdi-eye zmdi-hc-2x" /></a>
                                        {/* <Link className="mr-10" color="primary" to={{pathname:"/app/my-account/edit-kyc", state : { data : lst }}}><i className="zmdi zmdi-eye zmdi-hc-2x" /></Link> */}
                                    </Fragment>
                                ]
                            })
                        }
                        options={options}
                    />
                </div>

                <Drawer
                    width="40%"
                    handler={null}
                    open={open}
                    onMaskClick={this.onClick}
                    className={null}
                    level={null}
                    placement="right"
                    getContainer={null}
                    showMask={false}
                    height="100%"
                >
                    {componentName !== '' &&
                        <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} pagedata={viewData} props={this.props} />}
                </Drawer>
            </div>
        );
    }
}

const mapPropsToState = ({ domainDashRdcer, drawerclose }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }

    const { data, loading, ext_flag } = domainDashRdcer;
    return { data, loading, ext_flag, drawerclose };
}

export default connect(mapPropsToState, {
    listInActiveDomainData, activeDomain, getDomainData
})(ListInActiveDomainDashboard);
