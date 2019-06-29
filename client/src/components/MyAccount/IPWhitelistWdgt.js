/**
 * Auther : Kevin Ladani
 * Created : 09/10/2018
 * Updated : 24/10/2018 (Salim Deraiya)
 * Updated by:Saloni Rathod(05th April 2019)
 * IP Whitelisting Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import { Badge } from 'reactstrap';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import { CustomFooter } from './Widgets';
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import validateIpWhitelistingReport from '../../validation/MyAccount/ip_whitelisting';
// redux action
import {
	listIPWhitelist,
	DeleteIPToWhitelist,
	disableIPWhitelist,
	enableIPWhitelist
} from "Actions/MyAccount";
import {
	changeDateFormat,
	getDeviceInfo,
	getIPAddress,
	getHostName,
	getMode
} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';

//Columns Object
const columns = [
	{
		name: <IntlMessages id="sidebar.colHash" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="myaccount.ipWhitelistColumn.ip" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="my_account.IPWhitelis.addColumn.aliasName" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="sidebar.colStatus" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="myaccount.ipWhitelistColumn.date" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="myaccount.ipWhitelistColumn.action" />,
		options: {
			filter: false,
			sort: false
		}
	}
];
class IPWhitelistWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				SelectedIPAddress: '',
				DeviceId: getDeviceInfo(),
				Mode: getMode(),
				IPAddress: '', //getIPAddress(),
				HostName: getHostName()
			},
			datalist: {
				PageIndex: 1,
				Page_Size: AppConfig.totalRecordDisplayInList,
				FromDate: new Date().toISOString().slice(0, 10),
				ToDate: new Date().toISOString().slice(0, 10),
				IPAddress: "",
			},
			editIp: [],
			list: [],
			loading: false,
			checkedSwitch: true,
			edit_screen: false,
			errors: '',
			showReset: '',
			staticIP: '', //getIPAddress(),
		};
	}

	componentWillMount() {
		this.IPWhitelist(this.state.datalist.PageIndex, this.state.datalist.Page_Size);
		let self = this;
		getIPAddress().then(function (ipAddress) {
			self.setState({ staticIP: ipAddress });
		});
	}

	IPWhitelist = (PageIndex, PageSize) => {
		var newObj = Object.assign({}, this.state.datalist);
		newObj['PageIndex'] = PageIndex > 0 ? PageIndex : this.state.datalist.PageIndex;
		if (PageSize > 0) {
			newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.datalist.PageSize;
		}
		this.setState({ datalist: newObj });

		//For Action API...
		var reqObj = newObj;
		reqObj.PageIndex = PageIndex > 0 ? PageIndex - 1 : 1;
		this.props.listIPWhitelist(reqObj);

	}
	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });

		if (nextProps.ext_flag) {
			if (nextProps.data.ReturnCode === 1) {
				var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
				NotificationManager.error(errMsg);
			} else if (nextProps.data.ReturnCode === 0) {
				NotificationManager.success(nextProps.data.ReturnMsg);
				this.setState({ loading: true });
				setTimeout(() => this.props.listIPWhitelist(this.state.datalist), 2000);
			}
		} else if (Object.keys(nextProps.data).length > 0 && (typeof (nextProps.data.IpList) !== 'undefined' || nextProps.data.IpList.length > 0)) {
			this.setState({ list: nextProps.data.IpList, totalCount: nextProps.data.TotalRow });
		}
	}

	onEnableIP(IpAddress) {
		const newObj = Object.assign({}, this.state.data);
		newObj.SelectedIPAddress = IpAddress;
		this.setState({ data: newObj });

		let self = this;
		getIPAddress().then(function (ipAddress) {
			newObj.IPAddress = ipAddress;
			self.props.enableIPWhitelist(newObj);
		});
	}

	onChange = (event) => {
		var newObj = Object.assign({}, this.state.datalist);
		newObj[event.target.name] = event.target.value;
		this.setState({ datalist: newObj });
	}

	onDisableIP(IpAddress) {
		const newObj = Object.assign({}, this.state.data);
		newObj.SelectedIPAddress = IpAddress;
		this.setState({ data: newObj });

		let self = this;
		getIPAddress().then(function (ipAddress) {
			newObj.IPAddress = ipAddress;
			self.props.disableIPWhitelist(newObj);
		});
	}

	handleCheckChange = name => (event, checked) => {
		this.setState({ [name]: checked });
	};

	ondeleteIPWhitewlisDialog(IpAddress) {
		const newObj = Object.assign({}, this.state.data);
		newObj.SelectedIPAddress = IpAddress;
		this.setState({ data: newObj });

		this.refs.deleteConfirmationDialog.open();
	}

	ondeleteIPWhitelist() {
		let self = this;
		var reqObj = Object.assign({}, this.state.data);
		getIPAddress().then(function (ipAddress) {
			reqObj.IPAddress = ipAddress;
			self.props.DeleteIPToWhitelist(reqObj);
		});
		this.refs.deleteConfirmationDialog.close();
	}

	oneditIPWhitewlis(ipObj) {
		var editObj = {
			SelectedIPAddress: ipObj.IpAddress,
			IpAliasName: ipObj.IpAliasName
		}
		this.setState({ editIp: editObj });
		this.refs.editIpWhitelistDialog.open();
	}
	applyFilter = () => {
		const { FromDate, ToDate } = this.state.datalist;
		var newObj = Object.assign({}, this.state.datalist);
		const { isValid, errors } = validateIpWhitelistingReport(newObj);
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

					this.props.listIPWhitelist(newObj);
					this.setState({ showReset: true });
				}
			}

		}
	}



	handlePageChange = (pageNumber) => {
		this.IPWhitelist(pageNumber);
	}

	onChangeRowsPerPage = event => {
		this.IPWhitelist(1, event.target.value);
	};
	//to clear filter
	clearFilter = () => {
		var newObj = Object.assign({}, this.state.datalist);
		newObj.PageIndex = 0;
		newObj.Page_Size = AppConfig.totalRecordDisplayInList;
		newObj.FromDate = new Date().toISOString().slice(0, 10);
		newObj.ToDate = new Date().toISOString().slice(0, 10);
		newObj.IPAddress = "";
		this.setState({ datalist: newObj, showReset: false, errors: '' });
		this.props.listIPWhitelist(newObj);
	}
	render() {
		const { staticIP, checkedSwitch, list, loading, errors, showReset, totalCount } = this.state;
		const { FromDate, ToDate, PageIndex, Page_Size, IPAddress } = this.state.datalist;
		let today = new Date();
		today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
		const options = {
			search: false,
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
				filename: 'IP_WHITELIST_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
			},
			customFooter: (count, page, rowsPerPage) => {
				var page1 = page > 0 ? page + 1 : 1;
				return (
					<CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
				);
			},
			onTableChange: (action, tableState) => {
				if (action === 'changeRowsPerPage' || action === 'changePage') {
					this.getDeviceWhiteList(tableState.page, tableState.rowsPerPage);
				}
			},
		};
		return (
			<Fragment>
				<div className="text-success p-15 mb-15 border border-success">
					<IntlMessages id="sidebar.colIpAddress" /> : {staticIP}
				</div>
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
							<Label for="IPAddress4"><IntlMessages id="sidebar.colIpAddress" /></Label>

							<Input type="text" name="IPAddress" id="IPAddress4" placeholder="IPAddress" value={IPAddress} onChange={(e) => this.onChange(e)} />
							{errors.IPAddress && <div className="text-danger text-left"><IntlMessages id={errors.IPAddress} /></div>}
						</FormGroup>
						<FormGroup className="col-md-3 col-sm-6">
							<div className="btn_area">
								<Button variant="raised" disabled={((FromDate === "" || ToDate === "") ? true : false)} className="mr-10 text-white rounded-0 border-0 perverbtn" onClick={() => this.applyFilter()}><IntlMessages id="widgets.apply" /></Button>
								{showReset && <Button className="btn-danger rounded-0 border-0 text-white" onClick={(e) => this.clearFilter()}><IntlMessages id="button.clear" /></Button>}
							</div>
						</FormGroup>
					</div>
				</JbsCollapsibleCard>
				<Fragment>
					<div className="StackingHistory">
						{checkedSwitch === false ? (
							<span className="pricing-main" />
						) : (
								<div className={this.props.darkMode ? 'ipwhitelist-darkmode' : 'ipwhitelist'}>
									<MUIDataTable title={<IntlMessages id="sidebar.ipWhitelist" />} columns={columns} options={options}
										data={list.map((item, key) => {
											return [
												key + 1 + (PageIndex * Page_Size),
												item.IpAddress,
												item.IpAliasName == null ? '' : item.IpAliasName,
												(
													item.IsEnable
														?
														<Badge color="success" onClick={() => this.onDisableIP(item.IpAddress)} style={{ 'cursor': 'pointer' }}>
															<IntlMessages id="sidebar.active" />
														</Badge>
														:
														<Badge color="danger" onClick={() => this.onEnableIP(item.IpAddress)} style={{ 'cursor': 'pointer' }}>
															<IntlMessages id="sidebar.inActive" />
														</Badge>
												),
												changeDateFormat(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss'),
												<Fragment>
													<Button className="text-danger" onClick={() => this.ondeleteIPWhitewlisDialog(item.IpAddress)}>
														<i className="zmdi zmdi-close zmdi-hc-lg" />
													</Button>
												</Fragment>
											];
										})}
									/>
								</div>
							)}
					</div>
					<DeleteConfirmationDialog
						ref="deleteConfirmationDialog"
						title={<IntlMessages id="sidebar.deleteConfirm" />}
						message={<IntlMessages id="sidebar.deleteIPNote" />}
						onConfirm={() => this.ondeleteIPWhitelist()}
					/>
				</Fragment>
			</Fragment>
		);
	}
}
// map state to props
const mapStateToProps = ({ ipWhitelist, settings }) => {
	var response = {
		data: ipWhitelist.data,
		ext_flag: ipWhitelist.ext_flag,
		loading: ipWhitelist.loading,
		darkMode: settings.darkMode
	};
	return response;
};

export default connect(mapStateToProps, {
	listIPWhitelist,
	DeleteIPToWhitelist,
	disableIPWhitelist,
	enableIPWhitelist
})(IPWhitelistWdgt);