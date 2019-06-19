/**
 * Auther : Salim Deraiya
 * Created : 11/02/2019
 *  updated by :Saloni Rathod(15th April 2019)
 * Affiliate SignUp Screen
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
// app config
import AppConfig from 'Constants/AppConfig';

//Affiliate Registration Form
import SignupForm from 'Components/MyAccount/AffiliateProgram/SignupForm';

class AffiliateSignup extends Component {
	render() {
		const { loading } = this.props;
		return (
			<QueueAnim type="bottom" duration={2000}>
				<div className="jbs-session-wrapper inner_bg">
					{loading &&
						<LinearProgress />
					}
					<div className="session-inner-wrapper">
						<div className="container">
							<div className="register_screen">
								<div className="session-body text-center">
									<div className="session-head mb-30">
										<h2 className="font-weight-bold"><IntlMessages id="my_account.joinOurAffiliate" /> {AppConfig.brandName}</h2>
									</div>
									<SignupForm {...this.props} />
									<p className="text-muted"><IntlMessages id="my_account.bySigningnote" values={{ appName: AppConfig.brandName }} /> <Link target="_blank" to="/terms-of-service"><IntlMessages id="sidebar.termsOfService" /></Link></p>
								<div className="mb-0">
									<p><IntlMessages id="my_account.alreadyHaveAnAccount" /> <Link to="/signin"><IntlMessages id="sidebar.loginIn" /></Link></p>
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

export default AffiliateSignup;