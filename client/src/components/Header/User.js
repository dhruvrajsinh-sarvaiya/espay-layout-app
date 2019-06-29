/*====== Max Height Menu =====*/
import React, { Component } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';

// components
import SupportPage from '../Support/SupportPage';

// intl messages
import IntlMessages from 'Util/IntlMessages';

import { redirectToLogin } from 'Helpers/helpers';

class User extends Component {

	state = {
		anchorEl: null,
		name: '',
		userDropdownMenu: false,
		isSupportModal: false
	};

	/**
	 * Logout User
	 */
	logoutUser() {
		localStorage.removeItem("Thememode")
		redirectToLogin();
	}


	handleClick = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};

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
			<UncontrolledDropdown nav className="list-inline-item jbs-dropdown-hed userprofile">
				<DropdownToggle nav className="p-0">
					<Tooltip title="My Account" placement="bottom" disableFocusListener={true}>
						<IconButton className="" aria-label="User">
							<i className="zmdi zmdi-account"></i><p className="text-whit">{this.props.name}</p>
						</IconButton>
					</Tooltip>
				</DropdownToggle>
				<DropdownMenu>
					<ul className="list-unstyled mb-0">
						<li>
							<Link to={{
								pathname: '/app/my-account/my-profile-info',
								state: { activeTab: 0 }
							}}>
								<i className="zmdi zmdi-account text-primary mr-3"></i>
								<IntlMessages id="widgets.profile" />
							</Link>
						</li>
						<li>
							<Link to='/app/my-account/membership-level'>
								<i className="ti-medall text-primary mr-3"></i>
								<IntlMessages id="sidebar.membershipLevel" />
							</Link>
						</li>
						<li className="border-top">
							<a href="javascript:void(0)" onClick={() => this.logoutUser()}>
								<i className="zmdi zmdi-power text-danger mr-3"></i>
								<IntlMessages id="widgets.logOut" />
							</a>
						</li>
					</ul>
				</DropdownMenu>
				<SupportPage
					isOpen={this.state.isSupportModal}
					onCloseSupportPage={() => this.onCloseSupportPage()}
					onSubmit={() => this.onSubmitSupport()}
				/>
			</UncontrolledDropdown>
		);
	}
}

const mapStateToProps = ({ settings, editProfileRdcer }) => {
	const response = {
		settings: settings,
		profileData: editProfileRdcer.data
	}
	return response;
}

export default connect(mapStateToProps, {})(User);