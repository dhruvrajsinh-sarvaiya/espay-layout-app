/* 
    Developer : Kevin Ladani
    Date : 24-11-2018
    File Comment : 2FA Authentication Component
*/
import React, { Component } from 'react';
import IntlMessages from "Util/IntlMessages";
import 'rc-drawer/assets/index.css';
import MatButton from "@material-ui/core/Button";
import { SimpleCard } from "./Widgets";
import { DashboardPageTitle } from './DashboardPageTitle';

class TwoFactorAuthenticationDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: ''
        }
    }
    onClick = () => {
        this.setState({
            open: !this.state.open
        });
    };
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
        const { drawerClose } = this.props;
        return (

            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.2FaAuthentication" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('')} className="text-dark"> */}
                        <SimpleCard
                            title={<IntlMessages id="my_account.googleAuthentication" />}
                            icon="fa fa-qrcode"
                            bgClass="bg-dark"
                            clickEvent={this.onClick}
                        />
                        {/* </a> */}
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('')} className="text-dark"> */}
                        <SimpleCard
                            title={<IntlMessages id="my_account.smsAuthentication" />}
                            icon="zmdi zmdi-smartphone-android"
                            bgClass="bg-dark"
                            clickEvent={this.onClick}
                        />
                        {/* </a> */}
                    </div>
                </div>
            </div>
        )
    }
}

export { TwoFactorAuthenticationDashboard };