/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 01-04-2019
    UpdatedDate : 28-01-2019  // Updated by Jayesh for scrolling user history
	Description : Chat History User Wise
	Todo : Scroll wise chat history load
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Alert } from "reactstrap";
// intl messages
import IntlMessages from "Util/IntlMessages";
// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import 'rc-drawer/assets/index.css';
//Import List chat user Actions...
import { getChatUserhistory } from 'Actions/ChatDashboard';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
import AppConfig from 'Constants/AppConfig';
import { DashboardPageTitle } from '../DashboardPageTitle';
import InfiniteScroll from 'react-infinite-scroll-component';

//BreadCrumbData
const BreadCrumbData = [
	{
		title: <IntlMessages id="sidebar.app" />,
		link: '',
		index: 0
	},
	{
		title: <IntlMessages id="sidebar.dashboard" />,
		link: '',
		index: 0
	},
	{
		title: <IntlMessages id="sidebar.Chat" />,
		link: '',
		index: 2
	},
	{
		title: <IntlMessages id="sidebar.chatuserlist" />,
		link: '',
		index: 1
	},
	{
		title: <IntlMessages id="sidebar.chatuserhistory" />,
		link: '',
		index: 0
	}
];
class ChatHistory extends Component {
	constructor(props) {
		super();
		// default ui local state
		this.state = {
			loading: false, // loading activity
			errors: {},
			err_alert: true,
			open: false,
			items: [],
			hasMore: true,
			currentUsername: '',
			currentPage: 0,
			totalRecords: 0,
			menudetail: [],
			Pflag: true,
		};
	}
	// Action for Get ChatUser List 
	componentWillMount() {
		this.props.getMenuPermissionByID('550A8B6B-34F5-3328-32D3-FE1C19DD359B');
	}

	componentWillReceiveProps(nextProps) {

		// update menu details if not set 
		if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
			if (nextProps.menu_rights.ReturnCode === 0) {
				this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
				let Username = this.props.chatUserlistData.UserName;
				if (Username != '') {
					this.setState({ currentUsername: Username });

				} else {
					this.props.drawerClose();
				}
			} else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					window.location.href = AppConfig.afterLoginRedirect;
				}, 2000);
			}
			this.setState({ Pflag: false })
		}

		let userName = this.props.chatUserlistData.UserName;
		if (userName != '') {
			this.setState({ currentUsername: userName });
		}

		if (typeof nextProps.chatUser_History !== 'undefined' && nextProps.chatUser_History.ReturnCode === 1) { //getlist fail
			if (typeof nextProps.chatUser_History.errors.message !== 'undefined' && nextProps.chatUser_History.errors.message !== '') {
				this.setState({ err_alert: true });
			}
			this.setState({
				errors: nextProps.chatUser_History.errors
			});
		}

		if (typeof nextProps.chatUser_History !== 'undefined' && nextProps.chatUser_History.ReturnCode === 0) {
			if (nextProps.chatUser_History.Data !== null) {
				this.setState((prevState) => {
					return { items: this.state.items.concat(nextProps.chatUser_History.Data), currentPage: (prevState.currentPage + 1), totalRecords: nextProps.chatUser_History.TotalRecord, loading: nextProps.loading };
				});
			} else
				this.setState({ hasMore: false });
		}

	}

	closeAll = () => {
		this.setState({
			open: false,
			items: [],
			currentPage: 0,
			totalRecords: 0,
			hasMore: true
		});
		this.props.closeAll();
	}

	drawerClose = () => {
		this.setState({
			open: false,
			items: [],
			currentPage: 0,
			totalRecords: 0,
			hasMore: true
		});
		this.props.drawerClose();
	}

	fetchMoreData = () => {

		if (this.state.items.length >= this.state.totalRecords) {
			this.setState({ hasMore: false });
			return;
		}
		setTimeout(() => {

			let data = {
				Username: this.state.currentUsername,
				Page: this.state.currentPage
			}
			this.props.getChatUserhistory(data);

		}, 2000);

	};

	/* check menu permission */
	checkAndGetMenuAccessDetail(GUID) {
		var response = false;
		var index;
		const { menudetail } = this.state;
		if (menudetail.length) {
			for (index in menudetail) {
				if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
					response = menudetail[index];
			}
		}
		return response;
	}

	render() {

		const { err_alert, errors } = this.state;
		return (
			<Fragment>
				<div className="jbs-page-content">
					<DashboardPageTitle title={<IntlMessages id="sidebar.chatuserhistory" />} breadCrumbData={BreadCrumbData} drawerClose={this.drawerClose} closeAll={this.closeAll} />
					{errors.message && <div className="alert_area">
						<Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
					</div>}
					<JbsCollapsibleCard fullBlock>
						<div className="StackingHistory">
							<div className="row">
								<div className="col-sm-12 list-group-item list-group-item-action active"><IntlMessages id="sidebar.chatuserhistory" /></div>
							</div>
							<div className="row">
								<div className="col-sm-3 list-group-item"><IntlMessages id="chathistory.name" /></div>
								<div className="col-sm-6 list-group-item"><IntlMessages id="chathistory.message" /></div>
								<div className="col-sm-3 list-group-item"><IntlMessages id="chathistory.time" /></div>
							</div>
							<InfiniteScroll
								dataLength={this.state.items.length > 0}
								next={this.fetchMoreData}
								hasMore={this.state.hasMore}
								loader={<JbsSectionLoader />}
								height={600}
								endMessage={
									this.state.items.length === 0 ? (<div className="row">
										<div className="col-sm-12 list-group-item text-center">
											<IntlMessages id="chathistory.notFound" />
										</div>
									</div>) : (
											<div className="row">
												<div className="col-sm-12 list-group-item text-center">
													<IntlMessages id="chathistory.seenallhistory" />
												</div>
											</div>)
								}
							>
								{this.state.items.length > 0 && this.state.items.map((chatdata, index) => {

									var d = chatdata.Time;
									var date = new Date(+d); //NB: use + before variable name
									var dd = date.getDate();
									var mm = date.getMonth() + 1;
								    dd = dd < 10 ? '0' + dd : dd;
								    mm = mm < 10 ?  '0' + mm : mm;

									let formatted_date = dd + '/' + mm + '/' + date.getFullYear() + ' ' + date.toLocaleTimeString();

									return (
										<div className="row" key={index}>
											<div className="col-sm-3 list-group-item">{chatdata.Name}</div>
											<div className="col-sm-6 list-group-item">{chatdata.Message}</div>
											<div className="col-sm-3 list-group-item">{formatted_date}</div>
										</div>
									);

								})}
							</InfiniteScroll>
						</div>
					</JbsCollapsibleCard>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ chatUserList, authTokenRdcer }) => {
	const { chatUser_History, errors, loading } = chatUserList;
	const { menuLoading, menu_rights } = authTokenRdcer;
	return { chatUser_History, errors, loading, menuLoading, menu_rights }
};

export default connect(
	mapStateToProps,
	{
		getChatUserhistory,
		getMenuPermissionByID,
	}
)(ChatHistory);