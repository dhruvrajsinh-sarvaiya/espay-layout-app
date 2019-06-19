/**
 * App Header
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import screenfull from 'screenfull';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Switch from '@material-ui/core/Switch';
import $ from 'jquery';
import moment from 'moment';

// actions
import {
	collapsedSidebarAction,
	// darkModeAction, 
	changeThemeColor, modeChange
} from 'Actions';

// helpers
import { getAppLayout } from "Helpers/helpers";

// components
import Notifications from './Notifications';
import ChatSidebar from './ChatSidebar';
import DashboardOverlay from '../DashboardOverlay/DashboardOverlay';
import LanguageProvider from './LanguageProvider';
import QuickLinks from './QuickLinks';
import MobileSearchForm from './MobileSearchForm';
import User from './User';
//Get IP,Hostname,deviceInfo and mode from the helper.js
import {
	getDeviceInfo,
	getIPAddress,
	getHostName,
	getMode
} from "Helpers/helpers";

// intl messages
import IntlMessages from 'Util/IntlMessages';
import { getProfileByID } from "Actions/MyAccount";
import AppConfig from 'Constants/AppConfig';
import { EXITED } from 'react-transition-group/Transition';
const signalR = require("@aspnet/signalr");
const signalRChatURL = AppConfig.signalRChatURL

class Header extends Component {

	constructor(props) {
		super(props);

		try {

			this.state = {
				customizer: false,
				isMobileSearchFormVisible: false,
				name: '',
				socketTimeData: [],
				TimeStamp: 1542351633587,
				isUserBlocked: true,
				userBlockInfo: [],
				chatHubConnection: new signalR.HubConnectionBuilder().withUrl(signalRChatURL, { transport: signalR.HttpTransportType.LongPolling, accessTokenFactory: () => localStorage.getItem('gen_access_token') }).configureLogging(signalR.LogLevel.None).build(),
				data: {
					DayNightMode: localStorage.getItem('Thememode') !== 'undefined' ? localStorage.getItem('Thememode') : false,
					DeviceId: getDeviceInfo(),
					Mode: getMode(),
					IPAddress: '', //getIPAddress(),
					HostName: getHostName()
				}
			}

		} catch (e) {
			console.log("Connection Initialize error", e)
		}
	}

	componentDidMount() {
		//const { darkMode } = this.props;

		// if (darkMode) {
		// 	this.darkModeHanlder(true);
		// }

		if (this.state.data.DayNightMode) {
			var DayNightMode = JSON.parse(this.state.data.DayNightMode)
			this.darkModeHanlder(DayNightMode);
		}

		// added by devang parekh for getting username
		this.props.getProfileByID();
		// localStorage.removeItem('Thememode');
		this.props.location.state.hubConnection.on('SetTime', (TimeData) => {

			try {
				let timeStamp = JSON.parse(TimeData);

				if (typeof timeStamp.Data !== 'undefined' && timeStamp.Data !== '') {

					if ((timeStamp.EventTime && this.state.socketTimeData.length == 0) ||
						(this.state.socketTimeData.length !== 0 && timeStamp.EventTime >= this.state.socketTimeData.EventTime)) {

						this.setState({ TimeStamp: parseInt(timeStamp.Data), socketTimeData: timeStamp })
					}

				}
			} catch (error) {

			}
		});
	}

	// invoke before Compoent render
	componentWillMount() {
		//Added by Jayesh for Chat API updated on 04-01-2019
		if (atob(localStorage.getItem("chat")) !== 'undefined' && atob(localStorage.getItem("chat")) !== null) {
			try {
				let ChatAPI = JSON.parse(atob(localStorage.getItem("chat")));
				let ChatScript = '';

				if (ChatAPI.zendesk_active == 1 && ChatAPI.zendesk != "")
					ChatScript = ChatAPI.zendesk;
				else if (ChatAPI.zoho_active == 1 && ChatAPI.zoho != "")
					ChatScript = ChatAPI.zoho;
				else if (ChatAPI.tawk_active == 1 && ChatAPI.tawk != "")
					ChatScript = ChatAPI.tawk;
				else if (ChatAPI.livechatinc_active == 1 && ChatAPI.livechatinc != "")
					ChatScript = ChatAPI.livechatinc;
				else if (ChatAPI.livehelpnow_active == 1 && ChatAPI.livehelpnow != "")
					ChatScript = ChatAPI.livehelpnow;
				else if (ChatAPI.smartsupp_active == 1 && ChatAPI.smartsupp != "")
					ChatScript = ChatAPI.smartsupp;

				if (ChatScript != "") {
					if (ChatAPI.zendesk_active == 1) {
						const script = document.createElement("script");
						script.id = 'ze-snippet';
						script.src = ChatScript;
						document.head.appendChild(script);
					}
					else {
						var re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
						var match;
						while (match = re.exec(ChatScript)) {
							const script = document.createElement("script");
							const scriptText = document.createTextNode(match[1]);
							script.appendChild(scriptText);
							document.head.appendChild(script);
						}
					}
				}


			} catch (error) {

			}

		}

		try {

			//console.log("Start connection")
			this.state.chatHubConnection.start().then(() => {
				//console.log("End connection")
				this.setState({ chatHubConnection: this.state.chatHubConnection });

			});

		} catch (e) {
			console.log("Start Connection error", e)
		}


		this.state.chatHubConnection.onclose(e => {
			//console.log('disconnected from server chat');
			//console.log(window.JbsHorizontalLayout);
			//console.log("Start connection new")
			this.state.chatHubConnection.start().then(() => {
				//console.log("End connection new")
				this.setState({ chatHubConnection: this.state.chatHubConnection });
			});
		});

		this.state.chatHubConnection.on('RecieveBlockUnblockUser', (receivedMessage) => {
			//console.log('SignalR Response from RecieveBlockUnblockUser',receivedMessage)
			try {

				receivedMessage = JSON.parse(receivedMessage);
				if ((receivedMessage.EventTime && this.state.userBlockInfo.length === 0) ||
					(this.state.userBlockInfo.length !== 0 && receivedMessage.EventTime > this.state.userBlockInfo.EventTime)) {

					if (receivedMessage.Data && typeof receivedMessage.Data.IsBlocked !== 'undefined') {
						this.setState({
							isUserBlocked: receivedMessage.Data.IsBlocked,
							userBlockInfo: receivedMessage
						});
					}

				}

			} catch (e) {

			}

		});

	}

	componentWillReceiveProps(nextProps) {
		if (Object.keys(nextProps.profileData).length > 0 && nextProps.profileData.ReturnCode === 0) {
			// to store user details in global state - added by Nishant 
			this.props.location.state = { ...this.props.location.state, userData: nextProps.profileData.UserData };
			const fullname = (nextProps.profileData.UserData.FirstName !== null ? nextProps.profileData.UserData.FirstName : '') + ' ' + (nextProps.profileData.UserData.LastName !== null ? nextProps.profileData.UserData.LastName : '');
			const name = (fullname !== ' ') ? fullname : nextProps.profileData.UserData.Username;
			this.setState({ name: name });
		}
		if (nextProps.settings.modeChangeData.ReturnCode === 0) {
			localStorage.setItem('Thememode', this.state.data.DayNightMode);
		}
	}

	/**
     * Dark Mode Event Hanlder
     * Use To Enable Dark Mode
     * @param {*object} event
    */
	// darkModeHanlder(isTrue) {
	// 	if (isTrue) {
	// 		$('body').addClass('dark-mode');
	// 	} else {
	// 		$('body').removeClass('dark-mode');
	// 	}
	// 	this.props.darkModeAction(isTrue);
	// }

	darkModeHanlder(isTrue) {
		if (isTrue) {
			$('body').addClass('dark-mode');
		} else {
			$('body').removeClass('dark-mode');
		}
		// this.setState({
		// 	data: {
		// 		...this.state.data,
		// 		DayNightMode: isTrue
		// 	}
		// })
		this.state.data.DayNightMode = isTrue;
		let self = this;
		var reqObj = Object.assign({}, this.state.data);
		getIPAddress().then(function (ipAddress) {
			reqObj.IPAddress = ipAddress;
			self.props.modeChange(reqObj);
		});
		// this.props.modeChange(isTrue);
	}

	/**
     * Change Theme Color Event Handler
     * @param {*object} theme 
     */
	changeThemeColor(theme) {
		var DayNightMode = JSON.parse(this.state.data.DayNightMode)
		this.darkModeHanlder(DayNightMode);
		this.props.changeThemeColor(theme);
	}

	// function to change the state of collapsed sidebar
	onToggleNavCollapsed = (event) => {
		const val = !this.props.navCollapsed;
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

	// mobile search form
	openMobileSearchForm() {
		this.setState({ isMobileSearchFormVisible: true });
	}

	render() {
		const { isMobileSearchFormVisible, darkMode } = this.state;
		const { loading } = this.props.settings;
		$('body').click(function () {
			$('.dashboard-overlay').removeClass('show');
			$('.dashboard-overlay').addClass('d-none');
			$('body').css('overflow', '');
		});
		var date = moment(this.state.TimeStamp).format("YYYY-MM-DD H:mm:ss");
		const { tradingMenu, horizontalMenu, agencyMenu, location } = this.props;
		var DayNightMode = JSON.parse(this.state.data.DayNightMode)
		return (
			<AppBar position="static" className="jbs-header">
				{loading && <JbsSectionLoader />}
				<Toolbar className="d-flex justify-content-between w-100 pl-0">
					<div className="d-flex align-items-center">
						{(tradingMenu || horizontalMenu || agencyMenu) &&
							<div className="site-logo">
								{/* <Link to="/app/dashboard/CooldexTrading" className="logo-normal"> */}
								<Link to="/app/dashboard/trading" className="logo-normal">
									{/* <img src={require('Assets/img/cool_dex_one.png')} className="img-fluid" alt="site-logo" width="100" height="17" /> */}
									<img src={require('Assets/image/CoolDexLogo-tm.png')} className="img-fluid" alt="Cooldex-logo" alt="Cooldex-logo" width="150" />
								</Link>
							</div>
						}
						{!agencyMenu &&
							<ul className="list-inline">
								{!horizontalMenu ?
									<li className="list-inline-item" onClick={(e) => this.onToggleNavCollapsed(e)}>
										<Tooltip title="Sidebar Toggle" placement="bottom">
											<IconButton color="inherit" mini="true" aria-label="Menu" className="humburger">
												<MenuIcon />
											</IconButton>
										</Tooltip>
									</li> :
									<li className="list-inline-item">
										<Tooltip title="Sidebar Toggle" placement="bottom">
											<IconButton color="inherit" aria-label="Menu" className="humburger" component={Link} to="/">
												<i className="ti-layout-sidebar-left"></i>
											</IconButton>
										</Tooltip>
									</li>
								}
								{!tradingMenu && horizontalMenu && <QuickLinks />}
								<li className="list-inline-item desktopMode search-icon d-inline-block">
									<IconButton mini="true" className="search-icon-btn" onClick={() => this.openMobileSearchForm()}>
										<i className="zmdi zmdi-search"></i>
									</IconButton>
									<MobileSearchForm
										isOpen={isMobileSearchFormVisible}
										onClose={() => this.setState({ isMobileSearchFormVisible: false })}
									/>
								</li>
								<li className="desktopMode" style={{ marginBottom: "20px", marginLeft: "10px" }}>
									<span className={this.props.settings.darkMode ? "text-light" : 'text-dark'}>{date}</span>
								</li>
							</ul>
						}
					</div>
					<ul className="list-inline">
						<li className="list-inline-item">
							<Tooltip title="Dark Mode" placement="bottom" disableFocusListener={true}>
								<FormControlLabel
									control={
										<Switch
											checked={DayNightMode}
											onChange={(e) => this.darkModeHanlder(e.target.checked)}
											className="switch-btn tour-step-0"
										/>
									}
									className="m-0"
								/>
							</Tooltip>
						</li>
						{/* <li className="list-inline-item">
							<Tooltip title="Dark Mode" placement="bottom">
								<FormControlLabel
									control={
										<Switch
											checked={darkMode}
											onChange={(e) => this.darkModeHanlder(e.target.checked)}
											className="switch-btn tour-step-0"
										/>
									}
									className="m-0"
								/>
							</Tooltip>
						</li> */}
						{/* <li className="list-inline-item summary-icon">
							<Tooltip title="Summary" placement="bottom">
								<a href="javascript:void(0)" className="header-icon tour-step-3" onClick={() => this.openDashboardOverlay()}>
									<i className="zmdi zmdi-info-outline"></i>
								</a>
							</Tooltip>
						</li> */}
						<LanguageProvider />
						<User name={this.state.name} />
						<Notifications hubConnection={this.props.location.state.hubConnection} />
						<li className="list-inline-item setting-icon">
							<Tooltip title="Chat" placement="bottom" disableFocusListener={true}>
								<IconButton aria-label="settings" onClick={() => this.setState({ customizer: true })}>
									<i className="zmdi zmdi-comment"></i>
								</IconButton>
							</Tooltip>
						</li>
						<li className="list-inline-item desktopMode">
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
						<ChatSidebar isUserBlocked={this.state.isUserBlocked} chatHubConnection={this.state.chatHubConnection} name={this.state.name} />
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
/* const mapStateToProps = ({ settings }) => {

	return settings;
}; */
const mapStateToProps = ({ settings, editProfileRdcer }) => {
	const response = {
		settings: settings,
		profileData: editProfileRdcer.data
	}
	return response;
}

export default withRouter(connect(mapStateToProps, {
	collapsedSidebarAction,
	// darkModeAction,
	changeThemeColor,
	getProfileByID,
	modeChange
})(Header));
