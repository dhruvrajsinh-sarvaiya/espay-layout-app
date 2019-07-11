/**
 * Create By Sanjay 
 * Created Date 18/03/2019
 * Component For List Most Active Ip Addess 
 */
import React, { Component, Fragment } from 'react';
import IntlMessages from "Util/IntlMessages";
import { Table } from 'reactstrap';

//Added By Tejas Start 4/4/2019
import { injectIntl } from 'react-intl';
// added By Tejas For Connect component to store 
import { connect } from "react-redux";
import Pagination from "react-js-pagination";
//  Used For Display Notification 
import { NotificationManager } from "react-notifications";
import { Form, FormGroup, Label, Input, Row, Col, Button } from "reactstrap";
// used for Mui data table
import MUIDataTable from "mui-datatables";

import Select from "react-select";

import { getUserDataList } from "Actions/MyAccount";

import { changeDateFormat } from "Helpers/helpers";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// used for loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// used for call actions
import { getMostActiveIpAddressReport } from "Actions/APIPlanConfiguration";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';

// import for tooltip
import Tooltip from "@material-ui/core/Tooltip";

import validator from 'validator';

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
        title: <IntlMessages id="sidebar.MostActiveIpAddress" />,
        link: '',
        index: 1
    }
];

// End 

class ListMostActiveIpAddess extends Component {

    // make default state values on load Added By Tejas
    constructor(props) {
        super(props);
        this.state = {
            start_date: new Date().toISOString().slice(0, 10),
            end_date: new Date().toISOString().slice(0, 10),
            currentDate: new Date().toISOString().slice(0, 10),
            onLoad: 0,
            mostActiveAddress: [],
            TotalCount: 0,
            TotalPages: 0,
            start_row: 1,
            Page_Size: AppConfig.totalRecordDisplayInList,
            PageNo: 1,
            open: false,
            userID: '',
            ipAddress: "",
            userName: "",
            menudetail: []
        };
    }

    componentWillMount() {
        this.setState({ menudetail: this.props.menudetail })
        if (this.props.menudetail && this.props.menudetail.length > 0) {
            this.props.getUserDataList();
        }
    }

    //For handle Page Change
    handlePageChange = (pageNumber) => {
        const Data = {
            MemberID: this.state.userID ? parseInt(this.state.userID) : 0,
            FromDate: this.state.start_date,
            ToDate: this.state.end_date,
            PageNo: pageNumber - 1,
            PageSize: this.state.Page_Size,
            IPAddress: this.state.ipAddress !== "" ? this.state.ipAddress : "",
        };

        if ((this.state.start_date !== '' && this.state.end_date === '') || (this.state.end_date !== '' && this.state.start_date === '')) {
            NotificationManager.error(<IntlMessages id="trading.openorders.dateselect" />);
        } else if (this.state.end_date < this.state.start_date) {
            NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
        } else if (this.state.end_date > this.state.currentDate) {
            NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
        } else if (this.state.start_date > this.state.currentDate) {
            NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
        } else if (this.state.ipAddress !== "" && !this.ValidateIpAddress(this.state.ipAddress)) {
            NotificationManager.error(<IntlMessages id="daemonconfigure.error.invalidIPAddress" />);
        } else {

            this.setState({ PageNo: pageNumber, onLoad: 1 });
            this.props.getMostActiveIpAddressReport(Data);
        }
    }

    componentWillReceiveProps(nextprops) {

        if (this.state.TotalCount !== nextprops.TotalCount) {
            this.setState({ TotalCount: nextprops.TotalCount })
        }

        if (this.state.TotalPages !== nextprops.TotalPages) {
            this.setState({ TotalPages: nextprops.TotalPages })
        }

        if (nextprops.mostActiveAddressSuccess && nextprops.mostActiveAddressSuccess.length > 0 && this.state.onLoad) {
            this.setState({
                mostActiveAddress: nextprops.mostActiveAddressSuccess,
                onLoad: 0
            })
        } else if (nextprops.mostActiveAddressFailure && nextprops.mostActiveAddressFailure.ReturnCode === 1 && this.state.onLoad) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.mostActiveAddressFailure.ErrorCode}`} />);
            this.setState({
                mostActiveAddress: [],
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
            onLoad: 0,
            TotalCount: 0,
            TotalPages: 0,
            start_row: 1,
            Page_Size: AppConfig.totalRecordDisplayInList,
            PageNo: 1,
            open: false,
            userID: "",
            userName: "",
            ipAddress: "",
        })
    }

    // apply button for Fetch Trade Recon List
    onApply = event => {
        event.preventDefault();

        const Data = {
            MemberID: this.state.userID ? parseInt(this.state.userID) : 0,
            FromDate: this.state.start_date,
            ToDate: this.state.end_date,
            PageNo: this.state.PageNo - 1,
            PageSize: this.state.Page_Size,
            IPAddress: this.state.ipAddress !== "" ? this.state.ipAddress : "",
        };

        if ((this.state.start_date !== '' && this.state.end_date === '') || (this.state.end_date !== '' && this.state.start_date === '')) {
            NotificationManager.error(<IntlMessages id="trading.openorders.dateselect" />);
        } else if (this.state.end_date < this.state.start_date) {
            NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
        } else if (this.state.end_date > this.state.currentDate) {
            NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
        } else if (this.state.start_date > this.state.currentDate) {
            NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
        } else if (this.state.ipAddress !== "" && !this.ValidateIpAddress(this.state.ipAddress)) {
            NotificationManager.error(<IntlMessages id="daemonconfigure.error.invalidIPAddress" />);
        } else {
            if (this.state.PageNo > 1) {
                this.setState({ PageNo: 1 });
                Data.PageNo = 0;
            }
            else {
                Data.PageNo = this.state.PageNo - 1;
            }
            this.setState({ onLoad: 1, PageNo: 1 })
            this.props.getMostActiveIpAddressReport(Data);
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

    ValidateIpAddress = data => {
        return (validator.isIP(data, 4)) ? true : false;
    };

    // used to handle change event of every input field and set values in states
    handleChangeIpAddress = event => {
        this.setState({ ipAddress: event.target.value });
    };

    onChangeSelectUser = (event) => {
        this.setState({ userID: (typeof (event.value) === "undefined" ? "" : event.value), userName: (typeof (event.label) === "undefined" ? "" : event.label) });
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
    render() {
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('E4383BC6-6B2B-7DBB-A77E-47D19D189441'); //E4383BC6-6B2B-7DBB-A77E-47D19D189441
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const { MostActiveIpAddress, intl, drawerClose } = this.props;

        var data = this.state.mostActiveAddress ? this.state.mostActiveAddress : []
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            download: false,
            rowsPerPage: this.state.Page_Size,
            downloadOptions: {
                filename: 'Most_Active_Addresses_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            pagination: false,
            sort: false
        };

        // define columns for data tables
        const columns = [
            {
                name: intl.formatMessage({ id: "sidebar.user" })
            },
            {
                name: intl.formatMessage({ id: "sidebar.emailAddress" })
            },
            {
                name: intl.formatMessage({ id: "sidebar.IpAddress" })
            },
            {
                name: intl.formatMessage({ id: "sidebar.WhitelistedIp" })
            },
            {
                name: intl.formatMessage({ id: "sidebar.APIAccess" })
            },
            {
                name: intl.formatMessage({ id: "sidebar.AccessedOn" })
            },

        ];


        return (
            <Fragment>
                {this.props.openData === false ?
                    MostActiveIpAddress.length !== 0 ?
                        <div className="mt-25 tableStyle card">
                            <div className="tableHeading">
                                {<IntlMessages id="sidebar.MostActiveAddress" />}
                                <Tooltip title={<IntlMessages id="HttpErrors.viewMore" />}
                                    disableFocusListener
                                    disableTouchListener
                                >
                                    <a href="javascript:void(0)" className="pull-right m-5" onClick={this.props.OpenMostActiveAddress} >
                                        <i className="fa fa-angle-double-right" />
                                    </a>
                                </Tooltip>
                            </div>
                            <Table hover bordered responsive>
                                <thead>
                                    <tr>
                                        <th>{<IntlMessages id="sidebar.user" />}</th>
                                        <th>{<IntlMessages id="sidebar.IpAddress" />}</th>
                                        <th>{<IntlMessages id="sidebar.WhitelistedIp" />}</th>
                                        <th>{<IntlMessages id="sidebar.APIAccess" />}</th>
                                        <th>{<IntlMessages id="sidebar.AccessedOn" />}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MostActiveIpAddress.map((list, index) => {
                                        return <tr key={index}>
                                            <th>{list.UserName}</th>
                                            <td>{list.IPAddress}</td>
                                            <td>{list.WhitelistIP === 0 ? "Yes" : "No"}</td>
                                            <td>{list.Host + "" + list.Path}</td>
                                            <td>{<span className="date">{changeDateFormat(list.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>}</td>
                                        </tr>

                                    })} </tbody>
                            </Table>
                        </div> :
                        <Fragment>
                            <div className="mt-25 tableStyle card">
                                <div className="tableHeading">
                                    {<IntlMessages id="sidebar.MostActiveAddress" />}
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
                        <WalletPageTitle title={<IntlMessages id="sidebar.MostActiveIpAddress" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={drawerClose} />
                        {(this.props.mostActiveAddressLoading || this.props.userListLoading) && <JbsSectionLoader />}
                        <div className=" mb-10  Trade-Recon">
                            {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && // check for filter permission
                                <JbsCollapsibleCard>
                                    <div className="top-filter">
                                        <Form className="frm_search tradefrm row">
                                            <FormGroup className="col-md-2 col-sm-4">
                                                <Label for="UserId"><IntlMessages id="my_account.userName" /></Label>
                                                <Select className="r_sel_20"
                                                    options={userlist.map((user) => ({
                                                        label: user.UserName,
                                                        value: user.Id,
                                                    }))}
                                                    onChange={this.onChangeSelectUser}
                                                    value={{ label: this.state.userName }}
                                                    maxMenuHeight={200}
                                                    placeholder={<IntlMessages id="sidebar.searchdot" />}
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
                                                <Label for="trn_no">
                                                    {
                                                        <IntlMessages id="sidebar.colIPAddress" />
                                                    }
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="TrnNo"
                                                    value={this.state.ipAddress}
                                                    id="TrnNo"
                                                    onChange={this.handleChangeIpAddress}
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
                                        title={<IntlMessages id="sidebar.MostActiveAddress" />}
                                        data={data.map(item => {
                                            return [
                                                item.UserName,
                                                item.EmailID,
                                                item.IPAddress,
                                                item.WhitelistIP === 0 ?
                                                    <span>{<IntlMessages id="sidebar.no" />}</span> :
                                                    <span>{<IntlMessages id="sidebar.yes" />}</span>,
                                                item.Host + "" + item.Path,
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

const mapStateToProps = ({ actvHstrRdcer, APIPlanConfigurationReducer }) => {
    const { mostActiveAddressFailure, mostActiveAddressSuccess, mostActiveAddressLoading } = APIPlanConfigurationReducer;
    const TotalCount = APIPlanConfigurationReducer.TotalCountIp;
    const TotalPages = APIPlanConfigurationReducer.TotalPagesIp;
    const { getUser } = actvHstrRdcer;
    const userListLoading = actvHstrRdcer.loading;

    return { getUser, userListLoading, TotalCount, TotalPages, mostActiveAddressFailure, mostActiveAddressSuccess, mostActiveAddressLoading };
}

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getMostActiveIpAddressReport,
        getUserDataList
    }
)(injectIntl(ListMostActiveIpAddess));

