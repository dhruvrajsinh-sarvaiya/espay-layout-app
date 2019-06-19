/**
 * App Routes
 */
import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

// app default layout
import JbsAppLayout from 'Components/JbsAppLayout';

// router service
import routerService from "../services/_routerService";

class DefaultLayout extends Component {
	render() {
		const { match } = this.props;
		return (
			<JbsAppLayout>
				{routerService && routerService.map((route,key)=>
					<Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
				)}
			</JbsAppLayout>
		);
	}
}

export default withRouter(connect(null)(DefaultLayout));
