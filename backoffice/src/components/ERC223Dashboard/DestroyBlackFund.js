/* 
    Developer : Vishva shah
    Date : 03-06-2019
    File Comment : Destroy Black fund Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import "rc-drawer/assets/index.css";
import IntlMessages from "Util/IntlMessages";
import { injectIntl } from 'react-intl';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import MUIDataTable from "mui-datatables";
import { changeDateFormat } from "Helpers/helpers";
import { Form, FormGroup, Label, Input } from "reactstrap";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Button from "@material-ui/core/Button";
import {
    destroyBlackFundList
} from "Actions/ERC223";
import { NotificationManager } from 'react-notifications';
import { isScriptTag,isHtmlTag, } from 'Helpers/helpers';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import validator from "validator";
const initState = {
    menudetail: [],
    flag: true,
    Address:"",
    FromDate: new Date().toISOString().slice(0, 10),
    ToDate: new Date().toISOString().slice(0, 10),
    Today: new Date().toISOString().slice(0, 10),
    showApply: false,
    errors:{}
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
        title: <IntlMessages id="sidebar.Erc223dashboard" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="lable.DestroyBlackFund" />,
        link: '',
        index: 2
    },
];

class DestroyBlackFund extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('D88501EE-5AA8-279E-52B9-CCF988E69126'); // get wallet menu permission
    }
    // will receive props update state..
    componentWillReceiveProps(nextProps) {
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.flag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.destroyBlackFundList({});
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ flag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({
                open: false,
            })
        }
    }
    // close all drawer...
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    };
    onChange(e, key) {
        let error = {};
        if (e.target.name === "Address") {
            if (isScriptTag(e.target.value)) {
                error.Address = "my_account.err.scriptTag";

            }
            else if (isHtmlTag(e.target.value)) {
                error.Address = "my_account.err.htmlTag";
            }
            else {
                this.setState({errors:{}})
            }
        }
        this.setState({ errors: error})
        this.setState({ [key]: e.target.value });
    }
     //Apply Filter option
     applyFilter = () => {
        if ((this.state.FromDate !== '' && this.state.ToDate !== '') || this.state.Address !== '') {
            this.props.destroyBlackFundList({
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                Address:this.state.Address,
            });
            this.setState({ showApply: true });
        }
    }
    //clear filter
    clearFilter = () => {
        this.setState({...initState,menudetail:this.state.menudetail},() =>this.props.destroyBlackFundList({}));
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('0F4E9DD8-869B-22A6-1572-C478FCB97800'); //0F4E9DD8-869B-22A6-1572-C478FCB97800
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const { errors } = this.state;
        const { drawerClose, intl } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "table.address" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "sidebar.user" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "table.date" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "lable.TrnHash" }),
                options: {
                    filter: false,
                    sort: true
                }
            },            
            {
                name: intl.formatMessage({ id: "organizationLedger.title.remarks" }),
                options: {
                    filter: false,
                    sort: true
                }
            }
        ];
        const options = {
            filter: false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
        }
        return (
            <div className="jbs-page-content">
                {(this.props.menuLoading || this.props.loading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="lable.DestroyBlackFund" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="StackingHistory">
                {menuPermissionDetail.Utility.indexOf('18736530') !== -1 &&
                <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="tradefrm row">
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="FromDate"><IntlMessages id="widgets.startDate" /></Label>
                                        <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={this.state.FromDate} onChange={(e) => this.onChange(e, 'FromDate')} max={this.state.Today} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="ToDate"><IntlMessages id="widgets.endDate" /></Label>
                                        <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={this.state.ToDate} onChange={(e) => this.onChange(e, 'ToDate')} max={this.state.Today} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Address"><IntlMessages id="wallet.Address" /></Label>
                                        <Input type="text" name="Address" id="Address" placeholder={intl.formatMessage({ id: "wallet.Address" })} value={this.state.Address} onChange={(e) => {if (validator.isAlphanumeric(e.target.value) || e.target.value === "") {this.onChange(e, 'Address')}}} maxLength={50} />
                                        {errors.Address && <span className="text-danger text-left"><IntlMessages id={errors.Address} /></span>}     
                                </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button color="primary" variant="raised" className="text-white" onClick={() => this.applyFilter()} disabled={((this.state.FromDate !== '' && this.state.ToDate !== '' && Object.keys(errors).length===0) || (this.state.Address !== '' && Object.keys(errors).length===0))  ? false : true}><IntlMessages id="widgets.apply" /></Button>
                                            {this.state.showApply && <Button className="ml-15 btn-danger text-white" onClick={(e) => this.clearFilter()}><IntlMessages id="bugreport.list.dialog.button.clear" /></Button>}
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </JbsCollapsibleCard>
                }
                    <MUIDataTable
                        data={this.props.destroyList.map((item, key) => {
                            return [
                                key + 1,
                                item.Address,
                                item.ActionByUserName,
                                changeDateFormat(item.ActionDate,'DD-MM-YYYY HH:mm:ss', false),
                                item.TrnHash,
                                item.Remarks
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
            </div>
         </div>
        )
    }
}
const mapStateToProps = ({ DestroyBlackFundReducer, drawerclose, authTokenRdcer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { destroyList, loading } = DestroyBlackFundReducer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { loading, drawerclose, menuLoading, menu_rights,destroyList };
};

export default connect(mapStateToProps, {
    destroyBlackFundList,
    getMenuPermissionByID,
})(injectIntl(DestroyBlackFund));
