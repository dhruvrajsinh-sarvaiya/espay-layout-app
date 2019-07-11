/* 
    Created By : Megha Kariya
    Date : 05-02-2019
    File Comment : CMS FAQ Dashboard Component
*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { SimpleCard } from '../DashboardWidgets';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DashboardPageTitle } from '../DashboardPageTitle';
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import EmailTemplates from './emailtemplates';
import EmailTemplatesConfiguration from './emailtemplatesconfiguration';
import { NotificationManager } from "react-notifications";
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
        title: <IntlMessages id="sidebar.cms" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.templates" />,
        link: '',
        index: 0
    }
];


// componenet listing
const components = {
    EmailTemplates: EmailTemplates,
    EmailTemplatesConfiguration: EmailTemplatesConfiguration,
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, close2Level, closeAll) => {
    return React.createElement(components[TagName], { props, drawerClose, close2Level, closeAll });
};
// Component for MyAccount Organization Information dashboard
class EmailTemplateDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            loading: false,
            data: {},
            menudetail: [],
            Pflag: true,
        }
    }

    onClick = () => {
        this.setState({
            open: this.state.open ? false : true,
        })
    }

    showComponent = (componentName, permission) => {
        // check permission go on next page or not
        if (permission) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }


    close2Level = () => {
        this.setState({ open: false });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('48899E46-090A-09D5-296D-32CD4EB8952C');
    }

    componentWillReceiveProps(nextProps) {
        // update menu details if not set 
        if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });

            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    this.props.drawerClose();
                }, 2000);
            }
            this.setState({ Pflag: false })
        }

        this.setState({ loading: nextProps.loading });
    }

    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        var response = false;
        var index;
        const { menudetail } = this.state;
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
                    response = menudetail[index];
            }
        }
        return response;
    }

    render() {
        const { componentName, open } = this.state;
        const { drawerClose, loading } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.templates" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(loading || this.props.menuLoading) && <JbsSectionLoader />}

                <div className="row">
                    {this.checkAndGetMenuAccessDetail('E6E1F7B2-3532-1AE7-41D2-006633A1381C') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('EmailTemplates', (this.checkAndGetMenuAccessDetail('E6E1F7B2-3532-1AE7-41D2-006633A1381C')).HasChild)} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.templatesList" />}
                                    icon="zmdi zmdi-email"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('1E56DBA8-5E6F-494C-6939-B38B959D6816') &&
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('EmailTemplatesConfiguration', (this.checkAndGetMenuAccessDetail('1E56DBA8-5E6F-494C-6939-B38B959D6816')).HasChild)} className="text-dark">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.templatesConfiguration" />}
                                    icon="zmdi zmdi-email"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>
                    }
                </div>
                <Drawer
                    width="100%"
                    handler={false}
                    open={open}
                    className="drawer2"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {componentName != '' && dynamicComponent(componentName, this.props, this.onClick, this.close2Level, this.closeAll)}
                </Drawer>
            </div>
        );
    }
}

const mapStateToProps = ({ authTokenRdcer }) => {
    var response = {
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
    };
    return response;
}

export default connect(mapStateToProps, { getMenuPermissionByID })(EmailTemplateDashboard);