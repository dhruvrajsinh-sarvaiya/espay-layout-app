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

// components
//import { SessionSlider } from 'Components/Widgets';

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
									{/* <div>									
										<Link to="/signup" className="mr-15 text-white"><IntlMessages id="my_account.createNewAccount" /></Link>
										<Button variant="raised" className="btn-light" component={Link} to="/signup"><IntlMessages id="my_account.signUp" /></Button>
									</div> */}
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
										{/* <p className="text-muted"><IntlMessages id="my_account.bySigningnote" /> {AppConfig.brandName}</p>
										<p className="mb-0"><a target="_blank" href="/terms-of-service" className="text-muted"><IntlMessages id="sidebar.termsOfService" /></a></p> */}
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
