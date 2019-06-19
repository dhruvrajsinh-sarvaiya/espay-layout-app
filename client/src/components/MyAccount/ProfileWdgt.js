import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { connect } from 'react-redux';
import { Row, Col } from "reactstrap";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import EditProfileWdgt from "./EditProfileWdgt";
import UserProfileBasicInfoBlk from "./UserProfileBasicInfoBlk";
import VerifyDocumentTypeWdgt from "./VerifyDocumentTypeWdgt";
import PersonalVerificationFormWdgt from "./PersonalVerificationFormWdgt";
import EnterpriseVerificationFormWdgt from "./EnterpriseVerificationFormWdgt";
import MembershipLevelsCompWdgt from "./MembershipLevelsCompWdgt";
import ChangepasswordWdgt from "./ChangepasswordWdgt";
// intl messages
import IntlMessages from "Util/IntlMessages";
// Used For Set Conditional Base Classes
import classnames from "classnames";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Tooltip from '@material-ui/core/Tooltip';
import { getKYCStatus } from "Actions/MyAccount";

class ProfileWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ViewComponent: "View1"
		};
		this.onCancel = this.onCancel.bind(this);
	}

	changeComponentView(newName) {
		this.setState({
			ViewComponent: newName
		});
	}
	onCancel() {
		this.setState({
			ViewComponent: "View1"
		});
	}

	componentWillMount() {
		this.props.getKYCStatus();
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });
	}

	render() {
		var GetViewMembershipLevel;
		var GetView;
		var BackBtn;

		if (this.state.ViewComponent === "View1") {
			GetView = (
				<div className="row mx-auto">
					<div className="col-md-12">
						<JbsCollapsibleCard
							colClasses={classnames({ commonwalletjbscard_darkmode: this.props.darkMode })}>
							<UserProfileBasicInfoBlk {...this.props} />
						</JbsCollapsibleCard>
					</div>
				</div>
			);
		}
		if (this.state.ViewComponent === "View2") {
			GetView = (
				<VerifyDocumentTypeWdgt {...this.props}
					changeComponentView={this.changeComponentView.bind(this)}
				/>
			);
		}
		if (this.state.ViewComponent === "View3") {
			GetView = (
				<PersonalVerificationFormWdgt {...this.props}
					changeComponentView={this.changeComponentView.bind(this)}
				/>
			);
		}
		if (this.state.ViewComponent === "View4") {
			GetView = (
				<EnterpriseVerificationFormWdgt {...this.props}
					changeComponentView={this.changeComponentView.bind(this)}
				/>
			);
		}
		if (this.state.ViewComponent === "View5") {
			GetView = ("");
			GetViewMembershipLevel = (
				<MembershipLevelsCompWdgt {...this.props}
					changeComponentView={this.changeComponentView.bind(this)}
				/>
			);
		}
		if (this.state.ViewComponent !== "View1") {
			BackBtn = (
				<Button
					onClick={this.onCancel}
					className="btn btn-danger text-white text-center mt-10"
				>
					<IntlMessages id="button.back" />
				</Button>
			);
		}

		return (
			<div>
				{GetView === "" ?
					<div>
						<div className="tabformtitle">
							<span><IntlMessages id="myAccount.Dashboard.myProfileInfo.profileWdgt.personalInformation" /></span>
							<p>
							<IntlMessages id="myAccount.Dashboard.myProfileInfo.profileWdgt.personalInformation.description" />
            				</p>
						</div>

						<div className="ml-10 user-account-body">
							<div className="col-md-1 offset-md-11 mb-10">{BackBtn}</div>
							<div className="card p-15 mb-5">{GetViewMembershipLevel}</div>
						</div>
					</div>
					:

					<div>
						<Tabs defaultTab="PersonalInformation" onChange={tabId => { }}>
							<Row>
								<Col md={3} className="pr-0 prsnl_col">
									<div className="innertabpanel">
										<TabList className="myaccountinnerTab">
											<Tab className={this.props.darkMode ? 'innertabmenu-darkmode ' : 'innertabmenu'} tabFor="PersonalInformation">
												<Tooltip id="tooltip-icon" title={<IntlMessages id="myAccount.Dashboard.myProfileInfo.profileWdgt.personalInformation" />}><i className="zmdi zmdi-account-box-o" /></Tooltip>
												<IntlMessages id="myAccount.Dashboard.myProfileInfo.profileWdgt.personalInformation" />
											</Tab>
											<Tab className={this.props.darkMode ? 'innertabmenu-darkmode ' : 'innertabmenu'} tabFor="UpdateProfile">
												<Tooltip id="tooltip-icon" title={<IntlMessages id="myAccount.Dashboard.myProfileInfo.profileWdgt.personalInformation" />}><i className="zmdi zmdi-edit" /></Tooltip>
												<IntlMessages id="myAccount.Dashboard.myProfileInfo.profileWdgt.updateProfile" />
											</Tab>
											<Tab className={this.props.darkMode ? 'innertabmenu-darkmode ' : 'innertabmenu'} tabFor="ChangePassword">
												<Tooltip id="tooltip-icon" title={<IntlMessages id="myAccount.Dashboard.myProfileInfo.profileWdgt.personalInformation" />}><i className="zmdi zmdi-lock" /></Tooltip>
												<IntlMessages id="myAccount.Dashboard.myProfileInfo.security.changePassword" />
											</Tab>
											{this.props.KYCStatus !== 1 &&
												<Tab className={this.props.darkMode ? 'innertabmenu-darkmode ' : 'innertabmenu'} tabFor="PersonalVerificationForm">
													<Tooltip id="tooltip-icon" title={<IntlMessages id="myAccount.Dashboard.myProfileInfo.profileWdgt.personalInformation" />}><i className="zmdi zmdi-file" /></Tooltip>
													<IntlMessages id="sidebar.personalIdentityVerification" />
												</Tab>
											}
										</TabList>
									</div>
								</Col>
								<Col md={9} className="p-0">
									<TabPanel tabId="PersonalInformation">
										<div className="tabformtitle">
											<span><IntlMessages id="myAccount.Dashboard.myProfileInfo.profileWdgt.personalInformation" /></span>
											<p><IntlMessages id="myAccount.Dashboard.myProfileInfo.profileWdgt.personalInformation.description" /></p>
										</div>
										<div className="ml-10 user-account-body">
											<div className="col-md-1 offset-md-11 mb-10">{BackBtn}</div>
											<div className="p-15  mb-5">{GetView}</div>
										</div>
									</TabPanel>
									<TabPanel tabId="UpdateProfile">
										<div className="tabformtitle">
											<span><IntlMessages id="myAccount.Dashboard.myProfileInfo.profileWdgt.updateProfile" /></span>
											<p><IntlMessages id="myAccount.Dashboard.myProfileInfo.profileWdgt.updateInformation.description" /></p>
										</div>
										<div className="row">
											<div className="mx-auto col-md-6 col-sm-12">
												<EditProfileWdgt {...this.props} />
											</div>
										</div>
									</TabPanel>
									<TabPanel tabId="ChangePassword">
										<div className="tabformtitle">
											<span><IntlMessages id="myAccount.Dashboard.myProfileInfo.security.changePassword" /></span>
											<p><IntlMessages id="myAccount.Dashboard.myProfileInfo.security.updateAccountPassword" /></p>
										</div>
										<ChangepasswordWdgt {...this.props} />
									</TabPanel>
									{this.props.KYCStatus !== 1 &&
										<TabPanel tabId="PersonalVerificationForm">
											<div className="tabformtitle">
												<span><IntlMessages id="sidebar.personalIdentityVerification" /></span>
												<p><IntlMessages id="my_account.personalVerifyNote" /></p>
											</div>
											<div className="row"><PersonalVerificationFormWdgt showTitle={false} {...this.props} /></div>
										</TabPanel>
									}
								</Col>
							</Row>
						</Tabs>
					</div>
				}
			</div>
		);
	}
}

const mapStateToProps = ({ prsnlVerifyFrmRdcer, settings }) => {
	const { KYCStatus } = prsnlVerifyFrmRdcer.kycStatus;
	const { darkMode } = settings;
	return { darkMode, KYCStatus };
}

export default connect(mapStateToProps, {
	getKYCStatus
})(ProfileWdgt);