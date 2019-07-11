/* 
    Developer : Nishant Vadgama
    Date : 06-02-2019
    File Comment : Wallet ledger component
*/
import React, { Component, Fragment } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { FormGroup, Label, Input, Alert, Form } from "reactstrap";
import { injectIntl } from 'react-intl';
import MUIDataTable from "mui-datatables";
import { changeDateFormat } from "Helpers/helpers";
import {
    getOrganizationLedger
} from 'Actions/OrganizationLedger';
import { CustomFooter } from 'Components/MyAccount/Dashboards/Widgets/CustomFooter';
import AppConfig from 'Constants/AppConfig';
const initState = {
    showReset: false,
    AccWalletId: "",
    FromDate: new Date().toISOString().slice(0, 10),
    ToDate: new Date().toISOString().slice(0, 10),
    Page: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    TotalCount: 0,
    showError: false,
    showSuccess: false,
    responseMessage: "",
    Today: new Date().toISOString().slice(0, 10)
}

class WalletLedger extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    getListFromServer = (Page, PageSize) => {
        var newObj = Object.assign({}, this.state);
        newObj['Page'] = Page > 0 ? Page : this.state.Page;
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.PageSize;
        this.setState(newObj);
        //For Action API...
        var reqObj = newObj;
        reqObj.Page = Page > 0 ? Page - 1 : 1;
        this.props.getOrganizationLedger(reqObj);
    }
    // will receive change totalcount
    componentWillReceiveProps(nextProps) {
        if (this.state.TotalCount != nextProps.totalCount) {
            this.setState({ TotalCount: nextProps.totalCount });
        }
        /* update wallet id  */
        if (this.state.AccWalletId !== nextProps.pagedata) {
            this.setState({
                AccWalletId: nextProps.pagedata
            }, () => {
                this.getListFromServer(1, this.state.PageSize);
            });
        }
        // check ledger response 
        if (nextProps.ledgerResponse.hasOwnProperty('ReturnCode')) {
            if (nextProps.ledgerResponse.ReturnCode === 1) {
                const intl = this.props.intl;
                this.setState({ showError: true, responseMessage: intl.formatMessage({ id: `apiWalletErrCode.${nextProps.ledgerResponse.ErrorCode}` }) })
                setTimeout(function () {
                    this.setState({ showError: false });
                }.bind(this), 3000);
            }
        }
    }
    //Pagination Change Method...
    handlePageChange(pageNumber) {
        this.getListFromServer(pageNumber);
    }
    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListFromServer(1, event.target.value);
    };
    //change handler 
    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
        //onchange fetch wallets
        if (e.target.name === 'WalletUsageType') {
            this.setState({ walletLabel: null });
            this.props.getOrganizationWallets({
                WalletTypeId: this.state.WalletTypeId,
                WalletUsageType: e.target.value
            });
        } else if (e.target.name === 'WalletTypeId') {
            this.setState({ walletLabel: null });
            this.props.getOrganizationWallets({
                WalletTypeId: e.target.value,
                WalletUsageType: this.state.WalletUsageType
            });
        }
    }
    //onchange select user
    onChangeSelectWallet(e) {
        this.setState({ AccWalletId: e.value, walletLabel: { label: e.label } });
    }
    //   Apply Filter option
    applyFilter = () => {
        if (
            this.state.FromDate !== "" &&
            this.state.ToDate !== "" &&
            this.state.AccWalletId !== ""
        ) {
            this.getListFromServer(1, this.state.PageSize);
            this.setState({ showReset: true });
        }
    };
    //clear filter
    clearFilter = () => {
        this.setState(initState);
    };
    render() {
        const intl = this.props.intl;
        const columns = [
            {
                name: intl.formatMessage({ id: "lable.LedgerId" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.Amount" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "lable.CrAmount" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.DrAmount" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "lable.PreBal" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "lable.PostBal" }),
                options: { sort: true, filter: false }
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
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            filter: false,
            search: false,
            serverSide: this.props.walletLedger.length ? true : false,
            page: this.state.Page,
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalCount,
            textLabels: {
                body: {
                    noMatch: intl.formatMessage({ id: "wallet.emptyTable" }),
                    toolTip: intl.formatMessage({ id: "wallet.sort" }),
                }
            },
            customToolbar: () => {
                return (
                    <div className="top-filter">
                        <Form className="tradefrm row">
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="FromDate">
                                    {intl.formatMessage({ id: "widgets.startDate" })}
                                </Label>
                                <Input
                                    type="date"
                                    name="FromDate"
                                    id="FromDate"
                                    placeholder="dd/mm/yyyy"
                                    value={this.state.FromDate}
                                    onChange={e => this.onChangeHandler(e)}
                                    max={this.state.Today}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="endDate">
                                    {intl.formatMessage({ id: "widgets.endDate" })}
                                </Label>
                                <Input
                                    type="date"
                                    name="ToDate"
                                    id="ToDate"
                                    placeholder="dd/mm/yyyy"
                                    value={this.state.ToDate}
                                    onChange={e => this.onChangeHandler(e)}
                                    max={this.state.Today}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <div className="btn_area">
                                    <Button
                                        color="primary"
                                        variant="raised"
                                        disabled={(this.state.FromDate !== "" && this.state.ToDate !== "" && this.state.AccWalletId !== "") ? false : true}
                                        onClick={() => this.applyFilter()}
                                    >
                                        {intl.formatMessage({ id: "widgets.apply" })}
                                    </Button>
                                </div>
                            </FormGroup>
                        </Form>
                    </div>);
            },
            customFooter: (count, page, rowsPerPage) => {
                var pages = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={pages} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
        };
        return (
            <Fragment>
                <Fragment>
                    <Alert color="danger" isOpen={this.state.showError} toggle={(e) => this.setState({ showError: false })}>
                        {this.state.responseMessage}
                    </Alert>
                    <Alert color="success" isOpen={this.state.showSuccess} toggle={(e) => this.setState({ showSuccess: false })}>
                        {this.state.responseMessage}
                    </Alert>
                </Fragment>
                <div className="StackingHistory wlt_ledger">
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        title={this.props.title}
                        data={this.props.walletLedger.map(item => {
                            return [
                                item.LedgerId,
                                parseFloat(item.Amount).toFixed(8),
                                parseFloat(item.CrAmount).toFixed(8),
                                parseFloat(item.DrAmount).toFixed(8),
                                parseFloat(item.PreBal).toFixed(8),
                                parseFloat(item.PostBal).toFixed(8),
                                item.Remarks,
                                changeDateFormat(item.TrnDate, 'DD-MM-YYYY HH:mm:ss', false),
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = ({ OrgWalletLedgerReducer, }) => {
    const { loading, organizationWallets, walletLedger, totalCount, ledgerResponse } = OrgWalletLedgerReducer;
    return { loading, organizationWallets, walletLedger, totalCount, ledgerResponse };
};

export default connect(mapStateToProps, {
    getOrganizationLedger,
})(injectIntl(WalletLedger));