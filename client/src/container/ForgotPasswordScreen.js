/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 *  updated by :Saloni Rathod(15th April 2019)
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
					{/* <AppBar position="static" className="session-header">
						<Toolbar>
							<div className="container">
								<div className="d-flex justify-content-between">
									<div className="session-logo">
										<Link to="/">
											<img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35" />
										</Link>
									</div>
									<div>									
										<Link to="/signup" className="mr-15 text-primary"><IntlMessages id="my_account.createNewAccount" /></Link>
										<Button variant="raised" className="btn-primary text-white" component={Link} to="/signup"><IntlMessages id="my_account.signUp" /></Button>
									</div>
								</div>
							</div>
						</Toolbar>
					</AppBar> */}
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
