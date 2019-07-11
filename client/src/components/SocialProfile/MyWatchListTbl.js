/* 
    Developer : Salim Deraiya
    Date : 22-01-2019
    UpdatedBy : Salim Deraiya (22-01-2019)..
    File Comment : Follower List Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import IntlMessages from 'Util/IntlMessages';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { getLeaderWatchlist } from 'Actions/SocialProfile';
import AppConfig from 'Constants/AppConfig';

class MyWatchListTbl extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			loading: false,
			PageIndex: 0,
			Page_Size: AppConfig.totalRecordDisplayInList,
			GroupId: 0
		};
	}

	componentWillMount() {
		const reqObj = {
			PageIndex: this.state.PageIndex,
			Page_Size: this.state.Page_Size,
			GroupId: this.state.GroupId
		}
		this.props.getLeaderWatchlist(reqObj);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

		if (nextProps.data.ReturnCode === 1) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg);
		} else if (nextProps.data.ReturnCode === 0) {
			if (nextProps.data.hasOwnProperty('WatcherList') && nextProps.data.WatcherList.length > 0) {
				this.setState({ list: nextProps.data.WatcherList });
			}
		}
	}

	render() {
		const { list, loading } = this.state;
		return (
			<Fragment>
				{loading && <JbsSectionLoader />}
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
							<th><IntlMessages id="sidebar.colGroupName" /></th>
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
										<td>{item.GroupName}</td>
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
			</Fragment>
		);
	}
}

const mapStateToProps = ({ socialProfileRdcer, settings }) => {
	var response = {
		darkMode: settings.darkMode,
		data: socialProfileRdcer.getLeaderWatchlist,
		loading: socialProfileRdcer.loading
	}

	return response;
}

export default connect(mapStateToProps, {
	getLeaderWatchlist
})(MyWatchListTbl);