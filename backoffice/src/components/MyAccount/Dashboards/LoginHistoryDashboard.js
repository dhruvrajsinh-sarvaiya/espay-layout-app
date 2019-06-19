/* 
    Developer : Kevin Ladani
    Date : 27-11-2018
    Updated By : Bharat Jograna (BreadCrumb)13 March 2019
    File Comment : Login History Component
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import MUIDataTable from "mui-datatables";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { CustomFooter } from './Widgets';
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import { getLoginHistoryData } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
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
        name: <IntlMessages id="sidebar.colDate" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colDevice" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colIpAddress" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colLocation" />,
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
        title: <IntlMessages id="my_account.manageAccount" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.loginHistory" />,
        link: '',
        index: 2
    }
];

class LoginHistoryDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                PageIndex: 1,
                Page_Size: AppConfig.totalRecordDisplayInList
            },
            list: [],
            loading: true,
            totalCount: 0,
            open: false,
            menudetail: [],
            menuLoading:false
        };
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    //Get Login History Data form API...
    getListLoginHistory = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageIndex'] = PageNo > 0 ? PageNo : this.state.data.PageIndex;
        if (PageSize > 0) {
            newObj['Page_Size'] = PageSize > 0 ? PageSize : this.state.data.Page_Size;
        }
        this.setState({ data: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageIndex = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getLoginHistoryData(reqObj);
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('84E942EA-2195-3F13-2933-F35E1B728B33'); // get myaccount menu permission

    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });

        //Added by Saloni Rathod
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
			if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getListLoginHistory(this.state.data.PageIndex, this.state.data.Page_Size);
            }
            else if (nextProps.menu_rights.ReturnCode !== 0) {
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					window.location.href = AppConfig.afterLoginRedirect;
				}, 2000);
			}
		}

        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }

        if (nextProps.LoginHistoryDashData.ReturnCode === 1 || nextProps.LoginHistoryDashData.ReturnCode === 9) {
            this.setState({ list: [], totalCount: nextProps.LoginHistoryDashData.TotalCount });
        } else if (Object.keys(nextProps.LoginHistoryDashData).length > 0 && (typeof (nextProps.LoginHistoryDashData.LoginHistoryList) !== 'undefined' || nextProps.LoginHistoryDashData.LoginHistoryList.length > 0)) {
            this.setState({ list: nextProps.LoginHistoryDashData.LoginHistoryList, totalCount: nextProps.LoginHistoryDashData.TotalCount });
        }
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getListLoginHistory(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListLoginHistory(1, event.target.value);
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
        const { PageIndex, Page_Size } = this.state.data;
        const { list, loading, totalCount } = this.state;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5'); //163E7CDD-4AD6-87DB-4C36-7464D79B923E
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
            serverSide: list.length !== 0 ? true : false,
            page: PageIndex,
            count: totalCount,
            rowsPerPage: Page_Size,
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
                var page = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getListLoginHistory(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.loginHistory" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="StackingHistory">
                    <MUIDataTable 
                    // title={<IntlMessages id="sidebar.loginHistory" />} 
                    columns={columns} 
                    options={options}
                        data={list.map((item, key) => {
                            return [
                                key + 1 + (PageIndex * Page_Size),
                                changeDateFormat(item.Date, 'YYYY-MM-DD HH:mm:ss'),
                                item.Device,
                                item.IpAddress,
                                item.Location
                            ];
                        })}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ loginHistoryDashboard, drawerclose,authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { LoginHistoryDashData, loading } = loginHistoryDashboard;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { LoginHistoryDashData, loading, drawerclose , menuLoading,menu_rights};
}

export default connect(mapStateToProps, {
    getLoginHistoryData,
    getMenuPermissionByID
})(LoginHistoryDashboard);