/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Updated by:Saloni Rathod(19th March 2019)
 * Activity List Actions
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import MUIDataTable from "mui-datatables";
import IntlMessages from 'Util/IntlMessages';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { CustomFooter } from 'Components/MyAccount/Widgets';
import { activityList } from 'Actions/MyAccount';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import AppConfig from 'Constants/AppConfig';
//change date formate from the helper.js
import { changeDateFormat, splitString } from "Helpers/helpers";
//for Validation
import validateLoginHistoryReport from '../../validation/MyAccount/login_history';


//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: true, sort: false }
    },

    {
        name: <IntlMessages id="sidebar.colDeviceName" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colIpAddress" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.location" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colMode" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colHostname" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: { filter: true, sort: false }
    }
];


class ActivityListWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            componentName: '',
            datalist: {
                pageIndex: 1,
                pageSize: AppConfig.totalRecordDisplayInList,
                FromDate: new Date().toISOString().slice(0, 10),
                ToDate: new Date().toISOString().slice(0, 10),
                Mode: '',
                Device: '',
                Location: '',
            },
            getList: [],
            errors: '',
            totalCount: '',
            showReset: false,
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
                    this.props.activityList(newObj);
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
        newObj.pageIndex = 0;
        newObj.pageSize = AppConfig.totalRecordDisplayInList;
        newObj.FromDate = new Date().toISOString().slice(0, 10);
        newObj.ToDate = new Date().toISOString().slice(0, 10);
        newObj.Mode = '';
        newObj.Location = '';
        newObj.Device = '';
        this.setState({ datalist: newObj, showReset: false, errors: '' });
        setTimeout(() => {
            this.props.activityList(newObj);
        }, 100)
    }
    tblHandlePageChange = (pageNumber) => {
        this.getActivityList(pageNumber);
    }

    onChangeRowsPerPage = event => {
        this.getActivityList(1, event.target.value);
    };
    componentWillMount() {
        this.getActivityList(this.state.datalist.pageIndex, this.state.datalist.pageSize);
    }

    getActivityList = (pageIndex, pageSize) => {
        var newObj = Object.assign({}, this.state.datalist);
        newObj['pageIndex'] = pageIndex > 0 ? pageIndex : this.state.datalist.pageIndex;
        newObj['pageSize'] = pageSize > 0 ? pageSize : this.state.data.pageSize;
        this.setState({ datalist: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.pageIndex = pageIndex > 0 ? pageIndex - 1 : 1;
        this.props.activityList(reqObj);

    }
    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });

        if (nextProps.list.ReturnCode === 1 || nextProps.list.ReturnCode === 9) {
            this.setState({ getList: [], totalCount: 0 });
        } else if (nextProps.list.hasOwnProperty('ActivityLogHistoryList') && nextProps.list.ActivityLogHistoryList.length > 0) {
            this.setState({ getList: nextProps.list.ActivityLogHistoryList, totalCount: nextProps.list.TotalRow });
        }
    }

    render() {
        const { getList, totalCount, errors, showReset } = this.state;
        const { pageIndex, pageSize, Location, Device, Mode, FromDate, ToDate } = this.state.datalist;
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
        const { loading } = this.props;
        //Table Options
        const options = {
            search: false,
            filterType: "select",
            responsive: "scroll",
            selectableRows: false,
            resizableColumns: false,
            viewColumns: false,
            filter: false,
            download: false,
            serverSide: getList.length !== 0 ? true : false,
            page: pageIndex,
            count: totalCount,
            rowsPerPage: pageSize,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            downloadOptions: {
                filename: 'Activity_List_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page1 = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.tblHandlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.props.activityList(tableState.page, tableState.rowsPerPage);
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
                            <Label for="Location"><IntlMessages id="sidebar.colLocation" /></Label>
                            <Input type="text" name="Location" id="Location" placeholder="Location" value={Location} onChange={(e) => this.onChange(e)} />
                            {errors.Location && <div className="text-danger text-left"><IntlMessages id={errors.Location} /></div>}
                        </FormGroup>
                        <FormGroup className="col-md-3 col-sm-6">
                            <Label for="Device"><IntlMessages id="sidebar.colDevice" /></Label>
                            <Input type="text" name="Device" id="Device" placeholder="Device" value={Device} onChange={(e) => this.onChange(e)} />
                            {errors.Device && <div className="text-danger text-left"><IntlMessages id={errors.Device} /></div>}
                        </FormGroup>
                        <FormGroup className="col-md-3 col-sm-6">
                            <Label for="Mode"><IntlMessages id="sidebar.mode" /></Label>
                            <Input type="select" name="Mode" id="Mode" value={Mode} onChange={(e) => this.onChange(e)}>
                                <IntlMessages id="sidebar.selMode">{(selMode) => <option value="">{selMode}</option>}</IntlMessages>
                                <option value="Web"><IntlMessages id="sidebar.web"></IntlMessages></option>
                                <option value="Mobile"><IntlMessages id="sidebar.mobile"></IntlMessages></option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="col-md-3 col-sm-6">
                            <div className="btn_area">
                                <Button variant="raised" disabled={((FromDate === "" || ToDate === "") ? true : false)} className="mr-10 rounded-0 border-0  text-white perverbtn" onClick={() => this.applyFilter()}><IntlMessages id="widgets.apply" /></Button>
                                {showReset && <Button className="btn-danger rounded-0 border-0  ctext-white" onClick={(e) => this.clearFilter()}><IntlMessages id="button.clear" /></Button>}
                            </div>
                        </FormGroup>
                    </div>
                </JbsCollapsibleCard>
                <div className="StackingHistory">
                    <Fragment>
                        <div className={this.props.darkMode ? 'transaction-history-detail-darkmode' : 'transaction-history-detail'}>
                            <MUIDataTable
                                title={<IntlMessages id="sidebar.ActivityLog" />}
                                columns={columns}
                                options={options}
                                data={
                                    getList.map((lst, index) => {
                                        return [
                                            index + 1 + (pageIndex * pageSize),
                                            lst.Device,
                                            lst.IpAddress,
                                            lst.Location,
                                            lst.Mode,
                                            splitString(lst.HostName, '/', 3),
                                            changeDateFormat(lst.Date, 'YYYY-MM-DD HH:mm:ss')
                                        ]
                                    })
                                }
                            />
                        </div>
                    </Fragment>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = ({ activityListRdcer, settings }) => {
    const { darkMode } = settings;
    const { list, loading } = activityListRdcer;
    return { list, loading, darkMode }
}

export default connect(mapStateToProps, {
    activityList
})(ActivityListWdgt);