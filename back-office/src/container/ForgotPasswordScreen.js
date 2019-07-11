/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * SignIn Screen
 */

import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
// intl messages
import IntlMessages from "Util/IntlMessages";


// app config
import AppConfig from 'Constants/AppConfig';

//Login Form
import { ForgotPassword } from 'Components/MyAccount';

class ForgotPasswordScreen extends Component {
	render() {
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
											<img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35" />
										</Link>
									</div>
								</div>
							</div>
						</Toolbar>
					</AppBar>
					<div className="session-inner-wrapper frgt_scrn">
						<div className="container">
							<div className="row row-eq-height">
								<div className="w-75 col-md-7 col-lg-7 mx-auto">
									<div className="session-body text-center">
										<div className="session-head mb-30">
											<h2 className="font-weight-bold"><IntlMessages id="my_account.getStartedWith" /> {AppConfig.brandName}</h2>
										</div>
										<ForgotPassword />
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

export default ForgotPasswordScreen;
