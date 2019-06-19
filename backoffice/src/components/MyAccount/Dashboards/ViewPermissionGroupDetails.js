/* 
    Developer : Salim Deraiya
    Date : 13-03-2019
    File Comment : My Account View Permission Group Detail Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import "rc-drawer/assets/index.css";
import { DashboardPageTitle } from './DashboardPageTitle';
// import { getRoleManagementById } from "Actions/MyAccount";
// import { ActiveInactiveStatus } from '../ActiveInactiveStatus';

class ViewPermissionGroupDetails extends Component {
	constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: {
				RoleID : '',
                RoleName : '',
                RoleDescription : '',
                Status : ''
            },
            userRoleHistory: []
        };
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    /* componentWillReceiveProps(nextProps) {
        //Get Role Data By Id
        if (nextProps.getData.hasOwnProperty('RoleDetail') && Object.keys(nextProps.getData.RoleDetail).length > 0 && this.props.pagedata.isEdit) {
            this.setState({ data : nextProps.getData.RoleDetail });
        }
	} */

	render() {
		const { drawerClose } = this.props;
        const { RoleName, RoleDescription, Status } = this.state.data;
		return (
			<div className="jbs-page-content">
				<DashboardPageTitle title={<IntlMessages id="sidebar.roleDetails" />} drawerClose={drawerClose} closeAll={this.closeAll} />
				<Fragment>										
                    {this.props.loading && <JbsSectionLoader />}
                    <div className="row">
                        <div className="col-md-4 col-sm-6">
                            <h2><IntlMessages id="sidebar.roleDetails" /></h2>
                            <table className="table table-striped">
                                <colgroup>
                                    <col width="30%" />
                                    <col width="70%" />
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th scope="row"><IntlMessages id="my_account.roleName" /></th>
                                        <td>{RoleName}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><IntlMessages id="my_account.roleDescription" /></th>
                                        <td>{RoleDescription}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><IntlMessages id="my_account.status" /></th>
                                        <td><ActiveInactiveStatus status={Status} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-8 col-sm-6">
                            <h2><IntlMessages id="sidebar.associatedUsers" /></h2>
                            {/* <ListUserRoleAssign {...this.props} isShowPageTitle={false} dynPageTitle={<IntlMessages id="sidebar.associatedUsers" />} /> */}
                        </div>
                    </div>					
				</Fragment>
			</div>
		);
	}
}

/* const mapStateToProps = ({ roleManagementRdcer }) => {
    const { getData, loading } = roleManagementRdcer;
    return { getData, loading };
}

export default connect(mapStateToProps, {
    getRoleManagementById
})(ViewPermissionGroupDetails); */

export default ViewPermissionGroupDetails;