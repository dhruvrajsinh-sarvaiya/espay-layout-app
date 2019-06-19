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
class KYCDocumentDashboard extends Component {
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

	/* componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });
		if (Object.keys(nextProps.domainDashData).length > 0 && Object.keys(nextProps.domainDashData.TotalCountDomain).length > 0) {
			this.setState({ data: nextProps.domainDashData.TotalCountDomain });
		}
	} */


	render() {
		// const { TotalDoamin, TotalActiveDomain, TotalDisActiveDomain } = this.state.data;
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
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('ListKYCDocumentType')} className="text-dark">
								<CountCard
									title={<IntlMessages id="sidebar.listKYCDocumentType" />}
									count={0}
									icon="zmdi zmdi-menu"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>
						<div className="col-sm-12 col-md-4 w-xs-full">
							<a href="javascript:void(0)" onClick={(e) => this.showComponent('AddKYCDocumentDashboard')} className="text-dark">
								<SimpleCard
									title={<IntlMessages id="sidebar.addKYCDocumentType" />}
									icon="zmdi zmdi-plus-circle"
									bgClass="bg-dark"
									clickEvent={this.onClick}
								/>
							</a>
						</div>
					</div>
				}
				<Drawer
					width={componentName === 'AddKYCDocumentDashboard' ? '50%' : '100%'}
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

export default KYCDocumentDashboard;