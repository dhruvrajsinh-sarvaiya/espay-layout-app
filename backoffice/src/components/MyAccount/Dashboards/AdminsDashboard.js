/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Admins Dashboard Component
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
import { getAdminData } from 'Actions/MyAccount';

// Component for MyAccount Admins Dashboard
class AdminsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: ''
        }
    }

    componentWillMount() {
        this.props.getAdminData();
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
        const { drawerClose, adminDashData, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.adminDashboard" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                    {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListAdminDashboard')} className="text-dark">
                            <CountCard
                                title={<IntlMessages id="my_account.totalAdmins" />}
                                count={adminDashData.total_count > 0 ? adminDashData.total_count : 0}
                                icon="zmdi zmdi-shield-security"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                    {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListAdminDashboard')} className="text-dark">
                            <CountCard
                                title={<IntlMessages id="my_account.activeAdmins" />}
                                count={adminDashData.active_count > 0 ? adminDashData.active_count : 0}
                                icon="zmdi zmdi-check"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                    {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListAdminDashboard')} className="text-dark">
                            <CountCard
                                title={<IntlMessages id="my_account.inactiveAdmins" />}
                                count={adminDashData.inactive_count > 0 ? adminDashData.inactive_count : 0}
                                icon="zmdi zmdi-block"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                    {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListAdminDashboard')} className="text-dark">
                            <CountCard
                                title={<IntlMessages id="my_account.deleteAdmins" />}
                                count={adminDashData.delete_count > 0 ? adminDashData.delete_count : 0}
                                icon="zmdi zmdi-delete"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                    {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListAdminDashboard')} className="text-dark">
                            <CountCard
                                title={<IntlMessages id="my_account.newAdmins" />}
                                count={adminDashData.new_count > 0 ? adminDashData.new_count : 0}
                                icon="zmdi zmdi-account-add"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddAdminDashboard')} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.addAdmins" />}
                                icon="zmdi zmdi-plus-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                </div>
                <Drawer
                    width={componentName === 'AddAdminDashboard' ? '50%' : '100%'}
                    handler={false}
                    open={open}
                    onMaskClick={this.onClick}
                    className="drawer2"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} props={this.props} />
                </Drawer>
            </div>
        );
    }
}

const mapToProps = ({ adminDashRdcer }) => {
    const { adminDashData, loading } = adminDashRdcer;
    return { adminDashData, loading };
}

export default connect(mapToProps, {
    getAdminData
})(AdminsDashboard);