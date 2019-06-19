/* 
    Developer : Parth Andhariya
    File Comment : Wallet Ledger Report component
    Date : 01-03-2019
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import Button from "@material-ui/core/Button";
import { getUserMarginWallets, getMarginWalletLedger } from "Actions/MarginTrading/WalletLedgerReport";
import { FormGroup, Label, Input, Row } from 'reactstrap';
import { getUserDataList } from "Actions/MyAccount";
import { injectIntl } from 'react-intl';
import Select from "react-select";
import { changeDateFormat } from "Helpers/helpers";
import { JsonMissingTypeErrorBase } from "survey-knockout";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from 'Components/MyAccount/Dashboards/Widgets/CustomFooter';
import AppConfig from 'Constants/AppConfig';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};

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
        title: <IntlMessages id="sidebar.marginTrading" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="wallet.WalletLedgerReport" />,
        link: '',
        index: 1
    },
];

const initState = {
    open: false,
    PageNo: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    TotalCount: 0,
    WalletId: '',
    WalletName: "",
    UserId: "",
    visible: false,
    UserLabel: null,
    FromDate: new Date().toISOString().slice(0, 10),
    ToDate: new Date().toISOString().slice(0, 10),
    showReset: false,
    errFromData: false,
    errToData: false,
    today: new Date().toISOString().slice(0, 10),
    menudetail: [],
    notificationFlag: true,
}

class WalletLedgerReport extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    getListFromServer = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.PageNo;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.PageSize;
        }
        this.setState(newObj);
        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getMarginWalletLedger(reqObj);
    }


    componentWillMount() {
        this.props.getMenuPermissionByID('F71A7A53-1BD2-155A-8B4C-5CB70F916931'); // get wallet menu permission
        // this.props.getUserDataList();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
        if (this.state.TotalCount !== nextProps.TotalCount) {
            this.setState({ TotalCount: nextProps.TotalCount })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getUserDataList();
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
    }

    //Pagination Change Method...
    handlePageChange(pageNumber) {
        this.getListFromServer(pageNumber);
    }

    // //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListFromServer(1, event.target.value);
    };

    closeAll = () => {
        this.props.closeAll();
    };
    //onchange select user
    onChangeSelectUser(e) {
        if (e.value !== undefined && e.value !== "") {
            this.setState({
                UserId: e.value, UserLabel: { label: e.label }, visible: true, WalletName: "", showReset: false, FromDate: new Date().toISOString().slice(0, 10),
                ToDate: new Date().toISOString().slice(0, 10),
            });
            this.props.getUserMarginWallets({ UserId: e.value })
        } else {
            this.setState({ visible: false, WalletName: "", UserId: e.value, UserLabel: { label: e.label }, })
        }

    }

    // onChangeSelectUser(e) {
    //     this.setState({ UserId: e.value, UserLabel: { label: e.label }, visible: true });
    //     this.props.getUserMarginWallets({ UserId: e.value })

    // }
    //onchange select walletId
    onChangeSelectwalletId(e) {
        this.setState({
            WalletId: e.value,
            WalletName: { label: e.label }
        })
    }
    // on change for dates
    onChangeHandler(e, key) {
        e.preventDefault();
        this.setState({ [key]: e.target.value });
    }
    //Apply Filter option
    applyFilter = () => {
        if (this.state.FromDate !== '' && this.state.FromDate > this.state.today) {
            /* validate from date */
            this.setState({ errFromData: true });
        } else if (this.state.ToDate !== '' && this.state.ToDate > this.state.today) {
            /* validate to date */
            this.setState({ errToData: true });
        } else if (this.state.ToDate < this.state.FromDate) {
            this.setState({
                errToData: true,
                errFromData: true
            })
        } else if ((this.state.FromDate !== '' && this.state.ToDate !== '') && (this.state.FromDate <= this.state.today && this.state.ToDate <= this.state.today) && (this.state.ToDate >= this.state.FromDate) && (this.state.UserId !== '' && this.state.WalletName !== "")) {
            // this.props.getMarginWalletLedger({
            //     FromDate: this.state.FromDate,
            //     ToDate: this.state.ToDate,
            //     WalletId: this.state.WalletId,
            //     PageNo: 0,
            //     PageSize: 10
            // })
            this.getListFromServer(1, this.state.PageSize);
            this.setState({ showReset: true, errFromData: false, errToData: false });
        }
    }
    //clear filter
    clearFilter = () => {
        this.setState({ ...initState, menudetail: this.state.menudetail });
        // this.setState(initState, () => this.getListFromServer(this.state.PageNo, this.state.PageSize));
        // this.props.getMarginWalletLedger({
        //     PageSize: this.state.PageSize,
        //     PageNo: this.state.PageNo,
        //     WalletId:this.state.WalletId,
        //     FromDate: new Date().toISOString().slice(0, 10),
        //     ToDate: new Date().toISOString().slice(0, 10)
        // });
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('0F2EC1C4-26D5-936A-2432-4012BF2A2214'); //0F2EC1C4-26D5-936A-2432-4012BF2A2214
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const userMarginWallets = this.props.userMarginWallets;
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        const { drawerClose } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "table.LedgerId" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.Amount" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.CrAmount" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.DrAmount" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.PreBal" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.PostBal" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.Remarks" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.TrnDate" }),
                options: { sort: false, filter: false }
            },
        ];
        const options = {
            filter: false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            rowsPerPageOptions: [10, 25, 50, 100],
            serverSide: this.props.marginWalletLedgers.length !== 0 ? true : false,
            page: this.state.PageNo,
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalCount,
            print: false,
            download: false,
            viewColumns: false,
            search: false,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customFooter: (count, page, rowsPerPage) => {
                var page = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            // onTableChange: (action, tableState) => {
            //     switch (action) {
            //         case 'changeRowsPerPage':
            //             this.setState({
            //                 PageNo: tableState.page,
            //                 PageSize: tableState.rowsPerPage,
            //             });
            //             this.props.getMarginWalletLedger({
            //                 PageNo: tableState.page,
            //                 PageSize: tableState.rowsPerPage,
            //                 FromDate: this.state.FromDate,
            //                 ToDate: this.state.ToDate,
            //                 WalletId: this.state.WalletId,
            //             });
            //             break;
            //         case 'changePage':
            //             this.setState({
            //                 PageNo: tableState.page,
            //                 PageSize: tableState.rowsPerPage,
            //             });
            //             this.props.getMarginWalletLedger({
            //                 PageNo: tableState.page,
            //                 PageSize: tableState.rowsPerPage,
            //                 FromDate: this.state.FromDate,
            //                 ToDate: this.state.ToDate,
            //                 WalletId: this.state.WalletId,
            //             });
            //             break;
            //     }
            // }
        };
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="wallet.WalletLedgerReport" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                    {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                        <JbsCollapsibleCard>
                            <div className="col-md-12">
                                <div className="top-filter clearfix px-20">
                                    <Row>
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="UserId">{intl.formatMessage({ id: "wallet.lblUserId" })}</Label>
                                            <Select
                                                options={userlist.map((user, i) => ({
                                                    label: user.UserName,
                                                    value: user.Id,
                                                }))}
                                                onChange={e => this.onChangeSelectUser(e)}
                                                value={this.state.UserLabel}
                                                maxMenuHeight={200}
                                                placeholder={intl.formatMessage({ id: "sidebar.searchdot" })}
                                            />
                                        </FormGroup>
                                        {this.state.visible === true && (
                                            <FormGroup className="col-md-2 col-sm-4">
                                                <Label for="WalletId">{intl.formatMessage({ id: "wallet.walletList" })}</Label>
                                                <Select
                                                    options={userMarginWallets.map((wallet, i) => ({
                                                        label: wallet.WalletName,
                                                        value: wallet.AccWalletID,
                                                    }))}
                                                    onChange={e => this.onChangeSelectwalletId(e)}
                                                    value={this.state.WalletName}
                                                    maxMenuHeight={200}
                                                    placeholder={intl.formatMessage({ id: "sidebar.searchdot" })}
                                                />
                                            </FormGroup>)}
                                        {this.state.WalletName !== '' && (
                                            <FormGroup className="col-md-2 col-sm-4">
                                                <Label for="startDate">{intl.formatMessage({ id: "widgets.startDate" })}</Label>
                                                <Input type="date" name="date" id="startDate" placeholder="dd/mm/yyyy" value={this.state.FromDate} onChange={(e) => this.onChangeHandler(e, 'FromDate')} max={this.state.today} />
                                                {this.state.errFromData && (
                                                    <span className="text-danger">
                                                        {intl.formatMessage({ id: "wallet.invalidDate" })}
                                                    </span>
                                                )}
                                            </FormGroup>)}
                                        {this.state.WalletName !== '' && (
                                            <FormGroup className="col-md-2 col-sm-4">
                                                <Label for="endDate">{intl.formatMessage({ id: "widgets.endDate" })}</Label>
                                                <Input type="date" name="date" id="endDate" placeholder="dd/mm/yyyy" value={this.state.ToDate} onChange={(e) => this.onChangeHandler(e, 'ToDate')} max={this.state.today} />
                                                {this.state.errToData && (
                                                    <span className="text-danger">
                                                        {intl.formatMessage({ id: "wallet.invalidDate" })}
                                                    </span>
                                                )}
                                            </FormGroup>
                                        )}
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <div className="btn_area m-0">
                                                <Label className="d-block">&nbsp;</Label>
                                                <Button
                                                    color="primary"
                                                    variant="raised"
                                                    className="text-white"
                                                    onClick={() => this.applyFilter()}
                                                    disabled={(this.state.UserId !== '' && this.state.WalletName !== "") ? false : true}
                                            >{intl.formatMessage({ id: "widgets.apply" })}</Button>

                                            {(this.state.showReset && this.state.WalletName !== "") &&
                                                <Button className="btn-danger text-white ml-10" onClick={(e) => this.clearFilter()}>
                                                {intl.formatMessage({ id: "bugreport.list.dialog.button.clear" })}
                                            </Button>}
                                                </div>
                                            </FormGroup>
                                    </Row>
                                </div>
                                </div>
                        </JbsCollapsibleCard>
                            }
                    {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                            {
                                // (this.props.marginWalletLedgers.length !== 0 &&
                                this.state.showReset == true
                                //  ) 
                                && (
                                    <MUIDataTable
                                        data={this.props.marginWalletLedgers.map((item, key) => {
                                            return [
                                                item.LedgerId,
                                                parseFloat(item.Amount).toFixed(8),
                                                parseFloat(item.CrAmount).toFixed(8),
                                                parseFloat(item.DrAmount).toFixed(8),
                                                parseFloat(item.PreBal).toFixed(8),
                                                parseFloat(item.PostBal).toFixed(8),
                                                item.Remarks,
                                                changeDateFormat(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false),
                                            ];
                                        })}
                                        columns={columns}
                                        options={options}
                                    />)}
                </div>
            </div >
                );
            }
        }
        
const mapStateToProps = ({actvHstrRdcer, MarginWalletLedger, drawerclose, authTokenRdcer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
                        setTimeout(function () {
                            drawerclose.bit = 2
                        }, 1000);
                    }
    const {menuLoading, menu_rights } = authTokenRdcer;
    const {getUser} = actvHstrRdcer;
    const {loading, userMarginWallets, marginWalletLedgers, TotalCount } = MarginWalletLedger;
    return {getUser, loading, userMarginWallets, marginWalletLedgers, drawerclose, TotalCount, menuLoading, menu_rights };
                };
                
export default connect(mapStateToProps, {
                        getUserDataList,
                    getUserMarginWallets,
                    getMarginWalletLedger,
                    getMenuPermissionByID
                })(injectIntl(WalletLedgerReport));
