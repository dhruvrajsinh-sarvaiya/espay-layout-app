/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Languages Dashboard Component
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
import { getLanguageData } from 'Actions/MyAccount';

// Component for MyAccount Languages Dashboard
class LanguageDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: ''
        }
    }

    componentWillMount() {
        this.props.getLanguageData();
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
        const { drawerClose, lngDashData, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.languagesDashboard" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListLanguageDashboard')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="my_account.totalLanguages" />}
                                    count={lngDashData.total_count > 0 ? lngDashData.total_count : 0}
                                    icon="fa fa-language"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListLanguageDashboard')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="my_account.activeLanguages" />}
                                    count={lngDashData.active_count > 0 ? lngDashData.active_count : 0}
                                    icon="zmdi zmdi-check"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListLanguageDashboard')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="my_account.inactiveLanguages" />}
                                    count={lngDashData.inactive_count > 0 ? lngDashData.inactive_count : 0}
                                    icon="zmdi zmdi-block"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {loading ? <PreloadWidget />
                            : <a href="javascript:void(0)" onClick={(e) => this.showComponent('ListLanguageDashboard')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id="my_account.deleteLanguages" />}
                                    count={lngDashData.delete_count > 0 ? lngDashData.delete_count : 0}
                                    icon="zmdi zmdi-delete"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        }
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddLanguageDashboard')} className="text-dark"> */}
                            <SimpleCard
                                title={<IntlMessages id="my_account.addLanguages" />}
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

const mapToProps = ({ lngDashRdcer }) => {
    const { lngDashData, loading } = lngDashRdcer;
    return { lngDashData, loading };
}

export default connect(mapToProps, {
    getLanguageData
})(LanguageDashboard);