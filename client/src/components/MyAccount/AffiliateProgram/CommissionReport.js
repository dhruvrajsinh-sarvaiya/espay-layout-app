/**
 * Auther : Salim Deraiya
 * Created : 12/02/2019
 * Affiliate Commission Report
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
// import  CustomFooter  from 'Components/MyAccount/Widgets';
import { CustomFooter } from './../Widgets';
import { FormGroup, Label, Input, Button, Badge } from 'reactstrap';
import MUIDataTable from "mui-datatables";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import { affiliateCommissionReport, getAffiliateSchemeTypeMappingList, affiliateAllUser, getUserDataList, } from "Actions/MyAccount";
import { changeDateFormat } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
import validateAffiliateReport from '../../../validation/MyAccount/affiliate_report';

//colums names
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colTrnRefNo" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colAffiliateLevel" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="sidbar.colFromWalletName" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colToWalletName" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colFromAccWalletId" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colToAccWalletId" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colAmount" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colAffiliateUserName" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colAffiliateEmail" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colSchemeMappingName" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colTrnUserName" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colRemarks" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colTrnWalletTypeName" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colCommissionPer" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colTrnDate" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: { filter: false, sort: false }
    }
];

const CmsnReportType = ({ data }) => {
    switch (data) {
        case 1: return <Badge color="success"><IntlMessages id="sidebar.approval" /></Badge>
        case 2: return <Badge color="primary"><IntlMessages id="sidebar.reject" /></Badge>
        case 4: return <Badge color="warning"><IntlMessages id="sidebar.pending" /></Badge>
        default: return null;
    }
}

class CommissionReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList,
                FromDate: new Date().toISOString().slice(0, 10),
                ToDate: new Date().toISOString().slice(0, 10),
                SchemeMappingId: '',
                TrnUserId: '',
                TrnRefNo: '',
            },
            mappingList: [],
            userlist: [],
            mappingLable: '',
            userLable: '',
            showReset: false,
            loading: false,
            isDisable: true,
            totalCount: 0,
            errors: {},
            list: []
        }
    }

    componentWillMount() {
        this.getCommissionList(this.state.data.PageNo, this.state.data.PageSize);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });

        //Get scheme type mapping Id
        if (nextProps.mappingList.hasOwnProperty('AffiliateSchemeTypeMappingList') && Object.keys(nextProps.mappingList.AffiliateSchemeTypeMappingList).length > 0) {
            this.setState({ mappingList: nextProps.mappingList.AffiliateSchemeTypeMappingList });
        }

        //Get user list... 
        if (nextProps.userlist.hasOwnProperty('Response') && Object.keys(nextProps.userlist.Response).length > 0) {
            this.setState({ userlist: nextProps.userlist.Response });
        }

        // get table data...
        if (nextProps.commissionData.hasOwnProperty('Data')) {
            this.setState({ list: [] })
            if (nextProps.commissionData.ReturnCode === 0) {
                this.setState({ list: nextProps.commissionData.Data, totalCount: nextProps.commissionData.TotalCount })
            }
        }
    }

    clearFilter = () => {
        var newObj = Object.assign({}, this.state.data);
        newObj.FromDate = new Date().toISOString().slice(0, 10);
        newObj.ToDate = new Date().toISOString().slice(0, 10);
        newObj.SchemeMappingId = "";
        newObj.TrnUserId = "";
        newObj.TrnRefNo = "";
        this.setState({ data: newObj, errors: '', showReset: false, isDisable: true });
        this.props.affiliateCommissionReport(newObj);
    }

    onChange = (event) => {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj, isDisable: false });
    }

    applyFilter = () => {
        const { FromDate, ToDate } = this.state.data;
        const { errors, isValid } = validateAffiliateReport(this.state.data);
        this.setState({ errors: errors });
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
                    this.getCommissionList(1, AppConfig.totalRecordDisplayInList);
                    this.setState({ showReset: true });
                }
            }

        }
    }

    handlePageChange = (pageNumber) => {
        this.getCommissionList(pageNumber);
    }

    onChangeRowsPerPage = event => {
        this.getCommissionList(1, event.target.value);
    };

    getCommissionList = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.data.PageNo;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.data.PageSize;
        }
        this.setState({ data: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getAffiliateSchemeTypeMappingList(reqObj);
        this.props.affiliateAllUser(reqObj);
        this.props.affiliateCommissionReport(reqObj);
    }

    render() {
        const { PageNo, PageSize, FromDate, ToDate, SchemeMappingId, TrnUserId, TrnRefNo } = this.state.data;
        const { mappingList, userlist, loading, list, totalCount, showReset, errors, isDisable } = this.state;
        const options = {
            filterType: "select",
            responsive: "scroll",
            selectableRows: false,
            resizableColumns: false,
            search: false, //menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            print: false,
            download: false,
            viewColumns: false,
            filter: false,
            sort: false,
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
                var page = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getCommissionList(tableState.page, tableState.rowsPerPage);
                }
            },
            downloadOptions: {
                filename: 'Commission_Report_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            }
        };

        return (
            <Fragment>
                {loading && <JbsSectionLoader />}
                <JbsCollapsibleCard>
                    <div className="top-filter row">
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="FromDate"><IntlMessages id="widgets.startDate" /><span className="text-danger">*</span></Label>
                            <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={FromDate} onChange={(e) => this.onChange(e)} />
                            {errors.FromDate && <div className="text-danger text-left"><IntlMessages id={errors.FromDate} /></div>}
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="ToDate"><IntlMessages id="widgets.endDate" /><span className="text-danger">*</span></Label>
                            <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate} onChange={(e) => this.onChange(e)} />
                            {errors.ToDate && <div className="text-danger text-left"><IntlMessages id={errors.ToDate} /></div>}
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="TrnRefNo"><IntlMessages id="sidebar.colTrnRefNo" /></Label>
                            <IntlMessages id="sidebar.searchdot">
                                {(placeholder) => <Input type="text" name="TrnRefNo" id="TrnRefNo" placeholder={placeholder} value={TrnRefNo} onChange={this.onChange} />}
                            </IntlMessages>
                            {errors.TrnRefNo && <div className="text-danger text-left"><IntlMessages id={errors.TrnRefNo} /></div>}
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="SchemeMappingId"><IntlMessages id="sidebar.colSchemeMappingId" /></Label>
                            <Input type="select" name="SchemeMappingId" id="SchemeMappingId" value={SchemeMappingId} onChange={(e) => this.onChange(e)}>
                                <IntlMessages id="sidebar.selectSchemeMAppingId" >{(selMapid) => (<option value='' >{selMapid}</option>)}</IntlMessages>
                                {mappingList.map((data, key) => (<option key={key} value={data.MappingId}>{data.SchemeName}</option>))}
                            </Input>
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="TrnUserId"><IntlMessages id="sidebar.colAffiliateUserId" /></Label>
                            <Input type="select" name="TrnUserId" id="TrnUserId" value={TrnUserId} onChange={(e) => this.onChange(e)}>
                                <IntlMessages id="sidebar.selAffiliateUserId" >{(selUserId) => (<option value='' >{selUserId}</option>)}</IntlMessages>
                                {userlist.map((data, key) => (<option key={key} value={data.Id}>{data.UserName}</option>))}
                            </Input>
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <div className="btn_area">
                                <Button variant="raised" disabled={((FromDate === "" || ToDate === "") ? true : isDisable)} className="mr-10 text-white rounded-0 border-0 perverbtn" onClick={() => this.applyFilter()}><IntlMessages id="widgets.apply" /></Button>
                                {showReset && <Button className="btn-danger  rounded-0 border-0 text-white" onClick={(e) => this.clearFilter()}><IntlMessages id="button.clear" /></Button>}
                            </div>
                        </FormGroup>
                    </div>
                </JbsCollapsibleCard>
                <div className="StackingHistory">
                    <MUIDataTable
                        // title={<IntlMessages id="sidebar.commissionReport" />}
                        columns={columns}
                        options={options}
                        data={list.map((item, key) => {
                            return [
                                key + 1 + (PageNo * PageSize),
                                item.TrnRefNo,
                                item.Level,
                                item.FromWalletName + '(' + item.FromWalletId + ')',
                                item.ToWalletName + '(' + item.ToWalletId + ')',
                                item.FromAccWalletId,
                                item.ToAccWalletId,
                                item.Amount.toFixed(8),
                                item.AffiliateUserName + '(' + item.AffiliateUserId + ')',
                                item.AffiliateEmail,
                                item.SchemeMappingName,
                                item.TrnUserName,
                                item.Remarks,
                                item.TrnWalletTypeName,
                                item.CommissionPer,
                                changeDateFormat(item.TrnDate, 'YYYY-MM-DD HH:mm:ss'),
                                <Fragment>
                                    <CmsnReportType data={item.Status} />
                                </Fragment>,
                            ];
                        })}
                    />
                </div>
            </Fragment>
        );
    }
}

//Mapstatetoprops...
const mapStateToProps = ({ affiliateReportRdcer, AffiliateSchemeTypeMapping }) => {
    const { commissionData, userlist, loading } = affiliateReportRdcer;
    const { mappingList } = AffiliateSchemeTypeMapping;
    return { mappingList, commissionData, userlist, loading };
}

export default connect(mapStateToProps, {
    affiliateCommissionReport,
    getAffiliateSchemeTypeMappingList,
    affiliateAllUser,
    getUserDataList,
})(CommissionReport);