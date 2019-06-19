/**
 * CreatedBy : Salim Deraiya
 * Date :08/10/2018
 * View Domains
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// intl messages
import IntlMessages from "Util/IntlMessages";

class ViewDomainWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alias: '',
			domain: '',
			status: ''
		};
	}

	componentWillMount() {
		console.log('Props Value:',this.props);
	}

	render() {
		const  { alias, domain, status } = this.state;
		return (
			<Fragment>
				<div className="card p-15">
					<h4 className="heading">View Domain Detials</h4>
					<table>
						<tr>
							<th>Alias Name</th>
							<td>{alias}</td>
						</tr>
						<tr>
							<th>Domain Name</th>
							<td>{domain}</td>
						</tr>
						<tr>
							<th>Status</th>
							<td>{status}</td>
						</tr>
					</table>
				</div>
			</Fragment>
		);
	}
}

export default withRouter(ViewDomainWdgt);