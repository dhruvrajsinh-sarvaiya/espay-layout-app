/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * SignIn Screen
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import { Helmet } from 'react-helmet';
// intl messages
import IntlMessages from "Util/IntlMessages";
import { FormattedMessage } from 'react-intl';
//Tab
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// app config
import AppConfig from 'Constants/AppConfig';

//Login Form
import { NormalLoginWdgt } from 'Components/MyAccount';
import { SigninEmailWithOTPWdgt } from 'Components/MyAccount';
import { SigninMobileWithOTPWdgt } from 'Components/MyAccount';
import CooddeskLogo from '../assets/image/CoolDexLogo-tm.png';

class SigninTabScreen extends Component {
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
				<FormattedMessage id="seo.landing.title">
					{title => <Helmet><title>{title}</title></Helmet>}
				</FormattedMessage>
				<FormattedMessage id="seo.landing.desc">
					{desc => <Helmet><meta name="description" content={desc} /></Helmet>}
				</FormattedMessage>
				<Helmet>
					<meta name="theme-color" content="#008f68" />
					<meta property='og:title' content="Cooldex" />
					<meta name="keywords" content="Signin"></meta>
				</Helmet>
				<div className="jbs-session-wrapper inner_bg">
					{loading &&
						<LinearProgress />
					}

					<div className="session-inner-wrapper">
						<div className="container">
							<div className="login_screen">
								<div className="session-body text-center">
									<img src={CooddeskLogo} alt="session-logo" className="cmp_logo" />
									<div className="session-head mb-30">
										<h2 className="font-weight-bold"><IntlMessages id="my_account.getStartedWith" /> {AppConfig.brandName}</h2>
									</div>
									<Tabs className="signinupbtn" value={activeIndex} onChange={(e, value) => this.handleChange(e, value)} fullWidth indicatorColor="primary" textColor="primary">
										<Tab label={<IntlMessages id="sidebar.normalSignin" />} className="cstm_tab" />
										<Tab label={<IntlMessages id="sidebar.signinWithEmail" />} className="cstm_tab" />
										<Tab label={<IntlMessages id="sidebar.signinWithMobile" />} className="cstm_tab" />
									</Tabs>
									<div className="tab_container">
										{activeIndex === 0 && <NormalLoginWdgt />}
										{activeIndex === 1 && <SigninEmailWithOTPWdgt />}
										{activeIndex === 2 && <SigninMobileWithOTPWdgt />}
									</div>
									<div>
										<IntlMessages id="sidebar.dontHaveAnAccount" />
										<Link className="mr-10" to="/signup"><IntlMessages id="sidebar.joinCooldex" /></Link>
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

export default SigninTabScreen;