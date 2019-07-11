/* 
    Developer : Parth Andhariya
    Date : 15-04-2019
    File Comment : IP Wise Request report component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import IntlMessages from "Util/IntlMessages";
import { NotificationManager } from "react-notifications";
import { injectIntl } from 'react-intl';
import MUIDataTable from "mui-datatables";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { getIPWiseRequestReport } from "Actions/IPWiseRequestReportAction";
import AppConfig from 'Constants/AppConfig';
//custom footer from widgets
import { CustomFooter } from "Components/MyAccount/Dashboards/Widgets";
import { changeDateFormat } from "Helpers/helpers";
import { isScriptTag } from 'Helpers/helpers';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';

const initState = {
    PageNo: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    TotalCount: 0,
    showReset: false,
    IPAddress: "",
    FromDate: "",
    ToDate: "",
    Today: new Date().toISOString().slice(0, 10),
    error: "",
    notificationFlag: true,
    menudetail: [],
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
        title: <IntlMessages id="sidebar.ApiKeyConfiguration" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.IPWiseRequestReport" />,
        link: '',
        index: 1
    },
];

class IPWiseRequestReport extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }

    //will mount fetch data...
    componentWillMount() {
        this.props.getMenuPermissionByID('4A1605E2-80EE-1A93-9E57-A32B4F0D8599'); // get wallet menu permission
    }

    //Get List From Server API...
    getListFromServer = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.PageNo;
        newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.PageSize;
        this.setState(newObj);
        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        delete reqObj.showReset;
        delete reqObj.TotalCount;
        delete reqObj.Today;
        this.props.getIPWiseRequestReport(reqObj);
    };

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getListFromServer(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListFromServer(1, event.target.value);
    }

    // will receive props update state..
    componentWillReceiveProps(nextProps) {
        if (this.state.TotalCount != nextProps.TotalCount) {
            this.setState({ TotalCount: nextProps.TotalCount })
        }

        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.getListFromServer(this.state.PageNo, this.state.PageSize);
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    // close all drawer...
    closeAll = () => {
        this.props.closeAll();
    };

    //onchange handler...
    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    // apply filter 
    applyFilter() {
        if (this.state.FromDate !== '' || this.state.ToDate !== '' || this.state.IPAddress !== '') {
            if (isScriptTag(this.state.IPAddress)) {
                this.setState({ error: "my_account.err.scriptTag" })
            } else {
                this.getListFromServer(1, this.state.PageSize);
                this.setState({ showReset: true });
            }
        }
    }

    //reset filter 
    clearFilter() {
        this.setState(initState, () => this.getListFromServer(this.state.PageNo, this.state.PageSize));
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
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('CA365DF0-9CC1-16DC-73CC-6197EBCA80D6'); //CA365DF0-9CC1-16DC-73CC-6197EBCA80D6
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const { intl } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "sidebar.colAffiliateUserName" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.email" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colIPAddress" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.Path" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "daemonconfigure.daemonaddform.form.label.host" }),
                options: { sort: false, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.date" }),
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
            serverSide: this.props.IpWiseReport.length !== 0 ? true : false,
            page: this.state.PageNo,
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalCount,
            search: false,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customFooter: (count, page, rowsPerPage) => {
                var tblPage = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter
                        count={count}
                        page={tblPage}
                        rowsPerPage={rowsPerPage}
                        handlePageChange={this.handlePageChange}
                        onChangeRowsPerPage={this.onChangeRowsPerPage}
                    />
                );
            },
        };

        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.IPWiseRequestReport" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                    <JbsCollapsibleCard>
                        <div className="top-filter">
                            <Form className="tradefrm row">
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="startDate"><IntlMessages id="widgets.startDate" /></Label>
                                    <Input type="date" name="FromDate" id="startDate" placeholder="dd/mm/yyyy" value={this.state.FromDate} onChange={(e) => this.onChangeHandler(e)} max={this.state.Today} />
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="endDate"><IntlMessages id="widgets.endDate" /></Label>
                                    <Input type="date" name="ToDate" id="endDate" placeholder="dd/mm/yyyy" value={this.state.ToDate} onChange={(e) => this.onChangeHandler(e)} max={this.state.Today} />
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="IPAddress2"><IntlMessages id="sidebar.colIPAddress" /></Label>
                                    <Input type="text" name="IPAddress" id="IPAddress2" placeholder={intl.formatMessage({ id: "sidebar.colIPAddress" })} value={this.state.IPAddress} onChange={(e) => this.onChangeHandler(e)} maxLength={20} />
                                    {this.state.error && (
                                        <span className="text-danger">
                                            <IntlMessages id={this.state.error} />
                                        </span>
                                    )}
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <div className="btn_area">
                                        <Button color="primary" variant="raised" className="text-white" onClick={() => this.applyFilter()} disabled={(this.state.FromDate !== '' && this.state.ToDate !== '') || this.state.IPAddress ? false : true}><IntlMessages id="widgets.apply" /></Button>
                                        {this.state.showReset && <Button className="ml-15 btn-success text-white" onClick={(e) => this.clearFilter()}><IntlMessages id="bugreport.list.dialog.button.clear" /></Button>}
                                    </div>
                                </FormGroup>
                            </Form>
                        </div>
                    </JbsCollapsibleCard>
                }
                <div className="StackingHistory">
                    <MUIDataTable
                        data={this.props.IpWiseReport.map(item => {
                            return [
                                item.UserName,
                                item.EmailID,
                                item.IPAddress,
                                item.Path,
                                item.Host,
                                changeDateFormat(item.CreatedDate, 'YYYY-MM-DD')
                            ];
                        })}
                        columns={columns}
                        options={options}
                    /></div>
            </div>
        );
    }
}

const mapStateToProps = ({ IPWiseRequest, authTokenRdcer }) => {
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { loading, TotalCount, IpWiseReport } = IPWiseRequest;
    return { loading, TotalCount, IpWiseReport, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getIPWiseRequestReport,
    getMenuPermissionByID
})(injectIntl(IPWiseRequestReport));