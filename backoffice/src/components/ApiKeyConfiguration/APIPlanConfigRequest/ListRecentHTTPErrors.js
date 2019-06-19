/**
 * Create By Sanjay 
 * Created Date 18/03/2019
 * Component For List Http Errors
 */
import React, { Component, Fragment } from 'react';
import IntlMessages from "Util/IntlMessages";
import { Badge, Table } from 'reactstrap';
import { injectIntl } from 'react-intl';
//Added By Tejas Start 2/4/2019
// added By Tejas For Connect component to store 
import { connect } from "react-redux";
// import for jquery
import $ from 'jquery';
import Pagination from "react-js-pagination";
//  Used For Display Notification 
import { NotificationManager } from "react-notifications";
import { Form, FormGroup, Label, Input, Row, Col, Button } from "reactstrap";
// used for Mui data table
import MUIDataTable from "mui-datatables";
// import Button from "@material-ui/core/Button";


import { changeDateFormat } from "Helpers/helpers";
// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// used for loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// used for call actions
import { getHttpErrorCodeList } from "Actions/APIPlanConfiguration";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';

// import for tooltip
import Tooltip from "@material-ui/core/Tooltip";

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
        title: <IntlMessages id="sidebar.ApiKeyConfiguration" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.HTTPStatus" />,
        link: '',
        index: 1
    }
];

// End 

class ListRecentHTTPErrors extends Component {
    // make default state values on load Added By Tejas
    constructor(props) {
        super(props);
        this.state = {
            start_date: new Date().toISOString().slice(0, 10),
            end_date: new Date().toISOString().slice(0, 10),
            currentDate: new Date().toISOString().slice(0, 10),
            onLoad: 1,
            httpErrors: [],
            errorCode: '',
            TotalCount: 0,
            TotalPages: 0,
            start_row: 1,
            Page_Size: AppConfig.totalRecordDisplayInList,
            PageNo: 1,
            open: false,
            menudetail: []
        };
    }

    //For handle Page Change
    handlePageChange = (pageNumber) => {
        const Data = {
            ErrorCode: this.state.errorCode ? parseInt(this.state.errorCode) : "",
            FromDate: this.state.start_date,
            ToDate: this.state.end_date,
            PageNo: pageNumber - 1,
            PageSize: this.state.Page_Size,
        };

        this.setState({ PageNo: pageNumber, onLoad: 1 });
        this.props.getHttpErrorCodeList(Data);
    }
    componentWillMount() {
        this.setState({ menudetail: this.props.menudetail })
    }
    componentWillReceiveProps(nextprops) {

        if (this.state.TotalCount !== nextprops.TotalCount) {
            this.setState({ TotalCount: nextprops.TotalCount })
        }

        if (this.state.TotalPages !== nextprops.TotalPages) {
            this.setState({ TotalPages: nextprops.TotalPages })
        }

        if (nextprops.httpErrorsSuccess && nextprops.httpErrorsSuccess.length > 0 && this.state.onLoad) {
            this.setState({
                httpErrors: nextprops.httpErrorsSuccess,
                onLoad: 0
            })
        } else if (nextprops.httpErrorsFailure && nextprops.httpErrorsFailure.ReturnCode === 1 && this.state.onLoad) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.httpErrorsFailure.ErrorCode}`} />);
            this.setState({
                httpErrors: [],
                onLoad: 0
            })
        }

    }

    //cleear all fields
    onClear = event => {
        event.preventDefault();

        this.setState({
            start_date: new Date().toISOString().slice(0, 10),
            end_date: new Date().toISOString().slice(0, 10),
            currentDate: new Date().toISOString().slice(0, 10),
            onLoad: 1,
            errorCode: '',
            TotalCount: 0,
            TotalPages: 0,
            start_row: 1,
            Page_Size: AppConfig.totalRecordDisplayInList,
            PageNo: 1,
            open: false,
        })
    }

    // apply button for Fetch Trade Recon List
    onApply = event => {
        event.preventDefault();

        const Data = {
            ErrorCode: this.state.errorCode ? parseInt(this.state.errorCode) : "",
            FromDate: this.state.start_date,
            ToDate: this.state.end_date,
            PageNo: this.state.PageNo - 1,
            PageSize: this.state.Page_Size,
        };

        if ((this.state.start_date !== '' && this.state.end_date === '') || (this.state.end_date !== '' && this.state.start_date === '')) {
            NotificationManager.error(<IntlMessages id="trading.openorders.dateselect" />);
        } else if (this.state.end_date < this.state.start_date) {
            NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
        } else if (this.state.end_date > this.state.currentDate) {
            NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
        } else if (this.state.start_date > this.state.currentDate) {
            NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
        } else {
            if (this.state.PageNo > 1) {
                this.setState({ PageNo: 1 });
                Data.PageNo = 0;
            }
            else {
                Data.PageNo = this.state.PageNo - 1;
            }
            this.setState({ onLoad: 1, PageNo: 1 })
            this.props.getHttpErrorCodeList(Data);
        }
    };

    // used to handle change event of every input field and set values in states
    handleChangeFromDate = event => {
        this.setState({ start_date: event.target.value });
    };

    // used to handle change event of every input field and set values in states
    handleChangeToDate = event => {
        this.setState({ end_date: event.target.value });
    };

    handleChangeErrorCode = (event) => {
        if ($.isNumeric(event.target.value)) {
            this.setState({ [event.target.name]: event.target.value });
        }
        if (event.target.value === "") {
            this.setState({ [event.target.name]: event.target.value });
        }
    }

    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        var response = false;
        var index;
        const { menudetail } = this.state;
        if (menudetail) {
            if (menudetail.length) {
                for (index in menudetail) {
                    if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
                        response = menudetail[index];
                }
            }
        }
        return response;
    }
    // renders the component
    render() {
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('361C6E9F-816B-673D-5A8D-D980617369F3'); //361C6E9F-816B-673D-5A8D-D980617369F3
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const { ErrorCodeList, intl, drawerClose } = this.props;

        var data = this.state.httpErrors ? this.state.httpErrors : []

        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            download: false,
            rowsPerPage: this.state.Page_Size,
            downloadOptions: {
                filename: 'Http_error_code_list_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            pagination: false,
            sort: false
        };

        // define columns for data tables
        const columns = [
            {
                name: intl.formatMessage({ id: "sidebar.colStatus" })
            },
            {
                name: intl.formatMessage({ id: "sidebar.RequestType" })
            },
            {
                name: intl.formatMessage({ id: "sidebar.Request" })
            },
            {
                name: intl.formatMessage({ id: "sidebar.Time" })
            },

        ];

        return (
            <Fragment>
                {this.props.openData === false ?
                    ErrorCodeList.length !== 0 ?
                        <div className="tableStyle card">
                            <div className="tableHeading">
                                {<IntlMessages id="sidebar.recentHTTPErrors" />}
                                <Tooltip title={<IntlMessages id="HttpErrors.viewMore" />}
                                    disableFocusListener
                                    disableTouchListener
                                >
                                    <a href="javascript:void(0)" className="pull-right m-5" onClick={this.props.OpenHttpErrors} >
                                        <i className="fa fa-angle-double-right" />
                                    </a>
                                </Tooltip>

                            </div>
                            <Table hover bordered responsive>
                                <thead>
                                    <tr>
                                        <th>{<IntlMessages id="sidebar.colStatus" />}</th>
                                        <th>{<IntlMessages id="sidebar.RequestType" />}</th>
                                        <th>{<IntlMessages id="sidebar.Request" />}</th>
                                        <th>{<IntlMessages id="sidebar.Time" />}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ErrorCodeList.map((list, index) => {
                                        return <tr key={index}>
                                            <th>{<Badge color={list.HTTPErrorCode == 200 ? "success" : list.HTTPErrorCode == 401 ? "warning" : "danger"}>{list.HTTPErrorCode}</Badge>}</th>
                                            <td>{<Badge color="primary">{list.MethodType}</Badge>}</td>
                                            <td>{list.Host + "" + list.Path}</td>
                                            <td>{<span className="date">{changeDateFormat(list.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </Table>
                        </div> :
                        <Fragment>
                            <div className="tableStyle card">
                                <div className="tableHeading">
                                    {<IntlMessages id="sidebar.recentHTTPErrors" />}
                                    <Tooltip title={<IntlMessages id="HttpErrors.viewMore" />}
                                        disableFocusListener
                                        disableTouchListener
                                    >
                                        <a href="javascript:void(0)" className="pull-right m-5" onClick={this.props.OpenMostActiveAddress} >
                                            <i className="fa fa-angle-double-right" />
                                        </a>
                                    </Tooltip>
                                </div>
                                <div className="tabel-norecord"><IntlMessages id="wallet.emptyTable" /></div>
                            </div>
                        </Fragment>
                    :
                    <div className="charts-widgets-wrapper jbs-page-content">
                        <WalletPageTitle title={<IntlMessages id="sidebar.HTTPStatus" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={drawerClose} />
                        {this.props.httpErrorsLoading && <JbsSectionLoader />}
                        <div className=" mb-10  Trade-Recon">
                            {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && // check for filter permission
                                <JbsCollapsibleCard>
                                    <div className="top-filter">
                                        <Form className="frm_search tradefrm row">
                                            <FormGroup className="col-md-2 col-sm-4">
                                                <Label for="member_id">
                                                    {
                                                        <IntlMessages id="sidebar.report.tradeRecon.errorCode" />
                                                    }
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="errorCode"
                                                    value={this.state.errorCode}
                                                    id="errorCode"
                                                    onChange={this.handleChangeErrorCode}
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-2 col-sm-4">
                                                <Label for="startDate1">
                                                    {
                                                        <IntlMessages id="traderecon.search.dropdown.label.fromdate" />
                                                    }
                                                </Label>
                                                <Input
                                                    type="date"
                                                    name="start_date"
                                                    value={this.state.start_date}
                                                    id="startDate1"
                                                    placeholder="dd/mm/yyyy"
                                                    max={this.state.currentDate}
                                                    onChange={this.handleChangeFromDate}
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-2 col-sm-4">
                                                <Label for="endDate1">
                                                    {
                                                        <IntlMessages id="traderecon.search.dropdown.label.todate" />
                                                    }
                                                </Label>
                                                <Input
                                                    type="date"
                                                    name="end_date"
                                                    value={this.state.end_date}
                                                    id="endDate1"
                                                    max={this.state.currentDate}
                                                    min={this.state.start_date}
                                                    placeholder="dd/mm/yyyy"
                                                    onChange={this.handleChangeToDate}
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-2 col-sm-4">
                                                <div className="btn_area">
                                                    <Button color="primary" onClick={this.onApply}><IntlMessages id="traderecon.search.dropdown.button.search" /></Button>
                                                    <Button color="danger" className="ml-15" onClick={this.onClear}><IntlMessages id="sidebar.btnClear" /></Button>
                                                </div>
                                            </FormGroup>
                                        </Form>
                                    </div>
                                </JbsCollapsibleCard>
                            }
                            {data && data.length > 0 && (
                                <div className="StackingHistory">
                                    <MUIDataTable
                                        title={<IntlMessages id="sidebar.HTTPStatus" />}
                                        data={data.map(item => {
                                            return [
                                                <span>
                                                    {<Badge color={item.HTTPErrorCode == 200 ? "success" : item.HTTPErrorCode == 401 ? "warning" : "danger"}>{item.HTTPErrorCode}</Badge>}
                                                </span>,
                                                item.MethodType,
                                                item.Path,
                                                <span className="date">{changeDateFormat(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>
                                            ]
                                        })}
                                        columns={columns}
                                        options={options}
                                    />
                                    {this.props.TotalCount > AppConfig.totalRecordDisplayInList ?
                                        <Row className="pagination_area">
                                            <Col md={5} className="mt-20">
                                                <span>Total Pages :- {this.state.TotalPages}</span>
                                            </Col>
                                            <Col md={4} className="text-right">
                                                <div id="pagination_div">
                                                    <Pagination className="pagination"
                                                        activePage={this.state.PageNo}
                                                        itemsCountPerPage={this.state.Page_Size}
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
                                                <span>{this.state.PageNo > 1 ? (this.state.start_row) + (this.state.Page_Size * (this.state.PageNo - 1)) + ' - ' + ((this.state.Page_Size * this.state.PageNo) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.Page_Size * this.state.PageNo)) : (this.state.start_row) + ' - ' + ((this.state.Page_Size * this.state.PageNo) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.Page_Size * this.state.PageNo))} of {this.state.TotalCount} Records</span>
                                            </Col>
                                        </Row>
                                        : null}
                                </div>
                            )}
                        </div>
                    </div>
                }
            </Fragment>
        )
    }
}

const mapStateToProps = ({ APIPlanConfigurationReducer }) => {
    const { TotalCount, TotalPages, httpErrorsFailure, httpErrorsSuccess, httpErrorsLoading } = APIPlanConfigurationReducer;

    return { TotalCount, TotalPages, httpErrorsFailure, httpErrorsSuccess, httpErrorsLoading };
}

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getHttpErrorCodeList
    }
)(injectIntl(ListRecentHTTPErrors));