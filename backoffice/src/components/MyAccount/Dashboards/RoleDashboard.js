/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Roles Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";
import { SimpleCard, CountCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { getRoleData } from 'Actions/MyAccount';

// Component for MyAccount Roles Dashboard
class RoleDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: ''
        }
    }

    componentWillMount() {
        this.props.getRoleData();
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
        const { drawerClose, roleDashData, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.roleDashboard" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    <div className="col-sm-12 col-md-3 w-xs-full">
                        {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListRoleDashboard')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="my_account.totalRoles" />}
                                    count={roleDashData.total_count > 0 ? roleDashData.total_count : 0}
                                    icon="zmdi zmdi-seat"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        }
                    </div>
                    <div className="col-sm-12 col-md-3 w-xs-full">
                        {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddRoleDashboard')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="my_account.activeRoles" />}
                                    count={roleDashData.active_count > 0 ? roleDashData.active_count : 0}
                                    icon="zmdi zmdi-check"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        }
                    </div>
                    <div className="col-sm-12 col-md-3 w-xs-full">
                        {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListRoleDashboard')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="my_account.inactiveRoles" />}
                                    count={roleDashData.inactive_count > 0 ? roleDashData.inactive_count : 0}
                                    icon="zmdi zmdi-block"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        }
                    </div>
                    <div className="col-sm-12 col-md-3 w-xs-full">
                        {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListRoleDashboard')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="my_account.deleteRoles" />}
                                    count={roleDashData.delete_count > 0 ? roleDashData.delete_count : 0}
                                    icon="zmdi zmdi-delete"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        }
                    </div>
                    <div className="col-sm-12 col-md-3 w-xs-full">
                        {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddRoleDashboard')} className="text-dark"> */}
                        <SimpleCard
                            title={<IntlMessages id="my_account.addRoles" />}
                            icon="zmdi zmdi-plus-circle"
                            bgClass="bg-dark"
                            clickEvent={this.onClick}
                        />
                        {/* </a> */}
                    </div>
                </div>
                <Drawer
                    width="100%"
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

const mapToProps = ({ roleDashRdcer }) => {
    const { roleDashData, loading } = roleDashRdcer;
    return { roleDashData, loading };
}

export default connect(mapToProps, {
    getRoleData
})(RoleDashboard);