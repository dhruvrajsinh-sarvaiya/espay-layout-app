/**
 * Horizontal App
 */
import React, { Component } from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';

// horizontal layout
import JbsHorizontalLayout from 'Components/JbsHorizontalLayout';

// router service
import routerService from "../services/_routerService";

class JbsHorizontalApp extends Component {
	render() {
		const { match, location } = this.props;
		if (location.pathname === '/horizontal') {
			return (<Redirect to={'/horizontal/dashboard/ecommerce'} />);
		}
		return (
			<JbsHorizontalLayout>
				{routerService && routerService.map((route,key)=>
					<Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
				)}
			</JbsHorizontalLayout>
		);
	}
}

export default withRouter(JbsHorizontalApp);
