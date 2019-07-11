/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    Updated By : Bharat Jograna (BreadCrumb)13 March 2019
    File Comment : MyAccount List User Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
//DataTable
import MUIDataTable from "mui-datatables";
import { ActiveInactiveStatus } from '../ActiveInactiveStatus';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)13 March 2019 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

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
        title: <IntlMessages id="sidebar.userManagement" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.userDashboard" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.listUsers" />,
        link: '',
        index: 3
    }
];

//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colFullName" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colEmail" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colMobile" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colUpdatedDt" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colAction" />,
        options: { filter: false, sort: false }
    }
];

const data = [
    {
        "id": 1,
        "full_name": "John Deo",
        "email": "john@deo.com",
        "mobile": "9898989898",
        "status": 1,
        "created_date": "2018-11-24 10:06:50",
        "updated_date": "2018-11-24 10:06:50"
    },
    {
        "id": 2,
        "full_name": "John Deo",
        "email": "john@deo.com",
        "mobile": "9898989898",
        "status": 1,
        "created_date": "2018-11-24 10:06:50",
        "updated_date": "2018-11-24 10:06:50"
    },
    {
        "id": 3,
        "full_name": "John Deo",
        "email": "john@deo.com",
        "mobile": "9898989898",
        "status": 1,
        "created_date": "2018-11-24 10:06:50",
        "updated_date": "2018-11-24 10:06:50"
    },
    {
        "id": 4,
        "full_name": "John Deo",
        "email": "john@deo.com",
        "mobile": "9898989898",
        "status": 1,
        "created_date": "2018-11-24 10:06:50",
        "updated_date": "2018-11-24 10:06:50"
    }
];

const options = {
    filterType: "select",
    responsive: "scroll",
    selectableRows: false
};

// Component for MyAccount List User Dashboard
class ListUserDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewData: '',
            open: false,
            componentName: ''
        }
    }

    //Added by Bharat Jograna, (BreadCrumb)13 March 2019
    componentWillReceiveProps(nextProps) {
        // To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open4 === false) {
            this.setState({ open: false });
        }
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true })
    }

    showComponent = (componentName, viewData) => {
        this.setState({
            viewData: viewData,
            componentName: componentName,
            open: this.state.open ? false : true
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    render() {
        const { componentName, open, viewData } = this.state;
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.listUsers" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    <MUIDataTable
                        columns={columns}
                        data={
                            data.map((lst, key) => {
                                return [
                                    lst.id,
                                    lst.full_name,
                                    lst.email,
                                    lst.mobile,
                                    <Fragment>
                                        <ActiveInactiveStatus status={lst.status} />
                                    </Fragment>,
                                    lst.created_date,
                                    lst.updated_date,
                                    <div className="list-action">
                                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ViewUserDashboard', lst)} className="ml-3"><i className="ti-eye" /></a>
                                    </div>
                                ]
                            })
                        }
                        options={options}
                    />
                </div>
                <Drawer
                    width="50%"
                    handler={false}
                    open={open}
                    placement="right"
                    className="drawer1 half_drawer"
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} pagedata={viewData} props={this.props} />
                </Drawer>
            </div>
        );
    }
}

//Added by Bharat Jograna (BreadCrumb)13 March 2019
const mapToProps = ({ drawerclose }) => {
    // To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    return { drawerclose };
}

export default connect(mapToProps, {})(ListUserDashboard);