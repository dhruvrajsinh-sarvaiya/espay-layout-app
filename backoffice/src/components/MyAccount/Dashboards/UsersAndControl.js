/*
    Developer : Bharat Jograna
    Date : 18-02-2019
    update by :
    File Comment : Users and Control Component
*/
import React, { Component } from 'react';
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { SimpleCard } from "./Widgets";
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import { DashboardPageTitle } from './DashboardPageTitle';


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
        index: 1
    },
    {
        title: <IntlMessages id="my_account.usersandcontrol" />,
        link: '',
        index: 0
    }
];


// Component for MyAccount Users And Constrol Configuration Dashboard
export default class UsersAndControl extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            loading: false,
            data: {},
        }
    }

    onClick = () => {
        this.setState({
            open: !this.state.open,
        })
    }
    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
        });
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    render() {
        const { componentName, open } = this.state;
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.usersandcontrol" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('RoleAssignHistory')} className="text-dark col-sm-full">
                            <SimpleCard
                                title={<IntlMessages id="my_account.roleassignhistory" />}
                                icon="zmdi zmdi-chart"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ManageRoles')} className="text-dark col-sm-full">
                            <SimpleCard
                                title={<IntlMessages id="my_account.manageroles" />}
                                icon="zmdi zmdi-chart"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                </div>
                <Drawer
                    width="100%"
                    // width={componentName === 'AddRoles' ? '50%' : '100%'}
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
                        <DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} closeAll={this.closeAll} props={this.props} />}
                </Drawer>
            </div>
        )
    }
}
