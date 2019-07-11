/* 
    Createdby : dhara gajera
    Updateby :dhara gajera
    CreatedDate : 24-12-2018
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { CountCard } from './DashboardWidgets';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import ChatUserList from './ChatUserList';
import IntlMessages from "Util/IntlMessages";
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//Import Chat Dashboard Actions...
import {
    getChatOnlineUserDashboard,
    getChatOfflineUserDashboard,
    getChatActiveUserDashboard,
    getChatBlockedUserDashboard
} from "Actions/ChatDashboard";
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
import AppConfig from 'Constants/AppConfig';
// componenet listing
const components = {
    ChatUserList: ChatUserList
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, GUID) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll, GUID });
};

// Component for Chat dashboard
class ChatDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            loading: false, // loading activity
            errors: {},
            err_msg: "",
            err_alert: true,
            permission: {},
            menudetail: [],
            Pflag: true,
            GUID: '',
        };
        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss() {
        let err = delete this.state.errors['message'];
        this.setState({ err_alert: false, errors: err });
    }

    onClose = () => {
        this.setState({
            open: this.state.open ? false : true,
        });
    }

    onClick = () => {
        this.setState({
            open: this.state.open ? false : true,
        });
        this.reload();
    }

    //Action Call for Get Count 
    componentWillMount() {
        this.props.getMenuPermissionByID('3B931E92-4833-451C-46D3-07EBC960127B');
    }

    // when close drawer its call reload method
    reload() {
        this.props.getChatOnlineUserDashboard()
        this.props.getChatOfflineUserDashboard()
        this.props.getChatActiveUserDashboard()
        this.props.getChatBlockedUserDashboard()
    }


    componentWillReceiveProps(nextProps) {

        // update menu details if not set 
        if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getChatOnlineUserDashboard()
                this.props.getChatOfflineUserDashboard()
                this.props.getChatActiveUserDashboard()
                this.props.getChatBlockedUserDashboard()
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
            this.setState({ Pflag: false })
        }

        this.setState({
            loading: nextProps.loading
        });
    }

    showComponent = (componentName, permission, GUID) => {
        if (permission) {
            this.setState({
                GUID: GUID,
                componentName: componentName,
                open: this.state.open ? false : true,
            });
        }
    }

    closeAll = () => {
        this.setState({
            open: false,
        });
        this.reload();
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
        const { componentName, loading, GUID } = this.state;

        return (
            <Fragment>
                {(loading || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('2A5EECB2-3621-6012-64F3-118863AE0FB1') && //2A5EECB2-3621-6012-64F3-118863AE0FB1
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a onClick={(e) => this.showComponent('ChatUserList', (this.checkAndGetMenuAccessDetail('2A5EECB2-3621-6012-64F3-118863AE0FB1')).HasChild, '2A5EECB2-3621-6012-64F3-118863AE0FB1')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id='chatDashbord.Onlineuser' />}
                                    count={(this.props.hasOwnProperty("onlineUserCount")) ? this.props.onlineUserCount : 0}
                                    icon="zmdi zmdi-account-box"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('C2F028D7-43B1-61CD-484E-78B786677CBC') && //C2F028D7-43B1-61CD-484E-78B786677CBC
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a onClick={(e) => this.showComponent('ChatUserList', (this.checkAndGetMenuAccessDetail('C2F028D7-43B1-61CD-484E-78B786677CBC')), 'C2F028D7-43B1-61CD-484E-78B786677CBC')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id='chatDashbord.Offlineuser' />}
                                    count={(this.props.hasOwnProperty("offlineUserCount")) ? this.props.offlineUserCount : 0}
                                    icon="zmdi zmdi-account-box"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('E8AF6EBD-3C71-19E1-6BBE-704CAFCE6E55') && //E8AF6EBD-3C71-19E1-6BBE-704CAFCE6E55
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a onClick={(e) => this.showComponent('ChatUserList', (this.checkAndGetMenuAccessDetail('E8AF6EBD-3C71-19E1-6BBE-704CAFCE6E55')), 'E8AF6EBD-3C71-19E1-6BBE-704CAFCE6E55')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id='chatDashbord.Activeuser' />}
                                    count={(this.props.hasOwnProperty("activeUserCount")) ? this.props.activeUserCount : 0}
                                    icon="zmdi zmdi-account-box"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                    {this.checkAndGetMenuAccessDetail('A5867888-30EA-0815-5050-C78FEE0A49D8') && //A5867888-30EA-0815-5050-C78FEE0A49D8
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a onClick={(e) => this.showComponent('ChatUserList', (this.checkAndGetMenuAccessDetail('A5867888-30EA-0815-5050-C78FEE0A49D8')), 'A5867888-30EA-0815-5050-C78FEE0A49D8')} className="text-dark">
                                <CountCard
                                    title={<IntlMessages id='chatDashbord.Blockeduser' />}
                                    count={(this.props.hasOwnProperty("blockedUserCount")) ? this.props.blockedUserCount : 0}
                                    icon="zmdi zmdi-account-box"
                                    bgClass="bg-dark"
                                    clickEvent={this.onClick}
                                />
                            </a>
                        </div>}
                </div>

                <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    onMaskClick={this.onClick}
                    className="drawer1"
                    placement="right"
                >
                    {componentName != '' && dynamicComponent(componentName, this.props, this.onClick, this.closeAll, GUID)}
                </Drawer>
            </Fragment>
        );
    }
}

const mapStateToProps = ({ chatDashboard, authTokenRdcer }) => {
    var response = {
        data: chatDashboard.data,
        loading: chatDashboard.loading,
        onlineUserCount: chatDashboard.onlineUserCount,
        offlineUserCount: chatDashboard.offlineUserCount,
        activeUserCount: chatDashboard.activeUserCount,
        blockedUserCount: chatDashboard.blockedUserCount,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
    };
    return response;
};

export default connect(mapStateToProps, {
    getChatOnlineUserDashboard,
    getChatOfflineUserDashboard,
    getChatActiveUserDashboard,
    getChatBlockedUserDashboard,
    getMenuPermissionByID,
})(ChatDashboard);