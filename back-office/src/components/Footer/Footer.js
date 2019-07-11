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

const Footer = () => (
	<div className="footermain">
		<div className="jbs-footer d-flex justify-content-between align-items-center" style={{ position: "inherit" }}>
			<ul className="list-inline footer-menus mb-0">
				<li className="list-inline-item">
					<Button component={Link} to="/app/dashboard"><IntlMessages id="sidebar.gettingStarted" /></Button>
				</li>
			</ul>
			<h5 className="mb-0">{AppConfig.copyRightText}</h5>
		</div>
	</div>
);

export default Footer;
