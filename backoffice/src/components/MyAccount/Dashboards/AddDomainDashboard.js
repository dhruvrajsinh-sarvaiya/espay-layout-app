/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
      update by Sanjay : 06-02-2019 (code for drawar)
    File Comment : MyAccount Add Domain Dashboard Component
*/
import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import AddDomainWdgt from '../AddDomainWdgt';
import { DashboardPageTitle } from './DashboardPageTitle';

// Component for MyAccount Add Domain Dashboard
class AddDomainDashboard extends Component {
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
                <DashboardPageTitle title={<IntlMessages id="my_account.addDomains" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <AddDomainWdgt {...this.props} />
            </div>
        );
    }
}

export default AddDomainDashboard;