/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount List Membership Level Dashboard Component
*/
import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import MatButton from '@material-ui/core/Button';
//DataTable
import MUIDataTable from "mui-datatables";
import { ActiveInactiveStatus } from '../ActiveInactiveStatus';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import { DashboardPageTitle } from './DashboardPageTitle';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

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
        name: <IntlMessages id="sidebar.colFullName" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colEmail" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colMobile" />,
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

// Component for MyAccount List Membership Level Dashboard
class ListMembershipLevelDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewData: '',
            open: false,
            componentName: ''
        }
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

    render() {
        const { componentName, open, viewData } = this.state;
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.listMembershipLevel" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    <MUIDataTable
                        title={<IntlMessages id="sidebar.listMembershipLevel" />}
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
                                    <Fragment>
                                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ViewMembershipLevelDashboard', lst)} className="text-dark"><i className="zmdi zmdi-eye zmdi-hc-2x" /></a>
                                    </Fragment>
                                ]
                            })
                        }
                        options={options}
                    />
                </div>
                <Drawer
                    width="40%"
                    handler={false}
                    open={open}
                    onMaskClick={this.onClick}
                    className="drawer2"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} pagedata={viewData} props={this.props} />
                </Drawer>
            </div>
        );
    }
}

export { ListMembershipLevelDashboard };