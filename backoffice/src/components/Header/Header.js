/**
 * App Header
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
//import Button from '@material-ui/core/Button';
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

// helpers
//import { getAppLayout } from "Helpers/helpers";

// components
import Notifications from './Notifications';
//import ChatSidebar from './ChatSidebar';
import DashboardOverlay from '../DashboardOverlay/DashboardOverlay';
import LanguageProvider from './LanguageProvider';
/* import SearchForm from './SearchForm';
import QuickLinks from './QuickLinks';
import MobileSearchForm from './MobileSearchForm'; */
//import User from './User';

// intl messages
//import IntlMessages from 'Util/IntlMessages';
import { getProfileByID } from "Actions/MyAccount";

class Header extends Component {

	state = {
		customizer: false,
		isMobileSearchFormVisible: false,
		name: ''
	}

	// function to change the state of collapsed sidebar
	onToggleNavCollapsed = (event) => {
		// const val = !this.props.navCollapsed;
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
		const { isMobileSearchFormVisible } = this.state;
		$('body').click(function () {
			$('.dashboard-overlay').removeClass('show');
			$('.dashboard-overlay').addClass('d-none');
			$('body').css('overflow', '');
		});
		const { horizontalMenu, agencyMenu, location } = this.props;
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
								{ /* !horizontalMenu && <QuickLinks /> */}
								{/* <li className="list-inline-item search-icon d-inline-block">
									<SearchForm />
									<IconButton mini="true" className="search-icon-btn" onClick={() => this.openMobileSearchForm()}>
										<i className="zmdi zmdi-search"></i>
									</IconButton>
									<MobileSearchForm
										isOpen={isMobileSearchFormVisible}
										onClose={() => this.setState({ isMobileSearchFormVisible: false })}
									/>
								</li> */}
							</ul>
						}
					</div>
					<ul className="navbar-right list-inline mb-0">
						{/* <li className="list-inline-item summary-icon">
							<Tooltip title="Summary" placement="bottom">
								<a href="javascript:void(0)" className="header-icon tour-step-3" onClick={() => this.openDashboardOverlay()}>
									<i className="zmdi zmdi-info-outline"></i>
								</a>
							</Tooltip>
						</li> */}
						{/* !horizontalMenu &&
							<li className="list-inline-item">
								<Tooltip title="Upgrade" placement="bottom">
								<Button component={Link} to={`/${getAppLayout(location)}/pages/pricing`} variant="raised" className="upgrade-btn tour-step-4 text-white" color="primary">
										<IntlMessages id="widgets.upgrade" />
									</Button>
								</Tooltip>
							</li> */
						}
						<LanguageProvider />
						{/*<User name={this.state.name} />*/}
						{/* {<Notifications />} */}
						{/* 
						<li className="list-inline-item setting-icon">
							<Tooltip title="Chat" placement="bottom">
								<IconButton aria-label="settings" onClick={() => this.setState({ customizer: true })}>
									<i className="zmdi zmdi-comment"></i>
								</IconButton>
							</Tooltip>
						</li> */}
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
						{/* <ChatSidebar /> */}
					</Drawer>
				</Toolbar>
				<DashboardOverlay
					onClose={() => this.closeDashboardOverlay()}
				/>
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