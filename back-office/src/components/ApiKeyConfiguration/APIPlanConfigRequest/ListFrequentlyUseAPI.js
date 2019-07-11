/**
 * Create By Sanjay
 * Created Date 18/03/2019
 * Component For List Frequently Use API
 */
import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import { connect } from "react-redux"; //use for connet react and redux
import { injectIntl } from "react-intl"; //support multilangauge support
import { NotificationManager } from "react-notifications"; //for showing Notification
import { Table, Form, Label, Input, Row, Col, Button, FormGroup } from "reactstrap"; //for style Component
import MUIDataTable from "mui-datatables"; //for Data table
import Select from "react-select";//for Searchable Dropdown
import Pagination from "react-js-pagination";//Pagination For Table
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //use Component For Loader
import WalletPageTitle from "Components/PageTitleBar/WalletPageTitle"; //Use for Page Title
import { changeDateFormat } from "Helpers/helpers";
import AppConfig from "Constants/AppConfig"; //use all globel variable from this
import { getAPIWiseReport } from 'Actions/APIPlanConfiguration';
import { getUserDataList } from "Actions/MyAccount";

//BreadCrumbData
const BreadCrumbData = [
    {
        title: <IntlMessages id="sidebar.app" />,
        link: "",
        index: 0,
    },
    {
        title: <IntlMessages id="sidebar.dashboard" />,
        link: "",
        index: 0,
    },
    {
        title: <IntlMessages id="sidebar.ApiKeyConfiguration" />,
        link: "",
        index: 0,
    },
    {
        title: <IntlMessages id="sidebar.mostFrequentApiuse" />,
        link: "",
        index: 1,
    },
];

//Columns Object for table
const columns = [
    {
        name: <IntlMessages id="sidebar.username" />,
    },
    {
        name: <IntlMessages id="sidebar.Status" />,
    },
    {
        name: <IntlMessages id="sidebar.HTTPStatus" />,
    },
    {
        name: <IntlMessages id="sidebar.Request" />,
    },
    {
        name: <IntlMessages id="sidebar.AccessedOn" />,
    },
];

class ListFrequentlyUseAPI extends Component {
    state = {
        Data: [],
        open: false,
        getFilter: {
            PageNo: 0,
            Pagesize: AppConfig.totalRecordDisplayInList,
            FromDate: "",
            ToDate: "",
            MemberID: "",
        },
        loading: true,
        showReset: false,
        totalCount: 0,
        menudetail: []
    };

    componentWillMount() {
        this.setState({ menudetail: this.props.menudetail })
        if (this.props.menudetail && this.props.menudetail.length > 0) {
            var newObj = Object.assign({}, this.state.getFilter);
            newObj.PageNo = 0;
            newObj.Pagesize = AppConfig.totalRecordDisplayInList;
            this.setState({ getFilter: newObj });
            this.props.getAPIWiseReport(newObj);
            this.props.getUserDataList();
        }
    }

    clearFilter = () => {
        let newObj = Object.assign({}, this.state.getFilter);
        newObj.PageNo = 0;
        newObj.Pagesize = AppConfig.totalRecordDisplayInList;
        newObj.MemberID = "";
        this.setState({ showReset: false, getFilter: newObj });
        this.props.getAPIWiseReport(newObj);
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }
        if (nextProps.apiWiseData.ReturnCode === 0) {
            this.setState({
                Data: nextProps.apiWiseData.Response,
                totalCount: nextProps.apiWiseData.TotalCount
            });
        } else if (nextProps.apiWiseData.ReturnCode === 1) {
            var errMsg = nextProps.apiWiseData.ErrorCode === 1 ? (nextProps.apiWiseData.ReturnMsg) : (<IntlMessages id={`apiErrCode.${nextProps.apiWiseData.ErrorCode}`} />);
            this.setState({
                Data: nextProps.apiWiseData.Response,
                totalCount: nextProps.apiWiseData.TotalCount
            });
            NotificationManager.error(errMsg);
        }
    }

    getFilterData = () => {
        this.setState({ showReset: true, loading: true });
        let newObj = Object.assign({}, this.state.getFilter);
        newObj.MemberID = parseInt(newObj.MemberID, 10);
        newObj.PageNo = 0;
        newObj.Pagesize = AppConfig.totalRecordDisplayInList;
        this.props.getAPIWiseReport(newObj);
    };

    handlePageChange = (pageNumber) => {
        this.setState({
            getFilter: {
                ...this.state.getFilter,
                PageNo: pageNumber - 1,
            },
        });
        this.props.getAPIWiseReport({
            ...this.state.getFilter,
            PageNo: pageNumber - 1,
        });
    };

    onChangeRowsPerPage = (event) => {
        this.setState({
            getFilter: {
                ...this.state.getFilter,
                PageNo: 0,
                Pagesize: event.target.value,
            },
        });
        this.props.getAPIWiseReport({
            ...this.state.getFilter,
            PageNo: 0,
            Pagesize: event.target.value,
        });
    };

    handleChange = (event) => {
        let newObj = Object.assign({}, this.state.getFilter);
        newObj[event.target.name] = event.target.value;
        this.setState({ getFilter: newObj, loading: false });
    };

    onChangeSelectUser = (event) => {
        this.setState({
            getFilter: {
                ...this.state.getFilter,
                MemberID: event.value
            }, loading: false
        });
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('BF6C5F9C-A530-0D6D-7EC8-D78231F33DDA'); //FD169CF2-5F24-8A1D-7E08-24C6F2801E07
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const { Data, totalCount, loading } = this.state;
        const { PageNo, Pagesize, FromDate, ToDate } = this.state.getFilter;
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        const { FrequentUse, drawerClose } = this.props;
        let today = new Date();
        today = today.getFullYear() + "-" + (today.getMonth() + 1 < 10 ? "0" : "") + (today.getMonth() + 1) + "-" + (today.getDate() < 10 ? "0" : "") + today.getDate();
        const options = {
            filterType: "select",
            responsive: "scroll",
            selectableRows: false,
            resizableColumns: false,
            search: false, //menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            print: false,
            download: false,
            viewColumns: false,
            filter: false,
            sort: false,
            serverSide: Data.length !== 0 ? true : false,
            page: PageNo,
            count: totalCount,
            rowsPerPage: Pagesize,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                },
            },
            customFooter: (count, page, rowsPerPage) => {
                return (
                    <Fragment>
                        {count > AppConfig.totalRecordDisplayInList &&
                            <Row className="pagination_area">
                                <Col md={4} sm={12} className="p_total"><div className="m-15"><IntlMessages id="pagination.totalCount" />{count}</div></Col>
                                <Col md={8} sm={12} className="p_info">
                                    <ul className="text-right m-15 paginationmain">
                                        <li className="pagerecord p_rowperpage">
                                            <ul>
                                                <li><IntlMessages id="pagination.rowPerPage" /></li>
                                                <li><Input type="select" name="rowPerPage" value={rowsPerPage} onChange={this.onChangeRowsPerPage}>
                                                    {/* CODE ADDED BY DEVANG PAREKH FOR HANDLE ROW PER PAGE FROM APP CONFIG (9-4-2019) */}
                                                    {
                                                        AppConfig.rowsPerPageOptions.map((item, key) => {
                                                            return <option key={key}>{item}</option>
                                                        })
                                                    }
                                                    {/* code end */}
                                                </Input>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="clearfix p_no">
                                            <Pagination
                                                hideDisabled
                                                prevPageText={<span aria-hidden="true" className="ti-angle-left"></span>}
                                                nextPageText={<span aria-hidden="true" className=" ti-angle-right"></span>}
                                                firstPageText={<span aria-hidden="true" className="ti-angle-double-left"></span>}
                                                lastPageText={<span aria-hidden="true" className="ti-angle-double-right"></span>}
                                                activePage={page + 1}
                                                itemsCountPerPage={rowsPerPage}
                                                totalItemsCount={count}
                                                pageRangeDisplayed={5}
                                                onChange={this.handlePageChange}
                                            />
                                        </li>
                                        <li className="pagerecord p_records">
                                            <span>{(page + 1) > 1 ? (1) + (rowsPerPage * (page)) + ' - ' + ((rowsPerPage * (page + 1)) > count ? (count) : (rowsPerPage * (page + 1))) : (1) + ' - ' + ((rowsPerPage * (page + 1)) > count ? (count) : (rowsPerPage * (page + 1)))} of {count} Records</span>
                                        </li>
                                    </ul>
                                </Col>
                            </Row>
                        }
                    </Fragment>
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.setState({
                        GetData: {
                            ...this.state.Getdata,
                            PageNo: tableState.page,
                            Pagesize: tableState.rowsPerPage,
                        },
                    });
                    this.props.getAPIWiseReport({
                        ...this.state.Getdata,
                        PageNo: tableState.page,
                        Pagesize: tableState.rowsPerPage,
                    });
                }
            },
        };
        return (
            <Fragment>
                {this.props.openFrequent === false ? (
                    FrequentUse.length !== 0 ? (
                        <div className="mt-25 mb-25 tableStyle card">
                            <div className="tableHeading">
                                {<IntlMessages id="sidebar.mostFrequentApiuse" />}
                                <a href="javascript:void(0)" className="pull-right m-5" onClick={this.props.OpenFrequentAPI} >
                                    <i className="fa fa-angle-double-right" />
                                </a>
                            </div>
                            <Table hover bordered responsive>
                                <thead>
                                    <tr>
                                        <th>
                                            {
                                                <IntlMessages id="sidebar.Status" />
                                            }
                                        </th>
                                        <th>
                                            {
                                                <IntlMessages id="sidebar.HTTPStatus" />
                                            }
                                        </th>
                                        <th>
                                            {
                                                <IntlMessages id="sidebar.Request" />
                                            }
                                        </th>
                                        <th>
                                            {
                                                <IntlMessages id="sidebar.AccessedOn" />
                                            }
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {FrequentUse.map((list, index) => {
                                        return (
                                            <tr key={index}>
                                                <th>
                                                    {list.Status === 0
                                                        ? "Success"
                                                        : "Failure"}
                                                </th>
                                                <td>{list.HTTPStatusCode}</td>
                                                <td>
                                                    {list.Host + "" + list.Path}
                                                </td>
                                                <td>
                                                    {
                                                        <span className="date">
                                                            {changeDateFormat(
                                                                list.CreatedDate,
                                                                "YYYY-MM-DD HH:mm:ss"
                                                            )}
                                                        </span>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                            <Fragment>
                                <div className="mt-25 tableStyle card">
                                    <div className="tableHeading">
                                        {<IntlMessages id="sidebar.mostFrequentApiuse" />}
                                        <a href="javascript:void(0)" className="pull-right m-5" onClick={this.props.OpenFrequentAPI} >
                                            <i className="fa fa-angle-double-right" />
                                        </a>
                                    </div>
                                    <div className="tabel-norecord">
                                        <IntlMessages id="wallet.emptyTable" />
                                    </div>
                                </div>
                            </Fragment>
                        )
                ) : (
                        <div className="jbs-page-content">
                            <WalletPageTitle
                                title={<IntlMessages id="sidebar.mostFrequentApiuse" />}
                                breadCrumbData={BreadCrumbData}
                                drawerClose={drawerClose}
                                closeAll={drawerClose}
                            />
                            {this.props.loading && <JbsSectionLoader />}
                            {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && // check for filter permission
                                <div className="top-filter">
                                    <Form className="frm_search tradefrm row">
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="startDate">
                                                <IntlMessages id="my_account.startDate" />
                                            </Label>
                                            <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={FromDate} max={today} onChange={this.handleChange} />
                                        </FormGroup>
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="endDate">
                                                <IntlMessages id="my_account.endDate" />
                                            </Label>
                                            <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate} min={FromDate} max={today} onChange={this.handleChange} />
                                        </FormGroup>
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="UserId"><IntlMessages id="my_account.userName" /></Label>
                                            <Select className="r_sel_20"
                                                options={userlist.map((user) => ({
                                                    label: user.UserName,
                                                    value: user.Id,
                                                }))}
                                                onChange={this.onChangeSelectUser}
                                                maxMenuHeight={200}
                                                placeholder={<IntlMessages id="sidebar.searchdot" />}
                                            />
                                        </FormGroup>
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <div className="btn_area">
                                                <Button color="primary" disabled={loading} onClick={this.getFilterData}><IntlMessages id="widgets.apply" /></Button>
                                                <Button color="danger" className="ml-15" onClick={this.clearFilter}><IntlMessages id="bugreport.list.dialog.button.clear" /></Button>
                                            </div>
                                        </FormGroup>
                                    </Form>
                                </div>
                            }
                            <div className="StackingHistory statusbtn-comm">
                                <MUIDataTable
                                    title={<IntlMessages id="sidebar.mostFrequentApiuse" />}
                                    columns={columns}
                                    options={options}
                                    data={Data.map((lst, key) => {
                                        return [
                                            lst.UserName,
                                            lst.Status === 0 ? "Success" : "Failure",
                                            lst.HTTPStatusCode,
                                            lst.Host + "" + lst.Path,
                                            <span className="date">{changeDateFormat(lst.CreatedDate, "YYYY-MM-DD HH:mm:ss")}</span>
                                        ];
                                    })}
                                />
                            </div>
                        </div>
                    )}
            </Fragment>
        );
    }
}

const mapStateToProps = ({ drawerclose, actvHstrRdcer, APIPlanConfigurationReducer }) => {
    const { apiWiseData, loading } = APIPlanConfigurationReducer;
    const { getUser } = actvHstrRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2;
        }, 1000);
    }
    return { drawerclose, apiWiseData, getUser, loading };
};

// export this component with action methods and props
export default connect(mapStateToProps, {
    getAPIWiseReport,
    getUserDataList
})(injectIntl(ListFrequentlyUseAPI));