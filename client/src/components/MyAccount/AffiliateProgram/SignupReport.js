/**
 * Auther : Salim Deraiya
 * Created : 12/02/2019
 * Updated By : Bharat Jograna, (API)18 March 2019
 * Affiliate Signup Report
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { CustomFooter } from 'Components/MyAccount/Widgets';
import { FormGroup, Label, Input, Button, Badge } from 'reactstrap';
import MUIDataTable from "mui-datatables";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import { changeDateFormat } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
// Added By Bharat Jograna 
import { affiliateSignupReport, affiliateSchemeType } from 'Actions/MyAccount';
// validation for filter
import validateAffiliateReport from '../../../validation/MyAccount/affiliate_report';

//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colName" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.mobileNumber" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colUserName" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colEmail" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="myaccount.schemeType" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colDateTime" />,
        options: { filter: true, sort: false }
    }
];

class SignupReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                FromDate: new Date().toISOString().slice(0, 10),
                ToDate: new Date().toISOString().slice(0, 10),
                Status: '',
                SchemeType: '',
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            showReset: false,
            loading: false,
            totalCount: 0,
            errors: {},
            isDisable: true,
            list: [],
            schemeList: [],
        }
    }

    getSignupList = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.data.PageNo;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.data.PageSize;
        }
        this.setState({ data: newObj });
        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.affiliateSignupReport(reqObj);
    }

    componentWillMount() {
        this.getSignupList(this.state.data.PageNo, this.state.data.PageSize);
        this.props.affiliateSchemeType();
    }

    clearFilter = () => {
        var newObj = Object.assign({}, this.state.data);
        newObj.FromDate = new Date().toISOString().slice(0, 10);
        newObj.ToDate = new Date().toISOString().slice(0, 10);
        newObj.PageNo = 0;
        newObj.PageSize = AppConfig.totalRecordDisplayInList;
        newObj.Status = '';
        newObj.SchemeType = '';
        this.setState({ data: newObj, showReset: false, errors: '', isDisable: true });
        this.props.affiliateSignupReport(newObj);
    }

    applyFilter = () => {
        const { FromDate, ToDate } = this.state.data;
        var newObj = Object.assign({}, this.state.data);
        newObj.PageNo = 1;
        newObj.PageSize = AppConfig.totalRecordDisplayInList;
        const { isValid, errors } = validateAffiliateReport(newObj);
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
                    this.getSignupList(newObj.PageNo, newObj.PageSize);
                    this.setState({ showReset: true });
                }
            }

        }
    }

    onChange = (event) => {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj, isDisable: false });
    }

    onChangeSelectUser(event) {
        var newObj = Object.assign({}, this.state.data);
        newObj.SchemeType = event.value;
        this.setState({ data: newObj })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        // To Set List...
        if (nextProps.signupData.ReturnCode === 1 || nextProps.signupData.ReturnCode === 9) {
            this.setState({ list: [] });
        }
        if (nextProps.signupData.ReturnCode === 0) {
            this.setState({ list: nextProps.signupData.Response, totalCount: nextProps.signupData.TotalCount });
        }
        // To Set SchemeType...
        if (nextProps.typelist.ReturnCode === 0) {
            this.setState({ schemeList: nextProps.typelist.Response });
        }
    }

    handlePageChange = (pageNumber) => {
        this.getSignupList(pageNumber);
    }

    onChangeRowsPerPage = event => {
        this.getSignupList(1, event.target.value);
    };

    render() {
        const { FromDate, ToDate, Status, PageNo, PageSize, SchemeType } = this.state.data;
        const { showReset, loading, list, totalCount, errors, schemeList, isDisable } = this.state;
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
            page: PageNo,
            count: totalCount,
            rowsPerPage: PageSize,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customFooter: (count, page, rowsPerPage) => {
                var page1 = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getSignupList(tableState.page, tableState.rowsPerPage);
                }
            },
            downloadOptions: {
                filename: 'Signup_Report_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            }
        };
        return (
            <Fragment>
                {loading && <JbsSectionLoader />}
                <JbsCollapsibleCard>
                    <div className="top-filter row">
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="FromDate"><IntlMessages id="widgets.startDate" /><span className="text-danger">*</span></Label>
                            <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={FromDate} max={today} onChange={(e) => this.onChange(e)} />
                            {errors.FromDate && <div className="text-danger text-left"><IntlMessages id={errors.FromDate} /></div>}
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="ToDate"><IntlMessages id="widgets.endDate" /><span className="text-danger">*</span></Label>
                            <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate} min={FromDate} max={today} onChange={(e) => this.onChange(e)} />
                            {errors.ToDate && <div className="text-danger text-left"><IntlMessages id={errors.ToDate} /></div>}
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="SchemeType"><IntlMessages id="myaccount.schemeType" /></Label>
                            <Input type="select" name="SchemeType" id="SchemeType" value={SchemeType} onChange={(e) => this.onChange(e)} >
                                <IntlMessages id="myaccount.selSchemeType">{schemeType => <option value="">{schemeType}</option>}</IntlMessages>
                                {schemeList.map((sList, index) =>(<option value={sList.Id}>{sList.Value}</option>))}
                            </Input>
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="Status"><IntlMessages id="widgets.status" /></Label>
                            <Input type="select" name="Status" id="Status" value={Status} onChange={(e) => this.onChange(e)}>
                                <IntlMessages id="sidebar.selStatus">{(selStatus) => <option value="">{selStatus}</option>}</IntlMessages>
                                <option value="1"><IntlMessages id="sidebar.confirm"></IntlMessages></option>
                                <option value="0"><IntlMessages id="sidebar.notConfirm"></IntlMessages></option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <div className="btn_area">
                                <Button variant="raised" disabled={((FromDate === "" || ToDate === "") ? true : isDisable)} className="mr-10 text-white rounded-0 border-0 perverbtn" onClick={() => this.applyFilter()}><IntlMessages id="widgets.apply" /></Button>
                                {showReset && <Button className="btn-danger rounded-0 border-0 text-white" onClick={(e) => this.clearFilter()}><IntlMessages id="button.clear" /></Button>}
                            </div>
                        </FormGroup>
                    </div>
                </JbsCollapsibleCard>
                <div className="StackingHistory">
                    <MUIDataTable
                        // title={<IntlMessages id="sidebar.signupReport" />}
                        columns={columns}
                        options={options}
                        data={list.map((lst, key) => {
                            return [
                                key + 1 + (PageNo * PageSize),
                                lst.FirstName + " " + lst.LastName,
                                lst.Mobile,
                                lst.UserName,
                                lst.Email,
                                lst.Status ? <Badge color="success">Confirm</Badge> : <Badge color="danger">Not Confirm</Badge>,
                                lst.SchemeType,
                                changeDateFormat(lst.JoinDate, 'YYYY-MM-DD HH:mm:ss')
                            ]
                        })}
                    />
                </div>
            </Fragment>
        );
    }
}

// Added By Bharat Jograna 
//Mapstatetoprops...
const mapStateToProps = ({ affiliateReportRdcer }) => {
    const { signupData, typelist, loading } = affiliateReportRdcer;
    return { signupData, typelist, loading };
}

export default connect(mapStateToProps, {
    affiliateSignupReport,
    affiliateSchemeType
})(SignupReport);