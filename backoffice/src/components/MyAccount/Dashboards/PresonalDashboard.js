/* 
    Developer : Kevin Ladani
    Date : 23-11-2018
    File Comment : MyAccount Personal Dashboard Component
*/
import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";

import { SimpleCard, OptionCard } from "./Widgets";
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";
import { DashboardPageTitle } from './DashboardPageTitle';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
// Component for MyAccount Organization dashboard
class PresonalDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			componentName: '',
			currentLevel: "Basic",
		}
	}
	onClick = () => {
		this.setState({
			open: !this.state.open
		});
	};

	showComponent = (componentName) => {
		this.setState({
			componentName: componentName,
			open: !this.state.open,
		});
	}
	closeAll = () => {
		this.setState({
			open: false,
		});
	}

	render() {
		const { componentName, open, currentLevel } = this.state;
		return (
			<Fragment>
				<div className="row">
					<div className="col-sm-12 col-md-3 w-xs-full">
						<a href="javascript:void(0)" onClick={(e) => this.showComponent('ProfileInformationDashboard')} className="text-dark col-sm-full">
							<SimpleCard
								title={<IntlMessages id="my_account.PersonalInformation" />}
								icon="zmdi zmdi-account-circle"
								bgClass="bg-dark"
								clickEvent={this.onClick}
							/>
						</a>
					</div>
					{/* <div className="col-sm-12 col-md-3 w-xs-full">
						<a href="javascript:void(0)" onClick={(e) => this.showComponent('SecurityDashboard')} className="text-dark col-sm-full">
							<SimpleCard
								title={<IntlMessages id="my_account.security" />}
								icon="zmdi zmdi-shield-security"
								bgClass="bg-dark"
								clickEvent={this.onClick}
							/>
						</a>
					</div> */}
					<div className="col-sm-12 col-md-3 w-xs-full">
						<a href="javascript:void(0)" onClick={(e) => this.showComponent('TwoFactorAuthenticationDashboard')} className="text-dark">
							<SimpleCard
								title={<IntlMessages id="my_account.2FA" />}
								icon="zmdi zmdi-portable-wifi-changes"
								bgClass="bg-dark"
								clickEvent={this.onClick}
							/>
						</a>
					</div>
					<div className="col-sm-12 col-md-3 w-xs-full">
						<a href="javascript:void(0)" onClick={(e) => this.showComponent('PreferencesDashboard')} className="text-dark">
							<SimpleCard
								title={<IntlMessages id="my_account.preferences" />}
								icon="zmdi zmdi-camera-alt"
								bgClass="bg-dark"
								clickEvent={this.onClick}
							/>
						</a>
					</div>
					<div className="col-sm-12 col-md-3 w-xs-full">
						{/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('')} className="text-dark"> */}
						<SimpleCard
							title={<IntlMessages id="my_account.editPhoto" />}
							icon="zmdi zmdi-camera"
							bgClass="bg-dark"
							clickEvent={this.onClick}
						/>
						{/* </a> */}
					</div>
					<div className="col-sm-12 col-md-3 w-xs-full">
						<a href="javascript:void(0)" onClick={(e) => this.showComponent('PrnGroupDashboard')} className="text-dark">
							<SimpleCard
								title={<IntlMessages id="my_account.groups" />}
								icon="zmdi zmdi-group-work"
								bgClass="bg-dark"
								clickEvent={this.onClick}
							/>
						</a>
					</div>
					<div className="col-sm-12 col-md-3 w-xs-full">
						<a href="javascript:void(0)" onClick={(e) => this.showComponent('ActivityDashboard')} className="text-dark">
							<SimpleCard
								title={<IntlMessages id="my_account.activity" />}
								icon="zmdi zmdi-star"
								bgClass="bg-dark"
								clickEvent={this.onClick}
							/>
						</a>
					</div>
					<div className="col-sm-12 col-md-3 w-xs-full">
						<a href="javascript:void(0)" onClick={(e) => this.showComponent('PrnSettingDashboard')} className="text-dark">
							<SimpleCard
								title={<IntlMessages id="my_account.settings" />}
								icon="zmdi zmdi-settings"
								bgClass="bg-dark"
								clickEvent={this.onClick}
							/>
						</a>
					</div>
					<div className="col-sm-12 col-md-3 w-xs-full">
						<a href="javascript:void(0)" onClick={(e) => this.showComponent('PrnMembershipLevelDashboard')} className="text-dark">
							<SimpleCard
								data={[<IntlMessages id="my_account.currentLevel" />, ":", currentLevel]}
								title={<IntlMessages id="my_account.membershipLevel" />}
								icon="zmdi zmdi-card-membership"
								bgClass="bg-dark"
								clickEvent={this.onClick}
							/>
						</a>
					</div>
				</div>
				<Drawer
					width="100%"
					handler={false}
					open={open}
					onMaskClick={this.onClick}
					className="drawer1"
					placement="right"
				>
					<DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} closeAll={this.closeAll} props={this.props} />
				</Drawer>
			</Fragment>
		);
	}
}

export default PresonalDashboard;
