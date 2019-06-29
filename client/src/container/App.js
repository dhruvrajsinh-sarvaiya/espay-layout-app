/**
 * App.js Layout Start Here
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import qs from 'query-string';
// jbs theme provider
import JbsThemeProvider from './JbsThemeProvider';

//Horizontal Layout
import HorizontalLayout from './HorizontalLayout';

import { referralUrlClick } from "Actions/MyAccount";

// app signin 
import SigninTabScreen from './SigninTabScreen';
import SignupTabScreen from './SignupTabScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import EmailConfirmationWdgt from '../components/MyAccount/EmailConfirmationWdgt';
import ForgotConfirmationWdgt from '../components/MyAccount/ForgotConfirmationWdgt';
import DeviceAuthorizeScreen from '../components/MyAccount/DeviceAuthorizeScreen';
import AffiliateSignup from './AffiliateSignup';
import AffiliateConfirmationWdgt from '../components/MyAccount/AffiliateProgram/AffiliateConfirmationWdgt';
import TermsofService from '../routes/pages/terms-of-service';
import Maintainance from '../routes/session/Maintainance';
import UserConfirmationWdgt from '../components/MyAccount/UserConfirmationWdgt'; //Added by Saloni Rathod

//landing page
import LandingPage from './LandingPage';

//Cooldex landing page
import landingcooldexPage from './LandingCooldex';

//Added by salim dt:17/10/2018...
import { autoRefreshToken, getIPAddress } from 'Helpers/helpers';

// callback component
import Callback from "Components/Callback/Callback";

//code added by devnag parkh (19-6-2019)
import CookieConsent from "react-cookie-consent";
// end 

const pageUrlArr = [
	"/app/pages/about-us",
	"/app/pages/contact-us",
	"/app/pages/application-center",
	"/app/pages/legal-statement",
	"/app/pages/terms-of-service",
	"/app/pages/privacy-policy",
	"/app/pages/fees",
	"/app/pages/faq",
	"/app/pages/refund-policy",
	"/app/pages/helpcenter",
	"/app/pages/helpcenter-info",
	"/app/affiliate/commission-pattern"
];
const pageUrlSecondArr = [
	"/about-us",
	"/contact-us",
	"/application-center",
	"/legal-statement",
	"/terms-of-service",
	"/privacy-policy",
	"/fees",
	"/faq",
	"/refund-policy",
	"/pages/helpcenter",
	"/pages/helpcenter-info",
	"/affiliate/commission-pattern"
];

/**
 * Initial Path To Check Whether User Is Logged In Or Not
 */
const InitialPath = ({ Component, ...rest, authUser, location, match, path }) => {
	/* added following condition for withdraw route confirmation screen */
	if (location.pathname === `${path}/withdraw-confirmation` && !authUser) {
		if (localStorage.getItem('RefNo') === null && localStorage.getItem('Bit') === null) {
			const parsed = qs.parse(location.search);
			localStorage.setItem('RefNo', parsed.RefNo);
			localStorage.setItem('Bit', parsed.Bit);
		}
	}
	if (pageUrlArr.indexOf(location.pathname) !== -1) {
		return (
			<Route
				{...rest}
				render={props => <Component {...props} />}
			/>);
	} else {
		return (
			<Route
				{...rest}
				render={props =>
					authUser
						? <Component {...props} />
						: <Redirect
							to={{
								pathname: '/signin',
								state: { from: props.location }
							}}
						/>}
			/>);
	}
}

class App extends Component {
	//Added by salim dt:17/10/2018..
	constructor(props) {
		super(props);
		if (props.user) {
			autoRefreshToken();
		}
	}

	componentWillMount() {

		let self = this;
		const PassURL = (this.props.location.search).split('?ref=')[1];
		if (PassURL !== "undefined" && typeof PassURL !== "undefined") {
			getIPAddress().then(function (ipAddress) {
				const IPAddress = ipAddress;
				self.props.referralUrlClick({ IPAddress, PassURL });
			});
		}

	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.referralCodeFromURL.ReturnCode === 0 && typeof nextProps.referralCodeFromURL !== "undefined") {
			// code change by devang parekh for add extra param in sign up request (2-4-2019)
			localStorage.setItem('ReferralCode', nextProps.referralCodeFromURL.ReferralCode + ',' + nextProps.referralCodeFromURL.ReferralServiceId + ',' + nextProps.referralCodeFromURL.ReferralChannelTypeId);
		}
	}

	render() {
		const { location, match, user } = this.props;
		/* if regarding url load then its allow without login added by kushal parekh*/ //Added helpcenter routes 11-01-2019
		if (location.pathname === '/') {
			if (pageUrlSecondArr.indexOf(location.pathname) !== -1) {
			} else {
				if (user === null) {
					return (<Redirect to={'/welcome'} />);
				} else {
					return (<Redirect to={'/app/dashboard/trading'} />);
				}
			}
		}
		//Added by salim
		const hide = { display: 'none' };
		return (
			<div>
				{/* code added by devang parekh for display cookie message when access any pages (19-6-2019)*/}
				<CookieConsent buttonText={"Accept!!"} cookieName="CookieTerms">
					This website uses cookies to give you the best, most relevent experience. Using this website means you're Ok with this.
				</CookieConsent>
				{/* end */}
				{/* Added by salim textToImage Convert */}
				<div style={hide}>
					<canvas id="textCanvas" height="50"></canvas>
				</div>
				<JbsThemeProvider>
					<NotificationContainer />
					<InitialPath
						path={`${match.url}app`}
						authUser={user}
						component={HorizontalLayout}
						location={location}
						match={match}
					/>
					<Route path="/horizontal" component={HorizontalLayout} />
					<Route path="/dashboard" component={HorizontalLayout} />
					<Route path="/signin" component={SigninTabScreen} />
					<Route path="/signup" component={SignupTabScreen} />
					<Route path="/register-confirm" component={EmailConfirmationWdgt} />
					<Route path="/forgot-password" component={ForgotPasswordScreen} />
					<Route path="/device-authorize" component={DeviceAuthorizeScreen} />
					<Route path="/affiliate-signup" component={AffiliateSignup} />
					<Route path="/affiliate-confirm" component={AffiliateConfirmationWdgt} />
					<Route path="/invite-confirm" component={UserConfirmationWdgt} /> {/* Added by Saloni Rathod */}
					<Route path="/landingpage" component={LandingPage} />
					<Route path="/welcome" component={landingcooldexPage} />
					<Route path="/callback" render={(props) => { return <Callback {...props} /> }} />
					<Route path="/forgot-confirm" component={ForgotConfirmationWdgt} />
					<Route path="/terms-of-service" component={TermsofService} />
					<Route path="/maintenance" component={Maintainance} />
				</JbsThemeProvider>
			</div>
		);
	}
}

const mapStateToProps = ({ nrlLoginRdcer, ReferralURLClick }) => {
	const { user } = nrlLoginRdcer;
	const { referralCodeFromURL } = ReferralURLClick;
	return { user, referralCodeFromURL };
};

export default connect(mapStateToProps, { referralUrlClick })(App);
