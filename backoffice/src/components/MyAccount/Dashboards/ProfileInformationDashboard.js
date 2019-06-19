/* 
    Developer : Kevin Ladani
    Date : 24-11-2018
    File Comment : Profile Information List Component
*/
import React, { Component } from 'react';
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import MatButton from '@material-ui/core/Button';
import { SimpleCard } from "./Widgets";
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import { DashboardPageTitle } from './DashboardPageTitle';

class ProfileInformationDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: ''
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

    render() {
        const { componentName, open } = this.state;
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.profileInformation" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('PersonalInformationDashboard')} className="text-dark col-sm-full">
                            <SimpleCard
                                title={<IntlMessages id="my_account.PersonalInformation" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('EmailAddressDashboard')} className="text-dark col-sm-full"> */}
                        <SimpleCard
                            title={<IntlMessages id="my_account.emailAddress" />}
                            icon="zmdi zmdi-email"
                            bgClass="bg-dark"
                            clickEvent={this.onClick}
                        />
                        {/* </a> */}
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('PhoneNumberDashboard')} className="text-dark col-sm-full">
                            <SimpleCard
                                title={<IntlMessages id="my_account.phoneNumber" />}
                                icon="zmdi zmdi-smartphone-android"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                </div>
                <Drawer
                    width={componentName === 'PersonalInformationDashboard' ? '50%' : '100%'}
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

export { ProfileInformationDashboard };