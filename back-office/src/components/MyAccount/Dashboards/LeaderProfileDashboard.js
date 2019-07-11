/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Add Domain Dashboard Component
*/
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import LeaderProfileWdgt from '../../SocialProfile/LeaderProfileWdgt';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { NotificationManager } from "react-notifications";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import { connect } from 'react-redux';
//Component for MyAccount Add Domain Dashboard
class LeaderProfileDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            menuDetail: this.props.menuDetail,
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        }
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true })
    }

    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: this.state.open ? false : true,
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('4C2CE5CB-491D-2EE3-01D1-DF14B9D549B5');
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });

        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }
    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        var response = {};
        var index;
        const { menudetail } = this.state;
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase()) {
                    if (menudetail[index].Fields && menudetail[index].Fields.length) {
                        var fieldList = {};
                        menudetail[index].Fields.forEach(function (item) {
                            fieldList[item.GUID] = item;
                        });
                        response = fieldList;
                    }
                }
            }
        }
        return response;
    }
    render() {
        var menuDetail = this.checkAndGetMenuAccessDetail('C326E883-7F5D-8C88-30E0-163E721AA514');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        const { drawerClose, } = this.props;
        return (

            <div className="jbs-page-content">

                <WalletPageTitle title={<IntlMessages id="my_account.leaderProfileConfiguration" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {Object.keys(menuDetail).length > 0 && //CB54F01C-3070-A454-07BF-36E0A1A95CD1
                    <LeaderProfileWdgt {...this.props} topButton={false} menuDetail={this.state.menuDetail} />
                }</div>
        );
    }
}
const mapToProps = ({ authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { menuLoading, menu_rights };
}
export default connect(mapToProps, {
    getMenuPermissionByID
})(LeaderProfileDashboard);
