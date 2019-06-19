/*
    Developer : Parth Andhariya
    Date : 23-04-2019
    File Comment : Open Position report component
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
import { getOpenPositionReportList } from "Actions/MarginTrading/OpenPositionReport";
// import pairlist data action 
import { getTradePairs } from "Actions/TradeRecon";
import { getUserDataList } from "Actions/MyAccount";
import { changeDateFormat } from "Helpers/helpers";
//custom footer from widgets
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
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
        title: <IntlMessages id="wallet.OpenPositionReport" />,
        link: '',
        index: 1
    },
];

class OpenPositionReport extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.handleChange = this.handleChange.bind(this);
    }
    //will mount fetch data...
    componentWillMount() {
        this.props.getMenuPermissionByID('4BF9E8B0-7537-1A4A-05AC-7DD2FB8D695D'); // get wallet menu permission
        // this.props.getUserDataList();
        // this.props.getTradePairs({ IsMargin: 1 });
        // this.props.getOpenPositionReportList({});
    }
    componentWillReceiveProps(nextprops) {
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                this.props.getUserDataList();
                this.props.getTradePairs({ IsMargin: 1 });
                this.props.getOpenPositionReportList({});
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
    //set state for input types
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    // apply filter 
    applyFilter() {
        if (this.state.pair !== '' || this.state.UserId !== '') {
            this.props.getOpenPositionReportList({
                PairId: this.state.pair,
                UserID: this.state.UserId
            });
            this.setState({ showReset: true });
        }
    }
    //reset filter 
    clearFilter() {
        this.setState(initState);
        this.props.getOpenPositionReportList({});
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
        const { drawerClose, Report, intl } = this.props;
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('EFBCEFCC-47DF-551F-4130-FB970D4F77C6'); //EFBCEFCC-47DF-551F-4130-FB970D4F77C6
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <Fragment >
                <Scrollbars
                    className="jbs-scroll"
                    autoHide
                    autoHideDuration={100}
                    style={{ height: 'calc(100vh - 100px)' }}
                >
                    <div className="jbs-page-content">
                        <WalletPageTitle title={<IntlMessages id="wallet.OpenPositionReport" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                        <div className="StackingHistory">
                             {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && // check for filter permission */}
                            <div className="col-md-12">
                                <JbsCollapsibleCard>
                                    <div className="top-filter">
                                        <Form className="tradefrm row">
                                            <FormGroup className="col-md-2 col-sm-4">
                                                <Label for="Select-1">{<IntlMessages id="wallet.lblUserId" />}</Label>
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
                                            <FormGroup className="col-md-2 col-sm-4">
                                                <Label for="ServiceProviderID"><IntlMessages id="sidebar.tradingLedger.filterLabel.currencyPair" /></Label>
                                                <Input type="select" name="pair" id="pair" value={this.state.pair} onChange={this.handleChange}>
                                                    <option value="">{intl.formatMessage({ id: "tradingLedger.selectCurrencyPair.all" })}</option>
                                                    {this.props.pairList.length && this.props.pairList.map((item, key) => (
                                                        <option value={item.PairId} key={key}>{item.PairName}</option>
                                                    ))}
                                                </Input>
                                            </FormGroup>
                                            <FormGroup className="col-md-2 col-sm-4">
                                                <div className="btn_area m-0">
                                                    <Label className="d-block">&nbsp;</Label>
                                                    <Button
                                                        color="primary"
                                                        variant="raised"
                                                        className="text-white"
                                                        onClick={() => this.applyFilter()}
                                                        disabled={(this.state.pair !== '' || this.state.UserId !== '') ? false : true}
                                                    ><IntlMessages id="widgets.apply" /></Button>
                                                    {this.state.showReset &&
                                                        <Button className="btn-danger text-white ml-10" onClick={(e) => this.clearFilter()}>
                                                            <IntlMessages id="bugreport.list.dialog.button.clear" />
                                                        </Button>}
                                                </div>
                                            </FormGroup>
                                        </Form>
                                    </div>
                                </JbsCollapsibleCard>
                            </div>
                             } 
                            {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                            <Card className="m-10" >
                                <Table hover className="mb-0" responsive>
                                    <thead>
                                        <tr>
                                            <th width="13%">{<IntlMessages id="myaccount.patternsColumn.id" />}</th>
                                            <th width="13%">{<IntlMessages id="tradingLedger.tableHeading.userID" />}</th>
                                            <th width="13%">{<IntlMessages id="table.UserName" />}</th>
                                            <th width="13%">{<IntlMessages id="table.pairname" />}</th>
                                            <th width="13%">{<IntlMessages id="widgets.date" />}</th>
                                            <th width="13%">{<IntlMessages id="liquidityprovider.list.column.label.action" />}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Report.length > 0 ?
                                            Report.map((item, key) => (
                                                <TradeSummaryCollapse key={key} data={item} onLoad={this.state.onLoad} />
                                            ))
                                            :
                                            <tr className="text-center">
                                                <td colSpan={8}>
                                                    <IntlMessages id="trading.market.label.nodata" />
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </Table>
                            </Card>
                        </div>
                    </div>
                </Scrollbars>
            </Fragment>
        );
    }
}
//class for collapsible data
class TradeSummaryCollapse extends Component {
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
                    <td>{data.MasterID}</td>
                    <td>{data.UserID}</td>
                    <td>{data.UserName}</td>
                    <td>{data.PairName}</td>
                    <td>{changeDateFormat(data.TrnDate, 'YYYY-MM-DD HH:mm:ss', false)}</td>
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
const mapStateToProps = ({ OpenPositionReport, tradeRecon, actvHstrRdcer, authTokenRdcer }) => {
    const { loading, Report } = OpenPositionReport;
    const { getUser } = actvHstrRdcer;
    const { pairList } = tradeRecon;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { loading, Report, pairList, getUser, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getOpenPositionReportList,
    getTradePairs,
    getUserDataList,
    getMenuPermissionByID
})(injectIntl(OpenPositionReport));
