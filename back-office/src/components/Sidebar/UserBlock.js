/**
 * User Block Component
 */
import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';

// components
import SupportPage from '../Support/SupportPage';

import { redirectToLogin } from 'Helpers/helpers';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import { getProfileByID } from "Actions/MyAccount";

class UserBlock extends Component {

	state = {
		userDropdownMenu: false,
		isSupportModal: false,
		name: ''
	}

	componentWillMount() {
		this.props.getProfileByID();
	}

	componentWillReceiveProps(nextProps) {
		if (Object.keys(nextProps.profileData).length > 0 && nextProps.profileData.ReturnCode === 0) {
			const fullname = (nextProps.profileData.UserData.FirstName !== null ? nextProps.profileData.UserData.FirstName : '') + ' ' + (nextProps.profileData.UserData.LastName !== null ? nextProps.profileData.UserData.LastName : '');
			const name = (fullname !== ' ') ? fullname : nextProps.profileData.UserData.Username;
			this.setState({ name: name });
		}
	}

	/**
	 * Logout User
	 */
	logoutUser() {
		redirectToLogin();
	}

	/**
	 * Toggle User Dropdown Menu
	 */
	toggleUserDropdownMenu() {
		this.setState({ userDropdownMenu: !this.state.userDropdownMenu });
	}

	/**
	 * Open Support Modal
	 */
	openSupportModal() {
		this.setState({ isSupportModal: true });
	}

	/**
	 * On Close Support Page
	 */
	onCloseSupportPage() {
		this.setState({ isSupportModal: false });
	}

	/**
	 * On Submit Support Page
	 */
	onSubmitSupport() {
		this.setState({ isSupportModal: false });
		NotificationManager.success('Message has been sent successfully!');
	}

	render() {
		return (
			<div className="top-sidebar">
				<div className="sidebar-user-block">
					<Dropdown
						isOpen={this.state.userDropdownMenu}
						toggle={() => this.toggleUserDropdownMenu()}
						className="jbs-dropdown"
					>
						<DropdownToggle
							tag="div"
							className="d-flex align-items-center"
						>
							<div className="user-profile">
								<img
									src={require('Assets/avatars/user-profile.png')}
									alt="user profile"
									className="img-fluid rounded-circle"
									width="50"
									height="100"
								/>
							</div>
							<div className="user-info">
								<span className="user-name ml-4">{this.state.name}</span>
								<i className="zmdi zmdi-chevron-down dropdown-icon mx-4"></i>
							</div>
						</DropdownToggle>
						<DropdownMenu>
							<ul className="list-unstyled mb-0">
								<li className="p-15 border-bottom user-profile-top bg-primary rounded-top">
									<p className="text-white mb-0 fs-14">{this.state.name}</p>
								</li>
								<li className="border-top">
									<a href="javascript:void(0)" onClick={() => this.logoutUser()}>
										<i className="zmdi zmdi-power text-danger mr-3"></i>
										<IntlMessages id="widgets.logOut" />
									</a>
								</li>
							</ul>
						</DropdownMenu>
					</Dropdown>
				</div>
				<SupportPage
					isOpen={this.state.isSupportModal}
					onCloseSupportPage={() => this.onCloseSupportPage()}
					onSubmit={() => this.onSubmitSupport()}
				/>
			</div>
		);
	}
}

// map state to props
const mapStateToProps = ({ settings, editProfileRdcer }) => {
	//return settings;
	const response = {
		settings: settings,
		profileData: editProfileRdcer.data
	}
	return response;
}

export default connect(mapStateToProps, {
	//logoutUserFromFirebase
	getProfileByID
})(UserBlock);