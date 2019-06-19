/* 
    Developer : Kevin Ladani
    Date : 24-11-2018
    File Comment : Groups Dashboard Component
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";
import { SimpleCard, CountCard } from "./Widgets";
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import { DashboardPageTitle } from './DashboardPageTitle';
import { getActivityData } from 'Actions/MyAccount';

class ActivityDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            lastActivity: 'Trade',
            ipAddress: '45.123.12.45',
            time: "06-11-2018 08:05:22"
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
    componentWillMount() {
        this.props.getActivityData();
    }

    render() {
        const { componentName, open, lastActivity, ipAddress, time } = this.state;
        const { drawerClose, activityDashData, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.activity" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('')} className="text-dark"> */}
                        <SimpleCard
                            data={[<IntlMessages id="my_account.lastActivity" />, ":", lastActivity]}
                            title={<IntlMessages id="my_account.activeHistory" />}
                            icon="zmdi zmdi-local-activity"
                            bgClass="bg-dark"
                            clickEvent={this.onClick}
                        />
                        {/* </a> */}
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {loading ? <PreloadWidget />
                            :
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('LoginHistoryDashboard')} className="text-dark col-sm-full">
                                <CountCard
                                    title={<IntlMessages id="my_account.loginHistory" />}
                                    count={activityDashData.loginHistory_count > 0 ? activityDashData.loginHistory_count : 0}
                                    icon="zmdi zmdi-account-circle"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {loading ? <PreloadWidget />
                            :
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('IPHistoryDashboard')} className="text-dark col-sm-full">
                                <CountCard
                                    title={<IntlMessages id="my_account.ipHistory" />}
                                    count={activityDashData.ipHistory_count > 0 ? activityDashData.ipHistory_count : 0}
                                    icon="zmdi zmdi-pin"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('')} className="text-dark"> */}
                        <SimpleCard
                            data={[<IntlMessages id="my_account.ipAddress" />, ":", ipAddress, <br />, <IntlMessages id="my_account.time" />, ":", time]}
                            title={<IntlMessages id="my_account.lastLogin" />}
                            icon="zmdi zmdi-share"
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
                    onMaskClick={this.onClick}
                    className="drawer2"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    <DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} closeAll={this.closeAll} props={this.props} />
                </Drawer>
            </div>
        )
    }
}
const mapToProps = ({ activityDashboard }) => {
    const { activityDashData, loading } = activityDashboard;
    return { activityDashData, loading };
}

export default connect(mapToProps, {
    getActivityData
})(ActivityDashboard);
//export { ActivityDashboard };