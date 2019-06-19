/**
 * Author : Saloni Rathod
 * Created : 20/03/2019
   Social Trading history
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { CustomFooter } from './Widgets';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import { Form, FormGroup, Label, Input, Badge, Button } from "reactstrap";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { socialTradingHistoryList } from "Actions/SocialProfile";
import { getTradePairs } from "Actions/TradeRecon";
import { affiliateAllUser } from "Actions/MyAccount";
import AppConfig from 'Constants/AppConfig';
import Select from "react-select";
import { NotificationManager } from "react-notifications";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';

//BreadCrumb Data...
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
        title: <IntlMessages id="my_account.socialTradingHistory" />,
        link: '',
        index: 2
    }
];

//colums names
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colTrnNo" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colPair" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colType" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colOrderType" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colAmount" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colCharge" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colTotal" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colPrice" />,
        options: { filter: true, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colIsCancel" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.coldatentime" />,
        options: { filter: false, sort: false }
    }
];

const Cancel = ({ data }) => {
    switch (data) {
        case 0: return <p><IntlMessages id="sidebar.yes" /></p>
        case 1: return <p><IntlMessages id="sidebar.no" /></p>
        default: return null;
    }
}

const StatusBadges = ({ data }) => {
    switch (data) {
        case 1: return <Badge color="success"><IntlMessages id="sidebar.confirm" /></Badge>
        case 0: return <Badge color="primary"><IntlMessages id="sidebar.pending" /></Badge>
        case 2: return <Badge color="danger"><IntlMessages id="sidebar.cancel" /></Badge>
        case 4: return <Badge color="dark"><IntlMessages id="sidebar.hold" /></Badge>
        default: return null;
    }
}

//SocialTradingHistory class
class SocialTradingHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signupList: [],
            pairList: [],
            userlist: [],
            filter: {
                Pair: '',
                TrnType: '',
                UserID: '0',
                FollowTradeType: '',
                FollowingTo: '0',
                FromDate: new Date().toISOString().slice(0, 10),
                ToDate: new Date().toISOString().slice(0, 10),
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList,
            },
            count: '',
            errors: {},
            showReset: false,
            loading: false,
            open: false,
            focus: false,
            menudetail: [],
            menuLoading: false
        };
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    applyFilter = (event) => {
        event.preventDefault();
        this.setState({ showReset: true, });
        if (this.state.filter.FromDate === "" || this.state.filter.ToDate === "") {
            NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
        } else {
            this.getsocialTradingHistoryList(1, this.state.filter.PageSize);
        }
    }

    clearFilter = () => {
        let curDate = new Date().toISOString().slice(0, 10);
        var newObj = Object.assign({}, this.state.filter);
        newObj.TrnType = "";
        newObj.Pair = "";
        newObj.FollowTradeType = "";
        newObj.FollowingTo = "0"
        newObj.UserID = "0";
        newObj.FromDate = curDate;
        newObj.ToDate = curDate;
        newObj.PageNo = 0;
        newObj.PageSize = this.state.filter.PageSize;
        this.setState({ showReset: false, filter: newObj, errors: '' });
        this.props.socialTradingHistoryList(newObj);
    }

    getsocialTradingHistoryList = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.filter);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.filter.PageNo;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.filter.PageSize;
        }
        this.setState({ filter: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.socialTradingHistoryList(reqObj);
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getsocialTradingHistoryList(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getsocialTradingHistoryList(1, event.target.value);
    };

    onChange = (event) => {
        var newObj = Object.assign({}, this.state.filter);
        newObj[event.target.name] = event.target.value;
        this.setState({ filter: newObj });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('BEFB2C70-585A-0955-54F1-CD409EB93821'); // get myaccount menu permission

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
    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });

        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getTradePairs();
                this.props.affiliateAllUser();
                this.getsocialTradingHistoryList(this.state.filter.PageNo, this.state.filter.PageSize);
            }
            else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
        }
        if (nextProps.userlist.ReturnCode === 0) {
            this.setState({ userlist: nextProps.userlist.Response, totalcount: nextProps.userlist.TotalCount });
        }
        if (nextProps.pairList) {
            this.setState({ pairList: nextProps.pairList });
        }
        if (nextProps.Data.ReturnCode === 1) {
            this.setState({ signupList: [] });
        } else if (nextProps.Data.ReturnCode === 0) {
            this.setState({ signupList: nextProps.Data.Response, totalcount: nextProps.Data.TotalCount });
        }
    }

    onChangeSelectPair(event) {
        event === null ? (event = { label: null, value: "" }) : null
        var newObj = Object.assign({}, this.state.filter);
        newObj.Pair = event.value;
        this.setState({ filter: newObj })
    }

    render() {
        const { loading, totalcount, errors, signupList, pairList } = this.state;
        const { FromDate, ToDate, PageNo, PageSize, TrnType, FollowTradeType } = this.state.filter;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('DEDBB543-2AFC-31DD-4E47-DF7F7F670017'); //163E7CDD-4AD6-87DB-4C36-7464D79B923E
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();

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
            serverSide: signupList.length !== 0 ? true : false,
            page: PageNo,
            count: totalcount,
            rowsPerPage: PageSize,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            downloadOptions: {
                filename: 'Social_Trading_History_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page1 = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getsocialTradingHistoryList(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.socialTradingHistory" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && //check filter curd operation ? */}
                    <JbsCollapsibleCard>
                        <div className="top-filter">
                            <Form className="tradefrm row">
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="FromDate"><IntlMessages id="my_account.startDate" /><span className="text-danger">*</span></Label>
                                    <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" max={today} value={FromDate} onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="ToDate"><IntlMessages id="my_account.endDate" /><span className="text-danger">*</span></Label>
                                    <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" max={today} min={FromDate} value={ToDate} onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="FollowTradeType"><IntlMessages id="sidebar.followTradeType" /></Label>
                                    <Input type="select" name="FollowTradeType" value={FollowTradeType} id="FollowTradeType" onChange={(e) => this.onChange(e)}>
                                        <IntlMessages id="sidebar.select">{(selType) => <option value="">{selType}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.copy">{(Copy) => <option value="CAN_COPY_TRADE">{Copy}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.mirror">{(Mirror) => <option value="CAN_MIRROR_TRADE">{Mirror}</option>}</IntlMessages>
                                    </Input>
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="TrnType"><IntlMessages id="sidebar.trntype" /></Label>
                                    <Input type="select" name="TrnType" value={TrnType} id="TrnType" onChange={(e) => this.onChange(e)}>
                                        <IntlMessages id="sidebar.select">{(selType) => <option value="">{selType}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.buy">{(buy) => <option value="BUY">{buy}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.sell">{(sell) => <option value="sell">{sell}</option>}</IntlMessages>
                                    </Input>
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4 pair_rsel rsel">
                                    <Label for="Pair"><IntlMessages id="sidebar.pair" /></Label>
                                    <Select className="r_sel_20"
                                        options={pairList.map((user) => ({
                                            value: user.PairName,
                                            label: user.PairName
                                        }))}
                                        isClearable={true}
                                        onChange={(e) => this.onChangeSelectPair(e)}
                                        maxMenuHeight={200}
                                        placeholder={<IntlMessages id="sidebar.searchdot" />}
                                    />
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
                <div className="StackingHistory">
                    <MUIDataTable
                        // title={<IntlMessages id="my_account.socialTradingHistory" />}
                        columns={columns}
                        options={options}
                        data={signupList.map((item, key) => {
                            return [
                                key + 1 + (PageNo * PageSize),
                                item.TrnNo,
                                item.PairName,
                                item.Type,
                                item.OrderType,
                                item.Amount,
                                item.ChargeRs,
                                item.Total,
                                <Fragment>
                                    <StatusBadges data={item.Status} />
                                </Fragment>,
                                item.Price,
                                <Fragment>
                                    <Cancel data={item.IsCancel} />
                                </Fragment>, changeDateFormat(item.DateTime, 'YYYY-MM-DD HH:mm:ss'),

                            ];
                        })}
                    />
                </div>
            </div>
        );
    }
}

//Mapstatetoprops...
const mapStateToProps = ({ socialTradingHistoryReducer, AffiliateRdcer, tradeRecon, authTokenRdcer }) => {
    const { Data, loading, } = socialTradingHistoryReducer;
    const { userlist } = AffiliateRdcer;
    const { pairList } = tradeRecon;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { Data, loading, userlist, pairList, menuLoading, menu_rights };
}

export default connect(mapStateToProps, {
    socialTradingHistoryList,
    getTradePairs,
    affiliateAllUser,
    getMenuPermissionByID
})(SocialTradingHistory);