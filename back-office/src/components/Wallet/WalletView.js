/* 
    Developer : Nishant Vadgama
    Date : 18-09-2018
    File Comment : Wallet list file component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import MUIDataTable from "mui-datatables";
import { Table } from 'reactstrap';
import { injectIntl } from 'react-intl';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import WalletLedger from './WalletLedger';
import {
    getWalletById,
    getWalletsAuthUserList
} from "Actions/Wallet";
import { NotificationManager } from "react-notifications";
//added by parth andariya
import AppConfig from 'Constants/AppConfig';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
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
        title: <IntlMessages id="wallet.walletTitle" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="wallet.walletDetails" />,
        link: '',
        index: 2
    },
];
class WalletView extends Component {
    state = {
        walletID: '',
        menudetail: [],
        notification: true,
    };
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.menuDetail ? 'DB060E19-0938-841B-316C-D5C91910100F' : '85AF8731-2B77-40C2-574D-EC1F4F4A2A87'); // get wallet menu permission
    }
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {  
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
    }
    closeAll = () => {
        this.props.closeAll();
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail(this.props.menuDetail ? '93198A70-A759-54B2-46B0-5CEA6C3A19AA' :'703CC047-A793-4819-8FD9-54044E940C1F');
        var AuthuserListPermission = this.checkAndGetMenuAccessDetail(this.props.menuDetail ? 'A64FA861-924A-69C3-4C53-4B881DD97C2F' :'34BED64D-1D67-517A-84F3-A23DCDB087C7');
        var ledgerPermissionDetail = this.checkAndGetMenuAccessDetail(this.props.menuDetail ? '1F358457-7ECB-1987-4EF9-D0DAEF5E5E6E' : '78DF2C45-8EC0-40BC-8E05-1BEE65A990DC')
        const { drawerClose, intl } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "table.walletName" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.organization" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.walletType" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.status" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "widgets.user" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colRole" }),
                options: { filter: true, sort: true }
            },
            // {
            //     name: intl.formatMessage({ id: "wallet.lblAction" }),
            //     options: { filter: false, sort: false }
            // }
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            print: false,
            download: false,
            viewColumns: false,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            }
        };
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="wallet.walletDetails" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                {menuPermissionDetail && this.props.walletDetails.hasOwnProperty("Walletname") && <JbsCollapsibleCard>
                    <div className="row">
                        <div className="col-sm-6">
                            <Table bordered className="mb-0">
                                <tbody>
                                    <tr>
                                        <th className="w-50">{<IntlMessages id="table.walletName" />}</th>
                                        <td className="w-50">{this.props.walletDetails.Walletname}</td>
                                    </tr>
                                    <tr>
                                        <th className="w-50">{<IntlMessages id="table.balance" />}</th>
                                        <td className="w-50">{this.props.walletDetails.Balance.toFixed(8)}</td>
                                    </tr>
                                    <tr>
                                        <th className="w-50">{<IntlMessages id="table.walletType" />}</th>
                                        <td className="w-50">{this.props.walletDetails.WalletTypeName}</td>
                                    </tr>
                                    <tr>
                                        <th className="w-50">{<IntlMessages id="table.IsValid" />}</th>
                                        <td className="w-50">{this.props.walletDetails.IsValid ? <IntlMessages id="sidebar.yes" /> : <IntlMessages id="sidebar.no" />}</td>
                                    </tr>
                                    <tr>
                                        <th className="w-50">{<IntlMessages id="table.organization" />}</th>
                                        <td className="w-50">{this.props.walletDetails.OrganizationName}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        <div className="col-sm-6">
                            <Table bordered className="mb-0">
                                <tbody>
                                    <tr>
                                        <th className="w-50">{<IntlMessages id="wallet.lblUserName" />}</th>
                                        <td className="w-50">{this.props.walletDetails.UserName}</td>
                                    </tr>
                                    <tr>
                                        <th className="w-50">{<IntlMessages id="language.isdefault" />}</th>
                                        <td className="w-50">{this.props.walletDetails.IsDefaultWallet ? <IntlMessages id="sidebar.yes" /> : <IntlMessages id="sidebar.no" />}</td>
                                    </tr>
                                    <tr>
                                        <th className="w-50">{<IntlMessages id="table.PublicAddress" />}</th>
                                        <td className="w-50">{this.props.walletDetails.PublicAddress}</td>
                                    </tr>
                                    <tr>
                                        <th className="w-50">{<IntlMessages id="table.InBoundBalance" />}</th>
                                        <td className="w-50">{this.props.walletDetails.InBoundBalance.toFixed(8)}</td>
                                    </tr>
                                    <tr>
                                        <th className="w-50">{<IntlMessages id="table.OutBoundBalance" />}</th>
                                        <td className="w-50">{this.props.walletDetails.OutBoundBalance.toFixed(8)}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </JbsCollapsibleCard>}
                {AuthuserListPermission &&
                <div className="StackingHistory mb-25">
                    <MUIDataTable
                        title={<IntlMessages id="wallet.authUserList" />}
                        data={this.props.authUserList.map((user, key) => {
                            return [
                                user.WalletName,
                                user.OrgName,
                                user.WalletType,
                                user.StrStatus,
                                user.UserName,
                                user.UserRoleName,
                                // <div className="list-action">
                                // </div>
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
                }
                {ledgerPermissionDetail &&
                <WalletLedger {...this.props} title={<IntlMessages id="wallet.WalletLedgerReport" />} />
                }
            </div>
        );
    }
}

const mapDispatchToProps = ({ walletReducer ,authTokenRdcer}) => {
    const { authUserList, walletDetails, loading } = walletReducer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { authUserList, walletDetails, loading,menuLoading ,menu_rights};
};

export default connect(mapDispatchToProps, {
    getWalletById,
    getWalletsAuthUserList,
    getMenuPermissionByID
})(injectIntl(WalletView));
