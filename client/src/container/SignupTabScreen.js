/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * SignUp Screen
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
// intl messages
import IntlMessages from "Util/IntlMessages";
//Tab
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// app config
import AppConfig from 'Constants/AppConfig';
//Registration Form
import { NormalRegistrationWdgt } from 'Components/MyAccount';
import { SignupEmailWithOTPWdgt } from 'Components/MyAccount';
import { SignupMobileWithOTPWdgt } from 'Components/MyAccount';


class SignupTabScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0
		}
	}

	handleChange(event, value) {
		this.setState({ activeIndex: value });
	}

	render() {
		const { activeIndex } = this.state;
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
										<h2 className="font-weight-bold"><IntlMessages id="my_account.getStartedWith" /> {AppConfig.brandName}</h2>
									</div>
									<div className="tab_area">
										<Tabs value={activeIndex} onChange={(e, value) => this.handleChange(e, value)} fullWidth indicatorColor="primary" textColor="primary">
											<Tab label={<IntlMessages id="sidebar.normalSignup" />} className="cstm_tab" />
											<Tab label={<IntlMessages id="sidebar.signupWithEmail" />} className="cstm_tab" />
											<Tab label={<IntlMessages id="sidebar.signupWithMobile" />} className="cstm_tab" />
										</Tabs>
										<div className="tab_container">
											{activeIndex === 0 && <NormalRegistrationWdgt />}
											{activeIndex === 1 && <SignupEmailWithOTPWdgt />}
											{activeIndex === 2 && <SignupMobileWithOTPWdgt />}
										</div>
									</div>
									<p className="text-muted"><IntlMessages id="my_account.bySigningnote" values={{ appName: AppConfig.brandName }} /> <Link target="_blank" to="/terms-of-service"><IntlMessages id="sidebar.termsOfService" /></Link></p>
									<p><IntlMessages id="my_account.alreadyHaveAnAccount" /> <Link to="/signin"><IntlMessages id="sidebar.loginIn" /></Link></p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</QueueAnim>
		);
	}
}

export default SignupTabScreen;