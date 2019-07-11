/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * SignUp Screen
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

//Registration Form
import { NormalRegistrationWdgt } from 'Components/MyAccount';
import { SignupEmailWithOTPWdgt } from 'Components/MyAccount';
import { SignupMobileWithOTPWdgt } from 'Components/MyAccount';

// app config
import AppConfig from 'Constants/AppConfig';

//Change signup method by url..
const parsed = qs.parse(location.search);
const methodID = parsed.id > 0 ? parseInt(parsed.id) : AppConfig.signInNSignUpMethod;

const RegisterMethod = ({ method_id }) => {
	var registerComponent = '';
	if(method_id === 0) {
		registerComponent = <NormalRegistrationWdgt />;
	} else if(method_id === 1) {
		registerComponent = <SignupEmailWithOTPWdgt />;
	} else if(method_id === 2) {
		registerComponent = <SignupMobileWithOTPWdgt />;
	}

	return registerComponent;
}

class SignUpScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            method : methodID
        }
	}

	render() {
        const { loading } = this.props;
        const { method } = this.state;
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
										<IntlMessages id="my_account.alreadyHaveAnAccount" />
										<Button component={Link} to="/signin" variant="raised" className="ml-15 btn-light"><IntlMessages id="my_account.signIn" /></Button>
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
										<RegisterMethod method_id={method} />
										<p className="text-muted"><IntlMessages id="my_account.bySigningnote" /> {AppConfig.brandName}</p>
										<p><Link target="_blank" to="/terms-of-service" className="text-muted"><IntlMessages id="sidebar.termsOfService" /></Link></p>
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

export default SignUpScreen;