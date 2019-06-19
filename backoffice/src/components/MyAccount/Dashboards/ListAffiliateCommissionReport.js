/**
 * Author : Saloni Rathod
 * Created : 13/2/2019
 * Updated By : Bharat Jograna (BreadCrumb)09 March 2019
 * Affiliate Commision Report 
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { CustomFooter } from './Widgets';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { Badge } from "reactstrap";
import Select from "react-select";
import { NotificationManager } from "react-notifications";
import { affiliateCommissionReport, getAffiliateSchemeTypeMappingList, affiliateAllUser, getUserDataList, } from "Actions/MyAccount";
import validateAffiliateReport from 'Validations/MyAccount/affiliate_report';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//BreadCrumb Data...
const BreadCrumbData = [
    {
        title: <IntlMessages id="sidebar.app" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.dashboard" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.adminPanel" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.affiliateManagement" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.affiliateReport" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.affiliateCommisionReport" />,
        link: '',
        index: 3
    }
];

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

const StatusBadges = ({ data }) => {
    switch (data) {
        case 1: return <Badge color="success">Approval</Badge>
        case 2: return <Badge color="primary">Reject</Badge>
        case 4: return <Badge color="warning">Pending</Badge>
        default: return null;
    }
}

//affiliate dashboard class
class ListAffiliateCommissionReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commissionList: [],
            filter: {
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList,
                FromDate: new Date().toISOString().slice(0, 10),
                ToDate: new Date().toISOString().slice(0, 10),
                TrnUserId: '',
                AffiliateUserId: '',
                SchemeMappingId: '',
                TrnRefNo: '',
            },
            totalcount: '',
            mappingList: [],
            userlist: [],
            trnlist: [],
            errors: {},
            showReset: false,
            loading: false,
            open: false,
            mappingLable: null,
            userLable: null,
            trnLable: null,
            menudetail: [],
			menuLoading: false,
            notificationFlag: true,
        };
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    applyFilter = () => {
        var newObj = Object.assign({}, this.state.filter);
        newObj.PageNo = 1;
        newObj.PageSize = AppConfig.totalRecordDisplayInList;
        const { errors, isValid } = validateAffiliateReport(newObj);
        const { FromDate, ToDate } = this.state.filter;
        this.setState({ errors: errors, showReset: true });
        if (isValid) {
            if (FromDate === "" || ToDate === "") {
                NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
            } else {
                this.getAffiliateCommissionReport(1, this.state.filter.PageSize);
            }
        }
    }

    clearFilter = () => {
        var newObj = Object.assign({}, this.state.filter);
        newObj.FromDate = new Date().toISOString().slice(0, 10);
        newObj.ToDate = new Date().toISOString().slice(0, 10);
        newObj.PageSize = AppConfig.totalRecordDisplayInList;
        newObj.SchemeMappingId = "";
        newObj.AffiliateUserId = "";
        newObj.TrnRefNo = "";
        newObj.TrnUserId = "";
        this.setState({
            showReset: false,
            filter: newObj,
            mappingLable: null,
            userLable: null,
            trnLable: null,
            errors: '',
        });
        this.props.affiliateCommissionReport(newObj);
    }

    getAffiliateCommissionReport = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.filter);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.filter.PageNo;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.filter.PageSize;
        }
        this.setState({ filter: newObj });
        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getAffiliateSchemeTypeMappingList(reqObj)
        this.props.affiliateCommissionReport(reqObj);
        this.props.affiliateAllUser(reqObj);
        this.props.getUserDataList();
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getAffiliateCommissionReport(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getAffiliateCommissionReport(1, event.target.value);
    };

    onChange = (event) => {
        var newObj = Object.assign({}, this.state.filter);
        newObj[event.target.name] = event.target.value;
        this.setState({ filter: newObj });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('24B126E5-7957-60E8-4286-CF21D02C0A96'); // get wallet menu permission

    }

    componentWillReceiveProps(nextProps) {
		this.setState({ loading: nextProps.loading, menuLoading:nextProps.menuLoading});
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getAffiliateCommissionReport(this.state.filter.PageNo, this.state.filter.PageSize);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        //Get scheme type mapping Id
        if (nextProps.list.hasOwnProperty('AffiliateSchemeTypeMappingList') && Object.keys(nextProps.list.AffiliateSchemeTypeMappingList).length > 0) {
            this.setState({ mappingList: nextProps.list.AffiliateSchemeTypeMappingList });
        }

        //Get Userlist
        if (nextProps.userlist.ReturnCode === 1 || nextProps.userlist.ReturnCode === 9) {
            this.setState({ userlist: [], totalcount: [] });
        } else if (nextProps.userlist.ReturnCode === 0) {
            this.setState({ userlist: nextProps.userlist.Response, totalcount: nextProps.userlist.TotalCount });
        }

        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open4 === false) {
            this.setState({ open: false });
        }

        // To set userList in React-select
        if (nextProps.getUser.ReturnCode === 0 && nextProps.getUser.hasOwnProperty('GetUserData')) {
            this.setState({ userlist: nextProps.getUser.GetUserData, totalCount: nextProps.getUser.TotalCount });
        }

        if (nextProps.commissionData.hasOwnProperty('Data')) {
            this.setState({ commissionList: [], totalcount: '' })
            if (nextProps.commissionData.ReturnCode === 0) {
                this.setState({ commissionList: nextProps.commissionData.Data, totalcount: nextProps.commissionData.TotalCount });
            }
        }
    }

    onChangeSelectMappingId = (event) => {
        event === null && (event = { label: '', value: '' });
        var newObj = Object.assign({}, this.state.filter);
        newObj.SchemeMappingId = event.value;
        this.setState({ filter: newObj, mappingLable: event.label });
    }

    onChangeSelectUserId = (event) => {
        event === null && (event = { label: '', value: '' });
        var newObj = Object.assign({}, this.state.filter);
        newObj.AffiliateUserId = event.value;
        this.setState({ filter: newObj, userLable: event.label })
    }

    onChangeSelectTrnId = (event) => {
        event === null && (event = { label: '', value: '' });
        var newObj = Object.assign({}, this.state.filter);
        newObj.TrnUserId = event.value;
        this.setState({ filter: newObj, trnLable: event.label });
    }
    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        var response = false;
        var index;
		const { menudetail } = this.state;
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
                    response = menudetail[index];
            }
        }
        return response;
    }
    render() {
        const { loading, totalcount, errors, commissionList, mappingList, userlist, mappingLable, userLable, trnLable, trnlist } = this.state;
        const { TrnRefNo, FromDate, ToDate, PageNo, PageSize } = this.state.filter;
        const { drawerClose } = this.props

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('717da1ec-6d6e-4cab-0dcc-7140f77270d9'); //717DA1EC-6D6E-4CAB-0DCC-7140F77270D9
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

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
            serverSide: commissionList.length !== 0 ? true : false,
            page: PageNo,
            count: totalcount,
            rowsPerPage: PageSize,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            downloadOptions: {
                filename: 'Login_History_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page1 = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getAffiliateCommissionReport(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.affiliateCommisionReport" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
				{(this.state.menuLoading || loading) && <JbsSectionLoader />}
             {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && //check filter curd operation */}
                <JbsCollapsibleCard>
                    <div className="top-filter">
                        <Form className="tradefrm row">
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="startDate"><IntlMessages id="my_account.startDate" /><span className="text-danger">*</span></Label>
                                <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={FromDate} onChange={this.onChange} />
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="endDate"><IntlMessages id="my_account.endDate" /><span className="text-danger">*</span></Label>
                                <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate} onChange={this.onChange} />
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="TrnRefNo"><IntlMessages id="sidebar.colTrnRefNo" /></Label>
                                <IntlMessages id="sidebar.searchdot">
                                    {(placeholder) =>
                                        <Input type="text" name="TrnRefNo" id="TrnRefNo" placeholder={placeholder} value={TrnRefNo} onChange={this.onChange} />
                                    }
                                </IntlMessages>
                                {errors.TrnRefNo && <div className="text-danger text-left"><IntlMessages id={errors.TrnRefNo} /></div>}
                            </FormGroup>
                            <FormGroup className="rsel col-md-2 col-sm-4">
                                <Label for="SchemeMappingId"><IntlMessages id="sidebar.colSchemeMappingName" /></Label>
                                <Select className="r_sel_20"
                                    options={mappingList.map((user) => ({
                                        label: user.Description,
                                        value: user.MappingId,
                                    }))}
                                    value={this.state.mappingLable === null ? null : ({ label: mappingLable })}
                                    isClearable={true}
                                    onChange={this.onChangeSelectMappingId}
                                    maxMenuHeight={200}
                                    placeholder={<IntlMessages id="sidebar.searchdot" />}
                                />
                            </FormGroup>
                            <FormGroup className="rsel col-md-2 col-sm-4">
                                <Label for="AffiliateUserId"><IntlMessages id="sidebar.colAffiliateUser" /></Label>
                                <Select className="r_sel_20"
                                    options={userlist.map((user) => ({
                                        label: user.UserName,
                                        value: user.Id,
                                    }))}
                                    value={this.state.userLable === null ? null : ({ label: userLable })}
                                    isClearable={true}
                                    onChange={this.onChangeSelectUserId}
                                    maxMenuHeight={200}
                                    placeholder={<IntlMessages id="sidebar.searchdot" />}
                                />
                            </FormGroup>
                            <FormGroup className="rsel col-md-2 col-sm-4">
                                <Label for="TrnUserId"><IntlMessages id="sidebar.user" /></Label>
                                <Select className="r_sel_20"
                                    options={trnlist.map((user) => ({
                                        label: user.UserName,
                                        value: user.Id,
                                    }))}
                                    value={this.state.trnLable === null ? null : ({ label: trnLable })}
                                    isClearable={true}
                                    onChange={this.onChangeSelectTrnId}
                                    maxMenuHeight={200}
                                    placeholder={<IntlMessages id="sidebar.searchdot" />}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <div className="btn_area m-0">
                                    <Button color="primary" onClick={this.applyFilter}><IntlMessages id="sidebar.btnApply" /></Button>
                                    {this.state.showReset && <Button color="danger" className="ml-15" onClick={this.clearFilter}><IntlMessages id="sidebar.btnClear" /></Button>}
                                </div>
                            </FormGroup>
                        </Form>
                    </div>
                </JbsCollapsibleCard>
                }
                <div className="StackingHistory">
                    <MUIDataTable
                        // title={<IntlMessages id="sidebar.affiliateCommisionReport" />}
                        columns={columns}
                        options={options}
                        data={commissionList.map((item, key) => {
                            return [
                                key + 1 + (PageNo * PageSize),
                                item.TrnRefNo,
                                item.Level,
                                item.FromWalletName + '(' + item.FromWalletId + ')',
                                item.ToWalletName + '(' + item.ToWalletId + ')',
                                item.FromAccWalletId,
                                item.ToAccWalletId,
                                item.Amount,
                                item.AffiliateUserName + '(' + item.AffiliateUserId + ')',
                                item.AffiliateEmail,
                                item.SchemeMappingName,
                                item.TrnUserName,
                                item.Remarks,
                                item.TrnWalletTypeName,
                                item.CommissionPer,
                                changeDateFormat(item.TrnDate, 'YYYY-MM-DD HH:mm:ss'),
                                <Fragment>
                                    <StatusBadges data={item.Status} />
                                </Fragment>,
                            ];
                        })}
                    />
                </div>
            </div>
        );
    }
}

//Mapstatetoprops...
const mapStateToProps = ({ AffiliateRdcer, drawerclose, AffiliateSchemeTypeMapping, actvHstrRdcer,authTokenRdcer }) => {
    //Added by Bharat Jograna (breadcrumb data)
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { list } = AffiliateSchemeTypeMapping;
    const { getUser } = actvHstrRdcer;
    const { commissionData, loading, userlist } = AffiliateRdcer;
    return { commissionData, loading, list, drawerclose, userlist, getUser,        menuLoading,
        menu_rights };
}

export default connect(mapStateToProps, {
    affiliateCommissionReport,
    getAffiliateSchemeTypeMappingList,
    affiliateAllUser,
    getUserDataList,
    getMenuPermissionByID
})(ListAffiliateCommissionReport);