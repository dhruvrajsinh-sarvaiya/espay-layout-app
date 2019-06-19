/**
 *   Developer : Parth Andhariya
 *   Date : 05-03-2019
 *   Component: Leverge Report
*/
import React, { Component, Fragment } from 'react';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import classnames from "classnames";
import MUIDataTable from "mui-datatables";
import { changeDateFormat } from "Helpers/helpers";
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import IntlMessages from 'Util/IntlMessages';
import {
    getCurrency,
} from "Actions/Withdraw";
import Select from "react-select";
import {
    FormGroup,
    Label,
    Input,
    Button
} from "reactstrap";
import {
    getLeverageReportList,
    getUpgradeLoan
} from 'Actions/MarginTrading';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import { Table } from 'reactstrap';
import { NotificationManager } from 'react-notifications';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
const LeveragePer = [
    { label: "1X", value: "1" },
    { label: "2X", value: "2" },
    { label: "3X", value: "3" },
    { label: "4X", value: "4" },
    { label: "5X", value: "5" },
    { label: "6X", value: "6" },
    { label: "7X", value: "7" },
    { label: "8X", value: "8" },
    { label: "9X", value: "9" },
    { label: "10X", value: "10" },
];
const initState = {
    TotalCount: 0,
    WalletTypeId: "",
    WalletTypeObj: "",
    Status: "",
    PageSize: 10,
    PageNo: 0,
    FromDate: "",
    ToDate: "",
    today: new Date().toISOString().slice(0, 10),
    showReset: false,
    Report: "",
    showDialog: false,
    showModal: false,
    LeveragePer: "",
    editdetail: {},
    LoanId: "",
    flag: false,
    disableConfirm: true
}
class LeverageReport extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    componentWillMount() {
        this.props.getCurrency();
        this.props.getLeverageReportList({
            PageSize: this.state.PageSize,
            PageNo: this.state.PageNo,
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            TotalCount: nextProps.TotalCount,
        })
        if (nextProps.updateLoan.hasOwnProperty('ReturnCode') && this.state.flag) {
            this.setState({ flag: false });
            if (nextProps.updateLoan.ReturnCode === 0) {
                this.setState({
                    showModal: false,
                });
                NotificationManager.success(nextProps.updateLoan.ReturnMsg);
            } else if (nextProps.updateLoan.ReturnCode === 1) {
                NotificationManager.error(
                    <IntlMessages id={`apiWalletErrCode.${nextProps.updateLoan.ErrorCode}`} />
                );
            }
        }
    }
    /* apply filter */
    applyFilter() {
        if (this.state.Status !== '' || this.state.WalletTypeId !== '' || (this.state.FromDate != "" && this.state.ToDate != "" && this.state.FromDate <= this.state.today && this.state.ToDate <= this.state.today) && (this.state.ToDate >= this.state.FromDate)) {
            this.props.getLeverageReportList({
                PageSize: this.state.PageSize,
                PageNo: this.state.PageNo,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                Status: this.state.Status,
                WalletTypeId: this.state.WalletTypeId
            });
            this.setState({ showReset: true });
        }
    }
    /* reset filter options */
    clearFilter() {
        this.setState(initState);
        this.props.getLeverageReportList({
            PageSize: this.state.PageSize,
            PageNo: this.state.PageNo,
        });
    }
    /* on chane handler select search */
    onChangeSelectCurrency(e) {
        this.setState({ WalletTypeId: e.value, WalletTypeObj: { label: e.label } });
    }
    /* on change handler */
    onChangeHander(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    // on change for dates
    onChangeHandler(e, key) {
        e.preventDefault();
        this.setState({ [key]: e.target.value });
    }
    toggleShowModal(item) {
        this.setState({
            disableConfirm: true,
            LoanId: item.Id,
            showModal: !this.state.showModal,
            LeveragePer: item.LeveragePer,
            editdetail: {
                LeveragePer: item.LeveragePer
            }
        });
    }
    // close model...
    toggleShowConfirmModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    }
    /* on chane handler */
    onChangeleverage(key, value) {
        this.setState({
            disableConfirm: false,
            editdetail: {
                ...this.state.editdetail,
                [key]: value,
            },
        })
    }
    upgradeLoan() {
        this.setState({ flag: true })
        this.props.getUpgradeLoan({
            LoanID: this.state.LoanId,
            LeverageX: this.state.editdetail.LeveragePer
        });
    }
    render() {
        const { showModal } = this.state;
        const { intl, Report, loading } = this.props;
        var columns = [
            {
                name: intl.formatMessage({ id: "table.Id" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "table.WalletTypeName" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "table.LeverageAmount" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "table.LeveragePer" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "table.Status" }),
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === 3),
                                "badge badge-danger": (value === 9),
                                "badge badge-info": (value === 6 || value === 0 || value === 5),
                                //"badge badge-warning": (value === 4),
                                "badge badge-success": (value === 1)
                            })} >
                                {intl.formatMessage({ id: "margin.historyStatus." + value })}
                            </span>

                        );
                    }
                }
            },
            {
                name: intl.formatMessage({ id: "table.RequestRemarks" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "table.TrnDate" }),
                options: { filter: false, sort: false }
            },
            {
                name: intl.formatMessage({ id: "widgets.action" }),
                options: { filter: false, sort: false }
            },

        ]
        const options = {
            filter: false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            rowsPerPageOptions: [10, 25, 50, 100],
            serverSide: this.props.Report.length !== 0 ? true : false,
            page: this.state.PageNo,
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalCount,
            print: false,
            download: false,
            viewColumns: false,
            search: true,
            textLabels: {
                body: {
                    noMatch: intl.formatMessage({ id: "wallet.emptyTable" }),
                    toolTip: intl.formatMessage({ id: "wallet.sort" }),
                }
            },
            onTableChange: (action, tableState) => {
                switch (action) {
                    case 'changeRowsPerPage':
                        this.setState({
                            PageNo: tableState.page,
                            PageSize: tableState.rowsPerPage,
                        });
                        this.props.getLeverageReportList({
                            PageNo: tableState.page,
                            PageSize: tableState.rowsPerPage,
                            FromDate: this.state.FromDate,
                            ToDate: this.state.ToDate,
                            Status: this.state.Status,
                            WalletTypeId: this.state.WalletTypeId,
                        });
                        break;
                    case 'changePage':
                        this.setState({
                            PageNo: tableState.page,
                            PageSize: tableState.rowsPerPage,
                        });
                        this.props.getLeverageReportList({
                            PageNo: tableState.page,
                            PageSize: tableState.rowsPerPage,
                            FromDate: this.state.FromDate,
                            ToDate: this.state.ToDate,
                            Status: this.state.Status,
                            WalletTypeId: this.state.WalletTypeId
                        });
                        break;
                }
            }
        };
        return (
            <div className={this.props.darkMode ? 'DepositWithdrawHistory-darkmode' : 'DepositWithdrawHistory'}>
                {loading && <JbsSectionLoader />}
                <JbsCollapsibleCard>
                    <div className="top-filter row">
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="WalletTypeId">{intl.formatMessage({ id: "trading.holdingorder.label.currency" })}</Label>
                            <Select
                                options={this.props.currencies.map((wallet, key) => ({
                                    label: wallet.SMSCode,
                                    value: wallet.WalletTypeID,
                                }))}
                                onChange={e => this.onChangeSelectCurrency(e)}
                                value={this.state.WalletTypeObj}
                                placeholder={intl.formatMessage({ id: "widgets.search" })}
                            />
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="Status">{intl.formatMessage({ id: "wallet.DWTableStatus" })}</Label>
                            <Input
                                type="select"
                                name="Status"
                                id="Status"
                                value={this.state.Status}
                                onChange={(e) => this.onChangeHander(e)}>
                                <option value="">{intl.formatMessage({ id: "wallet.selectStatus" })}</option>
                                <option value="0">{intl.formatMessage({ id: "margin.historyStatus.0" })}</option>
                                <option value="1">{intl.formatMessage({ id: "margin.historyStatus.1" })}</option>
                                <option value="5">{intl.formatMessage({ id: "margin.historyStatus.5" })}</option>
                                <option value="6">{intl.formatMessage({ id: "margin.historyStatus.6" })}</option>
                                <option value="9">{intl.formatMessage({ id: "margin.historyStatus.9" })}</option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="startDate">{intl.formatMessage({ id: "widgets.startDate" })}</Label>
                            <Input type="date" name="date" id="startDate" placeholder="dd/mm/yyyy" value={this.state.FromDate} onChange={(e) => this.onChangeHandler(e, 'FromDate')} max={this.state.today} />
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="endDate">{intl.formatMessage({ id: "widgets.endDate" })}</Label>
                            <Input type="date" name="date" id="endDate" placeholder="dd/mm/yyyy" value={this.state.ToDate} onChange={(e) => this.onChangeHandler(e, 'ToDate')} max={this.state.today} />
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <div className="btn_area">
                                <Button color="primary" className={"border-0 rounded-0 perverbtn" + ((this.state.Status !== '' || (this.state.FromDate !== "" && this.state.ToDate !== '' && this.state.FromDate <= this.state.today && this.state.ToDate <= this.state.today && this.state.FromDate <= this.state.ToDate) || this.state.WalletTypeId !== '') ? "" : "disabled")} onClick={(e) => this.applyFilter(e)}>{intl.formatMessage({ id: "widgets.apply" })}</Button>
                                {this.state.showReset && <Button className="ml-15 border-0 btn-danger rounded-0" onClick={(e) => this.clearFilter()}>{intl.formatMessage({ id: "button.clear" })}</Button>}
                            </div>
                        </FormGroup>
                    </div>
                </JbsCollapsibleCard>
                <div className="StackingHistory">
                    <MUIDataTable
                        data={Report.map(item => {
                            return [
                                item.Id,
                                item.WalletTypeName,
                                parseFloat(item.LeverageAmount).toFixed(8),
                                item.LeveragePer + 'X',
                                item.Status,
                                item.RequestRemarks,
                                changeDateFormat(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false),
                                <div className="list-action">
                                    <Tooltip title={<IntlMessages id="button.info" />} placement="bottom">

                                        <a
                                            href="javascript:void(0)"
                                            onClick={e => this.setState({ Report: item, showDialog: true })}
                                        >
                                            <i className="zmdi zmdi-eye" />
                                        </a>
                                    </Tooltip>
                                    {item.Status === 1 && <Tooltip title={<IntlMessages id="widgets.upgrade" />} placement="bottom">

                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.toggleShowModal(item)}
                                        >
                                            <i className="ti-pencil" />
                                        </a>
                                    </Tooltip>}
                                </div>
                            ]
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
                                    {<IntlMessages id="marginTrading.leverage" />}
                                </h5>
                            </div>
                            <div className=" col-sm-9 col-md-9 col-xl-9 pr-0">
                                <Input
                                    type="select"
                                    name="LeveragePer"
                                    id="LeveragePer"
                                    value={this.state.editdetail.LeveragePer}
                                    onChange={(e) => this.onChangeleverage("LeveragePer", e.target.value)}
                                >
                                    {LeveragePer.map((label, value) => (
                                        <option
                                            disabled={(label.value) <= (this.state.LeveragePer)}
                                            value={label.value} key={value}
                                        >{label.label}
                                        </option>
                                    ))}
                                </Input>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            className={"border-0 rounded-0 perverbtn"}
                            disabled={this.state.disableConfirm}
                            onClick={() => this.upgradeLoan()}><IntlMessages id="wallet.btnConfirm" /></Button>{' '}
                        <Button
                            color="danger"
                            className="mr-10 border-0 rounded-0 "
                            onClick={this.toggleShowConfirmModal}><IntlMessages id="button.cancel" /></Button>
                    </ModalFooter>
                </Modal>
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
                            <IntlMessages id="trading.leverageDetails" />
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
                            <div className="row">
                                <div className="col-sm-12 p-0">
                                    <Table bordered className="mb-0">
                                        <tbody>
                                            {(this.state.Report.hasOwnProperty('WalletTypeName') && this.state.Report.hasOwnProperty('FromWalletName')) && <tr>
                                                <td className="w-25"><IntlMessages id="table.WalletTypeName" /></td>
                                                <td className="w-25 font-weight-bold">{this.state.Report.WalletTypeName}</td>
                                                <td className="w-25"><IntlMessages id="table.FromWalletName" /></td>
                                                <td className="w-25 font-weight-bold">{this.state.Report.FromWalletName}</td>
                                            </tr>}
                                            {(this.state.Report.hasOwnProperty('UserName') && this.state.Report.hasOwnProperty('Amount')) && <tr>
                                                <td className="w-25"><IntlMessages id="table.UserName" /></td>
                                                <td className="w-25 font-weight-bold">{this.state.Report.UserName}</td>
                                                <td className="w-25"><IntlMessages id="table.Amount" /></td>
                                                <td className="w-25 font-weight-bold">{this.state.Report.Amount.toFixed(8)}</td>
                                            </tr>}
                                            {(this.state.Report.hasOwnProperty('LeverageAmount') && this.state.Report.hasOwnProperty('LeveragePer')) && <tr>
                                                <td className="w-25"><IntlMessages id="table.LeverageAmount" /></td>
                                                <td className="w-25 font-weight-bold">{this.state.Report.LeverageAmount.toFixed(8)}</td>
                                                <td className="w-25"><IntlMessages id="table.LeveragePer" /></td>
                                                <td className="w-25 font-weight-bold">{this.state.Report.LeveragePer + 'X'}</td>
                                            </tr>}
                                            {(this.state.Report.hasOwnProperty('ChargeAmount') && this.state.Report.hasOwnProperty('CreditAmount')) && <tr>
                                                <td className="w-25"><IntlMessages id="table.ChargeAmount" /></td>
                                                <td className="w-25 font-weight-bold">{this.state.Report.ChargeAmount.toFixed(8)}</td>
                                                <td className="w-25"><IntlMessages id="table.CreditAmount" /></td>
                                                <td className="w-25 font-weight-bold">{this.state.Report.CreditAmount.toFixed(8)}</td>
                                            </tr>}
                                            {(this.state.Report.hasOwnProperty('SafetyMarginAmount') && this.state.Report.hasOwnProperty('Status')) && <tr>
                                                <td className="w-25"><IntlMessages id="table.SafetyMarginAmount" /></td>
                                                <td className="w-25 font-weight-bold">{this.state.Report.SafetyMarginAmount.toFixed(8)}</td>
                                                <td className="w-25"><IntlMessages id="leverageReport.Status" /></td>
                                                <td><span className={classnames({
                                                            "badge badge-danger": (this.state.Report.Status === 3),
                                                            "badge badge-danger": (this.state.Report.Status === 9),
                                                            "badge badge-info": (this.state.Report.Status === 6 || this.state.Report.Status === 0 || this.state.Report.Status === 5),
                                                            //"badge badge-warning": (value === 4),
                                                            "badge badge-success": (this.state.Report.Status === 1)
                                                        })} >
                                                <IntlMessages id={"margin.historyStatus." + this.state.Report.Status} />
                                                </span>
                                                {/* <IntlMessages id="leverageReport.Status" /></td>
                                                <td className="w-25 font-weight-bold">{this.state.Report.Status} */}
                                                </td>
                                            </tr>}
                                            {(this.state.Report.hasOwnProperty('RequestRemarks') && this.state.Report.hasOwnProperty('TrnDate')) && <tr>
                                                <td className="w-25"><IntlMessages id="table.RequestRemarks" /></td>
                                                <td className="w-25 font-weight-bold">{this.state.Report.RequestRemarks}</td>
                                                <td className="w-25"><IntlMessages id="wallet.DWTableDate" /></td>
                                                <td className="w-25 font-weight-bold">{changeDateFormat(this.state.Report.TrnDate, 'YYYY-MM-DD HH:mm:ss', false)}</td>
                                            </tr>}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div >
        )
    }
}
// map states to props when changed in states from reducer
const mapStateToProps = ({ LeverageReportReducer, withdrawApp }) => {
    const { Report, loading, TotalCount, updateLoan } = LeverageReportReducer;
    const { currencies } = withdrawApp;
    return { Report, loading, currencies, TotalCount, updateLoan };
};
// export this component with action methods and props
export default connect(
    mapStateToProps,
    { getLeverageReportList, getCurrency, getUpgradeLoan }
)(injectIntl(LeverageReport));
