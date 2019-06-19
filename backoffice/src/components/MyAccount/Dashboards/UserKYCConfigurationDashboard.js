/* 
    Developer : Salim Deraiya
    Date : 27-12-2018
    File Comment : MyAccount KYC Configuration Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { SimpleCard, CountCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import { DashboardPageTitle } from './DashboardPageTitle';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
// import { getDomainData } from 'Actions/MyAccount';
import CircularProgress from '@material-ui/core/CircularProgress';

// Component for MyAccount KYC Configuration Dashboard
class UserKYCConfigurationDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			componentName: '',
			loading: false,
			data: {},
		}
	}

	onClick = () => {
		this.setState({
			open: !this.state.open,
		})
	}

	componentWillMount() {
		// this.props.getDomainData();
	}


	showComponent = (componentName) => {
		this.setState({
			componentName: componentName,
			open: !this.state.open,
		});
	}

	closeAll = () => {
		this.props.closeAll();
		this.setState({
			open: false,
		});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });
		if (Object.keys(nextProps.domainDashData).length > 0 && Object.keys(nextProps.domainDashData.TotalCountDomain).length > 0) {
			this.setState({ data: nextProps.domainDashData.TotalCountDomain });
		}
	}


	render() {
		const { TotalDoamin, TotalActiveDomain, TotalDisActiveDomain } = this.state.data;
		const { componentName, open } = this.state;
		const { drawerClose, loading } = this.props;
		return (
			<div className="jbs-page-content">
				<DashboardPageTitle title={<IntlMessages id="sidebar.domainDashboard" />} drawerClose={drawerClose} closeAll={this.closeAll} />
				{loading
					?
					<div className="text-center py-40"><CircularProgress className="progress-primary" thickness={2} /></div>
					:
					<div className="row">
						<div className="col-sm-12 col-md-4 w-xs-full">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('KYCDocumentDashboard')} className="text-dark">
								<CountCard
									title={<IntlMessages id="my_account.totalDomains" />}
									count={TotalDoamin > 0 ? TotalDoamin : 0}
									icon="zmdi zmdi-globe-alt"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>
						<div className="col-sm-12 col-md-4 w-xs-full">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('UserKYCConfigurationDashboard')} className="text-dark">
								<CountCard
									title={<IntlMessages id="my_account.activeDomains" />}
									count={TotalActiveDomain > 0 ? TotalActiveDomain : 0}
									icon="zmdi zmdi-check"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>
						<div className="col-sm-12 col-md-4 w-xs-full">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('KYCLevelDashboard')} className="text-dark">
								<CountCard
									title={<IntlMessages id="my_account.inactiveDomains" />}
									count={TotalDisActiveDomain > 0 ? TotalDisActiveDomain : 0}
									icon="zmdi zmdi-block"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>
					</div>
				}
				<Drawer
					width={componentName === 'AddDomainDashboard' ? '50%' : '100%'}
					handler={false}
					open={open}
					onMaskClick={this.onClick}
					className="drawer2"
					level=".drawer1"
					placement="right"
					levelMove={100}
				>
					<DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} closeAll={this.closeAll} props={this.props} />
				</Drawer>
			</div>
		);
	}
}

//Mapstatetoprops...
/* const mapToProps = ({ domainDashRdcer }) => {
	const { domainDashData, loading } = domainDashRdcer;
	return { domainDashData, loading };
}

export default connect(mapToProps, {
	getDomainData
})(KYCConfigurationDashboard); */

export default UserKYCConfigurationDashboard;