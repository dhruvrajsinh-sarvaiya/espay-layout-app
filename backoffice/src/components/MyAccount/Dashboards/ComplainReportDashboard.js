/* 
    Developer : Salim Deraiya
    Date : 26-11-2018
    Updated By : Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount Organization Form Dashboard Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { CustomFooter } from './Widgets';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { Form, FormGroup, Label, Input, Button, Badge } from 'reactstrap';
import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import { complainList, getComplainById, getSLAList } from "Actions/MyAccount";
import AppConfig from 'Constants/AppConfig';
import validateComplainReport from 'Validations/MyAccount/complain_report';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';

//Table Columns
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colCustomerName" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colComplainID" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colType" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colSubject" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colDescription" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colPriority" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colAction" />,
        options: { filter: false, sort: false }
    }
];

const ComplainStatus = ({ status_id }) => {
    let htmlStatus = "";
    if (status_id === "Open") {
        htmlStatus = (<Badge color="success"><IntlMessages id="sidebar.open" /></Badge>);
    } else if (status_id === "Close") {
        htmlStatus = (<Badge color="danger"><IntlMessages id="sidebar.closed" /></Badge>);
    } else if (status_id === "Pending") {
        htmlStatus = (<Badge color="primary"><IntlMessages id="sidebar.pending" /></Badge>);
    }
    return htmlStatus;
};


let today = new Date();
today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();

class ComplainReportDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            componentName: '',
            data: {
                PageIndex: 1,
                Page_Size: AppConfig.totalRecordDisplayInList,
                ComplainId: '',
                Status: '',
                TypeId: '0',
                PriorityId: '',
                FromDate: today,
                ToDate: today
            },
            SLAdata: {
                PageIndex: 0,
                Page_Size: AppConfig.totalRecordDisplayInList,
            },
            showReset: false,
            complainData: [],
            loading: false,
            errors: {},
            showStatus: true,
            totalCount: 0,
            menuDetail: {
                menuDetails: [],
                Status:''
            },
            menudetail: [],
            CurrentListGUID: '',
            ListGUID:'',
            notificationFlag: true,
            menuLoading: false,
            pagedata: "",
            ApiCallBit: this.props.menuDetail.GUID,
            ReplyComplainId : ''
        }
        this.initState = this.state.data;
    }

    onChange = (event) => {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    //Get Complain Report List form API...
    getComplainReportList = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageIndex'] = PageNo > 0 ? PageNo : this.state.data.PageIndex;
        if (PageSize > 0) {
            newObj['Page_Size'] = PageSize > 0 ? PageSize : this.state.data.Page_Size;
        }
        this.setState({ data: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.Status = this.state.data.Status > 0 ? newObj.Status : '';
        this.props.complainList(reqObj);
        this.props.getSLAList();
    }

    //Clear Data..
    clearFilter = (apiCall = true) => {
        var newObj = Object.assign({}, this.state.data);
        newObj.ComplainId = '';
        newObj.Status = '';
        newObj.TypeId = '';
        newObj.PriorityId = '';
        newObj.FromDate = today;
        newObj.ToDate = today;  
        this.setState({ showReset: false, data: newObj, errors: '' });
        if(apiCall) {
            setTimeout(() => {
                this.getComplainReportList(1, this.state.data.Page_Size);
            }, 100);
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.menuDetail.GUID); // get myaccount menu permission

    }

    onClick = () => {
        this.setState({ open: !this.state.open });
    }

    getFilterData = () => {
        const { errors, isValid } = validateComplainReport(this.state.data);
        const { FromDate, ToDate } = this.state.data;
        this.setState({ errors: errors, showReset: true });
        if (isValid) {
            if (FromDate === "" || ToDate === "") {
                NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
            } else {
                this.getComplainReportList(1, this.state.data.Page_Size);
            }
        }
    }

    showComponent = (componentName, ComplainId = 0, menuDetails) => {
        if (menuDetails.HasChild) {
            if (ComplainId !== '' && ComplainId > 0) {
                this.props.getComplainById(ComplainId);
            }
            this.setState({
                componentName: componentName,
                open: !this.state.open,
                menuDetail: {
                    menuDetails: menuDetails,
                    Status: this.props.pagedata.Status,
                },
                ReplyComplainId: ComplainId
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    closeAll = () => {
        this.clearFilter(false);
        this.props.closeAll();
        this.setState({ open: false,});
    }
    

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading,menuLoading:nextProps.menuLoading });
        if (this.state.ApiCallBit !== this.props.menuDetail.GUID) {
            this.setState({ ApiCallBit: this.props.menuDetail.GUID })
            // setTimeout(() => {                
                this.props.getMenuPermissionByID(this.props.menuDetail.GUID);
            // }, 1000);                
          }

    /* update menu details if not set */
    // if (this.state.oldGUID !== nextProps.menu_rights.Result.Modules[0].ParentGUID) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0 && this.state.CurrentListGUID !== nextProps.menu_rights.Result.Modules[0].ParentGUID) {

                this.setState({ menudetail: nextProps.menu_rights.Result.Modules, CurrentListGUID: nextProps.menu_rights.Result.Modules[0].GUID });
                    if (this.props.pagedata.Status === '') {
                    this.setState({ListGUID : "9A30A1D1-1042-1617-2B7F-1AFCB1E69036"})
                } else if (this.props.pagedata.Status === 1) {
                    this.setState({ListGUID : "3E999717-1AB0-927B-2756-FA0DD3200D3E"})
                } else if (this.props.pagedata.Status === 2) {
                    this.setState({ListGUID : "D23104E9-8A87-6D33-75E1-004D09426778"})
                } else if (this.props.pagedata.Status === 3) {
                    this.setState({ListGUID : "EA6A8A13-8B27-6347-81E3-5E605BB264B7"})
                }
               
                this.getComplainReportList(this.state.data.PageIndex, this.state.data.Page_Size);
            
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                    this.setState({ notificationFlag: false });
                    NotificationManager.error(<IntlMessages id={"error.permission"} />);
                    this.props.drawerClose();
                }
            }
        // }

        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }

        if (this.state.data.Status !== nextProps.pagedata.Status) {
            this.setState({
                showStatus: nextProps.pagedata.Status > 0 ? false : true,
                data: {
                    ...this.state.data,
                    Status: nextProps.pagedata.Status > 0 ? nextProps.pagedata.Status : ''
                }
            });

            /* setTimeout(() => {
                this.getComplainReportList(1, this.state.data.Page_Size);
            }, 100); */
        }

        if (nextProps.list.hasOwnProperty('GetTotalCompList') && nextProps.list.GetTotalCompList.length > 0) {
            this.setState({ complainData: nextProps.list.GetTotalCompList, totalCount: nextProps.list.TotalCount });
        } else if (nextProps.list.hasOwnProperty('GetTotalCompList') && nextProps.list.GetTotalCompList.length === 0) {
            this.setState({ complainData: [], totalCount: nextProps.list.TotalCount });
        }
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getComplainReportList(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getComplainReportList(1, event.target.value);
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

    Close = () => {
    this.props.drawerClose();
    this.setState({ open: false, componentName: "",menudetail:[],notificationFlag: true });
}
    render() {
        const { complainData, open, componentName, errors, totalCount,menuDetail } = this.state;
        const { ComplainId, Status, TypeId, PriorityId, FromDate, ToDate, PageIndex, Page_Size } = this.state.data;
        const { drawerClose, loading } = this.props;
        const { ComplaintPriorityGet } = this.props.getSlaData;
        // var menuPermissionDetail = this.checkAndGetMenuAccessDetail((menudetail.length) ? menudetail[0].GUID : ''); //7E4FF4CD-29E4-6826-7DFE-3A820EB95941
       
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail(this.state.ListGUID)

        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        var headetrMsg = <IntlMessages id="sidebar.totalComplainRptList" />;
        if (this.props.pagedata.Status === 1) {
            headetrMsg = <IntlMessages id="sidebar.openComplainRptList" />;
        } else if (this.props.pagedata.Status === 2) {
            headetrMsg = <IntlMessages id="sidebar.closeComplainRptList" />;
        } else if (this.props.pagedata.Status === 3) {
            headetrMsg = <IntlMessages id="sidebar.pendingComplainRptList" />;
        }

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
                title: <IntlMessages id="sidebar.helpNSupport" />,
                link: '',
                index: 1
            },
            {
                title: headetrMsg,
                link: '',
                index: 2
            }
        ];

        //Table Options
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
            serverSide: complainData.length !== 0 ? true : false,
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
                    this.getComplainReportList(tableState.page, tableState.rowsPerPage);
                }
            }
        };

        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
        let headerMsg = headetrMsg.props.id;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={headetrMsg} breadCrumbData={BreadCrumbData} drawerClose={this.Close} closeAll={this.closeAll} isClearData={true} clearDataFun={this.clearFilter} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                 {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && //check filter curd operation ? */}
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
                                <Label for="ComplainId"><IntlMessages id="my_account.complainId" /></Label>
                                <Input type="text" name="ComplainId" id="ComplainId" placeholder="Enter Complain Id" value={ComplainId} onChange={(e) => this.onChange(e)} />
                                {errors.ComplainId && (<span className="text-danger"><IntlMessages id={errors.ComplainId} /></span>)}
                            </FormGroup>
                            {this.props.pagedata.Status === '' && <FormGroup className="col-md-2 col-sm-4">
                                <Label for="Status"><IntlMessages id="my_account.status" /></Label>
                                <Input type="select" name="Status" id="Status" value={Status} onChange={(e) => this.onChange(e)}>
                                    <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                    <IntlMessages id="sidebar.open">{(selectOption) => <option value="1">{selectOption}</option>}</IntlMessages>
                                    <IntlMessages id="sidebar.close">{(selectOption) => <option value="2">{selectOption}</option>}</IntlMessages>
                                    <IntlMessages id="sidebar.pending">{(selectOption) => <option value="3">{selectOption}</option>}</IntlMessages>
                                </Input>
                            </FormGroup>}
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="TypeId"><IntlMessages id="sidebar.type" /></Label>
                                <Input type="select" name="TypeId" id="TypeId" value={TypeId} onChange={(e) => this.onChange(e)}>
                                    <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                    <IntlMessages id="sidebar.transaction">{(selectOption) => <option value="2">{selectOption}</option>}</IntlMessages>
                                    <IntlMessages id="sidebar.wallet">{(selectOption) => <option value="5">{selectOption}</option>}</IntlMessages>
                                    <IntlMessages id="sidebar.myAccount">{(selectOption) => <option value="6">{selectOption}</option>}</IntlMessages>
                                </Input>
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="PriorityId"><IntlMessages id="sidebar.priority" /></Label>
                                <Input type="select" name="PriorityId" id="PriorityId" value={PriorityId} onChange={(e) => this.onChange(e)}>
                                    <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                    {ComplaintPriorityGet &&
                                        ComplaintPriorityGet.map((list, index) => (
                                            <option key={index} value={list.Id}>{list.Priority}</option>
                                        ))}
                                </Input>
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <div className={this.props.pagedata.Status === '' ? "btn_area m-0" : "btn_area"}>
                                    <Button color="primary" variant="raised" onClick={this.getFilterData}><IntlMessages id="widgets.apply" /></Button>
                                    {this.state.showReset && <Button color="danger" className="ml-10" onClick={this.clearFilter}><IntlMessages id="sidebar.btnClear" /></Button>}
                                </div>
                            </FormGroup>
                        </Form>
                    </div>
                </JbsCollapsibleCard>
             } 
                <div className="StackingHistory mt-20">
                    <MUIDataTable
                        // title={headetrMsg}
                        columns={columns}
                        options={options}
                        className="statusbtn-comm"
                        data={complainData.map((list, index) => {
                            return [
                                index + 1 + (PageIndex - 1) * Page_Size,
                                list.UserName,
                                list.ComplainId,
                                list.Type,
                                <p className="Complainlist">{list.Subject}</p>,
                                <p className="Complainlist">{list.Description}</p>,
                                list.Priority,
                                <ComplainStatus status_id={list.Status} />,
                                <span className="date">{changeDateFormat(list.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>,
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('5645F321') !== -1 && // check for edit permission
                                    
                                    list.Status === 'Close' ? '-' :
                                    // <a href="javascript:void(0)" onClick={(e) => this.showComponent('ComplainReplyDashboard', list.ComplainId, this.checkAndGetMenuAccessDetail((menudetail.length) ? menudetail[0].GUID : ''),this.props.pagedata.Status)} className="text-dark ml-10"><i className="zmdi zmdi-mail-reply zmdi-hc-sm" />
                                    // </a> */
                                        <a href="javascript:void(0)" onClick={(e) =>{ this.showComponent("ComplainReplyDashboard", list.ComplainId, this.checkAndGetMenuAccessDetail((this.state.menudetail.length) ? this.state.menudetail[0].GUID : ''),this.props.pagedata.Status)}} className="text-dark ml-10"><i className="zmdi zmdi-mail-reply zmdi-hc-sm" /></a>
                                        
                                    }
                                </div>
                            ];
                        })}
                    />
                </div>
                <Drawer
                    width="100%"
                    handler={false}
                    open={open}
                    placement="right"
                    className="drawer1"
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    {componentName !== "" &&
                        <DynamicLoadComponent componentName={componentName} drawerClose={this.onClick} closeAll={this.closeAll} pagedata={this.state.ReplyComplainId} props={this.props} menuDetail={menuDetail} />}
                </Drawer>
            </div>
        );
    }
}

ComplainReportDashboard.defaultProps = {
    pagedata: {
        Status: ''
    }
}

//map state to props
const mapStateToProps = ({ complainRdcer, drawerclose, authTokenRdcer }) => {
        //Added by Bharat Jograna (BreadCrumb)09 March 2019
        if (drawerclose.bit === 1) {
            setTimeout(function () { drawerclose.bit = 2 }, 1000);
            
    }
    return {
        list: complainRdcer.list,
        loading: complainRdcer.loading,
        getSlaData: complainRdcer.getSlaData,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights:authTokenRdcer.menu_rights,
        drawerclose:drawerclose
     }

    // const { list, loading, getSlaData } = complainRdcer;
    // const {
    //     menuLoading,
    //     menu_rights
    // } = authTokenRdcer;
    // console.log("menurightsin mapstate",menu_rights)
    // return { list, loading, getSlaData, drawerclose, menuLoading,
    //     menu_rights };
   //  return response;
};

export default connect(mapStateToProps, {
    complainList,
    getComplainById,
    getSLAList,
    getMenuPermissionByID
})(ComplainReportDashboard);