/* 
    Developer : Salim Deraiya
    Date : 28-11-2018
    File Comment : MyAccount View Membership Level Dashboard Component
*/
import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import MatButton from '@material-ui/core/Button';
import { ActiveInactiveStatus } from '../ActiveInactiveStatus';
import { DashboardPageTitle } from './DashboardPageTitle';

// Component for MyAccount View Membership Level Dashboard
class ViewMembershipLevelDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    }

    render() {
        const { drawerClose, data } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.viewMembershipLevelDetails" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <table className="table table-striped">
                    <tbody>
                        <tr>
                            <th>Full Name</th>
                            <td>{data.full_name}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{data.email}</td>
                        </tr>
                        <tr>
                            <th>Mobile</th>
                            <td>{data.mobile}</td>
                        </tr>
                        <tr>
                            <th>Created Date</th>
                            <td>{data.created_date}</td>
                        </tr>
                        <tr>
                            <th>Updated Date</th>
                            <td>{data.updated_date}</td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td><ActiveInactiveStatus status={data.status} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ViewMembershipLevelDashboard;