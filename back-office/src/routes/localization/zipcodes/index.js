/* 
    Createdby : Dhara gajera 
    CreatedDate : 8/2/2019
    Description : zip codes List
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
//Import CRUD Operation For zipcodes Actions...
import { getZipCodes } from 'Actions/Localization';

const columns = [
	{
		name: <IntlMessages id="zipCodes.title.zipcodesId" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="zipCodes.title.zipcodes" />,
		options: { sort: true, filter: true }
	},{
		name: <IntlMessages id="zipCodes.title.zipAreaName" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="zipCodes.title.countryId" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="zipCodes.title.stateId" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="zipCodes.title.cityId" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="zipCodes.title.status" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="sidebar.colAction" />,
		options: { sort: false, filter: false }
	}
];

const sortColumns = [
	{
		orderBy: "zipcodesId",
		sortOrder: 1,
	},
	{
		orderBy: "zipCodes",
		sortOrder: 1,
    },
    {
		orderBy: "zipAreaName",
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
		orderBy: "cityId",
		sortOrder: 1,
	},
	{
		orderBy: "status",
		sortOrder: 1,
	}
];

class ZipCodess extends Component {

	constructor(props) {
		super(props);

		// default ui local state
		this.state = {
			loading: true, // loading activity
			zipCodeslist: [],
			page: 0,
			rowsPerPage: 10,
			searchValue: null,
			count: 0,
			orderBy: 'zipcodesId',
			sortOrder: 1,
			errors: {}
		};

	}

	componentWillMount() {
		this.props.getZipCodes({
			page: 0,
			rowsPerPage: 10,
			searchValue: null,
			orderBy: sortColumns[0].orderBy,
			sortOrder: sortColumns[0].sortOrder
		});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			zipCodeslist: nextProps.zipcodes_list.data,
			count: nextProps.zipcodes_list.totalCount,
			loading: nextProps.loading
		});
	}

	render() {
		const { loading, zipCodeslist, page, rowsPerPage, searchValue, count, orderBy, sortOrder } = this.state;

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
						to="/app/localization/add-zipcodes"
						variant="raised"
						className="btn-primary text-white"
					>
						<IntlMessages id="zipCodes.button.addZipcodes" />
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
						this.props.getZipCodes({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: orderBy, sortOrder: sortOrder });
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
							this.props.getZipCodes({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: orderBy, sortOrder: sortOrder });
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
						this.props.getZipCodes({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: sortColumns[tableState.activeColumn].orderBy, sortOrder: sortingDirectionString });
						break;
						default:break;
				}
			}
		};

		return (
			<Fragment>
				<div className="responsive-table-wrapper">
					<PageTitleBar title={<IntlMessages id="sidebar.zipcodes" />} match={this.props.match} />
					<Fragment>
						<JbsCollapsibleCard fullBlock>
							<MUIDataTable
								title={<IntlMessages id="sidebar.zipcodes" />}
								data={zipCodeslist && zipCodeslist.map(zip => {

									if (Number.isInteger(zip.cityId) == false || typeof zip.cityId == 'undefined')
                                    zip.cityId = 0;

									return [
										zip.zipcodesId,
										zip.zipcode,
                                        zip.zipAreaName,
										zip.countryId,
										zip.stateId,
										zip.cityId,
										zip.status == 1 ? (
											<Badge className="mb-10 mr-10" color="primary">
												<IntlMessages id="global.form.status.active" />
											</Badge>
										) : (
												<Badge className="mb-10 mr-10" color="danger">
													<IntlMessages id="global.form.status.inactive" />
												</Badge>
											),
										<div className="list-action">
											<Link color="primary" to={{ pathname: "/app/localization/edit-zipcodes", state: { data: zip } }} ><i className="ti-pencil" /></Link>
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

const mapStateToProps = ({ zipcodes }) => {
	const { zipcodes_list, loading } = zipcodes;
	return { zipcodes_list, loading }
}

export default withRouter(connect(mapStateToProps, {
	getZipCodes
})(ZipCodess));