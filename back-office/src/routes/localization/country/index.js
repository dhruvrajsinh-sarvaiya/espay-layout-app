/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 10-10-2018
    UpdatedDate : 10-10-2018
    Description : Country List
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

//Import CRUD Operation For Country Actions...
import { getCountry } from 'Actions/Localization';

const columns = [
	{
		name: <IntlMessages id="countries.title.countryId" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="countries.title.countryName" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="countries.title.countryCode" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="countries.title.status" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="sidebar.colAction" />,
		options: { sort: false, filter: false }
	}
];

const sortColumns = [
	{
		orderBy: "countryId",
		sortOrder: 1,
	},
	{
		orderBy: "countryName",
		sortOrder: 1,
	},
	{
		orderBy: "countryCode",
		sortOrder: 1,
	},
	{
		orderBy: "status",
		sortOrder: 1,
	}
];

class Country extends Component {

	constructor(props) {
		super(props);

		// default ui local state
		this.state = {
			loading: true, // loading activity
			countrylist: [],
			page: 0,
			rowsPerPage: 10,
			searchValue: null,
			count: 0,
			orderBy: 'countryId',
			sortOrder: 1,
			errors: {}
		};

	}

	componentWillMount() {
		this.props.getCountry({
			page: 0,
			rowsPerPage: 10,
			searchValue: null,
			orderBy: sortColumns[0].orderBy,
			sortOrder: sortColumns[0].sortOrder
		});
	}

	componentWillReceiveProps(nextProps) {

		this.setState({
			countrylist: nextProps.country_list.data,
			count: nextProps.country_list.totalCount,
			loading: nextProps.loading
		});

	}

	render() {
		const { loading, countrylist, page, rowsPerPage, searchValue, count, orderBy, sortOrder } = this.state;

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
						to="/app/localization/add-country"
						variant="raised"
						className="btn-primary text-white"
					>
						<IntlMessages id="countries.button.addCountry" />
					</MatButton>
				);
			},

			onTableChange: (action, tableState) => {

				switch (action) {
					case 'changeRowsPerPage':
					case 'changePage':
						this.setState({
							page: tableState.page,
							rowsPerPage: tableState.rowsPerPage,
							searchValue: tableState.searchText,
							orderBy: orderBy,
							sortOrder: sortOrder,
							loading: false
						});
						this.props.getCountry({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: orderBy, sortOrder: sortOrder });
						break;
					case 'search':

						if ((typeof tableState.searchText != 'undefined' && tableState.searchText != null && tableState.searchText.length > 2) || (typeof tableState.searchText != 'undefined' && tableState.searchText == null)) {
							this.setState({
								page: tableState.page,
								rowsPerPage: tableState.rowsPerPage,
								searchValue: tableState.searchText,
								orderBy: orderBy,
								sortOrder: sortOrder,
								loading: false
							});
							this.props.getCountry({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: orderBy, sortOrder: sortOrder });
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
						this.props.getCountry({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: sortColumns[tableState.activeColumn].orderBy, sortOrder: sortingDirectionString });
						break;
				}



			}
		};

		return (
			<Fragment>
				<div className="responsive-table-wrapper">
					<PageTitleBar title={<IntlMessages id="sidebar.countries" />} match={this.props.match} />
					<Fragment>
						<JbsCollapsibleCard fullBlock>
							<MUIDataTable
								title={<IntlMessages id="sidebar.countries" />}
								data={countrylist && countrylist.map(country => {
									return [
										country.countryId,
										country.locale.en,
										country.countryCode,
										country.status == 1 ? (
											<Badge className="mb-10 mr-10" color="primary">
												<IntlMessages id="global.form.status.active" />
											</Badge>
										) : (
												<Badge className="mb-10 mr-10" color="danger">
													<IntlMessages id="global.form.status.inactive" />
												</Badge>
											),
										<div className="list-action">
											<Link color="primary" to={{ pathname: "/app/localization/edit-country", state: { data: country } }} ><i className="ti-pencil" /></Link>
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

const mapStateToProps = ({ country }) => {
	const { country_list, loading } = country;
	return { country_list, loading }
}

export default withRouter(connect(mapStateToProps, {
	getCountry
})(Country));