/* 
    Developer : Kevin Ladani
    Date : 24-11-2018
    File Comment : Email Address Component
*/
import React, { Component } from 'react';
import IntlMessages from "Util/IntlMessages";
import 'rc-drawer/assets/index.css';
import MatButton from '@material-ui/core/Button';
import { DashboardPageTitle } from './DashboardPageTitle';
import {
    SimpleCard, CountCard
} from "./Widgets";

class EmailAddressDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            userEmail: 'test@test.com'
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
        const { componentName, open, userEmail } = this.state;
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.emailAddress" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={this.onClick} className="text-dark">
                            <SimpleCard
                                data={userEmail}
                                title={<IntlMessages id="my_account.primaryEmail" />}
                                icon="zmdi zmdi-email"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={this.onClick} className="text-dark">
                            <CountCard
                                title={<IntlMessages id="my_account.secondaryEmail" />}
                                count={10}
                                icon="zmdi zmdi-email"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a href="javascript:void(0)" onClick={this.onClick} className="text-dark">
                            <SimpleCard
                                title={<IntlMessages id="my_account.addEmailAddress" />}
                                icon="zmdi zmdi-plus-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}
export { EmailAddressDashboard };