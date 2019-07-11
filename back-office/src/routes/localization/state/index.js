/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 10-10-2018
    UpdatedDate : 10-10-2018
    Description : State List
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
//Import CRUD Operation For State Actions...
import { getState } from 'Actions/Localization';
const columns = [
	{
		name: <IntlMessages id="states.title.stateId" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="states.title.stateName" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="states.title.stateCode" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="states.title.countryId" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="states.title.status" />,
		options: { sort: true, filter: true }
	},
	{
		name: <IntlMessages id="sidebar.colAction" />,
		options: { sort: false, filter: false }
	}
];

const sortColumns = [
	{
		orderBy: "stateId",
		sortOrder: 1,
	},
	{
		orderBy: "stateName",
		sortOrder: 1,
	},
	{
		orderBy: "stateCode",
		sortOrder: 1,
	},
	{
		orderBy: "countryId",
		sortOrder: 1,
	},
	{
		orderBy: "status",
		sortOrder: 1,
	}
];

class State extends Component {

	constructor(props) {
		super(props);

		// default ui local state
		this.state = {
			loading: true, // loading activity
			statelist: [],
			page: 0,
			rowsPerPage: 10,
			searchValue: null,
			count: 0,
			orderBy: 'stateId',
			sortOrder: 1,
			errors: {}
		};

	}

	componentWillMount() {
		this.props.getState({
			page: 0,
			rowsPerPage: 10,
			searchValue: null,
			orderBy: sortColumns[0].orderBy,
			sortOrder: sortColumns[0].sortOrder
		});
	}

	componentWillReceiveProps(nextProps) {

		this.setState({
			statelist: nextProps.state_list.data,
			count: nextProps.state_list.totalCount,
			loading: nextProps.loading
		});
	}

	render() {
		const { loading, statelist, page, rowsPerPage, searchValue, count, orderBy, sortOrder } = this.state;

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
						to="/app/localization/add-state"
						variant="raised"
						className="btn-primary text-white"
					>
						<IntlMessages id="states.button.addState" />
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
						this.props.getState({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: orderBy, sortOrder: sortOrder });
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
							this.props.getState({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: orderBy, sortOrder: sortOrder });
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
						this.props.getState({ page: tableState.page, rowsPerPage: tableState.rowsPerPage, searchValue: tableState.searchText, orderBy: sortColumns[tableState.activeColumn].orderBy, sortOrder: sortingDirectionString });
						break;
					default: break;
				}
			}
		};

		return (
			<Fragment>
				<div className="responsive-table-wrapper">
					<PageTitleBar title={<IntlMessages id="sidebar.states" />} match={this.props.match} />
					<Fragment>
						<JbsCollapsibleCard fullBlock>
							<MUIDataTable
								title={<IntlMessages id="sidebar.states" />}
								data={statelist && statelist.map(state => {

									if (Number.isInteger(state.countryId) == false || typeof state.countryId == 'undefined')
										state.countryId = 0;

									return [
										state.stateId,
										state.locale.en,
										state.stateCode,
										state.countryId,
										state.status == 1 ? (
											<Badge className="mb-10 mr-10" color="primary">
												<IntlMessages id="global.form.status.active" />
											</Badge>
										) : (
												<Badge className="mb-10 mr-10" color="danger">
													<IntlMessages id="global.form.status.inactive" />
												</Badge>
											),
										<div className="list-action">
											<Link color="primary" to={{ pathname: "/app/localization/edit-state", state: { data: state } }} ><i className="ti-pencil" /></Link>
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

const mapStateToProps = ({ state }) => {
	const { state_list, loading } = state;
	return { state_list, loading }
}

export default withRouter(connect(mapStateToProps, {
	getState
})(State));