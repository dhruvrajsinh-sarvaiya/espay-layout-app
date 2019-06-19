/* 
    Developer : Salim Deraiya
    Date : 27-12-2018
    update by Sanjay : 06-02-2019 (code for drawar), Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : KYC Verify List Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { CustomFooter } from './Widgets';
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { Form, FormGroup, Label, Input, Badge, Button } from "reactstrap";
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { kycVerify } from 'Actions/MyAccount';
import { getKycStatus, changeDateFormat } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
import validateKYCVerifyList from 'Validations/MyAccount/kyc_verify_list'
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';

//BreadCrumbData
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
        title: <IntlMessages id="sidebar.listKYCVerify" />,
        link: '',
        index: 1
    }
];

//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="table.UserName" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colName" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colMobile" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colVerifyStatus" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colAction" />,
        options: { filter: false, sort: false }
    }
];

const KYCStatus = ({ status }) => {
    var htmlStatus = '';
    if (status === 1) {
        htmlStatus = <Badge color="success"><IntlMessages id="sidebar.approval" /></Badge>;
    } else if (status === 2) {
        htmlStatus = <Badge color="danger"><IntlMessages id="sidebar.reject" /></Badge>;
    } else if (status === 4) {
        htmlStatus = <Badge color="warning"><IntlMessages id="sidebar.pending" /></Badge>;
    }
    return htmlStatus;
}

//Component for MyAccount KYC Configuration Dashboard
class ListKYCVerifyWdgt extends Component {
    constructor(props) {
        super(props);
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();

        this.state = {
            data: {
                PageIndex: 1,
                Page_Size: AppConfig.totalRecordDisplayInList,
                Status: '',
                Mobile: '',
                EmailAddress: '',
                FromDate: today,
                ToDate: today
            },
            pagedata: {},
            showReset: false,
            open: false,
            componentName: '',
            loading: false,
            totalCount: 0,
            errors: {},
            kycList: [],
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        }
    }

    onChange = (event) => {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    applyFilter = (event) => {
        event.preventDefault();
        this.setState({ showReset: true });
        const { isValid, errors } = validateKYCVerifyList(this.state.data)
        this.setState({ errors: errors })
        const { FromDate, ToDate } = this.state.data;
        if (isValid) {
            if (FromDate === "" || ToDate === "") {
                NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
            } else {
                this.getKycList(1, this.state.data.Page_Size);
            }
        }
    }

    clearFilter = () => {
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();

        var newObj = Object.assign({}, this.state.data);
        newObj.EmailAddress = "";
        newObj.Status = "";
        newObj.Mobile = "";
        newObj.FromDate = today;
        newObj.ToDate = today;
        this.setState({ showReset: false, data: newObj, errors: '' });
        setTimeout(() => {
            this.getKycList(1, this.state.data.Page_Size);
        }, 100);
    }

    //Get Rule Module List form API...
    getKycList = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageIndex'] = PageNo > 0 ? PageNo : this.state.data.PageIndex;
        if (PageSize > 0) {
            newObj['Page_Size'] = PageSize > 0 ? PageSize : this.state.data.Page_Size;
        }
        this.setState({ data: newObj });

        //For Action API...
        var reqObj = newObj;
        this.props.kycVerify(reqObj);
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('59295759-7C28-29CD-6E1C-D9E6E5B52829'); // get myaccount menu permission
 }

    showComponent = (componentName, viewData) => {
        this.setState({
            pagedata: viewData,
            componentName: componentName,
            open: !this.state.open,
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    onClick = () => {
        this.setState({ open: !this.state.open });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getKycList(this.state.data.PageIndex, this.state.data.Page_Size);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                  NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }


        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({ open: false });
        }
        if (nextProps.list.hasOwnProperty('kYCListFilterationDataViewModels') && Object.keys(nextProps.list).length > 0 && Object.keys(nextProps.list.kYCListFilterationDataViewModels).length > 0) {
            this.setState({ kycList: nextProps.list.kYCListFilterationDataViewModels, totalCount: nextProps.list.TotalCount });
        } else if (nextProps.list.hasOwnProperty('kYCListFilterationDataViewModels') && Object.keys(nextProps.list.kYCListFilterationDataViewModels).length === 0) {
            this.setState({ kycList: [], totalCount: nextProps.list.TotalCount });
        }
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getKycList(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = (event) => {
        this.getKycList(1, event.target.value);
    };


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
        const { componentName, open, kycList, pagedata, totalCount, errors } = this.state;
        const { drawerClose, loading } = this.props;
        const { Status, EmailAddress, Mobile, FromDate, ToDate, PageIndex, Page_Size } = this.state.data;
        const kycStatusList = getKycStatus();

        //Check list permission....
        var menuDetailPermission = this.checkAndGetMenuAccessDetail('2649246c-803f-55d5-a08b-8f83e1e9588d'); //BF30765C-65DD-8965-A757-DE0EE5F02F61
        if (!menuDetailPermission) {
            menuDetailPermission = { Utility: [], CrudOption: [] }
        }
        const options = {
            filterType: "select",
            responsive: "scroll",
            selectableRows: false,
            resizableColumns: false,
            search: false, //menuDetailPermission.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            print: false,
            download: false,
            viewColumns: false,
            filter: false,
            sort: false,
            serverSide: kycList.length !== 0 ? true : false,
            page: PageIndex,
            count: totalCount,
            rowsPerPage: Page_Size,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customFooter: (count, page, rowsPerPage) => {
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getKycList(tableState.page, tableState.rowsPerPage);
                }
            }
        };

        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.listKYCVerify" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="StackingHistory">
                    {menuDetailPermission.Utility.indexOf('18736530') !== -1 && // check filter curd operation ?
                        <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="tradefrm row">
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="startDate"><IntlMessages id="my_account.startDate" /><span className="text-danger">*</span></Label>
                                        <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" max={today} value={FromDate} onChange={this.onChange} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="endDate"><IntlMessages id="my_account.endDate" /><span className="text-danger">*</span></Label>
                                        <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" min={FromDate} max={today} value={ToDate} onChange={this.onChange} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="mobile"><IntlMessages id="sidebar.mobile" /></Label>
                                        <IntlMessages id="sidebar.searchdot">
                                            {(placeholder) =>
                                                <Input type="text" name="Mobile" id="Mobile" placeholder={placeholder} value={Mobile} onChange={this.onChange} />
                                            }
                                        </IntlMessages>
                                        {errors.Mobile && <div className="text-danger text-left"><IntlMessages id={errors.Mobile} /></div>}
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="endDate"><IntlMessages id="my_account.emailId" /></Label>
                                        <IntlMessages id="sidebar.searchdot">
                                            {(placeholder) =>
                                                <Input type="text" name="EmailAddress" id="EmailAddress" placeholder={placeholder} value={EmailAddress} onChange={this.onChange} />
                                            }
                                        </IntlMessages>
                                        {errors.EmailAddress && <div className="text-danger text-left"><IntlMessages id={errors.EmailAddress} /></div>}
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Status"><IntlMessages id="sidebar.status" /></Label>
                                        <Input type="select" name="Status" id="Status" value={Status} onChange={this.onChange}>
                                            <IntlMessages id="sidebar.selStatus">{(optionValue) => <option value="">{optionValue}</option>}</IntlMessages>
                                            {kycStatusList.map((lst, index) => (
                                                <IntlMessages key={index} id={lst.label}>{(optionValue) => <option value={lst.id}>{optionValue}</option>}</IntlMessages>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button color="primary" onClick={this.applyFilter}><IntlMessages id="sidebar.btnApply" /></Button>
                                            {this.state.showReset && <Button color="danger" className="ml-10" onClick={this.clearFilter}><IntlMessages id="sidebar.btnClear" /></Button>}
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </JbsCollapsibleCard>
                    }
                    <div className="StackingHistory mt-20 statusbtn-comm">
                        <MUIDataTable
                            // title={<IntlMessages id="sidebar.listKYCVerify" />}
                            columns={columns}
                            options={options}
                            data={
                                kycList.map((lst, key) => {
                                    return [
                                        key + 1 + (PageIndex - 1) * Page_Size,
                                        lst.UserName,
                                        lst.FirstName + ' ' + lst.LastName,
                                        lst.Mobile,
                                        changeDateFormat(lst.Createddate, 'YYYY-MM-DD HH:mm:ss'),
                                        <Fragment>
                                            <KYCStatus status={lst.VerifyStatus} />
                                        </Fragment>,
                                        <div class="list-action">
                                            {menuDetailPermission.CrudOption.indexOf('5645F321') !== -1 && // check for edit permission
                                                <a href="javascript:void(0)" onClick={(e) => this.showComponent('EditKYCVerifyWdgt', lst, this.checkAndGetMenuAccessDetail('2649246C-803F-55D5-A08B-8F83E1E9588D').HasChild)} className=" ml-3"><i className="ti-pencil" /></a>
                                            }
                                        </div>
                                    ]
                                })
                            }
                        />
                    </div>
                </div>
                <Drawer
                    width="50%"
                    handler={false}
                    open={open}
                    placement="right"
                    className="drawer1 half_drawer"
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    {componentName !== "" && <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} pagedata={pagedata} props={this.props} />}
                </Drawer>
            </div>
        );
    }
}

//Mapstatetoprops...
const mapStateToProps = ({ kycVerifyRdcer, drawerclose, authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { list, loading } = kycVerifyRdcer;
    return {
        list, loading, drawerclose, menuLoading,
        menu_rights
    };
}

export default connect(mapStateToProps, {
    kycVerify,
    getMenuPermissionByID
})(ListKYCVerifyWdgt);