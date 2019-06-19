/* 
    Developer : Saloni Rathod
    Date : 24th May 2019
    Updated by  :
    File Comment : MyAccount List Referral Scheme type Mapping Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import MUIDataTable from "mui-datatables";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import Select from "react-select";
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { Form, FormGroup, Label, Input, Button, Badge } from 'reactstrap';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from './Widgets';
import { changeDateFormat } from "Helpers/helpers";
import { getReferralSchemeTypeMappingData, getSchemeTypeMappingById, changeStatusSchemeTypeMapping } from 'Actions/MyAccount';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { getReferralServiceTypeData,getReferralPayTypeData } from 'Actions/MyAccount';
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
        title: <IntlMessages id="sidebar.referralSchemeTypeMappingDashboard" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.listReferralSchemeTypeMapping" />,
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
        name: <IntlMessages id="sidebar.colpayTypeName" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colserviceTypeName" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colminimumDepositionRequired" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.description" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="my_account.startDate" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="my_account.endDate" />,
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
class ListReferralSchemeTypeMapping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                ServiceTypeMstId : '',
                PayTypeId: '',
                Status: '',
            },
            loading:false,
            pagedata: {},
            open: false,
            componentName: '',
            SchemetypemappingList: [],
            totalCount: 0,
            menuLoading: false,
            menudetail: [],
            Pflag: true,
            notificationFlag: true,
            Data: [],
            PaytypeData: [],
            styleLabel: '',
            ptypeLabel:''
        };
    }

    onChangeData = (event) => {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    getFilterData = () => {
        this.setState({ showReset: true });
      this.getReferralSchemeTypeMapping();
     
    }

    //Clear Data..
    clearFilter = () => {
        var newObj = Object.assign({}, this.state.data);
        newObj.SchemeTypeMappingId = '';
        newObj.CreditWalletTypeId = '';
        newObj.Status = '';
        this.setState({ showReset: false, data: newObj, errors: '' });
        setTimeout(() => {
            this.getReferralSchemeTypeMapping();
        }, 100);
    }

    onClick = () => {
        this.setState({ open: !this.state.open })
    }

    showComponent = (componentName, id = '', permission) => {
        if (permission.HasChild) {
            if (id > 0) {
                this.props.getSchemeTypeMappingById({ Id: id });
            }
            var pData = { isEdit: true }
            this.setState({
                componentName: componentName,
                open: !this.state.open,
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
    getReferralSchemeTypeMapping = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        this.props.getReferralSchemeTypeMappingData(newObj);
    }

    componentWillMount() {
         this.props.getMenuPermissionByID('54434A62-5AD9-0FCA-741E-842F1C691FC4');

    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getReferralSchemeTypeMapping(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getReferralSchemeTypeMapping(1, event.target.value);
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading ,loading:nextProps.loading})
            // update menu details if not set 
            if ((!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.Pflag)) {
                if (nextProps.menu_rights.ReturnCode === 0) {
                    this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                    this.props.getReferralSchemeTypeMappingData(this.state.data);
                    this.props.getReferralServiceTypeData();
                    this.props.getReferralPayTypeData();
                } else if (nextProps.menu_rights.ReturnCode !== 0) {
                    NotificationManager.error(<IntlMessages id={"error.permission"} />);
                    setTimeout(() => {
                        this.props.drawerClose();
                    }, 2000);
                }
                this.setState({ Pflag: false })
            }
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open5 === false) {
            this.setState({ open: false });
        }
        //Get Service  List...
        if (nextProps.list.ReturnCode === 1 || nextProps.list.ReturnCode === 9) {
            this.setState({ SchemetypemappingList: [], totalCount: 0 });
        } else if (nextProps.list.hasOwnProperty('Data') && nextProps.list.Data !== null) {
            this.setState({ SchemetypemappingList: nextProps.list.Data, totalCount: nextProps.list.TotalCount });
        }
        if (nextProps.referralServiceTypeData.ReturnCode === 0) {
            this.setState({ Data: nextProps.referralServiceTypeData.ReferralServiceTypeList })
        }
        if (nextProps.referralPayTypeData.ReturnCode === 0) {
            this.setState({ PaytypeData: nextProps.referralPayTypeData.ReferralPayTypeList })
        }
        //Get Updated List 
        if (this.state.notificationFlag && (nextProps.changeStatus.ReturnCode === 1 || nextProps.changeStatus.ReturnCode === 9)) {
            this.setState({ notificationFlag: false });
            var errMsg = nextProps.changeStatus.ErrorCode === 1 ? nextProps.changeStatus.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.changeStatus.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (this.state.notificationFlag && nextProps.changeStatus.ReturnCode === 0) {
            this.setState({ notificationFlag: false });
            this.getReferralSchemeTypeMapping();
            var sucMsg = nextProps.changeStatus.ErrorCode === 0 ? nextProps.changeStatus.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.changeStatus.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
        }
    }

    //Change Status Method...
    changeStatus = (Id, Status) => {
        var reqObj = {
            Id: Id,
            Status: Status
        }
        this.props.changeStatusSchemeTypeMapping(reqObj);
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

    //onchange Scheme Type
    onChangeSelectServiceType = (event) => {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.ServiceTypeMstId = event.value;
        this.setState({ data: newObj, styleLabel: event.label });

    }
    //onchange select paytype
    onChangeSelectUser = (event) => {
         event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.PayTypeId = event.value;
        this.setState({ data: newObj, ptypeLabel: event.label });
    }
    render() {
        const { componentName, open, SchemetypemappingList, totalCount, pagedata, menuDetail,Data,PaytypeData} = this.state;
        const { ServiceTypeMstId, PayTypeId, Status } = this.state.data;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('A595279E-7D18-1D91-69DC-1499D7B46E36'); //
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
            serverSide: SchemetypemappingList.length !== 0 ? true : false,
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
                var page = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getReferralSchemeTypeMapping(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <Fragment>
                {(this.state.menuLoading || this.state.loading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.listReferralSchemeTypeMapping" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                        <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="tradefrm row">
                                    <FormGroup className="rsel col-md-2 col-sm-4">
                                        <Label for="ServiceType"><IntlMessages id="sidebar.serviceType" /></Label>
                                        <Select
                                            options={Data.map((sList, index) => ({
                                                label: sList.ServiceTypeName,
                                                value: sList.Id
                                            }))}
                                            value={{ label: this.state.styleLabel }}
                                            onChange={this.onChangeSelectServiceType}
                                            isClearable={true}
                                            maxMenuHeight={200}
                                            placeholder={<IntlMessages id="sidebar.searchdot" />}
                                        />
                                    </FormGroup>
                                    <FormGroup className="rsel col-md-2 col-sm-4">
                                        <Label for="ServiceType"><IntlMessages id="sidebar.payType" /></Label>
                                        <Select
                                            options={PaytypeData.map((sList, index) => ({
                                                label: sList.PayTypeName,
                                                value: sList.Id
                                            }))}
                                            value={{ label: this.state.ptypeLabel }}
                                            onChange={this.onChangeSelectUser}
                                            isClearable={true}
                                            maxMenuHeight={200}
                                            placeholder={<IntlMessages id="sidebar.searchdot" />}
                                        />
                                    </FormGroup>
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
                            data={SchemetypemappingList.map((item, key) => {
                                return [
                                    key + 1,
                                    item.PayTypeName,
                                    item.ServiceTypeName,
                                    item.MinimumDepositionRequired,
                                    <p className="Complainlist">{item.Description}</p>,
                                    <span className="date">{changeDateFormat(item.FromDate, 'YYYY-MM-DD HH:mm:ss')}</span>,
                                    <span className="date">{changeDateFormat(item.ToDate, 'YYYY-MM-DD HH:mm:ss')}</span>,

                                    <Fragment>
                                        <Badge color={item.Status === 1 ? "success" :(item.Status===0?"warning": "danger")}>{item.Status === 1 ? <IntlMessages id="sidebar.active" /> : (item.Status===0?<IntlMessages id="sidebar.inActive" />:<IntlMessages id="sidebar.delete" />)}</Badge>
                                    </Fragment>,
                                    <div className="list-action">
                                         {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check for edit permission */}
                                             <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditReferralSchemeTypeMapping', item.Id,this.checkAndGetMenuAccessDetail('A595279E-7D18-1D91-69DC-1499D7B46E36'))} className="ml-3"><i className="ti-pencil" /></a>
                                        }
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check for edit permission
                                            (item.Status !== 1) && <a href="javascript:void(0)" onClick={() => this.changeStatus(item.Id, 1)} className="ml-3"><i className="ti-check" /></a>}
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check for edit permission
                                            (item.Status === 1) && <a href="javascript:void(0)" onClick={() => this.changeStatus(item.Id, 0)} className="ml-3"><i className="ti-na" /></a>}
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check for edit permission
                                            (item.Status !== 9) && <a href="javascript:void(0)" onClick={() => this.changeStatus(item.Id, 9)} className="ml-3"><i className="ti-close" /></a>}
                                    </div>
                                ];
                            })}
                        />
                    </div>
                    <Drawer
                        width={componentName === 'AddEditReferralSchemeTypeMapping' ? "50%" : "100%"}
                        handler={false}
                        open={open}
                        placement="right"
                        className={componentName === 'AddEditReferralSchemeTypeMapping' ? "drawer1 half_drawer" : "drawer1"}
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

const mapToProps = ({ ReferralSchemeTypeMappingReducer, drawerclose, authTokenRdcer,ReferralServiceTypeReducer,ReferralPayTypeReducer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { list, changeStatus, getDataById, loading, edit_loading } = ReferralSchemeTypeMappingReducer;
    const { referralServiceTypeData } = ReferralServiceTypeReducer;
    const { referralPayTypeData } = ReferralPayTypeReducer;
    return { list, changeStatus, getDataById, loading, edit_loading, drawerclose, menuLoading, menu_rights, referralServiceTypeData, referralPayTypeData   };
}

export default connect(mapToProps, {
    getReferralServiceTypeData,
    getReferralSchemeTypeMappingData,
    getSchemeTypeMappingById,
    changeStatusSchemeTypeMapping,
    getMenuPermissionByID,
    getReferralPayTypeData,
})(ListReferralSchemeTypeMapping);