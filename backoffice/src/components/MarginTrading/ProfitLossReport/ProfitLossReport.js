/*
    Developer : Vishva shah
    Date : 27-04-2019
    File Comment : Profit Loss report component
*/
import React, { Component, Fragment } from "react";
import { Scrollbars } from 'react-custom-scrollbars';
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { FormGroup, Form, Label, Input, Table, Card } from "reactstrap";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import IntlMessages from "Util/IntlMessages";
import { injectIntl } from 'react-intl';
import Select from "react-select";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { getProfitLossList } from "Actions/MarginTrading/ProfitLossReport";
// import pairlist data action 
import { getTradePairs } from "Actions/TradeRecon";
import { getUserDataList } from "Actions/MyAccount";
import { changeDateFormat } from "Helpers/helpers";
import { getWalletType } from "Actions/WalletUsagePolicy";
import { Row, Col } from "reactstrap";
//custom footer from widgets
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import Pagination from "react-js-pagination";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const initState = {
    showReset: false,
    pair: "",
    UserLabel: "",
    UserId: "",
    onLoad: 1,
    PageNo: 1,
    WalletType: '',
    TotalCount: 0,
    PageSize: AppConfig.totalRecordDisplayInList,
    TotalPages: 0,
    start_row: 1,
    menudetail: [],
    notificationFlag: true,
}
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
        title: <IntlMessages id="wallet.ProfitLossReport" />,
        link: '',
        index: 1
    },
];

class ProfitLossReport extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.handleChange = this.handleChange.bind(this);
    }
    //will mount fetch data...
    componentWillMount() {
        this.props.getMenuPermissionByID('A76CD0BE-07F0-1B14-7381-679DB33253A3'); // get wallet menu permission
    }
    componentWillReceiveProps(nextprops) {
        if (this.state.TotalCount != nextprops.TotalCount) {
            this.setState({ TotalCount: nextprops.TotalCount })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                this.setState({ PageNo: 1 });
                this.props.getWalletType({ Status: 1 });
                this.props.getUserDataList();
                this.props.getTradePairs({ IsMargin: 1 });
                this.props.getProfitLossList({
                    PageNo: this.state.PageNo - 1,
                    PageSize: this.state.PageSize,
                    PairId: this.state.pair,
                    UserID: this.state.UserId,
                    WalletType: this.state.WalletType
                });
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
    }
    // close all drawer...
    closeAll = () => {
        this.props.closeAll();
    };
    onChangeHandler(e, key) {
        e.preventDefault();
        this.setState({ [key]: e.target.value });
    }
    //set state for input types
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    // pagination handle change event
    handlePageChange = (pageNumber) => {
        ProfitLossReport.PageNo = pageNumber - 1;
        ProfitLossReport.PageSize = this.state.PageSize;
        this.setState({ PageNo: pageNumber });
        this.props.getProfitLossList(ProfitLossReport)
    }
    // componentDidMount() {
    //     this.setState({ PageNo: 1 });
    //   this.props.getWalletType({ Status: 1 });
    //     this.props.getUserDataList();
    //     this.props.getProfitLossList({
    //         PageNo: this.state.PageNo - 1,
    //         PageSize: this.state.PageSize,
    //         PairId: this.state.pair,
    //         UserID: this.state.UserId,
    //         WalletType: this.state.WalletType
    //     });
    // }
    // apply filter 
    applyFilter() {
        if (this.state.pair !== '' || this.state.UserId !== '' || this.state.WalletType !== '') {
            this.props.getProfitLossList({
                PairId: this.state.pair,
                UserID: this.state.UserId,
                PageNo: this.state.PageNo - 1,
                PageSize: this.state.PageSize,
                WalletType: this.state.WalletType
            });
            this.setState({ showReset: true });
        }
    }
    //reset filter 
    clearFilter() {
        this.setState(initState);
        this.props.getProfitLossList({
            PageNo: this.state.PageNo - 1,
            PairId: "",
            UserID: "",
            WalletType: ''
        });
    }
    onChangeSelectUser(e) {
        if (e.value !== undefined && e.value !== "") {
            this.setState({ UserId: e.value, UserLabel: { label: e.label } });
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
        const { drawerClose, ProfitLossReport, intl } = this.props;
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('7E113B17-37AC-6F95-1632-967E4EB909A4'); //7E113B17-37AC-6F95-1632-967E4EB909A4
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        // const data = this.state.tradingLedger;
        if (ProfitLossReport.length === 0) {
            this.state.start_row = 0
        }
        else {
            this.state.start_row = 1
        }
        return (
            <Fragment>
                <Scrollbars
                    className="jbs-scroll"
                    autoHide
                    autoHideDuration={100}
                    style={{ height: 'calc(100vh - 100px)' }}
                >
                    <div className="jbs-page-content">
                        <WalletPageTitle
                            title={<IntlMessages id="wallet.ProfitLossReport" />}
                            breadCrumbData={BreadCrumbData}
                            drawerClose={drawerClose}
                            closeAll={this.closeAll}
                        />
                        <div className="StackingHistory">
                            {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && ( // check for filter permission
                                <div className="col-md-12">
                                    <JbsCollapsibleCard>
                                        <div className="top-filter">
                                            <Form className="tradefrm row">

                                                <FormGroup className="col-md-2 col-sm-4">
                                                    <Label for="Select-1">
                                                        {<IntlMessages id="wallet.lblUserId" />}
                                                    </Label>
                                                    <Select
                                                        options={userlist.map((user, i) => ({
                                                            label: user.UserName,
                                                            value: user.Id,
                                                        }))}
                                                        onChange={e => this.onChangeSelectUser(e)}
                                                        value={this.state.UserLabel}
                                                        maxMenuHeight={200}
                                                        placeholder={intl.formatMessage({
                                                            id: 'sidebar.searchdot',
                                                        })}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-2 col-sm-4">
                                                    <Label for="ServiceProviderID">
                                                        <IntlMessages id="sidebar.tradingLedger.filterLabel.currencyPair" />
                                                    </Label>
                                                    <Input
                                                        type="select"
                                                        name="pair"
                                                        id="pair"
                                                        value={this.state.pair}
                                                        onChange={this.handleChange}
                                                    >
                                                        <option value="">
                                                            {intl.formatMessage({
                                                                id: 'tradingLedger.selectCurrencyPair.all',
                                                            })}
                                                        </option>
                                                        {this.props.pairList.length &&
                                                            this.props.pairList.map((item, key) => (
                                                                <option value={item.PairId} key={key}>
                                                                    {item.PairName}
                                                                </option>
                                                            ))}
                                                    </Input>
                                                </FormGroup>
                                                <FormGroup className="col-md-2 col-sm-4">
                                                    <Label for="Select-1"><IntlMessages id="table.currency" /></Label>
                                                    <Input type="select" name="walletType" id="walletType" value={this.state.WalletType} onChange={(e) => this.onChangeHandler(e, 'WalletType')}>
                                                        <option value="">{intl.formatMessage({ id: "wallet.errCurrency" })}</option>
                                                        {this.props.walletType.length &&
                                                            this.props.walletType.map((type, index) => (
                                                                <option key={index} value={type.TypeName}>{type.TypeName}</option>
                                                            ))}
                                                    </Input>
                                                </FormGroup>
                                                <FormGroup className="col-md-2 col-sm-4">
                                                    <div className="btn_area m-0">
                                                        <Label className="d-block">&nbsp;</Label>
                                                        <Button
                                                            color="primary"
                                                            variant="raised"
                                                            className="text-white "
                                                            onClick={() => this.applyFilter()}
                                                            disabled={
                                                                this.state.pair !== '' ||
                                                                    this.state.UserId !== '' ||
                                                                    this.state.WalletType !== ''
                                                                    ? false
                                                                    : true
                                                            }
                                                        >
                                                            <IntlMessages id="widgets.apply" />
                                                        </Button>
                                                        {this.state.showReset && (
                                                            <Button
                                                                className="btn-danger text-white ml-10"
                                                                onClick={e => this.clearFilter()}
                                                            >
                                                                <IntlMessages id="bugreport.list.dialog.button.clear" />
                                                            </Button>

                                                        )}
                                                    </div>
                                                </FormGroup>
                                            </Form>
                                        </div>
                                    </JbsCollapsibleCard>
                                </div>
                            )}
                            {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                            <Card className="m-10">
                                {/* <Scrollbars
									className="jbs-scroll"
									autoHeight
									autoHeightMin={200}
									autoHeightMax={580}
									autoHide
								> */}
                                <Table hover className="mb-0" responsive>
                                    <thead>
                                        <tr>
                                            <th width="13%">{<IntlMessages id="myaccount.patternsColumn.id" />}</th>
                                            <th width="13%">{<IntlMessages id="table.UserName" />}</th>
                                            <th width="13%">{<IntlMessages id="table.currency" />}</th>
                                            <th width="13%">{<IntlMessages id="table.ProfitAmount" />}</th>
                                            <th width="13%">{<IntlMessages id="table.AvgLandingBuy" />}</th>
                                            <th width="13%">{<IntlMessages id="table.AvgLandingSell" />}</th>
                                            <th width="13%">{<IntlMessages id="table.SettledQty" />}</th>
                                            <th width="13%">{<IntlMessages id="widgets.date" />}</th>
                                            <th width="13%">
                                                {
                                                    <IntlMessages id="liquidityprovider.list.column.label.action" />
                                                }
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ProfitLossReport.length > 0 ? (
                                            ProfitLossReport.map((item, key) => (
                                                <ProfitLossCollapse
                                                    key={key}
                                                    data={item}
                                                    onLoad={this.state.onLoad}
                                                />
                                            ))
                                        ) : (
                                                <tr className="text-center">
                                                    <td colSpan={8}>
                                                        <IntlMessages id="trading.market.label.nodata" />
                                                    </td>
                                                </tr>
                                            )}
                                    </tbody>
                                </Table>
                                {/* </Scrollbars> */}
                            </Card>
                        </div>
                        {this.state.TotalCount > AppConfig.totalRecordDisplayInList &&
                            <Row>
                                <Col md={5} className="mt-20">
                                </Col>
                                <Col md={4} className="text-right">
                                    <div id="pagination_div">
                                        <Pagination className="pagination"
                                            activePage={this.state.PageNo}
                                            itemsCountPerPage={this.state.PageSize}
                                            totalItemsCount={this.state.TotalCount}
                                            pageRangeDisplayed={5}
                                            onChange={this.handlePageChange}
                                            prevPageText='<'
                                            nextPageText='>'
                                            firstPageText='<<'
                                            lastPageText='>>'
                                        />
                                    </div>
                                </Col>
                                <Col md={3} className="text-right mt-20">
                                    <span>{this.state.PageNo > 1 ? (this.state.start_row) + (this.state.PageSize * (this.state.PageNo - 1)) + ' - ' + ((this.state.PageSize * this.state.PageNo) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.PageSize * this.state.PageNo)) : (this.state.start_row) + ' - ' + ((this.state.PageSize * this.state.PageNo) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.PageSize * this.state.PageNo))} of {this.state.TotalCount} Records</span>
                                </Col>
                            </Row>
                        }
                    </div>
                </Scrollbars>
            </Fragment>
        );
    }
}
//class for collapsible data
class ProfitLossCollapse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            MasterID: null
        };
    }

    //On collapse project description
    OnCollapseProject() {
        this.setState({
            collapse: !this.state.collapse
        });
    }

    componentWillUnmount() {
        this.setState({
            collapse: false
        })
    }
    //redner for collapsible data
    render() {
        const { data } = this.props;
        const { collapse } = this.state;
        return (
            <Fragment>
                <tr >
                    <td>{data.ID}</td>
                    <td>{data.UserName}</td>
                    <td>{data.ProfitCurrencyName}</td>
                    <td>{parseFloat(data.ProfitAmount).toFixed(8)}</td>
                    <td>{parseFloat(data.AvgLandingBuy).toFixed(8)}</td>
                    <td>{parseFloat(data.AvgLandingSell).toFixed(8)}</td>
                    <td>{data.SettledQty}</td>
                    <td>{changeDateFormat(data.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</td>
                    <td className="list-action">
                        <a
                            href="javascript:void(0)"
                            onClick={() => this.OnCollapseProject()}
                        >
                            {collapse ? <i className="zmdi zmdi-chevron-up dropdown-icon mx-4" /> : <i className="zmdi zmdi-chevron-down dropdown-icon mx-4" />}
                        </a>
                    </td>
                </tr>
                {collapse && (
                    <Fragment>
                        <tr className="text-center">
                            <td colSpan={8}>
                                <Table hover className="mb-0 tradetable">
                                    <thead>
                                        <tr>
                                            <th width="14.28%">{<IntlMessages id="table.trnNo" />}</th>
                                            <th width="14.28%">{<IntlMessages id="table.pairname" />}</th>
                                            <th width="14.28%">{<IntlMessages id="wallet.orderType" />}</th>
                                            <th width="14.28%">{<IntlMessages id="components.quantity" />}</th>
                                            <th width="14.28%">{<IntlMessages id="table.BidPrice" />}</th>
                                            <th width="14.28%">{<IntlMessages id="table.landingprice" />}</th>
                                            <th width="14.28%">{<IntlMessages id="widgets.date" />}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.DetailedData.map((subitem, i) => {
                                            return [
                                                <tr key={i} className="tradeexpansion">
                                                    <td>{subitem.TrnNo}</td>
                                                    <td>{subitem.PairName}</td>
                                                    <td>{subitem.OrderType}</td>
                                                    <td>{subitem.Qty}</td>
                                                    <td>{parseFloat(subitem.BidPrice).toFixed(8)}</td>
                                                    <td>{parseFloat(subitem.LandingPrice).toFixed(8)}</td>
                                                    <td>{changeDateFormat(subitem.TrnDate, 'YYYY-MM-DD', false)}</td>
                                                </tr>
                                            ];
                                        })}
                                    </tbody>
                                </Table>
                            </td>
                        </tr>
                    </Fragment>
                )}
            </Fragment>
        );
    }
}
const mapStateToProps = ({ ProfitLoassReducer, tradeRecon, actvHstrRdcer, walletUsagePolicy, authTokenRdcer }) => {

    const { loading, ProfitLossReport, TotalCount } = ProfitLoassReducer;
    const { getUser } = actvHstrRdcer;
    const { pairList } = tradeRecon;
    const { walletType } = walletUsagePolicy;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { loading, ProfitLossReport, pairList, getUser, walletType, TotalCount, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getProfitLossList,
    getTradePairs,
    getUserDataList,
    getWalletType,
    getMenuPermissionByID
})(injectIntl(ProfitLossReport));
