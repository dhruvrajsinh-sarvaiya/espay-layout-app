/* 
    Developer : Salim Deraiya
	Date : 27-12-2018
	update by Sanjay : 06-02-2019 (code for drawar), Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount KYC Configuration Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { SimpleCard, CountCard } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
// import { DashboardPageTitle } from './DashboardPageTitle';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
// import { getDomainData } from 'Actions/MyAccount';
import CircularProgress from '@material-ui/core/CircularProgress';

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
		title: <IntlMessages id="sidebar.adminPanel" />,
		link: '',
		index: 0
	},
	{
		title: <IntlMessages id="kycConfiguration" />,
		link: '',
		index: 1
	}
];


// Component for MyAccount KYC Configuration Dashboard
class KYCConfigurationDashboard extends Component {
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
		//Added by Bharat Jograna, (BreadCrumb)09 March 2019
		// To Close the drawer using breadcrumb data 
		if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
			this.setState({ open: false });
		}

		// this.setState({ loading: nextProps.loading });
		// if (Object.keys(nextProps.domainDashData).length > 0 && Object.keys(nextProps.domainDashData.TotalCountDomain).length > 0) {
		// 	this.setState({ data: nextProps.domainDashData.TotalCountDomain });
		// }

		// To Close the drawer using breadcrumb data
		if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open1 === false) {
			this.setState({ open: false })
		}
	}


	render() {
		// const { TotalDoamin, TotalActiveDomain, TotalDisActiveDomain } = this.state.data;
		const { componentName, open } = this.state;
		const { drawerClose, loading } = this.props;
		return (
			<div className="jbs-page-content">
				<WalletPageTitle title={<IntlMessages id="sidebar.kycConfiguration" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
				{loading && <CircularProgress className="progress-primary" thickness={2} />}
				<div className="row">
					<div className="col-sm-12 col-md-4 w-xs-full">
						<a href="javascript:void(0)" onClick={(e) => this.showComponent('ListKYCVerifyWdgt')} className="text-dark">
							<SimpleCard
								title={<IntlMessages id="sidebar.listKYCConfiguration" />}
								icon="zmdi zmdi-chart"
								bgClass="bg-dark"
								clickEvent={this.onClick}
							/>
						</a>
					</div>
					{/* <div className="col-sm-12 col-md-4 w-xs-full">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('ListKYCConfiguration')} className="text-dark">
								<SimpleCard
									title={<IntlMessages id="sidebar.listKYCConfiguration" />}
									icon="zmdi zmdi-chart"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>
						<div className="col-sm-12 col-md-4 w-xs-full">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('AddKYCConfiguration')} className="text-dark">
								<SimpleCard
									title={<IntlMessages id="sidebar.addKYCConfiguration" />}
									icon="zmdi zmdi-chart"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div> */}
				</div>
				<Drawer
					width="100%"
					handler={null}
					open={open}
					onMaskClick={this.onClick}
					className={null}
					placement="right"
					level={null}
					getContainer={null}
					showMask={false}
					height="100%"
				>
					{componentName !== '' &&
						<DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} closeAll={this.closeAll} props={this.props} />}
				</Drawer>
			</div>
		);
	}
}

//Mapstatetoprops...
/* const mapToProps = ({ domainDashRdcer, drawerclose }) => {
	const { domainDashData, loading } = domainDashRdcer;
	return { domainDashData, loading, drawerclose };
}

export default connect(mapToProps, {
	getDomainData
})(KYCConfigurationDashboard); */

const mapToProps = ({ drawerclose }) => {
	//Added by Bharat Jograna (BreadCrumb)09 March 2019
	if (drawerclose.bit === 1) {
		setTimeout(function () { drawerclose.bit = 2 }, 1000);
	}

	return { drawerclose };
}

export default connect(mapToProps, {})(KYCConfigurationDashboard);