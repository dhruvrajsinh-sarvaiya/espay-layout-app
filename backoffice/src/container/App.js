/**
 * App.js Layout Start Here
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';

// jbs theme provider
import JbsThemeProvider from './JbsThemeProvider';

//Horizontal Layout
//import HorizontalLayout from './HorizontalLayout';

//Agency Layout
//import AgencyLayout from './AgencyLayout';

//Main App
import JbsDefaultLayout from './DefaultLayout';

// boxed layout
import JbsBoxedLayout from './JbsBoxedLayout';

// app signin
// import AppSignIn from './SigninFirebase';
//import AppSignUp from './SignupFirebase';
import SignInScreen from './SignInScreen';
import SigninTabScreen from './SigninTabScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import ForgotConfirmationWdgt from '../components/MyAccount/ForgotConfirmationWdgt';

// added by vishva
import ExportConfirm from '../components/DaemonAddress/ExportConfirm';
//Added by salim dt:22/12/2018..
//Import Refresh Token Method to helpers.js
import { autoRefreshToken } from 'Helpers/helpers';

// async components
/* import {
	AsyncSessionLoginComponent,
	AsyncSessionRegisterComponent,
	AsyncSessionLockScreenComponent,
	AsyncSessionForgotPasswordComponent,
	AsyncSessionPage404Component,
	AsyncSessionPage500Component,
	AsyncTermsConditionComponent
} from 'Components/AsyncComponent/AsyncComponent'; */

//Auth0
// import Auth from '../Auth/Auth';

// callback component
//import Callback from "Components/Callback/Callback";

//Auth0 Handle Authentication
/* const auth = new Auth();

const handleAuthentication = ({ location }) => {
	if (/access_token|id_token|error/.test(location.hash)) {
		auth.handleAuthentication();
	}
} */

/**
 * Initial Path To Check Whether User Is Logged In Or Not
 */
const InitialPath = ({ component: Component, ...rest, authUser }) =>

	<Route
		{...rest}
		render={props =>
			authUser
				? <Component {...props} />
				: <Redirect
					to={
						{
							// pathname: (rest.path === 'backoffice' ? 'backoffice' : '') + '/signin',
							// pathname: (rest.path === 'backoffice' ? 'backoffice' : '') + '/app/dashboard/ecommerce',
							// state: { from: props.location }
							pathname: '/signin',
							state: { from: props.location }
						}}
				/>}
	/>;

// let myPath = 'app';

class App extends Component {
	//Added by salim dt:22/12/2018..
	constructor(props) {
		super(props);
		if(props.user) {
			autoRefreshToken();
		}
	}

	render() {
		const { location, match, user } = this.props;
		if (location.pathname === '/') {
			if (user === null) {
				return (<Redirect to={'/signin'} />);
				// return (<Redirect to={'/app/dashboard/ecommerce'} />);
			} else {
				return (<Redirect to={'/app/dashboard/trading'} />);
			}
		}/*  else if (location.pathname === '/backoffice') {
			myPath = 'backoffice';
			if (user === null) {
				return (<Redirect to={'/backoffice/signin'} />);
			} else {
				return (<Redirect to={'/backoffice/dashboard/ecommerce'} />);
			}
		} */

		return (
			<Fragment>
				{/* Added by salim textToImage Convert */}
				<div style={{display: 'none'}}>
					<canvas id="textCanvas" height="50"></canvas>
				</div>
				<JbsThemeProvider>
					<NotificationContainer />
					<InitialPath
						path={`${match.url}app`}
						authUser={user}
						component={JbsDefaultLayout}
					/>
					<InitialPath
						path={`${match.url}backoffice`}
						authUser={user}
						component={JbsDefaultLayout}
					/>
					{/* <Route path="/horizontal" component={HorizontalLayout} /> */}
					{/* <Route path="/agency" component={AgencyLayout} /> */}
					<Route path="/boxed" component={JbsBoxedLayout} />
					{/* <Route path="/signin" component={AppSignIn} /> */}
					<Route path="/signin" component={SigninTabScreen} />
					<Route path="/forgot-confirm" component={ForgotConfirmationWdgt} />
					<Route path="/forgot-password" component={ForgotPasswordScreen} />
					{/* <Route path="/backoffice/signin" component={AppSignIn} /> */}
					{/* <Route path="/signup" component={AppSignUp} /> */}
					{/* <Route path="/session/login" component={AsyncSessionLoginComponent} />
					<Route path="/session/register" component={AsyncSessionRegisterComponent} />
					<Route path="/session/lock-screen" component={AsyncSessionLockScreenComponent} />
					<Route
						path="/session/forgot-password"
						component={AsyncSessionForgotPasswordComponent}
					/>
					<Route path="/session/404" component={AsyncSessionPage404Component} />
					<Route path="/session/500" component={AsyncSessionPage500Component} />
					<Route path="/terms-condition" component={AsyncTermsConditionComponent} /> */}
					{/* <Route path="/callback" render={(props) => {
						handleAuthentication(props);
						return <Callback {...props} />
					}} /> */}
					{/* added by vishva */}
					<Route path="/export-confirm" component={ExportConfirm} />
				</JbsThemeProvider>
			</Fragment>
		);
	}
}

// map state to props
/* const mapStateToProps = ({ authUser }) => {
	const { user } = authUser;
	return { user };
}; */
const mapStateToProps = ({ nrlLoginRdcer }) => {
	const { user } = nrlLoginRdcer;
	return { user };
};

export default connect(mapStateToProps)(App);
