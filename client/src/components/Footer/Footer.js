/**
 * Footer
 */
import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// app config
import AppConfig from 'Constants/AppConfig';
import SocialIcon from '../Social';

const Footer = () => (
	<div className="jbs-footer d-flex justify-content-between align-items-center">
		<div className="col-md-9">
			<ul className="list-inline footer-menus mb-0">
				<li className="list-inline-item">
					<Button component={Link} to="/app/pages/about-us"><IntlMessages id="sidebar.aboutUs" /></Button>
				</li>
				<li className="list-inline-item">
					<Button component={Link} to="/app/pages/terms-of-service"><IntlMessages id="sidebar.termsOfService" /></Button>
				</li>
				<li className="list-inline-item">
					<Button component={Link} to="/app/pages/privacy-policy"><IntlMessages id="sidebar.privacyPolicy" /></Button>
				</li>
				<li className="list-inline-item">
					<Button component={Link} to="/app/pages/legal-statement"><IntlMessages id="sidebar.legalStatement" /></Button>
				</li>
				<li className="list-inline-item">
					<Button component={Link} to="/app/pages/refund-policy"><IntlMessages id="sidebar.refundPolicy" /></Button>
				</li>
				<li className="list-inline-item">
					<Button component={Link} to="/app/pages/application-center"><IntlMessages id="sidebar.applicationCenter" /></Button>
				</li>
				<li className="list-inline-item">
					<Button component={Link} to="/app/pages/coin-list"><IntlMessages id="sidebar.coinList" /></Button>
				</li>
				<li className="list-inline-item">
					<Button component={Link} to="/app/pages/fees"><IntlMessages id="sidebar.fees" /></Button>
				</li>
				<li className="list-inline-item">
					<Button component={Link} to="/app/pages/contact-us"><IntlMessages id="sidebar.contactUs" /></Button>
				</li>
			</ul>
		</div>
		<div className="col-md-3">
			<SocialIcon />
			<h5 className="mb-0 pt-15">{AppConfig.copyRightText}</h5>
		</div>
	</div>
);

export default Footer;
