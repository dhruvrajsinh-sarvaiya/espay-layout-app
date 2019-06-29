/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 *  updated by :Saloni Rathod(15th April 2019)
 * SignIn Screen
 */

import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
// intl messages
import IntlMessages from "Util/IntlMessages";
// app config
import AppConfig from 'Constants/AppConfig';

//Login Form
import { ForgotPasswordWdgt } from 'Components/MyAccount';

class ForgotPasswordScreen extends Component {
	render() {
		const { loading } = this.props;
		return (
			<QueueAnim type="bottom" duration={2000}>
				<div className="jbs-session-wrapper inner_bg">
					{loading &&
						<LinearProgress />
					}
					<div className="session-inner-wrapper rmv_trnsfrm">
						<div className="container">
							<div className="inner_box">
								<div className="session-body text-center">
									<div className="session-head mb-30">
										<h2 className="font-weight-bold"><IntlMessages id="my_account.getStartedWith" /> {AppConfig.brandName}</h2>
									</div>
									<ForgotPasswordWdgt />
								</div>
							</div>
						</div>
					</div>
				</div>
			</QueueAnim>
		);
	}
}

export default ForgotPasswordScreen;
