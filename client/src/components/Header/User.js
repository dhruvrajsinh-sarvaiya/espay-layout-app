/*====== Max Height Menu =====*/
import React, { Component } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Badge } from 'reactstrap';
import { NotificationManager } from 'react-notifications';

// components
import SupportPage from '../Support/Support';

// redux action
// import { logoutUserFromFirebase } from 'Actions';

// intl messages
import IntlMessages from 'Util/IntlMessages';

//Added by salim
//import { getProfileByID } from "Actions/MyAccount";

import { redirectToLogin } from 'Helpers/helpers';

class User extends Component {

	state = {
		anchorEl: null,
		name : ''
	};

	state = {
		userDropdownMenu: false,
		isSupportModal: false
	}

	/* componentWillMount() {
		this.props.getProfileByID();
	} */

	/* componentWillReceiveProps(nextProps) {
		if(Object.keys(nextProps.profileData).length > 0 && nextProps.profileData.ReturnCode === 0) {
			const fullname = nextProps.profileData.UserData.FirstName+' '+nextProps.profileData.UserData.LastName;
			const name = fullname !== '' ? fullname : nextProps.profileData.UserData.Username;
			this.setState({ name : fullname });

		}
	} */

	/**
	 * Logout User
	 */
	logoutUser() {
		// this.props.logoutUserFromFirebase();
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
		const { name } = this.state;
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
						{/* <li className="p-15 border-bottom user-profile-top cooldexlanguage rounded-top">
							<p className="text-white mb-0 fs-14">{this.props.name}</p>
						</li> */}
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
						{/* <li>
							<Link to='/app/my-account/change-password'>
								<i className="zmdi zmdi-lock text-primary mr-3"></i>
								<IntlMessages id="sidebar.changePass" />
							</Link>
						</li>
						<li>
									<Link to={{
										pathname: '/app/users/user-profile-1',
										state: { activeTab: 2 }
									}}>
										<i className="zmdi zmdi-comment-text-alt text-success mr-3"></i>
										<IntlMessages id="widgets.messages" />
										<Badge color="danger" className="pull-right">3</Badge>
									</Link>
								</li>
						<li>
							<Link to="/app/my-account/complain">
								<i className="zmdi zmdi-edit text-warning mr-3"></i>
								<IntlMessages id="sidebar.feedback" />
								<Badge color="info" className="pull-right">1</Badge>
							</Link>
						</li> */}
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
		settings : settings,
		profileData : editProfileRdcer.data
	}
	return response;
}

export default connect(mapStateToProps, {
	//logoutUserFromFirebase,
	//getProfileByID
})(User);