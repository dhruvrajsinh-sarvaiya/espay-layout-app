/* 
    Developer : Vishva shah
    Date : 23-05-2019
    File Comment : Staking History Report Component
*/
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { Form,FormGroup, Label, Input,Row } from "reactstrap";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import "rc-drawer/assets/index.css";
import IntlMessages from "Util/IntlMessages";
import { injectIntl } from 'react-intl';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import MUIDataTable from "mui-datatables";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import {
    getStakingHistoryList,
} from "Actions/StakingHistoryReport";
import { changeDateFormat } from "Helpers/helpers";
import { CustomFooter } from 'Components/MyAccount/Dashboards/Widgets/CustomFooter';
import classnames from "classnames";
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { Table } from 'reactstrap';
import Slide from "@material-ui/core/Slide";
import Select from "react-select";
import { getUserDataList } from "Actions/MyAccount";
import { NotificationManager } from 'react-notifications';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
const initState = {
    Page: 1,
    PageSize: AppConfig.totalRecordDisplayInList,
    selectedRows: [],
    showDialog: false,
    FromDate: "",
    ToDate: "",
    Type: "",
    Slab: "",
    StakingType: "",
    TotalCount: 0,
    Today: new Date().toISOString().slice(0, 10),
    showReset: false,
    UserId: "",
    UserLabel: null,
    menudetail: [],
    notificationFlag: true,
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
        title: <IntlMessages id="sidebar.wallet" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="wallet.StakingHistoryReport" />,
        link: '',
        index: 1
    },
];

class StakingHistoryReport extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.handlePageChange = this.handlePageChange.bind(this);
    }
      //Pagination Change Method...
      handlePageChange(pageNumber) {
        this.getListFromServer(pageNumber);
    }
    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListFromServer(1, event.target.value);
    };
    getListFromServer = (Page, PageSize) => {
        var newObj = Object.assign({}, this.state);
        newObj['Page'] = Page > 0 ? Page : this.state.Page;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.PageSize;
        }
        this.setState(newObj);
        //For Action API...
        var reqObj = newObj;
        reqObj.Page = Page > 0 ? Page - 1 : 1;
        this.props.getStakingHistoryList(reqObj);
    }
     //onchange select user
     onChangeSelectUser(e) {
        this.setState({ UserId: e.value, UserLabel: { label: e.label } });
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('F493156B-2265-2682-3E4A-53F7A7C55A5E'); // get wallet menu permission
    }
    // will receive props update state..
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getUserDataList();
                this.getListFromServer(1, this.state.PageSize);
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) { 
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
        if (this.state.TotalCount != nextProps.TotalCount) {
            this.setState({ TotalCount: nextProps.TotalCount });
        }
    }
    // close all drawer...
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            pagedata: {}
        });
    };  
    // apply filter 
    applyFilter() {
        if (this.state.FromDate !== '' || this.state.ToDate !== '' || this.state.Type !== ''|| this.state.Slab !== '' || this.state.UserId!== '' || this.state.StakingType !== '') {
            this.setState({ showReset: true},this.getListFromServer(1, this.state.PageSize));
        }
    }
    //reset filter 
    clearFilter() { 
        this.setState({...initState},()=>this.getListFromServer(1, this.state.PageSize));
    }
     // change filter...
     onChangeDate(e, key) {
        e.preventDefault();
        this.setState({ [key]: e.target.value });
    }
    viewDetail = (selectedRows) => {
        this.setState({
            showDialog: true,
            selectedRows: selectedRows
        });
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
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        /* check menu permission */
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('A5200254-2B49-8275-3BAE-146129C827D4'); //A5200254-2B49-8275-3BAE-146129C827D4
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const { drawerClose, intl } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "sidebar.colId" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "widgets.user" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "wallet.StakingType" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "wallet.slabtype" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.currency" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "table.amount" }),
                options: { sort: true, filter: false }
            },
            {
                name: intl.formatMessage({ id: "wallet.MaturityDate" }),
                options: { sort: true, filter: false }
            },
             {
                name: intl.formatMessage({ id: "lable.status" }),
                options: { sort: true, filter: false ,
                    customBodyRender: (value, tableMeta, updateValue) => {
                    return (<span
                        className={classnames({
                            "badge badge-danger": (value === 0 || value === 9),
                            "badge badge-success": (value === 1),
                            "badge badge-warning": (value ===4),
                            "badge badge-info": (value === 5),
                        })}
                    >
                        {this.props.intl.formatMessage({
                            id: "wallet.stakinhghistorystatus." + value,
                        })}
                    </span>)
                }}
            },
            {
                name: intl.formatMessage({ id: "sidebar.colAction" }),
                options: { sort: false, filter: false }
            },
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            download: false,
            viewColumns: false,
            filter: false,
            print: false,
            search: false, //for check search permission
            serverSide: true,
            page: this.state.Page,
            rowsPerPage: this.state.PageSize,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            count: this.state.TotalCount,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customFooter: (count, page, rowsPerPage) => {
                var page = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
        };
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="wallet.StakingHistoryReport" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                    <JbsCollapsibleCard>
                    <div className="top-filter">
                        <Form className="tradefrm row">
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="FromDate"><IntlMessages id="widgets.startDate" /></Label>
                                <Input
                                    type="date"
                                    name="FromDate"
                                    id="FromDate"
                                    placeholder="dd/mm/yyyy"
                                    value={this.state.FromDate}
                                    max = {this.state.Today}
                                    onChange={e => this.onChangeDate(e, "FromDate")}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="ToDate"><IntlMessages id="widgets.endDate" /></Label>
                                <Input
                                    type="date"
                                    name="ToDate"
                                    id="ToDate"
                                    placeholder="dd/mm/yyyy"
                                    value={this.state.ToDate}
                                    max = {this.state.Today}
                                    onChange={e => this.onChangeDate(e, "ToDate")}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4 r_sel_20">
                                            <Label for="UserId"><IntlMessages id="wallet.lblUserId" /></Label>
                                            <Select className="r_sel_20"
                                                options={userlist.map((user, i) => ({
                                                    label: user.UserName,
                                                    value: user.Id,
                                                }))}
                                                onChange={e => this.onChangeSelectUser(e)}
                                                value={this.state.UserLabel}
                                                maxMenuHeight={200}
                                                placeholder={intl.formatMessage({ id: "sidebar.searchdot" })}
                                            />
                                        </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="Slab"><IntlMessages id="wallet.slab" /></Label>
                                <Input type="select" name="Slab" id="Slab" value={this.state.Slab} onChange={(e) => this.onChangeDate(e, 'Slab')}>
                                    <IntlMessages id="wallet.TSSelectSlabtype">
                                        {(optionValue) => <option value="">{optionValue}</option>}
                                    </IntlMessages>
                                    <IntlMessages id="wallet.Range">
                                        {(optionValue) => <option value="2">{optionValue}</option>}
                                    </IntlMessages>
                                    <IntlMessages id="wallet.Fixed">
                                        {(optionValue) => <option value="1">{optionValue}</option>}
                                    </IntlMessages>
                                </Input>
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="StakingType"><IntlMessages id="wallet.StakingType" /></Label>
                                <Input type="select" name="StakingType" id="StakingType" value={this.state.StakingType} onChange={(e) => this.onChangeDate(e, 'StakingType')}>
                                    <IntlMessages id="wallet.TSSelectstakingType">
                                        {(optionValue) => <option value="">{optionValue}</option>}
                                    </IntlMessages>
                                    <IntlMessages id="wallet.FixedDeposit">
                                        {(optionValue) => <option value="1">{optionValue}</option>}
                                    </IntlMessages>
                                    <IntlMessages id="wallet.Charge">
                                        {(optionValue) => <option value="2">{optionValue}</option>}
                                    </IntlMessages>
                                </Input>
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                    <Button
                                        color="primary"
                                        variant="raised"
                                        className="text-white"
                                        onClick={() => this.applyFilter()}
                                        disabled={(this.state.FromDate !== '' || this.state.ToDate !== '' || this.state.Type !== ''|| this.state.Slab !== '' || this.state.UserId!== '' || this.state.StakingType !== '') ? false : true}
                                    ><IntlMessages id="widgets.apply" /></Button>
                                {this.state.showReset &&
                                    <Button className="btn-danger text-white ml-10" onClick={(e) => this.clearFilter()}>
                                        <IntlMessages id="bugreport.list.dialog.button.clear" />
                                    </Button>}
                                    </div></FormGroup>
                                </Form>
                            </div>
                    </JbsCollapsibleCard>}
                <div className="StackingHistory">
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={this.props.StakingHistoryList.map((item, index) => {
                            return [
                                index + 1 + (this.state.Page * this.state.PageSize),
                                item.UserName,
                                item.StakingType === 1 ? <IntlMessages id="wallet.FixedDeposit" /> : <IntlMessages id="wallet.Charge" />,
                                item.SlabType === 1 ? <IntlMessages id="wallet.Fixed" /> : <IntlMessages id="wallet.Range" />,
                                item.StakingCurrency,
                                parseFloat(item.StakingAmount).toFixed(8),
                                changeDateFormat(item.MaturityDate, 'YYYY-MM-DD', false),
                                item.Status,
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('6AF64827') !== -1 &&
                                <Tooltip title={<IntlMessages id="wallet.view" />} placement="bottom">
                                    <a
                                        href="javascript:void(0)"
                                        onClick={() => this.viewDetail(item)} //
                                    >
                                        <i className="ti-eye" />
                                    </a>
                                    </Tooltip>
                                     }
                                    </div>
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
                     <IntlMessages id="lable.StakingDetails" />
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
                    <Table bordered responsive className="mb-0">
                            <tbody>
                                <tr>
                                    <th className="w-50">{<IntlMessages id="wallet.StakingType" />}</th>
                                    <td className="w-50">{this.state.selectedRows.StakingType === 1 ? <IntlMessages id="wallet.FixedDeposit" /> : <IntlMessages id="wallet.Charge" />}</td>
                                </tr>
                                    <tr>
                                        <th className="w-50">{<IntlMessages id="wallet.StakingCurrency" />}</th>
                                        <td className="w-50">{this.state.selectedRows.StakingCurrency}</td>
                                    </tr>
                                <tr>
                                    <th className="w-50">{<IntlMessages id="wallet.duration" />}</th>
                                    <td className="w-50">{this.state.selectedRows.DurationMonth} <IntlMessages id="wallet.Months" />, {this.state.selectedRows.DurationWeek} <IntlMessages id="wallet.Weeks" />
                                    </td>
                                </tr>
                                {this.state.selectedRows.StakingType === 1 && <React.Fragment>
                                <tr>
                                    <th className="w-50"><IntlMessages id="wallet.interestType" /></th>
                                    <td className="w-50">{this.state.selectedRows.InterestTypeName}</td>
                                </tr>
                                <tr>
                                    <th className="w-50"><IntlMessages id="wallet.MaturityCurrency" /></th>
                                    <td className="w-50">{this.state.selectedRows.MaturityCurrency}</td>
                                </tr>
                                <tr>
                                    <th className="w-50"><IntlMessages id="wallet.EnableStakingBeforeMaturity" /></th>
                                    <td className="w-50">{this.state.selectedRows.EnableStakingBeforeMaturity ? <IntlMessages id="sidebar.yes" /> : <IntlMessages id="sidebar.no" />}</td>
                                </tr>
                                <tr>
                                    <th className="w-50"><IntlMessages id="wallet.MaturityDate" /></th>
                                    <td className="w-50">{changeDateFormat(this.state.selectedRows.MaturityDate, 'YYYY-MM-DD HH:mm:ss')}</td>
                                </tr>
                                </React.Fragment>}
                                {this.state.selectedRows.StakingType === 2 && <tr>
                                                <th className="w-50"><IntlMessages id="trading.placeorder.label.makerscharge" /></th>
                                                <td className="w-50">{parseFloat(this.state.selectedRows.MakerCharges).toFixed(8)}</td>
                                            </tr>}
                                            <tr>
                                                <th className="w-50"><IntlMessages id="wallet.RenewUnstakingEnable" /></th>
                                                <td className="w-50">{this.state.selectedRows.RenewUnstakingEnable ? <IntlMessages id="sidebar.yes" /> : <IntlMessages id="sidebar.no" />}</td>
                                            </tr>
                                            <tr>
                                                <th className="w-50"><IntlMessages id="wallet.AmountCredited" /></th>
                                                <td className="w-50">{parseFloat(this.state.selectedRows.AmountCredited).toFixed(8)}</td>
                                            </tr>
                                          
                                            <tr>
                                                <th className="w-50"><IntlMessages id="wallet.slabtype" /></th>
                                                <td className="w-50">{this.state.selectedRows.SlabType === 1 ? <IntlMessages id="wallet.Fixed" /> : <IntlMessages id="wallet.Range" />}</td>
                                            </tr>
                                            <tr>
                                                <th className="w-50"><IntlMessages id="wallet.StakingAmount" /></th>
                                                <td className="w-50">{parseFloat(this.state.selectedRows.StakingAmount).toFixed(8)}</td>
                                            </tr>

                                <tr>
                                    <th className="w-50">{<IntlMessages id="table.Status" />}</th>
                                    <td className="w-50">
                                    <span className={classnames({
                                                        "badge badge-danger": (this.state.selectedRows.Status === 0 || this.state.selectedRows.Status === 9),
                                                        "badge badge-success": (this.state.selectedRows.Status === 1),
                                                        "badge badge-warning": (this.state.selectedRows.Status === 4),
                                                        "badge badge-info": (this.state.selectedRows.Status === 5),
                                                       
                                                    })} >
                                                        <IntlMessages id={"wallet.stakinhghistorystatus." + this.state.selectedRows.Status} />
                                                    </span>
                                    </td>
                                </tr>
                                {this.state.selectedRows.StakingType === 2 && <tr>
                                                <th className="w-50"><IntlMessages id="trading.placeorder.label.takerscharges" /></th>
                                                <td className="w-50">{parseFloat(this.state.selectedRows.TakerCharges).toFixed(8)}</td>
                                            </tr>}
                                            {this.state.selectedRows.StakingType === 1 && <React.Fragment>
                                                <tr>
                                                    <th className="w-50"><IntlMessages id="wallet.interest" /></th>
                                                    <td className="w-50">{parseFloat(this.state.selectedRows.InterestValue).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <th className="w-50"><IntlMessages id="wallet.MaturityAmount" /></th>
                                                    <td className="w-50">{parseFloat(this.state.selectedRows.MaturityAmount).toFixed(8)}</td>
                                                </tr>
                                                <tr>
                                                    <th className="w-50"><IntlMessages id="wallet.EnableStakingBeforeMaturityCharge" /></th>
                                                    <td className="w-50">{this.state.selectedRows.EnableStakingBeforeMaturityCharge}</td>
                                                </tr>
                                            </React.Fragment>}
                                            <tr>
                                                <th className="w-50"><IntlMessages id="wallet.EnableAutoUnstaking" /></th>
                                                <td className="w-50">{this.state.selectedRows.EnableAutoUnstaking ? <IntlMessages id="sidebar.yes" /> : <IntlMessages id="sidebar.no" />}</td>
                                            </tr>
                                            <tr>
                                                <th className="w-50"><IntlMessages id="wallet.RenewUnstakingPeriod" /></th>
                                                <td className="w-50">{this.state.selectedRows.RenewUnstakingPeriod}</td>
                                            </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
                 </DialogContentText>
             </DialogContent>
         </Dialog>
            </div>
        )
    }
}

const mapStateToProps = ({ StakingHistoryReport, drawerclose ,actvHstrRdcer,authTokenRdcer}) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { loading, StakingHistoryList ,TotalCount} = StakingHistoryReport;
    const { getUser } = actvHstrRdcer;
    return { loading, StakingHistoryList, drawerclose,getUser,TotalCount,menuLoading,menu_rights};
};

export default connect(mapStateToProps, {
    getStakingHistoryList,
    getUserDataList,
    getMenuPermissionByID
})(injectIntl(StakingHistoryReport));
