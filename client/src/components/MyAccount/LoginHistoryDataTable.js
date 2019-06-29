/**
 * Updated by:Saloni Rathod
 * My Account - Login History Data Table
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import { CustomFooter } from './Widgets';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import { loginHistoryList } from "Actions/MyAccount";
//for Validation
import validateLoginHistoryReport from '../../validation/MyAccount/login_history';
//change date formate from the helper.js
import { changeDateFormat } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';

//Table Object...
const columns = [
	{
		name: <IntlMessages id="sidebar.colHash" />,
		options: {
			filter: false,
			sort: true
		}
	},
	{
		name: <IntlMessages id="sidebar.colDate" />,
		options: {
			filter: false,
			sort: true
		}
	},
	{
		name: <IntlMessages id="sidebar.colDevice" />,
		options: {
			filter: false,
			sort: true
		}
	},
	{
		name: <IntlMessages id="sidebar.colIpAddress" />,
		options: {
			filter: false,
			sort: true
		}
	},
	{
		name: <IntlMessages id="sidebar.colLocation" />,
		options: {
			filter: false,
			sort: true
		}
	}
];


class LoginHistoryDataTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			loading: true,
			errors: '',
			showReset: '',
			totalCount: 0,
			datalist: {
				PageIndex: 1,
				Page_Size: AppConfig.totalRecordDisplayInList,
				FromDate: new Date().toISOString().slice(0, 10),
				ToDate: new Date().toISOString().slice(0, 10),
				IPAddress: '',
				Device: '',
				Location: '',
			},
		};
	}

	componentWillMount() {
		this.loginHistory(this.state.datalist.PageIndex, this.state.datalist.Page_Size);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading })
		if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			NotificationManager.error(errMsg);
		} else if (Object.keys(nextProps.data).length > 0 && (typeof (nextProps.data.LoginHistoryList) !== 'undefined' || nextProps.data.LoginHistoryList.length > 0)) {
			this.setState({ list: nextProps.data.LoginHistoryList, totalCount: nextProps.data.TotalCount });
		}
	}
	//to apply filter
	applyFilter() {
		const { FromDate, ToDate } = this.state.datalist;
		var newObj = Object.assign({}, this.state.datalist);
		const { isValid, errors } = validateLoginHistoryReport(newObj);
		this.setState({ errors: errors })
		if (isValid) {
			const currentDate = new Date().toISOString().slice(0, 10)
			if (FromDate !== "" && ToDate !== "") {
				this.setState({ showReset: true });
				if (FromDate > currentDate) {
					NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
				} else if (ToDate < FromDate) {

					NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
				} else if (ToDate > currentDate) {
					NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
				} else {
					this.props.loginHistoryList(newObj);
					this.setState({ showReset: true });
				}
			}

		}
	}
	onChange = (event) => {
		var newObj = Object.assign({}, this.state.datalist);
		newObj[event.target.name] = event.target.value;
		this.setState({ datalist: newObj });
	}
	//to clear filter
	clearFilter = () => {
		var newObj = Object.assign({}, this.state.datalist);
		newObj.PageIndex = 0;
		newObj.Page_Size = AppConfig.totalRecordDisplayInList;
		newObj.FromDate = new Date().toISOString().slice(0, 10);
		newObj.ToDate = new Date().toISOString().slice(0, 10);
		newObj.IPAddress = '';
		newObj.Location = '';
		newObj.Device = '';
		this.setState({ datalist: newObj, showReset: false, errors: '' });
		this.props.loginHistoryList(newObj);
	}

	loginHistory = (PageIndex, Page_Size) => {
		var newObj = Object.assign({}, this.state.datalist);
		newObj['PageIndex'] = PageIndex > 0 ? PageIndex : this.state.datalist.PageIndex;
		if (Page_Size > 0) {
			newObj['Page_Size'] = Page_Size > 0 ? Page_Size : this.state.datalist.Page_Size;
		}
		this.setState({ datalist: newObj });

		//For Action API...
		var reqObj = newObj;
		reqObj.PageIndex = PageIndex > 0 ? PageIndex - 1 : 1;
		this.props.loginHistoryList(reqObj);

	}
	handlePageChange = (pageNumber) => {
		this.loginHistory(pageNumber);
	}

	onChangeRowsPerPage = event => {
		this.loginHistory(1, event.target.value);
	};
	render() {
		const { list, loading, totalCount, errors, showReset } = this.state;
		const { FromDate, ToDate, PageIndex, Page_Size, IPAddress, Device, Location } = this.state.datalist;
		let today = new Date();
		today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
		const options = {
			filterType: "select",
			responsive: "scroll",
			selectableRows: false,
			resizableColumns: false,
			viewColumns: false,
			filter: false,
			download: false,
			serverSide: list.length !== 0 ? true : false,
			page: PageIndex,
			count: totalCount,
			rowsPerPage: Page_Size,
			textLabels: {
				body: {
					noMatch: <IntlMessages id="wallet.emptyTable" />,
					toolTip: <IntlMessages id="wallet.sort" />,
				}
			},
			downloadOptions: {
				filename: 'LOGIN_HISTORY_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
			},
			customFooter: (count, page, rowsPerPage) => {
				var page1 = page > 0 ? page + 1 : 1;
				return (
					<CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
				);
			},
			onTableChange: (action, tableState) => {
				if (action === 'changeRowsPerPage' || action === 'changePage') {
					this.props.loginHistoryList(tableState.page, tableState.rowsPerPage);
				}
			},
		};

		return (
			<Fragment>
				{loading && <JbsSectionLoader />}
				<JbsCollapsibleCard>
					<div className="top-filter row">
						<FormGroup className="col-md-3 col-sm-6">
							<Label for="FromDate"><IntlMessages id="widgets.startDate" /><span className="text-danger">*</span></Label>
							<Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={FromDate} max={today} onChange={(e) => this.onChange(e)} />
							{errors.FromDate && <div className="text-danger text-left"><IntlMessages id={errors.FromDate} /></div>}
						</FormGroup>
						<FormGroup className="col-md-3 col-sm-6">
							<Label for="ToDate"><IntlMessages id="widgets.endDate" /><span className="text-danger">*</span></Label>
							<Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate} min={FromDate} max={today} onChange={(e) => this.onChange(e)} />
							{errors.ToDate && <div className="text-danger text-left"><IntlMessages id={errors.ToDate} /></div>}
						</FormGroup>
						<FormGroup className="col-md-3 col-sm-6">
							<Label for="IPAddress1"><IntlMessages id="sidebar.colIpAddress" /></Label>
							<Input type="text" name="IPAddress" id="IPAddress1" placeholder="IPAddress" value={IPAddress} onChange={(e) => this.onChange(e)} />
							{errors.IPAddress && <div className="text-danger text-left"><IntlMessages id={errors.IPAddress} /></div>}
						</FormGroup>
						<FormGroup className="col-md-3 col-sm-6">
							<Label for="Device1"><IntlMessages id="sidebar.colDevice" /></Label>
							<Input type="text" name="Device" id="Device1" placeholder="Device" value={Device} onChange={(e) => this.onChange(e)} />
							{errors.Device && <div className="text-danger text-left"><IntlMessages id={errors.Device} /></div>}
						</FormGroup>
						<FormGroup className="col-md-3 col-sm-6">
							<Label for="Location1"><IntlMessages id="sidebar.colLocation" /></Label>
							<Input type="text" name="Location" id="Location1" placeholder="Location" value={Location} onChange={(e) => this.onChange(e)} />
							{errors.Location && <div className="text-danger text-left"><IntlMessages id={errors.Location} /></div>}
						</FormGroup>
						<FormGroup className="col-md-3 col-sm-6">
							<div className="btn_area">
								<Button variant="raised" disabled={((FromDate === "" || ToDate === "") ? true : false)} className="mr-10  rounded-0 border-0 text-white perverbtn " onClick={() => this.applyFilter()}><IntlMessages id="widgets.apply" /></Button>
								{showReset && <Button className="btn-danger  rounded-0 border-0 text-white" onClick={(e) => this.clearFilter()}><IntlMessages id="button.clear" /></Button>}
							</div>
						</FormGroup>
					</div>
				</JbsCollapsibleCard>
				<div className="StackingHistory">
					<Fragment>
						<div className={this.props.darkMode ? 'ipwhitelist-darkmode' : 'ipwhitelist'}>
							<MUIDataTable title={<IntlMessages id="sidebar.loginHistory" />} columns={columns} options={options}
								data={list.map((item, key) => {
									return [
										key + 1 + (PageIndex * Page_Size),
										changeDateFormat(item.Date, 'YYYY-MM-DD HH:mm:ss'),
										item.Device,
										item.IpAddress,
										item.Location
									]
								})}
							/>
						</div>
					</Fragment>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ loginHistoryRdcer, settings }) => {
	const { darkMode } = settings;
	const { data, loading } = loginHistoryRdcer;
	return { data, loading, darkMode };
};

export default connect(mapStateToProps, {
	loginHistoryList
})(LoginHistoryDataTable);
