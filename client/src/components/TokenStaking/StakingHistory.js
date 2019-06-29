/* 
    Developer : Nishant Vadgama
    Date : 21-09-2018
    File Comment : Staking history component model
*/
import React from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import { FormGroup, Label, Input, Button } from "reactstrap";
// import component for Card Design
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { changeDateFormat } from "Helpers/helpers";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import { Table } from 'reactstrap';
import { injectIntl } from 'react-intl';
import classnames from "classnames";
import { NotificationManager } from 'react-notifications';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Tooltip from "@material-ui/core/Tooltip";
import validator from "validator";
import {
    getSlabList,
} from "Actions/TokenStaking";
import {
    getStakHistory,
    getUnstakingPreConfirmation,
    postUnstakRequest,
} from "Actions/TokenStaking";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import AppConfig from 'Constants/AppConfig';
import { CustomFooter } from 'Components/MyAccount/Widgets';
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
const initState = {
    StatkingTypeID: "1",
    FromDate: "",
    ToDate: "",
    Type: "",
    Slab: "",
    StakingType: "",
    totalCount: 0,
    Page: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    showReset: false,
    showDialog: false,
    rowDetails: {},
    showDialogforUnstaking: false,
    StakingHistoryId: "",
    showModal: false,
    AvailableAmount: "",
    StakingAmount: "",
    editDetail: {},
    item: {},
    CurrencyTypeID: "",
    CurrencyTypeName: null,
    errors: "",
    Max: "",
    Min: "",
    notificationflag: false,
    Today: new Date().toISOString().slice(0, 10),
}

// staking history
class StakingHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    //will mount fetch data before load...
    componentWillMount() {
        this.getListFromServer(1, this.state.PageSize);
    }
    //Pagination Change Method...
    handlePageChange(pageNumber) {
        this.getListFromServer(pageNumber);
    }
    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListFromServer(1, event.target.value);
    };
    getListFromServer = (Page, PageSize) => {
        var newObj = Object.assign({}, this.state);
        newObj['Page'] = Page > 0 ? Page : this.state.Page;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.PageSize;
        }
        this.setState(newObj);
        //For Action API...
        var reqObj = newObj;
        reqObj.Page = Page > 0 ? Page - 1 : 1;
        this.props.getStakHistory(reqObj);
    }
    //on change props...
    componentWillReceiveProps(nextProps) {
        // changed total count...
        if (this.state.totalCount != nextProps.totalCount) {
            this.setState({ totalCount: nextProps.totalCount })
        }
        // unstaking pre confirmation
        if (nextProps.unstakPreconfirmationDetails.hasOwnProperty("ReturnCode") && this.state.notificationflag) {
            this.setState({ notificationflag: false });
            if (nextProps.unstakPreconfirmationDetails.ReturnCode === 1) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.unstakPreconfirmationDetails.ErrorCode}`} />);
            } else if (nextProps.unstakPreconfirmationDetails.ReturnCode === 0) {
                NotificationManager.success(<IntlMessages id={"wallet.tokenstakingPartialSuccess"} />);
                this.setState({
                    showModal: false,
                    errors: "",
                    ...initState
                });
            }
        }
        // unstaking pre confirmation
        if (nextProps.unstakResponse.hasOwnProperty("ReturnCode") &&
            nextProps.unstakResponse.ReturnCode === 1) {
            NotificationManager.error(nextProps.unstakResponse.ReturnMsg);
        } else if (nextProps.unstakResponse.hasOwnProperty("ReturnCode") && nextProps.unstakResponse.ReturnCode === 0) {
            this.setState({ showModal: false, });
            NotificationManager.success(nextProps.unstakResponse.ReturnMsg);
            this.props.getStakHistory({
                PageSize: this.state.PageSize,
                Page: this.state.Page
            });
        }
    }
    // change date filter...
    onChangeDate(e, key) {
        e.preventDefault();
        this.setState({ [key]: e.target.value });
    }
    // get history on filter apply...
    getHistoryData(e) {
        e.preventDefault();
        this.setState({ showReset: true },this.getListFromServer(1, this.state.PageSize));
    }
    //clear filter
    clearFilter = () => {
        this.setState(initState,() => this.getListFromServer(1, this.state.PageSize));
    }
    // view more
    viewMore(row) {
        this.setState({
            rowDetails: row,
            showDialog: true,
        })
    }
    // unstak request
    unstack(item) {
        this.setState({ showDialogforUnstaking: false })
        this.props.postUnstakRequest({
            StakingHistoryId: item.StakingHistoryId,
            Type: 1, // Full = 1,Partial = 2
            StakingPolicyDetailId: 0,
            StakingAmount: 0,
            ChannelId: 21,
        });
    }
    //Unstak Partially
    unstackPartial() {
        this.setState({ showModal: false, notificationflag: true })
        this.props.getUnstakingPreConfirmation({
            StakingHistoryId: this.state.StakingHistoryId,
            UnstakingType: 2, // Full = 1,Partial = 2
            DegradePolicyDetailID: parseFloat(this.state.editDetail.PolicyDetailID),
            Amount: parseFloat(this.state.editDetail.AvailableAmount),
            ChannelId: 21,
        });
    }
    toggleShowModal(item) {
        this.setState({
            showModal: !this.state.showModal,
            showDialogforUnstaking: false,
            AvailableAmount: item.AvailableAmount,
            PolicyDetailID: item.PolicyDetailID,
            StakingAmount: item.StakingAmount,
            errors: "",
            editDetail: {
                StakingType: item.StakingType.toString(),
                StakingCurrency: item.StakingCurrency,
                StakingAmount: item.StakingAmount,
                WalletName: item.WalletName,
                PolicyDetailID: item.PolicyDetailID.toString(),
                AvailableAmount: item.StakingAmount,
            },
        });
        this.props.getSlabList({
            StatkingTypeID: item.StakingType,
            CurrencyTypeID: item.WalletTypeID
        });
    }
    // close model...
    toggleShowConfirmModal = () => {
        this.setState({
            showModal: !this.state.showModal,
            errors: "",
            ...initState
        });
    }
    onblur(e) {
        var PolicyDetails = this.props.planlist;
        var p = this.state.editDetail.PolicyDetailID
        PolicyDetails = PolicyDetails.filter(function (planlist) {
            return planlist.PolicyDetailID == p;
        })
        var MinAmount = PolicyDetails[0].MinAmount
        var MaxAmount = PolicyDetails[0].MaxAmount
        if (parseFloat(MinAmount) >= parseFloat(e) || parseFloat(MaxAmount) <= parseFloat(e)) {
            this.setState({ errors: "wallet.errWDInvalidAmount" })
        } else if (parseFloat(this.state.editDetail.StakingAmount) < parseFloat(e)) {
            this.setState({ errors: "wallet.degradeerrors" })
        } else {
            this.setState({
                errors: "",
            })
        }
        this.setState({
            Min: MinAmount,
            Max: MaxAmount
        })
    }
    onChangeHanlder1(key, value) {
        if (validator.isNumeric(value, { no_symbols: true }) || value === "") {
            this.setState({
                editDetail: {
                    ...this.state.editDetail,
                    [key]: value,
                }
            })
        }
    }
    onChangeHanlder(key, value) {
        var PolicyDetail = this.props.planlist;
        PolicyDetail = PolicyDetail.filter(function (planlist) {
            return planlist.PolicyDetailID == value;
        })
        var MinAmount = PolicyDetail[0].MinAmount
        var MaxAmount = PolicyDetail[0].MaxAmount
        if (parseFloat(MinAmount) >= parseFloat(this.state.editDetail.AvailableAmount) || parseFloat(MaxAmount) <= parseFloat(this.state.editDetail.AvailableAmount)) {
            this.setState({ errors: "wallet.errWDInvalidAmount" })
        } else {
            this.setState({
                errors: "",
            })
        }
        this.setState({
            PolicyDetailID: this.state.PolicyDetailID,
            AvailableAmount: this.state.AvailableAmount,
            StakingAmount: this.state.StakingAmount,
            editDetail: {
                PolicyDetailID: PolicyDetail.PolicyDetailID,
                ...this.state.editDetail,
                [key]: value,
            },
            Min: MinAmount,
            Max: MaxAmount
        });
    }
    render() {
        const { showModal } = this.state;
        const intl = this.props.intl;
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.tableSr" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "wallet.StakingType" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "wallet.slabtype" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "trading.holdingorder.label.currency" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "wallet.DWTableAmount" }),
                options: {
                    filter: false, sort: false, tooltip: {
                        split: true
                    },
                }
            },
            {
                name: intl.formatMessage({ id: "wallet.MaturityDate" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "wallet.DWTableStatus" }),
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === intl.formatMessage({ id: "wallet.stakingStatus.0" })),
                                "badge badge-success": (value === intl.formatMessage({ id: "wallet.stakingStatus.1" })),
                                "badge badge-warning": (value === intl.formatMessage({ id: "wallet.stakingStatus.4" })),
                                "badge badge-info": (value === intl.formatMessage({ id: "wallet.stakingStatus.5" })),
                                "badge badge-secondary": (value === intl.formatMessage({ id: "wallet.stakingStatus.9" })),
                            })} >
                                {value}
                            </span>
                        );
                    }
                }
            },
            {
                name: intl.formatMessage({ id: "widgets.action" }),
                options: { filter: false, sort: false }
            },
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            // rowsPerPageOptions: [10, 25, 50, 100],
            serverSide: true,
            page: this.state.Page,
            rowsPerPage: this.state.PageSize,
            count: this.state.totalCount,
            print: false,
            download: false,
            viewColumns: false,
            filter: false,
            search: false,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customFooter: (count, page, rowsPerPage) => {
                var page1 = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
        };
        return (
            <JbsCollapsibleCard
                colClasses="col-sm-12 col-md-12 col-xl-12"
                heading={<IntlMessages id="wallet.CTHistoryTitle" />}
                fullBlock
            >
                <div className="row">
                    <div className="col-md-12">
                        <div className="row top-filter clearfix px-20 pb-20 token Stacking-search">
                            <FormGroup className="mb-0 pb-15 col-md-2">
                                <Label for="FromDate"><IntlMessages id="widgets.startDate" /></Label>
                                <Input
                                    type="date"
                                    name="FromDate"
                                    id="FromDate"
                                    placeholder="dd/mm/yyyy"
                                    value={this.state.FromDate}
                                    max = {this.state.Today}
                                    onChange={e => this.onChangeDate(e, "FromDate")}
                                />
                            </FormGroup>
                            <FormGroup className="mb-0 pb-15 col-md-2">
                                <Label for="ToDate"><IntlMessages id="widgets.endDate" /></Label>
                                <Input
                                    type="date"
                                    name="ToDate"
                                    id="ToDate"
                                    placeholder="dd/mm/yyyy"
                                    value={this.state.ToDate}
                                    max = {this.state.Today}
                                    onChange={e => this.onChangeDate(e, "ToDate")}
                                />
                            </FormGroup>
                            {/* <FormGroup className="w-10 mb-0 pb-15">
                                <Label for="Type"><IntlMessages id="sidebar.type" /></Label>
                                <Input type="select" name="Type" id="Type" value={this.state.Type} onChange={(e) => this.onChangeDate(e, 'Type')}>
                                    <IntlMessages id="wallet.TSSelectType">
                                        {(optionValue) => <option value="">{optionValue}</option>}
                                    </IntlMessages>
                                    <IntlMessages id="wallet.Staking">
                                        {(optionValue) => <option value="1">{optionValue}</option>}
                                    </IntlMessages>
                                    <IntlMessages id="wallet.Unstaking">
                                        {(optionValue) => <option value="2">{optionValue}</option>}
                                    </IntlMessages>
                                </Input>
                            </FormGroup> */}
                            <FormGroup className="mb-0 pb-15 col-md-2">
                                <Label for="Slab"><IntlMessages id="wallet.slab" /></Label>
                                <Input type="select" name="Slab" id="Slab" value={this.state.Slab} onChange={(e) => this.onChangeDate(e, 'Slab')}>
                                    <IntlMessages id="wallet.TSSelectSlabtype">
                                        {(optionValue) => <option value="">{optionValue}</option>}
                                    </IntlMessages>
                                    <IntlMessages id="wallet.Range">
                                        {(optionValue) => <option value="2">{optionValue}</option>}
                                    </IntlMessages>
                                    <IntlMessages id="wallet.Fixed">
                                        {(optionValue) => <option value="1">{optionValue}</option>}
                                    </IntlMessages>
                                </Input>
                            </FormGroup>
                            <FormGroup className="mb-0 pb-15 col-md-2">
                                <Label for="StakingType"><IntlMessages id="wallet.StakingType" /></Label>
                                <Input type="select" name="StakingType" id="StakingType" value={this.state.StakingType} onChange={(e) => this.onChangeDate(e, 'StakingType')}>
                                    <IntlMessages id="wallet.TSSelectstakingType">
                                        {(optionValue) => <option value="">{optionValue}</option>}
                                    </IntlMessages>
                                    <IntlMessages id="wallet.FixedDeposit">
                                        {(optionValue) => <option value="1">{optionValue}</option>}
                                    </IntlMessages>
                                    <IntlMessages id="wallet.Charge">
                                        {(optionValue) => <option value="2">{optionValue}</option>}
                                    </IntlMessages>
                                </Input>
                            </FormGroup>
                            <FormGroup className="mb-15 col-md-1">
                                <Label className="d-block">&nbsp;</Label>
                                <Button
                                    // color="primary"
                                    className="border-0 rounded-0 perverbtn"
                                    onClick={e => this.getHistoryData(e)}
                                >
                                    <IntlMessages id="widgets.apply" />
                                </Button>
                            </FormGroup>
                            {this.state.showReset && <FormGroup className="mb-15 col-md-1">
                                <Label className="d-block">&nbsp;</Label>
                                <Button  className="border-0 btn-danger rounded-0" onClick={(e) => this.clearFilter()}>
                                    <IntlMessages id="button.clear" />
                                </Button>
                            </FormGroup>}
                        </div>
                    </div>
                </div>
                {this.props.showLoading && <JbsSectionLoader />}
                <div className={this.props.darkMode ? 'DepositWithdrawHistory-darkmode' : 'DepositWithdrawHistory'}>
                    <MUIDataTable
                        data={this.props.stakHistoryList.map((item, key) => {
                            return [
                                key + 1+ (this.state.Page * this.state.PageSize),
                                item.StakingType === 1 ? <IntlMessages id="wallet.FixedDeposit" /> : <IntlMessages id="wallet.Charge" />,
                                item.SlabType === 1 ? <IntlMessages id="wallet.Fixed" /> : <IntlMessages id="wallet.Range" />,
                                item.StakingCurrency,
                                parseFloat(item.StakingAmount).toFixed(8),
                                changeDateFormat(item.MaturityDate, 'YYYY-MM-DD', false),
                                intl.formatMessage({ id: "wallet.stakingStatus." + item.Status }),
                                <div className="list-action">
                                    <a
                                        href="javascript:void(0)"
                                        onClick={e => this.viewMore(item)}
                                    >
                                        <i className="ti-eye" />
                                    </a>
                                    {item.Status == 1 ?
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.setState({ showDialogforUnstaking: true, item: item, StakingHistoryId: item.StakingHistoryId })}
                                        >
                                            <i className="ti-unlock" />
                                        </a> : ""}
                                </div>
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
                <Modal isOpen={showModal}>
                    <ModalHeader toggle={this.toggleShowConfirmModal} ><IntlMessages id="wallet.PartialUnstaking" /></ModalHeader>
                    {this.props.showLoading && <JbsSectionLoader />}
                    <ModalBody>
                        <div className="col-sm-12 col-md-12 col-xl-12 d-inline-flex p-0 mb-10">
                            <div className="col-sm-3 col-md-3 col-xl-3 p-0">
                                <h5 className="pt-10">
                                    {<IntlMessages id="trading.holdingorder.label.currency" />}
                                </h5>
                            </div>
                            <div className=" col-sm-9 col-md-9 col-xl-9 pr-0">
                                <Input
                                    type="text"
                                    name="StakingCurrency"
                                    id="StakingCurrency"
                                    value={this.state.editDetail.StakingCurrency}
                                    disabled
                                >
                                </Input>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-xl-12 d-inline-flex p-0 mb-10">
                            <div className="col-sm-3 col-md-3 col-xl-3 p-0">
                                <h5 className="pt-15">
                                    {<IntlMessages id="wallet.TSSelectedType" />}
                                </h5>
                            </div>
                            <div className=" col-sm-9 col-md-9 col-xl-9 pr-0">
                                <RadioGroup
                                    row
                                    aria-label="type"
                                    name="type"
                                    value={this.state.editDetail.StakingType}
                                    disabled
                                >
                                    <FormControlLabel
                                        value="1"
                                        control={<Radio />}
                                        label={<IntlMessages id="wallet.FixedDeposit" />}
                                        disabled />
                                    <FormControlLabel
                                        value="2"
                                        control={<Radio />}
                                        label={<IntlMessages id="wallet.Charge" />}
                                        disabled />
                                </RadioGroup>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-xl-12 d-inline-flex p-0 mb-10">
                            <div className="col-sm-3 col-md-3 col-xl-3 p-0">
                                <h5 className="pt-10">
                                    {<IntlMessages id="wallet.WDSelectedWallet" />}
                                </h5>
                            </div>
                            <div className=" col-sm-9 col-md-9 col-xl-9 pr-0">
                                <Input
                                    type="text"
                                    name="WalletName"
                                    id="WalletName"
                                    value={this.state.editDetail.WalletName}
                                    disabled
                                >
                                </Input>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-xl-12 d-inline-flex p-0 mb-10">
                            <div className="col-sm-3 col-md-3 col-xl-3 p-0">
                                <h5 className="pt-10">
                                    <IntlMessages id="wallet.selectPlan" />&nbsp;
                                    <Tooltip title={<IntlMessages id="tokenstaking.tooltip.Amount" />}>
                                        <a href="javascript:void(0)" className="mr-10"
                                        ><i className="zmdi zmdi-alert-circle" />
                                        </a>
                                    </Tooltip>
                                </h5>
                            </div>
                            <div className=" col-sm-9 col-md-9 col-xl-9 pr-0">
                                <Input
                                    type="select"
                                    name="PolicyDetailID"
                                    id="PolicyDetailID"
                                    value={this.state.editDetail.PolicyDetailID}
                                    onChange={(e) => this.onChangeHanlder("PolicyDetailID", e.target.value)}
                                >
                                    <option value="">
                                        {<IntlMessages id="wallet.selectPlan" />}
                                    </option>
                                    {this.props.planlist.map((item, key) => (
                                        <option
                                            disabled={parseFloat(item.AvailableAmount) >= parseFloat(this.state.AvailableAmount)}
                                            value={item.PolicyDetailID} key={key}>
                                            {item.AvailableAmount}
                                        </option>
                                    ))}
                                </Input>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-xl-12 d-inline-flex p-0 mb-10">
                            <div className="col-sm-3 col-md-3 col-xl-3 p-0">
                                <h5 className="pt-10">
                                    {<IntlMessages id="wallet.CTAmount" />}
                                </h5>
                            </div>
                            <div className=" col-sm-9 col-md-9 col-xl-9 pr-0">
                                <Input
                                    type="text"
                                    name="amount"
                                    id="amount"
                                    value={this.state.editDetail.AvailableAmount}
                                    onChange={(e) => this.onChangeHanlder1("AvailableAmount", e.target.value)}
                                    onBlur={(e) => this.onblur(e.target.value)}
                                >
                                </Input>
                                {this.state.errors && (
                                    <span className="text-danger">
                                        {intl.formatMessage({ id: this.state.errors })}
                                    </span>
                                )}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            // color="primary"
                            className={"mr-10 border-0 rounded-0 perverbtn"}
                            disabled={(this.state.StakingAmount == this.state.editDetail.AvailableAmount) || (parseFloat(this.state.editDetail.PolicyDetailID) == parseFloat(this.state.PolicyDetailID)) || (this.state.errors !== "")}
                            onClick={() => this.unstackPartial()}><IntlMessages id="wallet.btnConfirm" /></Button>{' '}
                        <Button
                            color="danger"
                            className="mr-10 border-0 rounded-0 "
                            onClick={this.toggleShowConfirmModal}><IntlMessages id="button.cancel" /></Button>
                    </ModalFooter>
                </Modal>
                <Dialog
                    style={{ zIndex: '99999' }}
                    open={this.state.showDialogforUnstaking}
                    onClose={() => this.setState({ showDialogforUnstaking: false })}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        <div className="list-action justify-content-between d-flex">
                            <IntlMessages id="wallet.staking.confirmationTile" />
                            <a
                                href="javascript:void(0)"
                                onClick={() => this.setState({ showDialogforUnstaking: false })}
                            >
                                <i className="ti-close" />
                            </a>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {this.state.item.StakingType === 2 ? <IntlMessages id="global.unstaking.message" /> : <IntlMessages id="wallet.staking.confirmation" />}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.unstack(this.state.item)}  className={"mr-10 border-0 rounded-0 perverbtn"} autoFocus>
                            <IntlMessages id="button.yes" />
                        </Button>
                        {this.state.item.StakingType === 2 ?
                            <Button
                                onClick={() => this.toggleShowModal(this.state.item)}
                                color="danger"
                                className={"mr-10 border-0 rounded-0 "}>
                                <IntlMessages id="button.No" />
                            </Button> :
                            <Button
                                onClick={() => this.setState({ showDialogforUnstaking: false })}
                                color="danger"
                                className={"mr-10 border-0 rounded-0 "}>
                                <IntlMessages id="button.No" />
                            </Button>
                        }
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.showDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth
                    maxWidth='md'
                    onClose={(e) => this.setState({ showDialog: false })}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        <div className="list-action justify-content-between d-flex">
                            {<IntlMessages id="wallet.stakingDetails" />}
                            <a
                                href="javascript:void(0)"
                                onClick={(e) => this.setState({ showDialog: false })}
                            >
                                <i className="ti-close" />
                            </a>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {this.state.rowDetails.hasOwnProperty("PolicyDetailID") && <div className="row">
                                <div className="col-sm-6 p-0">
                                    <Table bordered className="mb-0">
                                        <tbody>
                                            <tr>
                                                <td className="w-50 font-sm"><IntlMessages id="wallet.StakingType" /></td>
                                                <td className="w-50 font-sm">{this.state.rowDetails.StakingType === 1 ? <IntlMessages id="wallet.FixedDeposit" /> : <IntlMessages id="wallet.Charge" />}</td>
                                            </tr>
                                            <tr>
                                                <td className="w-50 font-sm"><IntlMessages id="wallet.StakingCurrency" /></td>
                                                <td className="w-50 font-sm">{this.state.rowDetails.StakingCurrency}</td>
                                            </tr>
                                            <tr>
                                                <td className="w-50 font-sm"><IntlMessages id="wallet.duration" /></td>
                                                <td className="w-50 font-sm">
                                                    {this.state.rowDetails.DurationMonth} <IntlMessages id="wallet.Months" />, {this.state.rowDetails.DurationWeek} <IntlMessages id="wallet.Weeks" />
                                                </td>
                                            </tr>
                                            {this.state.rowDetails.StakingType === 1 && <React.Fragment>
                                                <tr>
                                                    <td className="w-50 font-sm"><IntlMessages id="wallet.interestType" /></td>
                                                    <td className="w-50 font-sm">{this.state.rowDetails.InterestTypeName}</td>
                                                </tr>
                                                <tr>
                                                    <td className="w-50 font-sm"><IntlMessages id="wallet.MaturityCurrency" /></td>
                                                    <td className="w-50 font-sm">{this.state.rowDetails.MaturityCurrency}</td>
                                                </tr>
                                                <tr>
                                                    <td className="w-50 font-sm"><IntlMessages id="wallet.EnableStakingBeforeMaturity" /></td>
                                                    <td className="w-50 font-sm">{this.state.rowDetails.EnableStakingBeforeMaturity ? <IntlMessages id="sidebar.yes" /> : <IntlMessages id="sidebar.no" />}</td>
                                                </tr>
                                                <tr>
                                                    <td className="w-50 font-sm"><IntlMessages id="wallet.MaturityDate" /></td>
                                                    <td className="w-50 font-sm">{changeDateFormat(this.state.rowDetails.MaturityDate, 'YYYY-MM-DD HH:mm:ss')}</td>
                                                </tr>
                                            </React.Fragment>}
                                            {this.state.rowDetails.StakingType === 2 && <tr>
                                                <td className="w-50 font-sm"><IntlMessages id="trading.placeorder.label.makerscharge" /></td>
                                                <td className="w-50 font-sm">{parseFloat(this.state.rowDetails.MakerCharges).toFixed(8)}</td>
                                            </tr>}
                                            <tr>
                                                <td className="w-50 font-sm"><IntlMessages id="wallet.RenewUnstakingEnable" /></td>
                                                <td className="w-50 font-sm">{this.state.rowDetails.RenewUnstakingEnable ? <IntlMessages id="sidebar.yes" /> : <IntlMessages id="sidebar.no" />}</td>
                                            </tr>
                                            <tr>
                                                <td className="w-50 font-sm"><IntlMessages id="wallet.AmountCredited" /></td>
                                                <td className="w-50 font-sm">{parseFloat(this.state.rowDetails.AmountCredited).toFixed(8)}</td>
                                            </tr>

                                        </tbody>
                                    </Table>
                                </div>
                                <div className="col-sm-6 p-0">
                                    <Table bordered className="mb-0">
                                        <tbody>
                                            <tr>
                                                <td className="w-50 font-sm"><IntlMessages id="wallet.slabtype" /></td>
                                                <td className="w-50 font-sm">{this.state.rowDetails.SlabType === 1 ? <IntlMessages id="wallet.Fixed" /> : <IntlMessages id="wallet.Range" />}</td>
                                            </tr>
                                            <tr>
                                                <td className="w-50 font-sm"><IntlMessages id="wallet.StakingAmount" /></td>
                                                <td className="w-50 font-sm">{parseFloat(this.state.rowDetails.StakingAmount).toFixed(8)}</td>
                                            </tr>
                                            <tr>
                                                <td className="w-50 font-sm"><IntlMessages id="widgets.status" /></td>
                                                <td className="w-50 font-sm">
                                                    <span className={classnames({
                                                        "badge badge-danger": (this.state.rowDetails.Status === 0),
                                                        "badge badge-success": (this.state.rowDetails.Status === 1),
                                                        "badge badge-warning": (this.state.rowDetails.Status === 4),
                                                        "badge badge-info": (this.state.rowDetails.Status === 5),
                                                        "badge badge-secondary": (this.state.rowDetails.Status === 9),
                                                    })} >
                                                        <IntlMessages id={"wallet.stakingStatus." + this.state.rowDetails.Status} />
                                                    </span>
                                                </td>
                                            </tr>
                                            {this.state.rowDetails.StakingType === 2 && <tr>
                                                <td className="w-50 font-sm"><IntlMessages id="trading.placeorder.label.takerscharges" /></td>
                                                <td className="w-50 font-sm">{parseFloat(this.state.rowDetails.TakerCharges).toFixed(8)}</td>
                                            </tr>}
                                            {this.state.rowDetails.StakingType === 1 && <React.Fragment>
                                                <tr>
                                                    <td className="w-50 font-sm"><IntlMessages id="wallet.interest" /></td>
                                                    <td className="w-50 font-sm">{parseFloat(this.state.rowDetails.InterestValue).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="w-50 font-sm"><IntlMessages id="wallet.MaturityAmount" /></td>
                                                    <td className="w-50 font-sm">{parseFloat(this.state.rowDetails.MaturityAmount).toFixed(8)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="w-50 font-sm"><IntlMessages id="wallet.EnableStakingBeforeMaturityCharge" /></td>
                                                    <td className="w-50 font-sm">{this.state.rowDetails.EnableStakingBeforeMaturityCharge}</td>
                                                </tr>
                                            </React.Fragment>}
                                            <tr>
                                                <td className="w-50 font-sm"><IntlMessages id="wallet.EnableAutoUnstaking" /></td>
                                                <td className="w-50 font-sm">{this.state.rowDetails.EnableAutoUnstaking ? <IntlMessages id="sidebar.yes" /> : <IntlMessages id="sidebar.no" />}</td>
                                            </tr>
                                            <tr>
                                                <td className="w-50 font-sm"><IntlMessages id="wallet.RenewUnstakingPeriod" /></td>
                                                <td className="w-50 font-sm">{this.state.rowDetails.RenewUnstakingPeriod}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </div>}
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </JbsCollapsibleCard>
        );
    }
}

const mapDispatchToProps = ({ settings, tokenStakingReducer }) => {
    const { darkMode } = settings;
    const { planlist, planResponse, preConfirmationDetails, walletList, showLoading, stakHistoryList, totalCount, unstakPreconfirmationDetails, unstakResponse } = tokenStakingReducer;
    return { walletList, showLoading, stakHistoryList, totalCount, darkMode, unstakPreconfirmationDetails, unstakResponse, planlist, planResponse, preConfirmationDetails };
};

export default connect(mapDispatchToProps, {
    getStakHistory,
    getUnstakingPreConfirmation,
    postUnstakRequest,
    getSlabList,
})(injectIntl(StakingHistory));
