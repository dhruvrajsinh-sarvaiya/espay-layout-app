/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Add Domain Dashboard Component
*/
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import FollowerProfileWdgt from '../../SocialProfile/FollowerProfileWdgt';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { NotificationManager } from "react-notifications";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import { connect } from 'react-redux';
//Component for MyAccount Add Domain Dashboard
class FollowerProfileDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            menuDetail:this.props.menuDetail,
            menudetail: [],
			menuLoading:false,
			notificationFlag:true,
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
    componentWillMount() {
        this.props.getMenuPermissionByID('A2C4CBBA-159B-3AF9-2EE6-5E45B7D096A9'); 
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
    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
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
                var menuDetail = this.checkAndGetMenuAccessDetail('c1cd6a7c-1535-21aa-4647-860502b10291');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.followerProfileConfiguration" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                {Object.keys(menuDetail).length > 0 &&
                    <FollowerProfileWdgt {...this.props} topButton={false} menuDetail={this.state.menuDetail} />
                } </div>
        );
    }
}
const mapToProps = ({ authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {  menuLoading, menu_rights };
}
export default connect(mapToProps, {
    getMenuPermissionByID
})(FollowerProfileDashboard);
