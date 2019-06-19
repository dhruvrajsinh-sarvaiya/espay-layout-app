/* 
    Developer : Bharat Jograna
    Date : 11-02-2019
    update by  : 
    File Comment : Referral Deposite Report Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { CustomFooter } from './Widgets';
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { Form, FormGroup, Label, Input, Row, Col } from "reactstrap";
import Button from "@material-ui/core/Button";
import { DashboardPageTitle } from './DashboardPageTitle';
import 'rc-drawer/assets/index.css';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
//Actions
import { depositReport } from 'Actions/MyAccount';
import { changeDateFormat } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
// validation
import validateReferaals from '../../../validation/MyAccount/ReferralReport';


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
        title: <IntlMessages id="sidebar.adminPanel" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="my_account.referral" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.ReferralDepositeReport" />,
        link: '',
        index: 0
    }
];


//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colUserName" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colCurrency" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colCommissionrate" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colAddess" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colCommission" />,
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: <IntlMessages id="sidebar.colDate" />,
        options: {
            filter: true,
            sort: true,
        }
    }
];


// Component for MyAccount KYC Configuration Dashboard
class DepositeReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                PageIndex: 1,
                Page_Size: 10,
                Currency: '',
                username: '',
                FromDate: new Date().toISOString().slice(0, 10),
                ToDate: new Date().toISOString().slice(0, 10)
            },
            showReset: false,
            loading: false,
            totalCount: 0,
            errors: {},
            DepositeList: []
        }

    }


    onChange = (event) => {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }


    applyFilter = (event) => {
        // event.preventDefault();
        var newObj = Object.assign({}, this.state.data);
        newObj.PageIndex = 1;
        newObj.Page_Size = this.state.data.Page_Size;
        const { errors, isValid } = validateReferaals(newObj);
        if (isValid) {
            this.props.depositReport(newObj);
            this.setState({ showReset: true });
        }
        this.setState({ errors: errors })
    }


    clearFilter = () => {
        var newObj = Object.assign({}, this.state.data);
        newObj.FromDate = new Date().toISOString().slice(0, 10);
        newObj.ToDate = new Date().toISOString().slice(0, 10);
        newObj.Currency = "";
        newObj.username = "";
        newObj.PageIndex = 0;
        newObj.Page_Size = 10;
        this.setState({ showReset: false, data: newObj });
        this.props.depositReport(newObj);
    }


    closeAll = () => {
        this.props.closeAll();
    }


    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading });
        if (nextProps.DepositData.ReturnCode === 1) {
            var errMsg = nextProps.DepositData.ErrorCode === 1 ? nextProps.DepositData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.DepositData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.DepositData.ReturnCode === 0) {
            this.setState({ DepositeList: nextProps.DepositData.referral, totalCount: nextProps.DepositData.TotalCount });
            // NotificationManager.success(nextProps.DepositData.ReturnMsg);
        }
    }


    componentWillMount() {
        this.getListLoginHistory(this.state.data.PageIndex, this.state.data.Page_Size);
    }


    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getListLoginHistory(pageNumber);
    }


    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListLoginHistory(1, event.target.value);
    };


    //Get Login History Data form API...
    getListLoginHistory = (PageIndex, Page_Size) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageIndex'] = PageIndex > 0 ? PageIndex : this.state.data.PageIndex;
        if (Page_Size > 0) {
            newObj['Page_Size'] = Page_Size > 0 ? Page_Size : this.state.data.Page_Size;
        }
        this.setState({ data: newObj });
        //For Action API...
        var reqObj = newObj;
        reqObj.PageIndex = PageIndex > 0 ? PageIndex - 1 : 1;
        this.props.depositReport(reqObj);
    }


    render() {
        const { DepositeList, errors, totalCount } = this.state;
        const { drawerClose, loading } = this.props;
        const { username, FromDate, ToDate, PageIndex, Page_Size } = this.state.data;

        const options = {
            filterType: "select",
            responsive: "scroll",
            selectableRows: false,
            resizableColumns: false,
            viewColumns: false,
            filter: false,
            download: false,
            serverSide: DepositeList.length !== 0 ? true : false,
            page: PageIndex,
            count: totalCount,
            rowsPerPage: Page_Size,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            downloadOptions: {
                filename: 'Login_History_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getSendMailList(tableState.page, tableState.rowsPerPage);
                }
            }
        };
        return (
            <div className="jbs-page-content">
                <DashboardPageTitle title={<IntlMessages id="my_account.ReferralDepositeReport" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {loading
                    ?
                    <JbsSectionLoader />
                    :
                    <div className="StackingHistory">
                        <JbsCollapsibleCard>
                            <div className="col-md-12">
                                <div className="top-filter clearfix p-20">
                                    <Form className="tradefrm">
                                        <Row>
                                            <Col sm={2}>
                                                <FormGroup className="mb-5  mt-10">
                                                    <Label for="startDate"><IntlMessages id="my_account.startDate" /></Label>
                                                    <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={FromDate} onChange={this.onChange} />
                                                </FormGroup>
                                            </Col>
                                            <Col sm={2}>
                                                <FormGroup className="mb-5  mt-10">
                                                    <Label for="endDate"><IntlMessages id="my_account.endDate" /></Label>
                                                    <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate} onChange={this.onChange} />
                                                </FormGroup>
                                            </Col>
                                            <Col sm={2}>
                                                <FormGroup className="mb-5 mt-10">
                                                    <Label for="Status"><IntlMessages id="sidebar.colCurrency" /></Label>
                                                    <Input type="select" name="Status" id="Status" value={Status} onChange={this.onChange}>
                                                        <option value="ATCC_BTC">ATCC_BTC</option>
                                                        <option value="ATCC_INR">ATCC_INR</option>
                                                        <option value="INR_BTC">INR_BTC</option>
                                                    </Input>
                                                    {errors.Status && <div className="text-danger text-left"><IntlMessages id={errors.Status} /></div>}
                                                </FormGroup>
                                            </Col>
                                            <Col sm={2}>
                                                <FormGroup className="mb-5 mt-10">
                                                    <Label for="username"><IntlMessages id="sidebar.username" /></Label>
                                                    <IntlMessages id="sidebar.searchdot">
                                                        {(placeholder) =>
                                                            <Input type="text" name="username" id="username" placeholder={placeholder} value={username} onChange={this.onChange} />
                                                        }
                                                    </IntlMessages>
                                                    {errors.username && <div className="text-danger text-left"><IntlMessages id={errors.username} /></div>}
                                                </FormGroup>
                                            </Col>

                                            <Col sm={2} className="d-inline-block">
                                                <div className="d-inline-block">
                                                    <FormGroup className="mb-5 mt-10">
                                                        <Label className="d-block mt-10">&nbsp;</Label>
                                                        <Button color="primary" variant="raised" className="mr-10 text-white" onClick={this.applyFilter}><IntlMessages id="widgets.apply" /></Button>
                                                    </FormGroup>
                                                </div>
                                                <div className="d-inline-block">
                                                    {this.state.showReset && <FormGroup className="mb-5">
                                                        <Label className="d-block mt-10">&nbsp;</Label>
                                                        <Button className="btn-success text-white" onClick={this.clearFilter}>
                                                            <IntlMessages id="bugreport.list.dialog.button.clear" />
                                                        </Button>
                                                    </FormGroup>}
                                                </div>
                                            </Col>

                                        </Row>
                                    </Form>
                                </div>
                            </div>
                        </JbsCollapsibleCard>
                        <div className="StackingHistory mt-20 statusbtn-comm">
                            <MUIDataTable
                                title={<IntlMessages id="my_account.ReferralDepositeReport" />}
                                columns={columns}
                                options={options}
                                data={
                                    DepositeList.map((lst, key) => {
                                        return [
                                            lst.username,
                                            lst.currency,
                                            lst.commrate,
                                            lst.address == "" ? "-" : lst.address,
                                            lst.commearn,
                                            changeDateFormat(lst.Createddate, 'YYYY-MM-DD'),
                                        ]
                                    })
                                }
                            />
                        </div>
                    </div>
                }
            </div>
        );
    }
}

//Mapstatetoprops...
const mapStateToProps = ({ ReferralReport }) => {
    const { DepositData, loading } = ReferralReport;
    return { DepositData, loading };
}

export default connect(mapStateToProps, {
    depositReport
})(DepositeReport);
