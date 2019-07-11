/* 
    Developer : Salim Deraiya
    Date : 20-02-2019
    Updated by  : Bharat Jogrna, 25 FEB 2019, (BreadCrumb)13 March 2019
    File Comment : My Account List Rule Tool Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import 'rc-drawer/assets/index.css';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import MUIDataTable from "mui-datatables";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { Badge } from "reactstrap";
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)13 March 2019
import { CustomFooter } from './Widgets';
import { changeDateFormat } from "Helpers/helpers";
import { getRuleToolList, getRuleToolById, changeStatusRuleTool } from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';
import { getMenuPermissionByID } from 'Actions/MyAccount';

//Table Object...
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colToolName" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colActions" />,
        options: { filter: false, sort: true }
    }
];

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
        title: <IntlMessages id="sidebar.userManagement" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.ruleManagement" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.ruleToolDashboard" />,
        link: '',
        index: 3
    },
    {
        title: <IntlMessages id="sidebar.listRuleTool" />,
        link: '',
        index: 4
    }
];

class ListRuleTool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            pagedata: {},
            open: false,
            componentName: '',
            toolList: [],
            totalCount: 0,
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true });
    }

    showComponent = (componentName, toolID, menuDetail) => {
        if (menuDetail.HasChild) {
            if (toolID > 0) {
                this.props.getRuleToolById({ ID: toolID });
            }
            var pData = { isEdit: true }
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
                pagedata: pData,
                menuDetail: menuDetail
            });
        }
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    //Get Rule Tool List form API...
    getRuleTools = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.data.PageNo;
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.data.PageSize;
        this.setState({ data: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getRuleToolList(reqObj);
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('B8969652-4C13-769C-6318-B3F7D2EC5E7D'); // get myaccount menu permission
    }

    //Pagination Change Method...
    handlePageChange(pageNumber) {
        this.getRuleTools(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getRuleTools(1, event.target.value);
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading });

        //Added by Saloni Rathod
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')&& this.state.notificationFlag) {
			if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getRuleTools(this.state.data.PageNo, this.state.data.PageSize);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					window.location.href = AppConfig.afterLoginRedirect;
				}, 2000);
			}
        }
        
        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open5 === false) {
            this.setState({ open: false });
        }

        //Get Tool List...
        if (nextProps.list.hasOwnProperty('Result') && nextProps.list.Result.length > 0) {
            this.setState({ toolList: nextProps.list.Result, totalCount: nextProps.list.TotalCount });
        }

        //Added By Bharat Jograna
        //Get Updated List 
        if (nextProps.chngStsData.ReturnCode === 1) {
            var errMsg = nextProps.chngStsData.ErrorCode === 1 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.chngStsData.ReturnCode === 0) {
            this.getRuleTools(1, this.state.data.PageSize);
            var sucMsg = nextProps.chngStsData.ErrorCode === 0 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
        }
    }

    //Added By Bharat Jograna
    //Change Status Method...
    changeStatus(Id, Status) {
        var reqObj = {
            id: Id,
            Status: Status
        }
        this.props.changeStatusRuleTool(reqObj);
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
        const { componentName, open, toolList, totalCount, pagedata, menuDetail } = this.state;
        const { PageNo, PageSize } = this.state.data;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('aa8ce8f3-9cea-7c66-2bf0-df9e37f03f7f'); //AA8CE8F3-9CEA-7C66-2BF0-DF9E37F03F7F
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
            serverSide: toolList.length !== 0 ? true : false,
            page: PageNo,
            count: totalCount,
            rowsPerPage: PageSize,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            downloadOptions: {
                filename: 'RULE_TOOL_LIST_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var tblPage = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={tblPage} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getRuleTools(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <Fragment>
                {(this.state.menuLoading || this.props.listLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.listRuleTool" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="StackingHistory">
                        <MUIDataTable
                            columns={columns}
                            options={options}
                            data={toolList.map((item, key) => {
                                return [
                                    key + 1,
                                    item.ToolName,
                                    //Added By Bharat Jograna
                                    <Fragment>                                        
                                        <Badge color={item.Status ? "success" : "danger"}>{item.Status ? <IntlMessages id="sidebar.active" /> : <IntlMessages id="sidebar.inActive" />}</Badge>                                        
                                    </Fragment>,
                                    <div className="list-action">
                                     {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && //check edit curd operation */}
                                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditRuleTool', item.ToolID, this.checkAndGetMenuAccessDetail('aa8ce8f3-9cea-7c66-2bf0-df9e37f03f7f'))} className="ml-3"><i className="ti-pencil" /></a>
                                     }
                                    </div>
                                ];
                            })}
                        />
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
                        {componentName !== "" && <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} pagedata={pagedata} props={this.props} menuDetail={menuDetail} />}
                    </Drawer>
                </div>
            </Fragment>
        )
    }
}

const mapToProps = ({ ruleToolRdcer, drawerclose,authTokenRdcer}) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { list, chngStsData, listLoading } = ruleToolRdcer;
    return { list, chngStsData, listLoading, drawerclose, menuLoading, menu_rights };
}

export default connect(mapToProps, {
    getRuleToolList,
    getRuleToolById,
    changeStatusRuleTool,
    getMenuPermissionByID,
})(ListRuleTool);