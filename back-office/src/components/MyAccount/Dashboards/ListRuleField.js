/* 
    Developer : Saloni Rathod
    Date : 25-02-2019
    Updated By : Salim Deraiya dt:27/02/2019
    File Comment : My Account List Rule Field Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import MUIDataTable from "mui-datatables";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { CustomFooter } from './Widgets';
//Added by salim dt:27/02/2019
import { Badge } from "reactstrap";
import 'react-rangeslider/lib/index.css';
//End salim code..
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import { getRuleFieldList, getRuleFieldById, changeStatusRuleField } from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Table Object...
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colFieldName" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.visibility" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colActions" />,
        options: { filter: false, sort: false }
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
        title: <IntlMessages id="sidebar.ruleFieldsDashboard" />,
        link: '',
        index: 3
    },
    {
        title: <IntlMessages id="sidebar.listRuleFields" />,
        link: '',
        index: 4
    }
];

const RuleFieldStatus = ({ status }) => {
    var htmlStr = '';
    if (status === 0) {
        htmlStr = <Badge color="warning"><IntlMessages id="sidebar.readOnly" /></Badge>;
    } else if (status === 1) {
        htmlStr = <Badge color="success"><IntlMessages id="sidebar.write" /></Badge>;
    } else if (status === 9) {
        htmlStr = <Badge color="danger"><IntlMessages id="sidebar.invisible" /></Badge>;
    }
    return htmlStr;
}

//List Rulefield Component
class ListRuleField extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: {
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            pagedata: {},
            open: false,
            componentName: '',
            List: [],
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

    showComponent = (componentName, FieldId, menuDetail) => {
        if (menuDetail.HasChild) {
            if (FieldId > 0) {
                this.props.getRuleFieldById({ ID: FieldId });
            }
            var pData = { isEdit: true }
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
                pagedata: pData,
                menuDetail: menuDetail
            });
        }
        else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    //Get Rule Field List form API...
    getRuleField = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.data.PageNo;
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.data.PageSize;
        this.setState({ data: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getRuleFieldList(reqObj);
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('A0BE2877-5C29-375E-754F-E8C2E5FA2FF2'); // get myaccount menu permission

    }

    //Pagination Change Method...
    handlePageChange(pageNumber) {
        this.getRuleField(pageNumber);
    }

    //Change Status Method...
    changeStatus(status, fieldId) {
        var reqObj = {
            Id: fieldId,
            Status: status === 2 ? 9 : status //Added by salim dt:27/02/2019
        }
        this.props.changeStatusRuleField(reqObj);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getRuleField(1, event.target.value);
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')&& this.state.notificationFlag) {
			if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getRuleField(this.state.data.PageNo, this.state.data.PageSize);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					window.location.href = AppConfig.afterLoginRedirect;
				}, 2000);
			}
		}
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open5 === false) {
            this.setState({ open: false });
        }

        //Get Rule Field List...
        if (nextProps.list.hasOwnProperty('Result') && nextProps.list.Result.length > 0) {
            this.setState({ List: nextProps.list.Result, totalCount: nextProps.list.TotalCount });
        }

        //Get Change Status response...
        if (nextProps.chngStsData.ReturnCode === 1) {
            var errMsg1 = nextProps.chngStsData.ErrorCode === 1 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.error(errMsg1);
        } else if (nextProps.chngStsData.ReturnCode === 0) {
            this.getRuleField(1, this.state.data.PageSize);
            var sucMsg = nextProps.chngStsData.ErrorCode === 0 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
        }
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
        const { componentName, open, List, totalCount, pagedata } = this.state;
        const { PageNo, PageSize } = this.state.data;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('d68df4cd-0601-3283-5b5b-30b558871c17'); //D68DF4CD-0601-3283-5B5B-30B558871C17
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
            serverSide: List.length !== 0 ? true : false,
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
                filename: 'RULE_FIELD_LIST_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var tblPage = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={tblPage} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getRuleField(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <Fragment>
                {(this.state.menuLoading || this.props.listLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.listRuleFields" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="StackingHistory">
                        <div className="stsLbl">
                            <span className="lspn"><IntlMessages id="sidebar.readOnly" /></span>
                            <span className="lspn"><IntlMessages id="sidebar.write" /></span>
                            <span className="lspn"><IntlMessages id="sidebar.invisible" /></span>
                        </div>
                        <MUIDataTable
                            columns={columns}
                            options={options}
                            data={List.map((item, key) => {
                                return [
                                    key + 1 + (PageNo * PageSize), //Added by salim dt:27/02/2019
                                    item.FieldName,
                                    //Added by salim dt:27/02/2019
                                    <Fragment>
                                        {item.Visibility ? <Badge color="success"><IntlMessages id="sidebar.show" /></Badge> : <Badge color="danger"><IntlMessages id="sidebar.hide" /></Badge>}
                                    </Fragment>,
                                    <Fragment>
                                        <RuleFieldStatus status={item.Status} />
                                    </Fragment>,
                                    //End salim code...
                                    <div className="list-action">
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && //check edit curd operation */}
                                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditRuleField', item.FieldID, this.checkAndGetMenuAccessDetail('d68df4cd-0601-3283-5b5b-30b558871c17'))} className="ml-3"><i className="ti-pencil" /></a>
                                         } 
                                    </div>
                                ];
                            })}
                        />
                    </div>
                    <Drawer
                        width={componentName === 'AddEditRuleField' ? "50%" : "100%"}
                        handler={false}
                        open={open}
                        placement="right"
                        className={componentName === 'AddEditRuleField' ? "drawer1 half_drawer" : "drawer1"}
                        level=".drawer0"
                        levelMove={100}
                        height="100%"
                    >
                        {componentName !== "" && <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} pagedata={pagedata} props={this.props} menuDetail={checkAndGetMenuAccessDetail('599E46F4-134F-6A4E-7EB0-9602D27FA72B')} />}
                    </Drawer>
                </div>
            </Fragment>
        )
    }
}

const mapToProps = ({ ruleFieldRdcer, drawerclose, authTokenRdcer}) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { list, listLoading, chngStsData } = ruleFieldRdcer;
    return { list, listLoading, chngStsData, drawerclose, menuLoading, menu_rights };
}
export default connect(mapToProps, {
    getRuleFieldList,
    getRuleFieldById,
    changeStatusRuleField,
    getMenuPermissionByID,
})(ListRuleField);