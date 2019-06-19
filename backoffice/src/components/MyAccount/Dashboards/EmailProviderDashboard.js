/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Email Provider Dashboard Component
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
import { getEmailProviderData } from 'Actions/MyAccount';

// Component for MyAccount Email Provider Dashboard
class EmailProviderDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: ''
        }
    }

    componentWillMount() {
        this.props.getEmailProviderData();
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
        const { drawerClose, emlPrvdrDashData, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.emailProviderDashboard" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListEmailProviderDashboard')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="my_account.totalEmailProvider" />}
                                    count={emlPrvdrDashData.total_count > 0 ? emlPrvdrDashData.total_count : 0}
                                    icon="zmdi zmdi-email"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListEmailProviderDashboard')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="my_account.activeEmailProvider" />}
                                    count={emlPrvdrDashData.active_count > 0 ? emlPrvdrDashData.active_count : 0}
                                    icon="zmdi zmdi-check"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListEmailProviderDashboard')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="my_account.inactiveEmailProvider" />}
                                    count={emlPrvdrDashData.inactive_count > 0 ? emlPrvdrDashData.inactive_count : 0}
                                    icon="zmdi zmdi-block"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListEmailProviderDashboard')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="my_account.deleteEmailProvider" />}
                                    count={emlPrvdrDashData.delete_count > 0 ? emlPrvdrDashData.delete_count : 0}
                                    icon="zmdi zmdi-delete"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEmailProviderDashboard')} className="text-dark"> */}
                            <SimpleCard
                                title={<IntlMessages id="my_account.addEmailProvider" />}
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

const mapToProps = ({ emlPrvdrDashRdcer }) => {
    const { emlPrvdrDashData, loading } = emlPrvdrDashRdcer;
    return { emlPrvdrDashData, loading };
}

export default connect(mapToProps, {
    getEmailProviderData
})(EmailProviderDashboard);