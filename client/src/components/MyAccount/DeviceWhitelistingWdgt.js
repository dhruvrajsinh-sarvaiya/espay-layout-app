/**
 * Updated by:Saloni Rathod(19th March 2019)
 * List Device WhiteListing
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import { Badge } from 'reactstrap';
import { CustomFooter } from './Widgets';
import AppConfig from 'Constants/AppConfig';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from 'react-notifications';
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import { deviceWhiteList, deleteDeviceWhiteList, disableDeviceWhiteList, enableDeviceWhiteList } from "Actions/MyAccount";
// validation for filter
import validateDeviceWhitelistingReport from '../../validation/MyAccount/device_whitelisting';
//change date formate from the helper.js
import {
	changeDateFormat,
	getDeviceInfo,
	getIPAddress,
	getHostName,
	getMode
} from "Helpers/helpers";

//Table Object...
const columns = [
	{
		name: <IntlMessages id="sidebar.colHash" />,
		options: {
			filter: true,
			sort: false,
		}
	},
	{
		name: <IntlMessages id="my_account.deviceWhitelisting.colDevice_name" />,
		options: {
			filter: false,
			sort: false
		}
	},
	{
		name: <IntlMessages id="sidebar.colCreatedDt" />,
		options: {
			filter: true,
			sort: false,
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
		name: <IntlMessages id="sidebar.colActions" />,
		options: {
			filter: false,
			sort: false
		}
	},
];


class DeviceWhitelistingWdgt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				SelectedDeviceId: '',
				DeviceId: getDeviceInfo(),
				Mode: getMode(),
				IPAddress: '', //getIPAddress(),
				HostName: getHostName()
			},
			list: [],
			datalist: {
				PageIndex: 1,
				Page_Size: AppConfig.totalRecordDisplayInList,
				FromDate: new Date().toISOString().slice(0, 10),
				ToDate: new Date().toISOString().slice(0, 10),
				Device: "",
			},
			loading: false,
			totalCount: '',
			errors: '',
			showReset: false,
		}
	}

	componentWillMount() {
		this.getdeviceWhiteList(this.state.datalist.PageIndex, this.state.datalist.Page_Size);
	}

	handlePageChange = (pageNumber) => {
		this.getdeviceWhiteList(pageNumber);
	}

	onChangeRowsPerPage = event => {
		this.getdeviceWhiteList(1, event.target.value);
	};

	onChange = (event) => {
		var newObj = Object.assign({}, this.state.datalist);
		newObj[event.target.name] = event.target.value;
		this.setState({ datalist: newObj });
	}

	applyFilter = () => {
		const { FromDate, ToDate } = this.state.datalist;
		var newObj = Object.assign({}, this.state.datalist);
		const { isValid, errors } = validateDeviceWhitelistingReport(newObj);
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

					this.props.deviceWhiteList(newObj);
					this.setState({ showReset: true });
				}
			}
		}
	}
	//to clear filter
	clearFilter = () => {
		var newObj = Object.assign({}, this.state.datalist);
		newObj.PageIndex = 0;
		newObj.Page_Size = AppConfig.totalRecordDisplayInList;
		newObj.FromDate = new Date().toISOString().slice(0, 10);
		newObj.ToDate = new Date().toISOString().slice(0, 10);
		newObj.Device = "";
		this.setState({ datalist: newObj, showReset: false, errors: '' });
		this.props.deviceWhiteList(newObj);
	}

	getdeviceWhiteList = (PageIndex, Page_Size) => {
		var newObj = Object.assign({}, this.state.datalist);
		newObj['PageIndex'] = PageIndex > 0 ? PageIndex : this.state.datalist.PageIndex;
		if (Page_Size > 0) {
			newObj['Page_Size'] = Page_Size > 0 ? Page_Size : this.state.datalist.Page_Size;
		}
		this.setState({ datalist: newObj });

		//For Action API...
		var reqObj = newObj;
		reqObj.PageIndex = PageIndex > 0 ? PageIndex - 1 : 1;
		this.props.deviceWhiteList(reqObj);

	}
	componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading });
		if (nextProps.ext_flag) {
			if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
				var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
				NotificationManager.error(errMsg);
			} else if (nextProps.data.statusCode === 200) {
				NotificationManager.success(nextProps.data.ReturnMsg);
				this.setState({ loading: true });
				setTimeout(() => this.props.deviceWhiteList(this.state.datalist), 2000);
			}
		} else if (Object.keys(nextProps.data).length > 0 && (typeof (nextProps.data.DeviceList) !== 'undefined' || nextProps.data.DeviceList.length > 0)) {
			this.setState({ list: nextProps.data.DeviceList, totalCount: nextProps.data.TotalCount });
		}
	}

	// to enable device
	onEnableDevice(deviceId) {
		const newObj = Object.assign({}, this.state.data);
		newObj.SelectedDeviceId = deviceId;
		this.setState({ data: newObj });
		let self = this;
		getIPAddress().then(function (ipAddress) {
			newObj.IPAddress = ipAddress;
			self.props.enableDeviceWhiteList(newObj);
		});
	}

	// to disable device
	onDisableDevice(deviceId) {
		const newObj = Object.assign({}, this.state.data);
		newObj.SelectedDeviceId = deviceId;
		this.setState({ data: newObj });

		let self = this;
		getIPAddress().then(function (ipAddress) {
			newObj.IPAddress = ipAddress;
			self.props.disableDeviceWhiteList(newObj);
		});
	}
	//delete device dialog
	onDeleteDeviceDialog(deviceId) {
		const newObj = Object.assign({}, this.state.data);
		newObj.SelectedDeviceId = deviceId;
		this.setState({ data: newObj });

		this.refs.deleteConfirmationDialog.open();
	}

	// delete device
	onDeleteDevice() {
		let self = this;
		var reqObj = Object.assign({}, this.state.data);
		getIPAddress().then(function (ipAddress) {
			reqObj.IPAddress = ipAddress;
			self.props.deleteDeviceWhiteList(reqObj);
		});
		this.refs.deleteConfirmationDialog.close();
	}

	render() {
		const { list, loading, totalCount, errors, showReset } = this.state;
		const { FromDate, ToDate, PageIndex, Page_Size, Device } = this.state.datalist;
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
				filename: 'DEVICE_WHITELISTING_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
			},
			customFooter: (count, page, rowsPerPage) => {
				var page1 = page > 0 ? page + 1 : 1;
				return (
					<CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
				);
			},
			onTableChange: (action, tableState) => {
				if (action === 'changeRowsPerPage' || action === 'changePage') {
					this.props.deviceWhiteList(tableState.page, tableState.rowsPerPage);
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
							<Label for="Device2"><IntlMessages id="my_account.deviceWhitelisting.colDevice_name" /></Label>
							<Input type="text" name="Device" id="Device2" placeholder="Device" value={Device} onChange={(e) => this.onChange(e)} />
							{errors.Device && <div className="text-danger text-left"><IntlMessages id={errors.Device} /></div>}
						</FormGroup>
						<FormGroup className="col-md-3 col-sm-6">
							<div className="btn_area">
								<Button variant="raised" disabled={((FromDate === "" || ToDate === "") ? true : false)} className="mr-10  rounded-0 border-0 text-white perverbtn" onClick={() => this.applyFilter()}><IntlMessages id="widgets.apply" /></Button>
								{showReset && <Button className="btn-danger rounded-0 border-0 text-white" onClick={(e) => this.clearFilter()}><IntlMessages id="button.clear" /></Button>}
							</div>
						</FormGroup>
					</div>
				</JbsCollapsibleCard>
				<div className="StackingHistory">
					<Fragment>
						<div className={this.props.darkMode ? 'ipwhitelist-darkmode' : 'ipwhitelist'}>
							<MUIDataTable title={<IntlMessages id="sidebar.deviceWhitelisting" />} columns={columns} options={options}
								data={list.map((item, key) => {
									return [
										key + 1 + (PageIndex * Page_Size),
										<Fragment>
											{item.Device}
											<span className="d-block">({item.DeviceOS})</span>
										</Fragment>,
										changeDateFormat(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss'),
										(
											item.IsEnable
												?
												<Badge color="success" onClick={() => this.onDisableDevice(item.Id)} style={{ 'cursor': 'pointer' }}>
													<IntlMessages id="sidebar.active" />
												</Badge>
												:
												<Badge color="danger" onClick={() => this.onEnableDevice(item.Id)} style={{ 'cursor': 'pointer' }}>
													<IntlMessages id="sidebar.inActive" />
												</Badge>
										),
										<Fragment>
											<Button className="text-danger" onClick={() => this.onDeleteDeviceDialog(item.Id)}>
												<i className="zmdi zmdi-close zmdi-hc-lg" />
											</Button>
										</Fragment>
									];
								})}
							/>
						</div>
						<DeleteConfirmationDialog
							ref="deleteConfirmationDialog"
							title={<IntlMessages id="sidebar.deleteConfirm" />}
							message={<IntlMessages id="sidebar.deleteDeviceNote" />}
							onConfirm={() => this.onDeleteDevice()}
						/>
					</Fragment>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ deviceRdcer, settings }) => {
	const { darkMode } = settings;
	const { data, loading, ext_flag } = deviceRdcer;
	return { data, loading, ext_flag, darkMode }
}

export default withRouter(connect(mapStateToProps, {
	deviceWhiteList,
	deleteDeviceWhiteList,
	disableDeviceWhiteList,
	enableDeviceWhiteList
})(DeviceWhitelistingWdgt));