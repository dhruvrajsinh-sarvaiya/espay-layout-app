/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 10-10-2018
    UpdatedDate : 10-10-2018
    Description : City List
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import MatButton from "@material-ui/core/Button";
import MUIDataTable from "mui-datatables";
import {
	Badge
} from 'reactstrap';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';

//Import CRUD Operation For City Actions...
import { getCity } from 'Actions/Localization';

//Validation for City Form
//const validateCityformInput = require('../../../validation/Localization/city');
//Table Object...

const columns = [
	{
		name: <IntlMessages id="cities.title.cityId" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="cities.title.cityName" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="cities.title.countryId" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="cities.title.stateId" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="cities.title.status" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="sidebar.colAction" />,
		options: { sort: false, filter: false }
	}
];

const sortColumns = [
	{
		orderBy: "cityId",
		sortOrder: 1,
	},
	{
		orderBy: "cityName",
		sortOrder: 1,
	},
	{
		orderBy: "countryId",
		sortOrder: 1,
	},
	{
		orderBy: "stateId",
		sortOrder: 1,
	},
	{
		orderBy: "status",
		sortOrder: 1,
	}
];

class City extends Component {

	constructor(props) {
		super(props);

		// default ui local state
		this.state = {
			loading: true, // loading activity
			citylist: [],
			page: 0,
			rowsPerPage: 10,
			searchValue: null,
			count: 0,
			orderBy: 'cityId',
			sortOrder: 1,
			errors: {}
		};

	}

	componentWillMount() {
		this.props.getCity({
			page: 0,
			rowsPerPage: 10,
			searchValue: null,
			orderBy: sortColumns[0].orderBy,
			sortOrder: sortColumns[0].sortOrder
		});
	}

	componentWillReceiveProps(nextProps) {

		this.setState({
			citylist: nextProps.city_list.data,
			count: nextProps.city_list.totalCount,
			loading: nextProps.loading
		});

	}

	render() {
		const { loading, citylist, page, rowsPerPage, searchValue, count, orderBy, sortOrder } = this.state;

		const options = {
			filterType: "dropdown",
			responsive: "scroll",
			selectableRows: false,
			print: false,
			download: false,
			resizableColumns: false,
			viewColumns: false,
			filter: false,
			rowsPerPageOptions: [10, 25, 50, 100],
			serverSide: true,
			page: page,
			count: count,
			rowsPerPage: rowsPerPage,
			searchValue: searchValue,
			customToolbar: () => {
				return (
					<MatButton
						component={Link}
						to="/app/localization/add-city"
						variant="raised"
						className="btn-primary text-white"
					>
						<IntlMessages id="cities.button.addCity" />
					</MatButton>
				);
			},
			onTableChange: (action, tableState) => {

				switch (action) {
					case 'changeRowsPerPage':
						this.setState({
							page: tableState.page,
							rowsPerPage: tableState.rowsPerPage,
							searchValue: tableState.searchText,
							orderBy: orderBy,
							sortOrder: sortOrder,
							loading: false
						});
						this.props.getCity({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: orderBy, sortOrder: sortOrder });
						break;
					case 'changePage':
						this.setState({
							page: tableState.page,
							rowsPerPage: tableState.rowsPerPage,
							searchValue: tableState.searchText,
							orderBy: orderBy,
							sortOrder: sortOrder,
							loading: false
						});
						this.props.getCity({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: orderBy, sortOrder: sortOrder });
						break;
					case 'search':
						if (typeof tableState.searchText != 'undefined' && tableState.searchText != null && tableState.searchText.length > 2) {
							this.setState({
								page: tableState.page,
								rowsPerPage: tableState.rowsPerPage,
								searchValue: tableState.searchText,
								orderBy: orderBy,
								sortOrder: sortOrder,
								loading: false
							});
							this.props.getCity({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: orderBy, sortOrder: sortOrder });
						}
						else if (typeof tableState.searchText != 'undefined' && tableState.searchText == null) {

							this.setState({
								page: tableState.page,
								rowsPerPage: tableState.rowsPerPage,
								searchValue: tableState.searchText,
								orderBy: orderBy,
								sortOrder: sortOrder,
								loading: false
							});
							this.props.getCity({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: orderBy, sortOrder: sortOrder });
						}

						break;
					case 'sort':
						let sortingDirectionString = sortOrder == 1 ? -1 : 1;
						this.setState({
							page: tableState.page,
							rowsPerPage: tableState.rowsPerPage,
							searchValue: tableState.searchText,
							orderBy: sortColumns[tableState.activeColumn].orderBy,
							sortOrder: sortingDirectionString,
							loading: false
						});
						this.props.getCity({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: sortColumns[tableState.activeColumn].orderBy, sortOrder: sortingDirectionString });
						break;
				}
			}
		};

		return (
			<Fragment>
				<div className="responsive-table-wrapper">
					<PageTitleBar title={<IntlMessages id="sidebar.cities" />} match={this.props.match} />
					<Fragment>
						<JbsCollapsibleCard fullBlock>
							<MUIDataTable
								title={<IntlMessages id="sidebar.cities" />}
								data={citylist && citylist.map(citylistdata => {

									if (Number.isInteger(citylistdata.countryId) == false || typeof citylistdata.countryId == 'undefined')
										citylistdata.countryId = 0;
									else if (Number.isInteger(citylistdata.stateId) == false || typeof citylistdata.stateId == 'undefined')
										citylistdata.stateId = 0;

									return [
										citylistdata.cityId,
										citylistdata.locale.en,
										citylistdata.countryId,
										citylistdata.stateId,
										citylistdata.status == 1 ? (
											<Badge className="mb-10 mr-10" color="primary">
												<IntlMessages id="global.form.status.active" />
											</Badge>
										) : (
												<Badge className="mb-10 mr-10" color="danger">
													<IntlMessages id="global.form.status.inactive" />
												</Badge>
											),
										<div className="list-action">
											<Link color="primary" to={{ pathname: "/app/localization/edit-city", state: { data: citylistdata } }} ><i className="ti-pencil" /></Link>
										</div>
									]
								})}
								columns={columns}
								options={options}
							/>
							{loading &&
								<JbsSectionLoader />
							}
						</JbsCollapsibleCard>
					</Fragment>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ city }) => {

	const { city_list, loading } = city;
	return { city_list, loading }
}

export default withRouter(connect(mapStateToProps, {
	getCity
})(City));