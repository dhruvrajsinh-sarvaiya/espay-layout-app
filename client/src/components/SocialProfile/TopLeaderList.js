/**
 * Auther : Salim Deraiya
 * Created : 01/02/2018
 * Updated : 
 * Top Leader List Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { getTopLeaderList } from "Actions/SocialProfile";
import { NotificationManager } from 'react-notifications';

class TopLeaderList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			loading: false
		};
	}

	componentWillMount() {
		this.props.getTopLeaderList();
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });
		if (nextProps.data.ReturnCode === 1) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg);
		} else if (nextProps.data.ReturnCode === 0) {
			if (nextProps.data.hasOwnProperty('Response') && nextProps.data.Response !== null && nextProps.data.Response.length > 0) {
				this.setState({ list: nextProps.data.Response });
			}
		}
	}

	render() {
		const { list, loading } = this.state;
		return (
			<Fragment>
				{loading && <JbsSectionLoader />}
				<Fragment>
					<div className="mt-20 top-gainer-list">
						<div className="list_layout_area">
							<table className="cstm_tbl table table-hover table-responsive">
								<colgroup>
									<col width="5%" />
									<col width="35%" />
									<col width="35%" />
									<col width="25%" />
								</colgroup>
								<thead>
									<tr>
										<th><IntlMessages id="sidebar.colHash" /></th>
										<th><IntlMessages id="sidebar.colLeaderName" /></th>
										<th><IntlMessages id="sidebar.colNoOfFollower" /></th>
										<th><IntlMessages id="sidebar.colActions" /></th>
									</tr>
								</thead>
								<tbody>
									{
										list.length > 0
											? list.map((item, index) => (
												<tr key={index}>
													<td>{index + 1}</td>
													<td>{item.LeaderName}</td>
													<td>{item.NoOfFollowers}</td>
													<td><Link className="text-primary" to={{ pathname: "/app/social-profile/leader-board", state: { LeaderId: item.LeaderId } }}><i className="zmdi zmdi-eye zmdi-hc-2x"></i></Link></td>
												</tr>
											))
											:
											<tr>
												<td colSpan="4" className="text-center">{<IntlMessages id="wallet.emptyTable" />}</td>
											</tr>
									}
								</tbody>
							</table>
						</div>
					</div>
				</Fragment>
			</Fragment>
		);
	}
}

//MapStateToProps
const mapStateToProps = ({ topLeaderRdcer, settings }) => {
	const response = {
		darkMode: settings.darkMode,
		data: topLeaderRdcer.topLeader,
		loading: topLeaderRdcer.loading
	}
	return response;
};

export default connect(mapStateToProps, {
	getTopLeaderList
})(TopLeaderList);