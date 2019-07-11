/**
 * CreatedBy : Jinesh Bhatt
 * Date : 08-01-2019
 */
/**
 * Display Email Queue report
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import { Badge, Form, Input, Label, Row, Col } from "reactstrap";
import MatButton from "@material-ui/core/Button";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Pagination from 'react-js-pagination';
import IntlMessages from "Util/IntlMessages";
import { displayEmailQueueList, resentEmailRequest } from "Actions/Reports";
import { NotificationManager } from "react-notifications";
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import EmailBody from './EmailBody';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import Tooltip from "@material-ui/core/Tooltip";

require('../../assets/scss/bootstrap.scss');
const columns = [
    {
        name: <IntlMessages id="emailQueueReport.column.Email" />,
        options: {
            filter: true,
            sort: true
        }
    },
    {
        name: <IntlMessages id="emailQueueReport.column.subject" />,
        options: {
            filter: true,
            sort: false
        }
    },
    {
        name: <IntlMessages id="emailQueueReport.column.status" />,
        options: {
            filter: true,
            sort: false
        }
    },
    {
        name: <IntlMessages id="emailQueueReport.column.date" />,
        options: {
            filter: true,
            sort: false
        }
    },
    {
        name: <IntlMessages id="emailQueueReport.column.view" />,
        options: {
            filter: true,
            sort: false
        }
    }
];

const components = {
    EmailBody: EmailBody
};

const displayStatus = (Status) => {
    switch (Status) {
        case 1:
            return <Badge className="mb-10 mr-10" color="success">
                {<IntlMessages id="emailQueueReport.status.success" />}
            </Badge>;
        case 9:
            return <Badge className="mb-10 mr-10" color="danger">
                {<IntlMessages id="emailQueueReport.status.fail" />}
            </Badge>;
        case 6:
            return <Badge className="mb-10 mr-10" color="primary">
                {<IntlMessages id="emailQueueReport.status.pending" />}
            </Badge>;
        case 0:
            return <Badge className="mb-10 mr-10" color="primary">
                {<IntlMessages id="emailQueueReport.status.initialize" />}
            </Badge>;
        default:
            return "";
    }
}
const dynamicComponent = (TagName, props, drawerClose, closeAll) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll });
};
class EmailQueueWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: 0,
            selectedEmail: {}, // selected Email to perform operations,
            start_date: new Date().toISOString().slice(0, 10),
            end_date: new Date().toISOString().slice(0, 10),
            currentDate: new Date().toISOString().slice(0, 10),
            loading: false,
            componentName: '',
            open: false,
            Page: 1,
            PageSize: 25,
            Status: "",
            TotalPage: 0,
            TotalEmails: 0,
            notify: false,
            start_row: 1,
            TotalCount: 0,
            EmailList: []
        };
        this.onApply = this.onApply.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentWillMount() {
    }
    // component will received props
    componentWillReceiveProps(nextProps, nextContext) {

        // check for Email Count not undefined and if count not match with state count then store new count in state
        if (typeof nextProps.EmailQueueList.ReturnCode !== 'undefined' && nextProps.EmailQueueList.ReturnCode === 0) {
            this.setState({
                EmailList: nextProps.EmailQueueList.EmailQueueObj
            });

            if (nextProps.EmailQueueList.Count !== this.state.TotalEmails) {
                this.setState({
                    TotalEmails: nextProps.EmailQueueList.Count
                });
            }
        }

        // check error message if not undefined and return code not equals to 0 then show notification for error
        if (typeof nextProps.error.ReturnCode != 'undefined' && nextProps.error.ReturnMsg != '' && this.state.notify == true && nextProps.error.ReturnCode != 0) {
            NotificationManager.error(nextProps.error.ReturnMsg);
            this.setState({ notify: false });
        }
        // check error message if not undefined and return code not equals to 0 then show notification for error
        if (typeof nextProps.ResendEmail.ReturnCode != 'undefined' && nextProps.ResendEmail.ReturnCode == 0 && this.state.notify == true && nextProps.ResendEmail.ReturnMsg != '') {
            NotificationManager.success(nextProps.ResendEmail.ReturnMsg);
            this.setState({ notify: false });
        }

        if (this.state.TotalPage != nextProps.TotalPage) {
            this.setState({ TotalPage: nextProps.TotalPage })
        }

        if (this.state.TotalCount != nextProps.TotalCount) {
            this.setState({ TotalCount: nextProps.TotalCount, selectedRecord: null })
        }

    }

    // on change if change in any field store value in state
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    // On apply button click event handle
    onApply(event) {
        var date1 = new Date(this.state.start_date);
        var date2 = new Date(this.state.end_date);
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if ((this.state.start_date !== '' && this.state.end_date == '') || (this.state.end_date !== '' && this.state.start_date == '')) {

            NotificationManager.error(<IntlMessages id="report.organizationLedger.startDate" />);
        } else if (this.state.end_date < this.state.start_date) {

            NotificationManager.error(<IntlMessages id="report.organizationLedger.startDate" />);
        } else if (this.state.end_date > this.state.currentDate) {

            NotificationManager.error(<IntlMessages id="report.organizationLedger.endDate" />);
        } else if (this.state.start_date > this.state.currentDate) {

            NotificationManager.error(<IntlMessages id="report.organizationLedger.startDate" />);
        } else if (diffDays > 2) {
            NotificationManager.error(<IntlMessages id="emailQueueReport.diffDateError" />);
        } else {
            const request = {};
            request.FromDate = this.state.start_date;
            request.ToDate = this.state.end_date;
            request.Page = this.state.Page;
            this.setState({
                loading: true,
                Page: 1,
                notify: true
            });
            if (this.state.Status !== "") {
                request.Status = parseInt(this.state.Status);
            }
            if (this.state.PageSize !== "") {
                request.PageSize = this.state.PageSize;
            }
            var makeLedgerRequest = request;
            this.props.displayEmailQueueList({ makeLedgerRequest });
        }
    };


    // on change handler for status selection
    onChangeHandler(e, key) {
        e.preventDefault();
        this.setState({ [key]: e.target.value });
    };
    // resend email
    resentMail = (EmailID) => {
        if (typeof EmailID != 'undefined' && EmailID != null) {
            this.setState({ loading: true, notify: true });
            this.props.resentEmailRequest({ EmailID });
        }
    }
    // Handle pagination change page event
    handlePageChange = (pageNumber) => {

        this.setState({
            Page: pageNumber, loading: true
        });

        const request = {};
        request.FromDate = this.state.start_date;
        request.ToDate = this.state.end_date;
        request.Page = pageNumber;
        if (this.state.Status !== "") {
            request.Status = parseInt(this.state.Status);
        }
        if (this.state.PageSize !== "") {
            request.PageSize = this.state.PageSize;
        }
        this.props.displayEmailQueueList({
            makeLedgerRequest: request
        });
    };

    // drawer functions
    showComponent = (componentName, EmailTemplate) => {
        this.setState({
            componentName: componentName,
            open: this.state.open ? false : true,
            selectedEmail: EmailTemplate
        });
    };

    closeAll = () => {
        this.setState({ open: false });
    };

    toggleDrawer = (Email) => {
        this.setState({ open: this.state.open ? false : true });
    };

    render() {

        const data = this.state.EmailList;

        const Count = this.state.TotalEmails;

        const options = {
            filter: false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            rowsPerPageOptions: [10, 25, 50, 100],
            serverSide: true,
            page: this.state.Page,
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalEmails,
            print: false,
            download: false,
            viewColumns: false,
            search: false,
            pagination: false,

        };

        return (
            <div className="EmailQueueList">

                <JbsCollapsibleCard>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="top-filter clearfix">
                                <Form name="frm_search" className="row mb-10">
                                    <div className="col-md-3">
                                        <Label for="startDate1">{<IntlMessages
                                            id="sidebar.tradingLedger.filterLabel.startDate" />}</Label>
                                        <Input type="date" name="start_date" value={this.state.start_date}
                                            id="startDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
                                    </div>
                                    <div className="col-md-3">
                                        <Label for="endDate1">{<IntlMessages
                                            id="sidebar.tradingLedger.filterLabel.endDate" />}</Label>
                                        <Input type="date" name="end_date" value={this.state.end_date} id="endDate1"
                                            placeholder="dd/mm/yyyy" onChange={this.handleChange} />
                                    </div>
                                    <div className="col-md-2">
                                        <Label for="Select-1"><IntlMessages id="widgets.status" /></Label>
                                        <Input type="select" name="Status" id="status" value={this.state.Status}
                                            onChange={(e) => this.onChangeHandler(e, 'Status')}>
                                            <option value="">Select
                                                Status
                                            </option>
                                            <option
                                                value="1">Success</option>
                                            <option
                                                value="0">Initilalize
                                            </option>
                                            <option
                                                value="6">Pending</option>
                                            <option
                                                value="9">Fail
                                            </option>
                                        </Input>
                                    </div>
                                    <div className="col-md-1">
                                        <Label className="d-block">&nbsp;</Label>
                                        <MatButton variant="raised" className="btn-primary text-white"
                                            onClick={this.onApply}>
                                            <IntlMessages id="sidebar.tradingLedger.button.apply" />
                                        </MatButton>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>

                </JbsCollapsibleCard>
                {this.props.loading && <JbsSectionLoader />}
                <MUIDataTable
                    title={<IntlMessages id="emailQueueReport.title" />}
                    columns={columns}
                    data={data.map((item, key) => {
                        return [
                            item.RecepientEmail,
                            item.Subject,
                            displayStatus(item.Status),
                            item.EmailDate,
                            <div>
                                <Tooltip title={<IntlMessages id="emailQueueReport.tooltip.viewBody" />}>
                                    <a href="javascript:void(0)" className="mr-10" onClick={(event) => {
                                        this.showComponent('EmailBody', item)
                                    }}><i className="ti-eye" />
                                    </a>
                                </Tooltip>
                                {item.Status == 1 ?
                                    <Tooltip title={<IntlMessages id="emailQueueReport.tooltip.resendMail" />}>
                                        <a href="javascript:void(0)" className="mr-10" onClick={(event) => {
                                            this.resentMail(item.EmailID)
                                        }}><i className="ti-arrow-top-right" />
                                        </a>
                                    </Tooltip> : item.Status == 9 ? <Tooltip title={<IntlMessages id="emailQueueReport.tooltip.resendMail" />}>
                                        <a href="javascript:void(0)" className="mr-10" onClick={(event) => {
                                            this.resentMail(item.EmailID)
                                        }}><i className="ti-arrow-top-right" />
                                        </a>
                                    </Tooltip> : ''
                                }
                            </div>
                        ];
                    })}
                    options={options}
                />
                {
                    data.length > 0 &&
                    <Row>
                        <Col md={5} className="mt-20">
                            <span>Total Pages :- {this.state.TotalPage}</span>
                        </Col>
                        <Col md={4} className="text-right">
                            <div className="text-center">
                                <Pagination className="pagination"
                                    activePage={this.state.Page}
                                    itemsCountPerPage={this.state.PageSize}
                                    totalItemsCount={Count}
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
                            <span> {this.state.Page > 1 ? (this.state.start_row) + (this.state.PageSize * (this.state.Page - 1)) + ' - ' + ((this.state.PageSize * this.state.Page) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.PageSize * this.state.Page)) : (this.state.start_row) + ' - ' + ((this.state.PageSize * this.state.Page) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.PageSize * this.state.Page))} of {this.state.TotalCount} Records</span>
                        </Col>
                    </Row>
                }
                <Drawer
                    width="75%"
                    handler={false}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className="drawer1"
                    placement="right"
                >
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.state.selectedEmail, this.toggleDrawer, this.closeAll)}
                </Drawer>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ EmailQueueList }) => {

    const response = {
        EmailQueueList: EmailQueueList.QueueListResponse,
        loading: EmailQueueList.loading,
        error: EmailQueueList.error,
        ResendEmail: EmailQueueList.ResendEmailResponse,
        TotalPage: EmailQueueList.QueueListResponse.TotalPage,
        TotalCount: EmailQueueList.QueueListResponse.Count,
    };

    return response;
};

export default connect(mapStateToProps, { displayEmailQueueList, resentEmailRequest })(EmailQueueWdgt);
