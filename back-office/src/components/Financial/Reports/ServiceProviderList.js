/* 
    Createdby : Devang Parekh
    CreatedDate : 18-4-2019
    Description : List of service provider
*/

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import IntlMessages from 'Util/IntlMessages';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';

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
		title: <IntlMessages id="sidebar.financial" />,
		link: '',
		index: 0
	},
	{
		title: <IntlMessages id="sidebar.serviceProviderList" />,
		link: '',
		index: 1
	},
];

const columns = [
	{
		name: <IntlMessages id="widgets.username" />
	},
	{
		name: <IntlMessages id="sidebar.startUpName" />
	},
	{
		name: <IntlMessages id="sidebar.noOfEquity" />
	},
	{
		name: <IntlMessages id="sidebar.currentStatus" />
	},
	{
		name: <IntlMessages id="sidebar.investedAmount" />
	},
	{
		name: <IntlMessages id="table.balance" />
	},
	{
		name: <IntlMessages id="sidebar.currentValuation" />
	}
];

const startUpDetailList = [
	{ UserName: "John", StartUpName: "ABC", NoOfEquity: 10, CurrentStatus: 1, InvestedAmount: 468521, Balance: 454215, CurrentValuation: 4878412 },
	{ UserName: "Smith", StartUpName: "XYZ", NoOfEquity: 8, CurrentStatus: 2, InvestedAmount: 32564541, Balance: 6565263, CurrentValuation: 656921 },
	{ UserName: "Dev", StartUpName: "UVW", NoOfEquity: 6, CurrentStatus: 3, InvestedAmount: 1248541, Balance: 5656, CurrentValuation: 696232515 },
	{ UserName: "Mitual", StartUpName: "CDE", NoOfEquity: 3, CurrentStatus: 0, InvestedAmount: 3323154, Balance: 2565, CurrentValuation: 5451215 },
	{ UserName: "Leo", StartUpName: "WXY", NoOfEquity: 100, CurrentStatus: 1, InvestedAmount: 565221215, Balance: 656323, CurrentValuation: 968215656 },
	{ UserName: "Aliana", StartUpName: "MNO", NoOfEquity: 1054, CurrentStatus: 2, InvestedAmount: 526326595, Balance: 5689635, CurrentValuation: 5684545 },
]

class ServiceProviderList extends Component {

	constructor(props) {
		super(props);

		// default ui local state
		this.state = {
			loading: false,//true, // loading activity
			startUpList: [],
			page: 0,
			rowsPerPage: 100,
			searchValue: null,
			count: 0,
			errors: {}
		};
	}

	onChildClick = () => {
		this.setState({ openChild: this.state.openChild ? false : true })
	}

	showComponent = (componentName, page = '') => {

		if (page !== '') {
			this.setState({ pagedata: page });
		}

		this.setState({
			componentName: componentName,
			openChild: !this.state.open,
		});

	}

	closeAll = () => {
		this.props.closeAll();
		this.setState({ openChild: false });
	}

	render() {
		const { loading, page, searchValue, count } = this.state;
		const { drawerClose } = this.props;

		const options = {
			filterType: "dropdown",
			responsive: "scroll",
			selectableRows: false,
			print: false,
			download: false,
			resizableColumns: false,
			viewColumns: false,
			filter: false,
			rowsPerPageOptions: AppConfig.rowsPerPageOptions,
			serverSide: true,
			page: page,
			count: count,
			rowsPerPage: AppConfig.totalRecordDisplayInList,
			searchValue: searchValue,
			search: true,
			onTableChange: (action, tableState) => {

				if (action == 'changeRowsPerPage' || action == 'changePage') {
					this.setState({
						page: tableState.page,
						rowsPerPage: tableState.rowsPerPage,
						loading: false
					});
				} else if (action == 'search') {
					if ((typeof tableState.searchText != 'undefined' && tableState.searchText != null && tableState.searchText.length > 2) || (typeof tableState.searchText != 'undefined' && tableState.searchText == null)) {
						this.setState({
							page: tableState.page,
							rowsPerPage: tableState.rowsPerPage,
							loading: false
						});
					}
				} else if (action == 'sort') {
					this.setState({
						page: tableState.page,
						rowsPerPage: tableState.rowsPerPage,
						searchValue: tableState.searchText,
						loading: false
					});
				}
			}
		};

		return (
			<Fragment>
				<div className="jbs-page-content">

					<WalletPageTitle title={<IntlMessages id="sidebar.serviceProviderList" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />

					<div className="responsive-table-wrapper">

						<JbsCollapsibleCard fullBlock>
							<MUIDataTable
								title={<IntlMessages id="sidebar.serviceProviderList" />}
								data={startUpDetailList.map(startUp => {
									return [
										startUp.UserName,
										startUp.StartUpName,
										startUp.NoOfEquity,
										startUp.CurrentStatus,
										startUp.InvestedAmount,
										startUp.Balance,
										startUp.CurrentValuation
									]
								})}
								columns={columns}
								options={options}
							/>
							{loading && <JbsSectionLoader />}
						</JbsCollapsibleCard>
					</div>
				</div>
			</Fragment >
		);
	}
}

const mapStateToProps = ({ contactus }) => {
	const { contact_list, loading } = contactus;
	return { contact_list, loading }
}

export default withRouter(connect(mapStateToProps, {})(ServiceProviderList));