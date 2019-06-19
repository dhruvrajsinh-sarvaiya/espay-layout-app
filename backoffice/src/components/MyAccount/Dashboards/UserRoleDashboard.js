/* 
    Developer : Salim Deraiya
    Date : 18-02-2018
    File Comment : MyAccount User Management Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";
import { SimpleCard, CountCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import { DashboardPageTitle } from './DashboardPageTitle';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

// Component for MyAccount User Management Dashboard
class UserManagementDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: ''
        }
    }

    onClick = () => {
        this.setState({ open: !this.state.open });
    }

    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    render() {
        const { componentName, open } = this.state;
        const { drawerClose, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.userManagement" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    <div className="col-sm-12 col-md-3 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListRoleDashboard')} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.listRoles" />}
                                icon="zmdi zmdi-accounts"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-3 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddRoleDashboard')} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.addRoles" />}
                                icon="zmdi zmdi-accounts"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                </div>
                <Drawer
                    width={componentName === 'AddRoleDashboard' ? "50%" : "100%"}
                    handler={false}
                    open={open}
                    placement="right"
                    className="drawer1"
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} props={this.props} />
                </Drawer>
            </div>
        );
    }
}

export default UserManagementDashboard;