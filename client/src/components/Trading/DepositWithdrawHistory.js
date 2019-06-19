/* 
    Developer : Nishant Vadgama
    Date : 13-09-2018
    File Comment : Deposit/Witdhraw History Widget - Common
*/
import React, { Component, Fragment } from "react";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import classnames from "classnames";
import { changeDateFormat } from "Helpers/helpers";
import Tooltip from "@material-ui/core/Tooltip";
import { injectIntl } from "react-intl";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import { Table } from "reactstrap";
function Transition(props) {
    return <Slide direction="up" {...props} />;
}

// Deposit & Withdraw History widget
class DepositWithdrawHistory extends Component {
    state = {
        showDialog: false,
        rowDetails: {},
        explorerLink: [],
        rowsPerPage: 10,
    };
    render() {
        const intl = this.props.intl;
        const history = this.props.history;
        const title = this.props.title;
        var columns = [
            {
                name: intl.formatMessage({
                    id: "tradeSummary.filterLabel.trnNo",
                }),
                options: { filter: false, sort: true },
            },
            {
                name: intl.formatMessage({ id: "wallet.DWTableCoin" }),
                options: { filter: true, sort: true },
            },
            {
                name: intl.formatMessage({ id: "wallet.DWTableAmount" }),
                options: { filter: false, sort: false },
            },
            {
                name: intl.formatMessage({ id: "wallet.DWTableDate" }),
                options: { filter: false, sort: true },
            },
            {
                name: intl.formatMessage({ id: "wallet.DWTableStatus" }),
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span
                                className={classnames({
                                    "badge badge-danger":
                                        value === 2 ||
                                        value === 3 ||
                                        value === 5,
                                    "badge badge-info":
                                        value === 6 ||
                                        value === 9 ||
                                        value === 0,
                                    "badge badge-warning": value === 4,
                                    "badge badge-success": value === 1,
                                })}
                            >
                                {intl.formatMessage({
                                    id: "wallet.historyStatus." + value,
                                })}
                            </span>
                        );
                    },
                },
            },
            {
                name: intl.formatMessage({ id: "widgets.action" }),
                options: { filter: false, sort: false },
            },
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            download: false,
            viewColumns: false,
            print: false,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                },
            },
            rowsPerPage: this.state.rowsPerPage,
            onChangeRowsPerPage: (numberOfRow) => {
                this.setState({ rowsPerPage: numberOfRow });
            },
        };
        return (
            <Fragment>
                <div
                    className={
                        this.props.darkMode
                            ? "DepositWithdrawHistory-darkmode tbl_overflow_auto"
                            : "DepositWithdrawHistory tbl_overflow_auto"
                    }
                >
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        title={title}
                        data={history.map((item) => {
                            var ExplorerLink = item.hasOwnProperty(
                                "ExplorerLink"
                            )
                                ? JSON.parse(item.ExplorerLink)
                                : [];
                            return [
                                item.TrnNo,
                                item.CoinName,
                                item.Amount.toFixed(8),
                                changeDateFormat(
                                    item.Date,
                                    "YYYY-MM-DD HH:mm:ss",
                                    false
                                ),
                                item.Status === 4 && item.IsVerified === 0
                                    ? 9
                                    : item.Status,
                                <div className="list-action">
                                    <Tooltip
                                        title={
                                            <IntlMessages id="button.info" />
                                        }
                                        placement="bottom"
                                    >
                                        <a
                                            href="javascript:void(0)"
                                            onClick={(e) =>
                                                this.setState({
                                                    rowDetails: item,
                                                    showDialog: true,
                                                    explorerLink: ExplorerLink,
                                                })
                                            }
                                        >
                                            <i className="zmdi zmdi-eye" />
                                        </a>
                                    </Tooltip>
                                    {item.IsVerified === 0 &&
                                        item.Status === 4 ? (
                                            <Tooltip
                                                title={
                                                    <IntlMessages id="sidebar.btnResendConfirmEmail" />
                                                }
                                                placement="bottom"
                                            >
                                                <a
                                                    href="javascript:void(0)"
                                                    onClick={(e) =>
                                                        this.props.resendMailConfirmation(
                                                            item.TrnNo
                                                        )
                                                    }
                                                >
                                                    <i className="zmdi zmdi-mail-send" />
                                                </a>
                                            </Tooltip>
                                        ) : (
                                            ""
                                        )}
                                </div>,
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
                <Dialog
                    open={this.state.showDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth
                    maxWidth="md"
                    onClose={(e) => this.setState({ showDialog: false })}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        <div className="list-action justify-content-between d-flex">
                            <IntlMessages id="wallet.transactionDetails" />
                            <a
                                href="javascript:void(0)"
                                onClick={(e) =>
                                    this.setState({ showDialog: false })
                                }
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
                                            {this.state.rowDetails.hasOwnProperty(
                                                "TrnNo"
                                            ) && (
                                                <tr>
                                                    <td className="w-50">
                                                        <IntlMessages id="tradeSummary.filterLabel.trnNo" />
                                                    </td>
                                                    <td className="w-50">
                                                        {
                                                            this.state
                                                                .rowDetails
                                                                .TrnNo
                                                        }
                                                    </td>
                                                </tr>
                                            )}
                                            {this.state.rowDetails.hasOwnProperty(
                                                "CoinName"
                                            ) && (
                                                <tr>
                                                    <td className="w-50">
                                                        <IntlMessages id="wallet.DWTableCoin" />
                                                    </td>
                                                    <td className="w-50">
                                                        {
                                                            this.state
                                                                .rowDetails
                                                                .CoinName
                                                        }
                                                    </td>
                                                </tr>
                                            )}
                                            {this.state.rowDetails.hasOwnProperty(
                                                "Amount"
                                            ) && (
                                                <tr>
                                                    <td className="w-50">
                                                        <IntlMessages id="wallet.DWTableAmount" />
                                                    </td>
                                                    <td className="w-50">
                                                        {this.state.rowDetails.Amount.toFixed(
                                                            8
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                            {this.state.rowDetails.hasOwnProperty(
                                                "ChargeRs"
                                            ) && (
                                                <tr>
                                                    <td className="w-50">
                                                        <IntlMessages id="sidebar.colFee" />
                                                    </td>
                                                    <td className="w-50">
                                                        {this.state.rowDetails.ChargeRs.toFixed(
                                                            8
                                                        )}{" "}
                                                        {
                                                            this.state
                                                                .rowDetails
                                                                .ChargeCurrency
                                                        }
                                                    </td>
                                                </tr>
                                            )}
                                            {this.state.rowDetails.hasOwnProperty(
                                                "Date"
                                            ) && (
                                                <tr>
                                                    <td className="w-50">
                                                        <IntlMessages id="wallet.DWTableDate" />
                                                    </td>
                                                    <td className="w-50">
                                                        {changeDateFormat(
                                                            this.state
                                                                .rowDetails
                                                                .Date,
                                                            "YYYY-MM-DD HH:mm:ss",
                                                            false
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                            {this.state.rowDetails.hasOwnProperty(
                                                "Status"
                                            ) && (
                                                <tr>
                                                    <td className="w-50">
                                                        <IntlMessages id="wallet.DWTableStatus" />
                                                    </td>
                                                    <td className="w-50">
                                                    <span className={classnames({
                                                        "badge badge-danger": (this.state.rowDetails.Status === 2) ||(this.state.rowDetails.Status === 3)||(this.state.rowDetails.Status === 5) ,
                                                        "badge badge-success": (this.state.rowDetails.Status === 1),
                                                        "badge badge-warning": (this.state.rowDetails.Status === 4),
                                                        "badge badge-info": (this.state.rowDetails.Status === 6) || (this.state.rowDetails.Status === 9) ||(this.state.rowDetails.Status === 0),
                                                    })} >
                                                        <IntlMessages
                                                            id={`wallet.historyStatus.${
                                                                this.state
                                                                    .rowDetails
                                                                    .Status ===
                                                                    4 &&
                                                                this.state
                                                                    .rowDetails
                                                                    .IsVerified ===
                                                                    0
                                                                    ? 9
                                                                    : this.state
                                                                          .rowDetails
                                                                          .Status
                                                            }`}
                                                        />
                                                        </span>
                                                    </td>
                                                </tr>
                                            )}
                                            {this.state.rowDetails.hasOwnProperty(
                                                "TrnId"
                                            ) &&
                                                this.state.rowDetails.TrnId !==
                                                    "" && (
                                                    <tr>
                                                        <td className="w-50">
                                                            <IntlMessages id="table.TrnID" />
                                                        </td>
                                                        <td className="w-50">
                                                            {this.state
                                                                .rowDetails
                                                                .IsInternalTrn !==
                                                            1 ? (
                                                                <a
                                                                    href={
                                                                        this
                                                                            .state
                                                                            .explorerLink
                                                                            .length
                                                                            ? this
                                                                                  .state
                                                                                  .explorerLink[0]
                                                                                  .Data +
                                                                              "/" +
                                                                              this
                                                                                  .state
                                                                                  .rowDetails
                                                                                  .TrnId
                                                                            : this
                                                                                  .state
                                                                                  .rowDetails
                                                                                  .TrnId
                                                                    }
                                                                    target="_blank"
                                                                >
                                                                    {
                                                                        this
                                                                            .state
                                                                            .rowDetails
                                                                            .TrnId
                                                                    }
                                                                </a>
                                                            ) : (
                                                                this.state
                                                                    .rowDetails
                                                                    .TrnId
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            {this.state.rowDetails.hasOwnProperty(
                                                "Address"
                                            ) && (
                                                <tr>
                                                    <td className="w-50">
                                                        <IntlMessages id="wallet.WDInputAddress" />
                                                    </td>
                                                    <td className="w-50">
                                                        {
                                                            this.state
                                                                .rowDetails
                                                                .Address
                                                        }
                                                    </td>
                                                </tr>
                                            )}
                                            {this.state.rowDetails.hasOwnProperty(
                                                "Information"
                                            ) && (
                                                <tr>
                                                    <td className="w-50">
                                                        <IntlMessages id="wallet.DWTableInfo" />
                                                    </td>
                                                    <td className="w-50">
                                                        {
                                                            this.state
                                                                .rowDetails
                                                                .Information
                                                        }
                                                    </td>
                                                </tr>
                                            )}
                                            {this.state.rowDetails.hasOwnProperty(
                                                "TrnNo"
                                            ) &&
                                                this.state.rowDetails
                                                    .IsVerified === 0 &&
                                                this.state.rowDetails.Status ===
                                                    4 && (
                                                    <tr>
                                                        <td className="w-50">
                                                            <IntlMessages id="sidebar.btnResendConfirmEmail" />
                                                        </td>
                                                        <td className="w-50">
                                                            <a
                                                                href="javascript:void(0)"
                                                                onClick={(e) =>
                                                                    this.props.resendMailConfirmation(
                                                                        this
                                                                            .state
                                                                            .rowDetails
                                                                            .TrnNo
                                                                    )
                                                                }
                                                            >
                                                                <i className="zmdi zmdi-mail-send" />
                                                            </a>
                                                        </td>
                                                    </tr>
                                                )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}

export default injectIntl(DepositWithdrawHistory);
