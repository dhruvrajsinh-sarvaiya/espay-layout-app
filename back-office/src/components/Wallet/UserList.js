/* 
    Developer : Nishant Vadgama
    Date : 20-11-2018
    File Comment : Organization User List Componet
*/
import React, { Component } from 'react';
import IntlMessages from "Util/IntlMessages";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { changeDateFormat } from 'Helpers/helpers';
import { injectIntl } from 'react-intl';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import {
    getUserList,
} from 'Actions/Wallet';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import { NotificationManager } from 'react-notifications';
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
        title: <IntlMessages id="sidebar.wallet" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="walletDeshbard.walletMembers" />,
        link: '',
        index: 1
    },
];
const initState = {
    menudetail: [],
    notificationFlag: true,
}
class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    // will mount event
    componentWillMount() {
        this.props.getMenuPermissionByID('DCBDB1AD-A299-6EBB-1E99-66E52E442CC4'); // get wallet menu permission
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    };
    componentWillReceiveProps(nextProps) {
    if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
        if (nextProps.menu_rights.ReturnCode === 0) {
            this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            this.props.getUserList();
        } else if (nextProps.menu_rights.ReturnCode !== 0) {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
            this.props.drawerClose();
        }
        this.setState({ notificationFlag: false });
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
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('3391C90D-187C-84FD-8717-D7E8D3C6662A'); //DCBDB1AD-A299-6EBB-1E99-66E52E442CC4
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const { drawerClose } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.name" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.email" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.type" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.organization" }),
                options: { sort: true, filter: true }
            },
            {
                name: intl.formatMessage({ id: "table.balance" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.date" }),
                options: { sort: true, filter: false }
            },
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            filter: menuPermissionDetail.Utility.indexOf('18736530') !== -1, //for check filter permission,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
        };
        return (
            <div className="jbs-page-content">
             {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="walletDeshbard.walletMembers" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={this.props.userlist.map((user, key) => {
                            return [
                                user.AutoNo,
                                user.FirstName + ' ' + user.LastName,
                                user.Email,
                                user.UserType,
                                user.OrganizationName,
                                parseFloat(user.TotalBalance).toFixed(8),
                                changeDateFormat(user.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false),
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
            </div>
        )
    }
}

const mapToProps = ({ usersReducer ,authTokenRdcer}) => {
    const { userlist, loading } = usersReducer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { userlist, loading ,menuLoading,menu_rights};
};

export default connect(mapToProps, {
    getUserList,
    getMenuPermissionByID
})(injectIntl(UserList));