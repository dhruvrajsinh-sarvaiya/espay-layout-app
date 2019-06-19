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
import MatButton from '@material-ui/core/Button';
import { SimpleCard, CountCard } from "./Widgets";
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import { DashboardPageTitle } from './DashboardPageTitle';
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";
import { getGroupInfoData } from 'Actions/MyAccount';

class PrnGroupDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: ''
        }
    }

    componentWillMount() {
        this.props.getGroupInfoData();
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
        const { drawerClose, grpDashData, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.groups" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {loading ? <PreloadWidget />
                            :
                            /* <a href="javascript:void(0)" onClick={(e) => this.showComponent('')} className="text-dark"> */
                            < CountCard
                                title={<IntlMessages id="my_account.activeGroups" />}
                                count={grpDashData.active_count > 0 ? grpDashData.active_count : 0}
                                icon="zmdi zmdi-group-work"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                            /* </a> */
                        }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {loading ? <PreloadWidget />
                            :
                            /* <a href="javascript:void(0)" onClick={(e) => this.showComponent('')} className="text-dark"> */
                            <CountCard
                                title={<IntlMessages id="my_account.inactiveGroups" />}
                                count={grpDashData.inactive_count > 0 ? grpDashData.inactive_count : 0}
                                icon="zmdi zmdi-group-work"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                            /* </a> */
                        }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {loading ? <PreloadWidget />
                            :
                            /* <a href="javascript:void(0)" onClick={(e) => this.showComponent('')} className="text-dark"> */
                            <CountCard
                                title={<IntlMessages id="my_account.totalGroups" />}
                                count={grpDashData.total_count > 0 ? grpDashData.total_count : 0}
                                icon="zmdi zmdi-group-work"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                            /* </a> */
                        }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('')} className="text-dark"> */}
                        <SimpleCard
                            title={<IntlMessages id="my_account.groupInvitation" />}
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
const mapToProps = ({ groupInfoDashboard }) => {
    const { grpDashData, loading } = groupInfoDashboard;
    return { grpDashData, loading };
}

export default connect(mapToProps, {
    getGroupInfoData
})(PrnGroupDashboard);

//export { PrnGroupDashboard };