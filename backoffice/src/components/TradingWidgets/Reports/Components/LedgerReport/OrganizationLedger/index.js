
/**
 * CreatedBy : Jinesh Bhatt
 * Date : 07-01-2019
 */
/**
 * Display Organization Ledger report
 */
import CloseButton from '@material-ui/core/Button';
const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}
//BreadCrumbData
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
        title: <IntlMessages id="sidebar.trading" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="card.list.title.report" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.organizationLedger" />,
        link: '',
        index: 0
    }
];

import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { Badge, Form, Input, Label } from "reactstrap";
// redux action
/*import { displayUsers, deleteUsers } from "Actions/ExampleOrderList";*/
import MatButton from "@material-ui/core/Button";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { displayOrganizationLedger } from "Actions/LedgerReports";
import { getLedgerCurrencyList } from 'Actions/TradingReport';

import { NotificationManager } from "react-notifications";
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
//Columns Object
const columns = [
    {
        name: <IntlMessages id="organizationLedger.title.ledgerId" />,
        options: {
            filter: false,
            sort: true
        }
    },
    {
        name: <IntlMessages id="organizationLedger.title.Amount" />,
        options: {
            filter: true,
            sort: true
        }
    },
    {
        name: <IntlMessages id="organizationLedger.title.creditAmount" />,
        options: {
            filter: true,
            sort: false
        }
    },
    {
        name: <IntlMessages id="organizationLedger.title.debitAmount" />,
        options: {
            filter: true,
            sort: false
        }
    },
    {
        name: <IntlMessages id="organizationLedger.title.previousBalance" />,
        options: {
            filter: true,
            sort: false
        }
    },
    {
        name: <IntlMessages id="organizationLedger.title.postBalance" />,
        options: {
            filter: true,
            sort: false
        }
    },
    {
        name: <IntlMessages id="organizationLedger.title.remarks" />,
        options: {
            filter: false,
            sort: false
        }
    },
    {
        name: <IntlMessages id="organizationLedger.title.date" />,
        options: {
            filter: false,
            sort: false
        }
    }
];

import AppConfig from 'Constants/AppConfig';

class OrganizationLedgerWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: "",
            selectedUser: null, // selected user to perform operations,
            start_date: new Date().toISOString().slice(0, 10),
            end_date: new Date().toISOString().slice(0, 10),
            currentDate: new Date().toISOString().slice(0, 10),
            currencyList: [],
            OrganizationLedger: [],
            currency: '',
            loading: false,
            Page_Size: AppConfig.totalRecordDisplayInList
        };
        this.onApply = this.onApply.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }
    componentWillMount() {
        this.props.getLedgerCurrencyList({});
    }

    componentWillReceiveProps(nextProps) {

        if (typeof nextProps.currencyList !== 'undefined' && nextProps.currencyList.length) {

            this.setState({
                currencyList: nextProps.currencyList
            })
        }
        if (nextProps.OrganizationLedger.length !== 0) {
            this.setState({
                OrganizationLedger: nextProps.OrganizationLedger
            })
        } else if (this.state.OrganizationLedger.length <= 0) {
            this.setState({
                OrganizationLedger: []
            })
        }

    }
    // on change if change in any field store value in state
    handleChange(event) {

        this.setState({ [event.target.name]: event.target.value });
    }

    onClear = event => {
        event.preventDefault();

        this.setState({
            start_date: new Date().toISOString().slice(0, 10),
            end_date: new Date().toISOString().slice(0, 10),
            currentDate: new Date().toISOString().slice(0, 10),
            currency: '',
        })
    }

    onApply(event) {
        if ((this.state.start_date !== '' && this.state.end_date == '') || (this.state.end_date !== '' && this.state.start_date == '')) {

            NotificationManager.error(<IntlMessages id="report.organizationLedger.startDate" />);
        } else if (this.state.end_date < this.state.start_date) {

            NotificationManager.error(<IntlMessages id="report.organizationLedger.startDate" />);
        } else if (this.state.end_date > this.state.currentDate) {

            NotificationManager.error(<IntlMessages id="report.organizationLedger.endDate" />);
        } else if (this.state.start_date > this.state.currentDate) {

            NotificationManager.error(<IntlMessages id="report.organizationLedger.startDate" />);
        }
        var makeLedgerRequest = { FromDate: this.state.start_date, ToDate: this.state.end_date };

        if (this.state.currency) {
            makeLedgerRequest.SMSCode = this.state.currency;
        }
        // console.log(makeLedgerRequest);
        // call action method which call when click on filter
        this.props.displayOrganizationLedger(makeLedgerRequest);
        this.setState({ loading: true });

    }
    render() {
        //const data = this.props.OrganizationLedger;
        var data = this.state.OrganizationLedger ? this.state.OrganizationLedger : []
        const { drawerClose, closeAll } = this.props;
        return (
            <Fragment>
                <div className="charts-widgets-wrapper">
                    <div className="m-20 page-title d-flex justify-content-between align-items-center">
                        <div className="page-title-wrap">
                            <h2><IntlMessages id="sidebar.organizationLedger" /></h2>
                            <Breadcrumb className="tour-step-7 p-0" tag="nav">
                                {BreadCrumbData.length > 0 &&
                                    BreadCrumbData.map((list, index) => {
                                        return <BreadcrumbItem active={BreadCrumbData.length === index + 1} tag={BreadCrumbData.length === index + 1 ? "span" : "a"} key={index} href="javascript:void(0)" onClick={list.index && list.index == 1 ? drawerClose : closeAll}>{list.title}</BreadcrumbItem>
                                        //return <BreadcrumbItem active={BreadCrumbData.length === index + 1} tag={BreadCrumbData.length === index + 1 ? "span" : "a"} key={index} href={BreadCrumbData.length=== index + 1 ? "" : "javascript:void(0)"}  onClick={ () =>{list.index && list.index==1 ? drawerClose : BreadCrumbData.length === index + 1 ? '':closeAll}}>{list.title}</BreadcrumbItem>
                                    })
                                }
                            </Breadcrumb>
                        </div>
                        <div className="page-title-wrap bredscrum-top-btn">
                            <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                            <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                        </div>
                    </div>
                </div>
                <div className="OrganizationLedger">
                    <JbsCollapsibleCard>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="top-filter clearfix">
                                    <Form name="frm_search" className="row mb-10 tradefrm">
                                        <div className="col-md-3">
                                            <Label for="startDate1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.startDate" />}</Label>
                                            <Input type="date" name="start_date" value={this.state.start_date} id="startDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
                                        </div>
                                        <div className="col-md-3">
                                            <Label for="endDate1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.endDate" />}</Label>
                                            <Input type="date" name="end_date" value={this.state.end_date} id="endDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
                                        </div>

                                        <div className="col-md-3">
                                            <Label for="Select-1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.currencyPair" />}</Label>
                                            <div className="app-selectbox-sm">
                                                <Input type="select" name="currency" value={this.state.currency} id="Select-2" onChange={this.handleChange}>
                                                    <IntlMessages id="tradingLedger.selectCurrency">
                                                        {(selectCurrency) =>
                                                            <option value="">{selectCurrency}</option>
                                                        }
                                                    </IntlMessages>
                                                    {this.state.currencyList.map((currency, key) =>
                                                        <option key={key} value={currency.SMSCode}>{currency.SMSCode}</option>
                                                    )}
                                                </Input>
                                            </div>
                                        </div>
                                        <div className="col-md-1">
                                            <Label className="d-block">&nbsp;</Label>
                                            <MatButton variant="raised" className="btn-primary text-white" onClick={this.onApply} >
                                                <IntlMessages id="sidebar.tradingLedger.button.apply" />
                                            </MatButton>
                                        </div>

                                        <div className="col-md-1">
                                            <Label className="d-block">&nbsp;</Label>

                                            <MatButton
                                                variant="raised"
                                                className="btn-danger text-white"
                                                onClick={this.onClear}
                                            >
                                                <IntlMessages id="button.cancel" />
                                            </MatButton>
                                        </div>

                                    </Form>
                                </div>
                            </div>
                        </div>
                    </JbsCollapsibleCard>
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        title={<IntlMessages id="organizationLedger.title" />}
                        columns={columns}
                        data={data.map((item, key) => {
                            return [
                                item.ledgerID,
                                item.Amount,
                                item.creditAmount,
                                item.debitAmount,
                                item.previousBalance,
                                item.postBalance,
                                item.remark,
                                item.date,
                            ];

                        })}
                        options={{
                            selectableRows: false, // <===== will turn off checkboxes in rows
                            print: false,// <===== will turn off print option in header
                            download: false,// <===== will turn off download option in header
                            viewColumns: false,// <===== will turn off viewColumns option in header
                            rowsPerPage: this.state.Page_Size,
                            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
                            filter: false// <===== will turn off filter option in header
                        }}
                    />

                </div>
            </Fragment>
        );
    }
}
// map state to props
const mapStateToProps = ({ OrganizationLedger, tradingledger }) => {

    const response = {
        OrganizationLedger: OrganizationLedger.OrganizationLedger,
        loading: tradingledger.loading,
        currencyList: tradingledger.currencyList
    };

    return response;
};

export default connect(
    mapStateToProps,
    {
        displayOrganizationLedger,
        getLedgerCurrencyList
    }
)(OrganizationLedgerWdgt);
