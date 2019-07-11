/**
 * App.js Layout Start Here
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
// jbs theme provider
import JbsThemeProvider from './JbsThemeProvider';
//Main App
import JbsDefaultLayout from './DefaultLayout';
// boxed layout
import JbsBoxedLayout from './JbsBoxedLayout';
// app signin
import SigninTabScreen from './SigninTabScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import ForgotConfirmationWdgt from '../components/MyAccount/ForgotConfirmationWdgt';
// added by vishva
import ExportConfirm from '../components/DaemonAddress/ExportConfirm';
//Added by salim dt:22/12/2018..
import { autoRefreshToken } from 'Helpers/helpers';

/**
 * Initial Path To Check Whether User Is Logged In Or Not
 */
const InitialPath = (props) => {
	const { Component, authUser } = props;
	const rest = props;

	return (<Route
		{...rest}
		children={props =>
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

class App extends Component {
	//Added by salim dt:22/12/2018..
	constructor(props) {
		super(props);
		if (props.user) {
			autoRefreshToken();
		}
	}

	render() {
		const { location, match, user } = this.props;
		if (location.pathname === '/') {
			if (user === null) {
				return (<Redirect to={'/signin'} />);
			} else {
				return (<Redirect to={'/app/dashboard/trading'} />);
			}
		}

		return (
			<Fragment>
				{/* Added by salim textToImage Convert */}
				<div style={{ display: 'none' }}>
					<canvas id="textCanvas" height="50"></canvas>
				</div>
				<JbsThemeProvider>
					<NotificationContainer />

					<InitialPath path={`${match.url}app`} authUser={user} component={JbsDefaultLayout} />
					<InitialPath path={`${match.url}backoffice`} authUser={user} component={JbsDefaultLayout} />

					<Route path="/boxed" component={JbsBoxedLayout} />
					<Route path="/signin" component={SigninTabScreen} />
					<Route path="/forgot-confirm" component={ForgotConfirmationWdgt} />
					<Route path="/forgot-password" component={ForgotPasswordScreen} />
					{/* added by vishva */}
					<Route path="/export-confirm" component={ExportConfirm} />
				</JbsThemeProvider>
			</Fragment>
		);
	}
}

// map state to props
const mapStateToProps = ({ nrlLoginRdcer }) => {
	const { user } = nrlLoginRdcer;
	return { user };
};

export default connect(mapStateToProps)(App);
