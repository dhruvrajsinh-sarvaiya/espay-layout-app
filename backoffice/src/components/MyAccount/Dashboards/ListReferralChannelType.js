/**
 * Created By Sanjay
 * Created Date 13/02/2019
 * Component For Referral Channel Type
 */
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { Badge } from 'reactstrap';
import { NotificationManager } from "react-notifications";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { getReferralChannelTypeData, inactiveChannelType, activeChannelType, getChannelTypeById } from 'Actions/MyAccount';
import UpdateReferralChannelType from './UpdateReferralChannelType';
import { CustomFooter } from './Widgets';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
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
        index: 0
    },
    {
        title: <IntlMessages id="my_account.referralSystem" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.referralChannelType" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="my_account.ListReferralChannelType" />,
        link: '',
        index: 3
    }
];

//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: true, sort: true, }
    },
    {
        name: <IntlMessages id="sidebar.colChannelType" />,
        options: { filter: true, sort: true, }
    },
    {
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: { filter: true, sort: true, }
    },
    {
        name: <IntlMessages id="sidebar.colAction" />,
        options: { filter: false, sort: false, }
    }
];

const components = {
    UpdateReferralChannelType: UpdateReferralChannelType
};

//dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, menuDetail) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        menuDetail
    });
};

class ListReferralChannelType extends Component {

    state = {
        Data: [],
        open: false,
        componentName: "",
        menuDetail: {},
        menudetail: [],
        notificationFlag: true,
        menuLoading:false
    }

    onClick = () => {
        this.setState({ open: !this.state.open })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('5F0B757B-3A41-7405-7018-3715D6003052'); // get myaccount menu permission

    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
          if (nextProps.menu_rights.ReturnCode === 0) {
              this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
              this.props.getReferralChannelTypeData();
          } else if (nextProps.menu_rights.ReturnCode !== 0) {
              this.setState({ notificationFlag: false });
              NotificationManager.error(<IntlMessages id={"error.permission"} />);
              this.props.drawerClose();
          }
      }
        let errMsg;
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open4 === false) {
            this.setState({ open: false })
        }
        if (nextProps.referralChannelTypeData.ReturnCode === 0) {
            this.setState({ Data: nextProps.referralChannelTypeData.ReferralChannelTypeList })
        }
        if (nextProps.activeReferralChannelTypeData.ReturnCode === 0) {
            NotificationManager.success(nextProps.activeReferralChannelTypeData.ReturnMsg);
            this.props.getReferralChannelTypeData();
        } else if (nextProps.activeReferralChannelTypeData.ReturnCode === 1) {
            errMsg = nextProps.activeReferralChannelTypeData.ErrorCode === 1 ? nextProps.activeReferralChannelTypeData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.activeReferralChannelTypeData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        }
        if (nextProps.inActiceReferralChannelTypeData.ReturnCode === 0) {
            NotificationManager.success(nextProps.inActiceReferralChannelTypeData.ReturnMsg);
            this.props.getReferralChannelTypeData();
        } else if (nextProps.inActiceReferralChannelTypeData.ReturnCode === 1) {
            errMsg = nextProps.inActiceReferralChannelTypeData.ErrorCode === 1 ? nextProps.inActiceReferralChannelTypeData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.activeReferralChannelTypeData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        }
    }

    close2Level = () => {
        this.props.close2Level();
        this.setState({ open: false });
    }

    showComponent = (componentName, menuDetail, viewData) => {
        if (menuDetail.HasChild) {
            this.props.getChannelTypeById({ Id: viewData });
            this.setState({
                componentName: componentName,
                open: !this.state.open,
                menuDetail: menuDetail
            });
        }
        else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    onEnableChannelType(Id) {
        this.props.activeChannelType({ Id: Id });
    }

    onDisableChannelType(Id) {
        this.props.inactiveChannelType({ Id: Id });
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
        const { Data, componentName, open, menuDetail } = this.state;
        const { drawerClose, loading } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('58C0BCF3-8F91-2109-4812-5CC8B42376C8'); //4DF10E06-6CDB-42A8-140E-D5F1D709A5CA
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

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
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customFooter: (count, page, rowsPerPage) => {
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.ListReferralChannelType" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="StackingHistory statusbtn-comm">
                    <MUIDataTable
                        // title={<IntlMessages id="my_account.ListReferralChannelType" />}
                        columns={columns}
                        options={options}
                        data={
                            Data.map((lst, key) => {
                                return [
                                    key + 1,
                                    lst.ChannelTypeName,
                                    <span className="date">{changeDateFormat(lst.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>,
                                    <Fragment>
                                        {/* {
                                            menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 //check edit curd operation
                                            ?
                                            (lst.Status === 0
                                                ?
                                                <Badge color="danger" onClick={() => this.onEnableChannelType(lst.Id)} style={{ 'cursor': 'pointer' }}>
                                                    <IntlMessages id="sidebar.inactive" />
                                                </Badge>
                                                :
                                                <Badge color="success" onClick={() => this.onDisableChannelType(lst.Id)} style={{ 'cursor': 'pointer' }}>
                                                    <IntlMessages id="sidebar.active" />
                                                </Badge>
                                            )
                                            : */}
                                        <Badge color={lst.Status ? "success" : "danger"}>{lst.Status ? <IntlMessages id="sidebar.active" /> : <IntlMessages id="sidebar.inactive" />}</Badge>
                                        {/* }/ */}
                                    </Fragment>,
                                    <div>
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && //check edit curd operation
                                        <a
                                            href="javascript:void(0)"
                                            className="text-dark"
                                            onClick={(e) => this.showComponent('UpdateReferralChannelType', this.checkAndGetMenuAccessDetail('599E46F4-134F-6A4E-7EB0-9602D27FA72B'), lst.Id)}
                                        >
                                            <i className="ti-pencil" />
                                        </a>
                                    }
                                    </div>
                                ]
                            })
                        }
                    />
                </div>
                <Drawer
                    width="50%"
                    handler={false}
                    open={open}
                    placement="right"
                    className="drawer1 half_drawer"
                    level=".drawer0"
                    levelMove={100}
                    height="100%"
                >
                    {componentName !== "" &&
                        dynamicComponent(
                            componentName,
                            this.props,
                            this.onClick,
                            this.closeAll,
                            menuDetail
                        )}
                </Drawer>
            </div>
        )
    }
}

//Mapstatetoprops...
const mapStateToProps = ({ ReferralChannelTypeReducer, drawerclose,authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { referralChannelTypeData, activeReferralChannelTypeData, inActiceReferralChannelTypeData, loading } = ReferralChannelTypeReducer;
    return { referralChannelTypeData, activeReferralChannelTypeData, inActiceReferralChannelTypeData, loading, drawerclose,        menuLoading,
        menu_rights };
}

export default connect(mapStateToProps, {
    getReferralChannelTypeData,
    inactiveChannelType,
    activeChannelType,
    getChannelTypeById,
    getMenuPermissionByID
})(ListReferralChannelType);