/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * SignIn Screen
 */

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
// intl messages
import IntlMessages from "Util/IntlMessages";
//queryString
import qs from 'query-string';
// components
//import { SessionSlider } from 'Components/Widgets';
// app config
import AppConfig from 'Constants/AppConfig';

//Login Form
import { NormalLoginWdgt } from 'Components/MyAccount';
import { SigninEmailWithOTPWdgt } from 'Components/MyAccount';
import { SigninMobileWithOTPWdgt } from 'Components/MyAccount';

//Change signin method by url..
const parsed = qs.parse(location.search);
const methodID = parsed.id > 0 ? parseInt(parsed.id) : AppConfig.signInNSignUpMethod;

const LoginScreen = ({ method_id }) => {
	var loginComponent = '';
	if(method_id === 0) {
		loginComponent = <NormalLoginWdgt />;
	} else if(method_id === 1) {
		loginComponent = <SigninEmailWithOTPWdgt />;
	} else if(method_id === 2) {
		loginComponent = <SigninMobileWithOTPWdgt />;
	}

	return loginComponent;
}

class SignInScreen extends Component {
	constructor(props) {
		super(props);
        this.state = {
            method : methodID
        }
	}

	render() {
		const { method } = this.state;
		const { loading } = this.props;
		return (
			<QueueAnim type="bottom" duration={2000}>
				<div className="jbs-session-wrapper">
					{loading &&
						<LinearProgress />
					}
					<AppBar position="static" className="session-header">
						<Toolbar>
							<div className="container">
								<div className="d-flex justify-content-between">
									<div className="session-logo">
										<Link to="/">
											<img src={AppConfig.appLogo} alt="session-logo" />
										</Link>
									</div>
									<div>
										<IntlMessages id="my_account.createNewAccount" />
										<Button variant="raised" className="ml-15 btn-light" component={Link} to="/signup"><IntlMessages id="my_account.signUp" /></Button>
									</div>
								</div>
							</div>
						</Toolbar>
					</AppBar>
					<div className="session-inner-wrapper">
						<div className="container">
							<div className="row row-eq-height">
								<div className="col-sm-12 col-md-7 col-lg-7 mx-auto">
									<div className="session-body text-center">
										<div className="session-head mb-30">
											<h2 className="font-weight-bold"><IntlMessages id="my_account.getStartedWith" /> {AppConfig.brandName}</h2>
										</div>
										<LoginScreen method_id={method} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</QueueAnim>
		);
	}
}

export default SignInScreen;