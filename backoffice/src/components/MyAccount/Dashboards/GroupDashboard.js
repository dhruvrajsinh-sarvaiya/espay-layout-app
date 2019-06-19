/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Groups Dashboard Component
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
import { getGroupData } from 'Actions/MyAccount';

// Component for MyAccount Groups Dashboard
class GroupDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: ''
        }
    }

    componentWillMount() {
        this.props.getGroupData();
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
        const { drawerClose, grpDashData, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.groupDashboard" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                    {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListGroupDashboard')} className="text-dark">
                            <CountCard
                                title={<IntlMessages id="my_account.totalGroups" />}
                                count={grpDashData.total_count > 0 ? grpDashData.total_count : 0}
                                icon="zmdi zmdi-group-work"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                    {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListGroupDashboard')} className="text-dark">
                            <CountCard
                                title={<IntlMessages id="my_account.activeGroups" />}
                                count={grpDashData.active_count > 0 ? grpDashData.active_count : 0}
                                icon="zmdi zmdi-check"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                    {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListGroupDashboard')} className="text-dark">
                            <CountCard
                                title={<IntlMessages id="my_account.inactiveGroups" />}
                                count={grpDashData.inactive_count > 0 ? grpDashData.inactive_count : 0}
                                icon="zmdi zmdi-block"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                    {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListGroupDashboard')} className="text-dark">
                            <CountCard
                                title={<IntlMessages id="my_account.deleteGroups" />}
                                count={grpDashData.delete_count > 0 ? grpDashData.delete_count : 0}
                                icon="zmdi zmdi-delete"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddGroupDashboard')} className="text-dark"> */}
                            <SimpleCard
                                title={<IntlMessages id="my_account.addGroups" />}
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

const mapToProps = ({ grpDashRdcer }) => {
    const { grpDashData, loading } = grpDashRdcer;
    return { grpDashData, loading };
}

export default connect(mapToProps, {
    getGroupData
})(GroupDashboard);