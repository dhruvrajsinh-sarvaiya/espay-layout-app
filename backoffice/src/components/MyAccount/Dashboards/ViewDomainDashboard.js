/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount View Domain Dashboard Component
*/
import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import MatButton from '@material-ui/core/Button';
import { ActiveInactiveStatus } from '../ActiveInactiveStatus';
import { DashboardPageTitle } from './DashboardPageTitle';
import { changeDateFormat } from "Helpers/helpers";

// Component for MyAccount User Dashboard
class ViewDomainDashboard extends Component {
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
        ;
        const { drawerClose, pagedata } = this.props;
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="sidebar.viewDomainDetails" />} drawerClose={drawerClose} closeAll={this.closeAll} />
                <table className="table table-striped">
                    <tbody>
                        <tr>
                            <th>Alias Name</th>
                            <td>{pagedata.AliasName}</td>
                        </tr>
                        <tr>
                            <th>Domain Name</th>
                            <td>{pagedata.DomainName}</td>
                        </tr>
                        <tr>
                            <th>User Name</th>
                            <td>{pagedata.UserName}</td>
                        </tr>
                        <tr>
                            <th>Created Date</th>
                            <td>{pagedata.CreatedDate !== 'null' ? changeDateFormat(pagedata.CreatedDate, 'YYYY-MM-DD HH:mm:ss') : '-'}</td>
                        </tr>
                        <tr>
                            <th>Updated Date</th>
                            <td>{pagedata.UpdatedDate !== 'null' ? changeDateFormat(pagedata.UpdatedDate, 'YYYY-MM-DD HH:mm:ss') : '-'}</td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td><ActiveInactiveStatus status={pagedata.Status} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ViewDomainDashboard;