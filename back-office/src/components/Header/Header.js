/**
 * App Header
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import screenfull from 'screenfull';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';
// actions
import { collapsedSidebarAction } from 'Actions';
import LanguageProvider from './LanguageProvider';
import { getProfileByID } from "Actions/MyAccount";

class Header extends Component {

	state = {
		customizer: false,
		isMobileSearchFormVisible: false,
		name: ''
	}

	// function to change the state of collapsed sidebar
	onToggleNavCollapsed = (event) => {
		const val = !this.props.settings.navCollapsed;
		this.props.collapsedSidebarAction(val);
	}

	// open dashboard overlay
	openDashboardOverlay() {
		$('.dashboard-overlay').toggleClass('d-none');
		$('.dashboard-overlay').toggleClass('show');
		if ($('.dashboard-overlay').hasClass('show')) {
			$('body').css('overflow', 'hidden');
		} else {
			$('body').css('overflow', '');
		}
	}

	// close dashboard overlay
	closeDashboardOverlay() {
		$('.dashboard-overlay').removeClass('show');
		$('.dashboard-overlay').addClass('d-none');
		$('body').css('overflow', '');
	}

	// toggle screen full
	toggleScreenFull() {
		screenfull.toggle();
	}

	componentWillMount() {
		this.props.getProfileByID();
	}

	// mobile search form
	openMobileSearchForm() {
		this.setState({ isMobileSearchFormVisible: true });
	}

	componentWillReceiveProps(nextProps) {
		if (Object.keys(nextProps.profileData).length > 0 && nextProps.profileData.ReturnCode === 0) {
			this.props.location.state = { ...this.props.location.state, userData: nextProps.profileData.UserData };
			const fullname = (nextProps.profileData.UserData.FirstName !== null ? nextProps.profileData.UserData.FirstName : '') + ' ' + (nextProps.profileData.UserData.LastName !== null ? nextProps.profileData.UserData.LastName : '');
			const name = (fullname !== ' ') ? fullname : nextProps.profileData.UserData.Username;
			this.setState({ name: name });
		}
	}

	render() {
		$('body').click(function () {
			$('.dashboard-overlay').removeClass('show');
			$('.dashboard-overlay').addClass('d-none');
			$('body').css('overflow', '');
		});
		const { horizontalMenu, agencyMenu } = this.props;
		return (
			<AppBar position="static" className="jbs-header">
				<Toolbar className="d-flex justify-content-between w-100 pl-0">
					<div className="d-flex align-items-center">
						{(horizontalMenu || agencyMenu) &&
							<div className="site-logo">
								<Link to="/" className="logo-normal">
									<img src={require('Assets/img/cool_dex_one.png')} className="img-fluid" alt="site-logo" width="100" height="17" />
								</Link>
							</div>
						}
						{!agencyMenu &&
							<ul className="list-inline mb-0 navbar-left">
								{!horizontalMenu ?
									<li className="list-inline-item" onClick={(e) => this.onToggleNavCollapsed(e)}>
										<Tooltip title="Sidebar Toggle" placement="bottom" disableFocusListener={true}>
											<IconButton color="inherit" mini="true" aria-label="Menu" className="humburger">
												<MenuIcon />
											</IconButton>
										</Tooltip>
									</li> :
									<li className="list-inline-item">
										<Tooltip title="Sidebar Toggle" placement="bottom" disableFocusListener={true}>
											<IconButton color="inherit" aria-label="Menu" className="humburger" component={Link} to="/">
												<i className="ti-layout-sidebar-left"></i>
											</IconButton>
										</Tooltip>
									</li>
								}
							</ul>
						}
					</div>
					<ul className="navbar-right list-inline mb-0">
						<LanguageProvider />
						<li className="list-inline-item">
							<Tooltip title="Full Screen" placement="bottom" disableFocusListener={true}>
								<IconButton aria-label="settings" onClick={() => this.toggleScreenFull()}>
									<i className="zmdi zmdi-crop-free"></i>
								</IconButton>
							</Tooltip>
						</li>
					</ul>
					<Drawer
						anchor={'right'}
						open={this.state.customizer}
						onClose={() => this.setState({ customizer: false })}
					>
					</Drawer>
				</Toolbar>
			</AppBar>
		);
	}
}

// map state to props
const mapStateToProps = ({ settings, editProfileRdcer }) => {
	const response = {
		settings: settings,
		profileData: editProfileRdcer.data
	}
	return response;
}

export default withRouter(connect(mapStateToProps, {
	collapsedSidebarAction,
	getProfileByID
})(Header));