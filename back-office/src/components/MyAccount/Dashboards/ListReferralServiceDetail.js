/* 
    Developer : Bharat Jograna
    Date : 23 May 2019
    Updated by  :
    File Comment : MyAccount List Referral Service Detail Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import MUIDataTable from "mui-datatables";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { Form, FormGroup, Label, Input, Button, Badge } from 'reactstrap';
import Select from "react-select";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from './Widgets';
import { changeDateFormat } from "Helpers/helpers";
import { getReferralServiceDetailData, getReferralSchemeTypeMappingData, getServiceDetailById, changeStatusServiceDetail } from 'Actions/MyAccount';
import { getWalletType } from "Actions/WalletUsagePolicy";
import { getMenuPermissionByID } from 'Actions/MyAccount';

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
        title: <IntlMessages id="my_account.referralSystem" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.referralServiceDetailDashboard" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.listReferralServiceDetail" />,
        link: '',
        index: 3
    }
];

//Table Object...
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colMaximumLevel" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colMaximumCoin" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colMinimumValue" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colMaximumValue" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colWalletType" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colCommissionType" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colCommissionValue" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.Status" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colActions" />,
        options: { filter: false, sort: true }
    }
];

//Component for MyAccount List Referral Service Detail Component
class ListReferralServiceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                SchemeTypeMappingId: '',
                CreditWalletTypeId: '',
                Status: '',
            },
            pagedata: {},
            open: false,
            componentName: '',
            ServiceList: [],
            totalCount: 0,
            menuLoading: false,
            menudetail: [],
            Pflag: true,
            notificationFlag: true,
            CreditWalletTypeList: [],
            CreditWalletTypeLable: null,
            SchemeTypeMappingList: [],
            SchemeTypeMappingLable: null,
        };
    }

    onChangeData = (event) => {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    getFilterData = () => {
        this.setState({ showReset: true });
        this.getReferralServiceDetail();
    }

    //Clear Data..
    clearFilter = () => {
        var newObj = Object.assign({}, this.state.data);
        newObj.SchemeTypeMappingId = '';
        newObj.CreditWalletTypeId = '';
        newObj.Status = '';
        this.setState({ showReset: false, data: newObj, errors: '' });
        setTimeout(() => {
            this.getReferralServiceDetail();
        }, 100);
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true })
    }

    showComponent = (componentName, permission, id = '') => {
        if (permission.HasChild) {
            if (id > 0) {
                this.props.getServiceDetailById({ Id: id });
            }
            var pData = { isEdit: true }
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
                pagedata: pData,
                permission: permission
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    //Get Rule Sub Module List form API...
    getReferralServiceDetail = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        //For Action API...
        var reqObj = newObj;
        this.props.getReferralServiceDetailData(reqObj);
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('4CC8DF4E-44F5-5844-42EA-213F87AA97F0');

    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getReferralServiceDetail(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getReferralServiceDetail(1, event.target.value);
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })

        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open5 === false) {
            this.setState({ open: false });
        }

        // update menu details if not set 
        if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getReferralSchemeTypeMappingData();
                this.props.getWalletType({ Status: 1 });
                this.props.getReferralServiceDetailData(this.state.data);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    this.props.drawerClose();
                }, 2000);
            }
            this.setState({ Pflag: false })
        }


        //Get walletType
        if (nextProps.hasOwnProperty('walletType') && Object.keys(nextProps.walletType).length > 0) {
            this.setState({ CreditWalletTypeList: nextProps.walletType });
        }

        if (nextProps.mappingList.ReturnCode === 1 || nextProps.mappingList.ReturnCode === 9) {
            this.setState({ SchemeTypeMappingList: [], totalCount: 0 });
        } else if (nextProps.mappingList.hasOwnProperty('Data') && nextProps.mappingList.Data !== null) {
            this.setState({ SchemeTypeMappingList: nextProps.mappingList.Data, totalCount: nextProps.mappingList.TotalCount });
        }

        //Get Service Detail List...
        if (nextProps.list.ReturnCode === 1 || nextProps.list.ReturnCode === 9) {
            this.setState({ ServiceList: [], totalCount: 0 });
        } else if (nextProps.list.hasOwnProperty('Data') && nextProps.list.Data !== null) {
            this.setState({ ServiceList: nextProps.list.Data, totalCount: nextProps.list.TotalCount });
        }

        //Get Updated List 
        if (this.state.notificationFlag && (nextProps.changeStatus.ReturnCode === 1 || nextProps.changeStatus.ReturnCode === 9)) {
            this.setState({ notificationFlag: false });
            var errMsg = nextProps.changeStatus.ErrorCode === 1 ? nextProps.changeStatus.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.changeStatus.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (this.state.notificationFlag && nextProps.changeStatus.ReturnCode === 0) {
            this.setState({ notificationFlag: false });
            this.getReferralServiceDetail();
            var sucMsg = nextProps.changeStatus.ErrorCode === 0 ? nextProps.changeStatus.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.changeStatus.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
        }
    }

    onChange(event) {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    //Change Status Method...
    changeStatus = (Id, Status) => {
        var reqObj = {
            Id: Id,
            Status: Status
        }
        this.props.changeStatusServiceDetail(reqObj);
    }

    //onchange select Wallet...
    onChangeSelectCoin = (event) => {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.CreditWalletTypeId = event.value;
        this.setState({ data: newObj, CreditWalletTypeLable: event.label });
    }

    //onchange select SchemeTypeMappingId...
    onChangeSelectSchemeTypeMapping = (event) => {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.SchemeTypeMappingId = event.value;
        this.setState({ data: newObj, SchemeTypeMappingLable: event.label });
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
        const { componentName, open, ServiceList, totalCount, pagedata, CreditWalletTypeList, CreditWalletTypeLable, SchemeTypeMappingList, SchemeTypeMappingLable } = this.state;
        const { Status } = this.state.data;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('7D7AA261-93BF-7C10-1A13-5D1F086A12F7'); //
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
            serverSide: ServiceList.length !== 0 ? true : false,
            count: totalCount,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            downloadOptions: {
                filename: 'RULE_SUB_MODULE_LIST_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page1 = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getReferralServiceDetail(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <Fragment>
                {(this.state.menuLoading || this.props.loading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.listReferralServiceDetail" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    {menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1 &&
                        <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="frm_search tradefrm row">
                                    {
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="SchemeTypeMappingId" className="control-label col" ><IntlMessages id="sidebar.colSchemeTypeName" /><span className="text-danger">*</span></Label>
                                            <div className="r_sel_20">
                                                <Select
                                                    options={SchemeTypeMappingList.map((user) => ({
                                                        value: user.Id,
                                                        label: user.ServiceTypeName
                                                    }))}
                                                    isClearable={true}
                                                    value={SchemeTypeMappingLable === null ? null : ({ label: SchemeTypeMappingLable })}
                                                    onChange={(e) => this.onChangeSelectSchemeTypeMapping(e)}
                                                    maxMenuHeight={200}
                                                    placeholder={<IntlMessages id="sidebar.searchdot" />}
                                                />
                                            </div>
                                        </FormGroup>}
                                    {
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="CreditWalletTypeId" className="control-label col"><IntlMessages id="sidebar.colCreditWalletTypeName" /><span className="text-danger">*</span></Label>
                                            <div className="r_sel_20">
                                                <Select
                                                    options={CreditWalletTypeList.map((Wallet) => ({
                                                        value: Wallet.ID,
                                                        label: Wallet.TypeName
                                                    }))}
                                                    isClearable={true}
                                                    value={CreditWalletTypeLable === null ? null : ({ label: CreditWalletTypeLable })}
                                                    onChange={(e) => this.onChangeSelectCoin(e)}
                                                    maxMenuHeight={200}
                                                    placeholder={<IntlMessages id="sidebar.searchdot" />}
                                                />
                                            </div>
                                        </FormGroup>}
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Status"><IntlMessages id="my_account.status" /></Label>
                                        <Input type="select" name="Status" id="Status" value={Status} onChange={(e) => this.onChangeData(e)}>
                                            <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                            <IntlMessages id="sidebar.active">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
                                            <IntlMessages id="sidebar.inactive">{(selectOption) => <option value="0">{selectOption}</option>}</IntlMessages>
                                            <IntlMessages id="sidebar.delete">{(selectOption) => <option value="9">{selectOption}</option>}</IntlMessages>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button color="primary" variant="raised" onClick={this.getFilterData}><IntlMessages id="widgets.apply" /></Button>
                                            {this.state.showReset && <Button color="danger" className="ml-10" onClick={this.clearFilter}><IntlMessages id="sidebar.btnClear" /></Button>}
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </JbsCollapsibleCard>
                    }
                    <div className="StackingHistory">
                        <MUIDataTable
                            columns={columns}
                            options={options}
                            data={ServiceList.map((item, key) => {
                                return [
                                    key + 1,
                                    item.MaximumLevel,
                                    item.MaximumCoin,
                                    item.MinimumValue,
                                    item.MaximumValue,
                                    item.WalletTypeName,
                                    item.CommissionTypeName,
                                    item.CommissionValue,
                                    <Fragment>
                                        <Badge color={item.Status === 1 ? "success" : "danger"}>{item.Status === 1 ? <IntlMessages id="sidebar.active" /> : <IntlMessages id="sidebar.inActive" />}</Badge>
                                    </Fragment>,
                                    <div className="list-action">
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check for edit permission
                                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditReferralServiceDetail', this.checkAndGetMenuAccessDetail('7D7AA261-93BF-7C10-1A13-5D1F086A12F7'), item.Id)} className="ml-3"><i className="ti-pencil" /></a>
                                        }
                                        {//menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check for edit permission
                                            (item.Status !== 1) && <a href="javascript:void(0)" onClick={() => this.changeStatus(item.Id, 1)} className="ml-3"><i className="ti-check" /></a>}
                                        {//menuPermissionDetail.CrudOption.indexOf('419E988B') !== -1 && // check for edit permission
                                            (item.Status === 1) && <a href="javascript:void(0)" onClick={() => this.changeStatus(item.Id, 0)} className="ml-3"><i className="ti-na" /></a>}
                                        {//menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && // check for edit permission
                                            (item.Status !== 9) && <a href="javascript:void(0)" onClick={() => this.changeStatus(item.Id, 9)} className="ml-3"><i className="ti-close" /></a>}
                                    </div>
                                ];
                            })}
                        />
                    </div>
                    <Drawer
                        width={componentName === 'AddEditReferralServiceDetail' ? "50%" : "100%"}
                        handler={false}
                        open={open}
                        placement="right"
                        className={componentName === 'AddEditReferralServiceDetail' ? "drawer1 half_drawer" : "drawer1"}
                        level=".drawer0"
                        levelMove={100}
                        height="100%"
                    >
                        {componentName !== "" && <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} pagedata={pagedata} props={this.props} />}
                    </Drawer>
                </div>
            </Fragment>
        )
    }
}

const mapToProps = ({ ReferralServiceDetail, ReferralSchemeTypeMappingReducer, walletUsagePolicy, drawerclose, authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    var responce = {
        walletType: walletUsagePolicy.walletType,
        mappingList: ReferralSchemeTypeMappingReducer.list,
        list: ReferralServiceDetail.list,
        changeStatus: ReferralServiceDetail.changeStatus,
        getDataById: ReferralServiceDetail.getDataById,
        loading: ReferralServiceDetail.loading,
        edit_loading: ReferralServiceDetail.edit_loading,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights,
        drawerclose: drawerclose,
    };
    return responce;
}

export default connect(mapToProps, {
    getReferralServiceDetailData,
    getReferralSchemeTypeMappingData,
    getWalletType,
    getServiceDetailById,
    changeStatusServiceDetail,
    getMenuPermissionByID,
})(ListReferralServiceDetail);