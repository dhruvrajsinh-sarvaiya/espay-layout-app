/* 
    Createdby : Devang Parekh
    CreatedDate : 18-4-2019
    Description : List of total orders
*/

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import MUIDataTable from "mui-datatables";
// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// jbs section loader
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
		title: <IntlMessages id="sidebar.totalOrders" />,
		link: '',
		index: 1
	},
];

const columns = [
	{
		name: <IntlMessages id="widgets.productName" />
	},
	{
		name: <IntlMessages id="widgets.price" />
	},
	{
		name: <IntlMessages id="table.date" />
	},
	{
		name: <IntlMessages id="sidebar.colCustomerName" />
	}
];

class TotalOrders extends Component {

	constructor(props) {
		super(props);

		// default ui local state
		this.state = {
			loading: false,//true, // loading activity
			totalOrders: [],
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

		if (page != '') {
			this.setState({ pagedata: page });
		}

		this.setState({
			componentName: componentName,
			openChild: !this.state.open
		});

	}

	closeAll = () => {
		this.props.closeAll();
		this.setState({ openChild: false });
	}

	render() {
		const { loading, totalOrders, page, searchValue, count } = this.state;
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

				switch (action) {
					case 'changeRowsPerPage':
					case 'changePage':
						this.setState({
							page: tableState.page,
							rowsPerPage: tableState.rowsPerPage,
							loading: false
						});
						break;
					case 'search':
						if ((typeof tableState.searchText != 'undefined' && tableState.searchText != null && tableState.searchText.length > 2) || (typeof tableState.searchText != 'undefined' && tableState.searchText == null)) {
							this.setState({
								page: tableState.page,
								rowsPerPage: tableState.rowsPerPage,
								loading: false
							});
						}
						break;
					case 'sort':
						this.setState({
							page: tableState.page,
							rowsPerPage: tableState.rowsPerPage,
							searchValue: tableState.searchText,
							loading: false
						});
						break;
					default: break;
				}
			}
		};

		return (
			<Fragment>
				<div className="jbs-page-content">

					<WalletPageTitle title={<IntlMessages id="sidebar.totalOrders" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />

					<div className="responsive-table-wrapper">

						<JbsCollapsibleCard fullBlock>
							<MUIDataTable
								title={<IntlMessages id="sidebar.totalOrders" />}
								data={totalOrders && totalOrders.map(startUp => {
									return [
										startUp.ProductName,
										startUp.Price,
										startUp.Date,
										startUp.CustomerName
									]
								})}
								columns={columns}
								options={options}
							/>
							{loading &&
								<JbsSectionLoader />
							}
						</JbsCollapsibleCard>
					</div>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ contactus }) => {
	const { contact_list, loading } = contactus;
	return { contact_list, loading }
}

export default withRouter(connect(mapStateToProps, {
})(TotalOrders));