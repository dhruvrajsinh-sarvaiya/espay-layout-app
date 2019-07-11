/**
 * Created By Sanjay
 * Created Date 13/02/2019
 * Component For List Referral Service Type
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
import { changeDateFormat } from "Helpers/helpers";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { getReferralServiceTypeData, inactiveServiceType, activeServiceType, getServiceTypeById } from 'Actions/MyAccount';
import UpdateReferralServiceType from './UpdateReferralServiceType';
import { CustomFooter } from './Widgets';
import AppConfig from 'Constants/AppConfig';
import { getMenuPermissionByID } from 'Actions/MyAccount';

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
        title: <IntlMessages id="my_account.referralServiceTypeDashboard" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="my_account.ListReferralServiceType" />,
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
        name: <IntlMessages id="sidebar.colServiceType" />,
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
    UpdateReferralServiceType: UpdateReferralServiceType
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, menuDetail) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        menuDetail
    });
};

class ListReferralServiceType extends Component {
    state = {
        Data: [],
        open: false,
        componentName: "",
        menudetail: [],
        notificationFlag: true,
        menuLoading:false
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('DD07BC7C-5190-0EED-99AA-2AF167911FDB'); // my account menu permission
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
          if (nextProps.menu_rights.ReturnCode === 0) {
            this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            this.props.getReferralServiceTypeData();
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
        if (nextProps.referralServiceTypeData.ReturnCode === 0) {
            this.setState({ Data: nextProps.referralServiceTypeData.ReferralServiceTypeList })
        }
        if (nextProps.activeReferralServiceTypeData.ReturnCode === 0) {
            NotificationManager.success(nextProps.activeReferralServiceTypeData.ReturnMsg);
            this.props.getReferralServiceTypeData();
        } else if (nextProps.activeReferralServiceTypeData.ReturnCode === 1) {
            errMsg = nextProps.activeReferralServiceTypeData.ErrorCode === 1 ? nextProps.activeReferralServiceTypeData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.activeReferralServiceTypeData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        }
        if (nextProps.inActiceReferralServiceTypeData.ReturnCode === 0) {
            NotificationManager.success(nextProps.inActiceReferralServiceTypeData.ReturnMsg);
            this.props.getReferralServiceTypeData();
        } else if (nextProps.inActiceReferralServiceTypeData.ReturnCode === 1) {
            errMsg = nextProps.inActiceReferralServiceTypeData.ErrorCode === 1 ? nextProps.inActiceReferralServiceTypeData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.activeReferralServiceTypeData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        }
    }

    close2Level = () => {
        this.props.close2Level();
        this.setState({ open: false });
    }

    showComponent = (componentName, menuDetail, viewData) => {
        if (menuDetail.HasChild) {
            this.props.getServiceTypeById({ Id: viewData });
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
                menuDetail: menuDetail
            });
        }
        else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    onEnableServiceType(Id) {
        this.props.activeServiceType({ Id: Id });
    }

    onDisableServiceType(Id) {
        this.props.inactiveServiceType({ Id: Id });
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('222122D7-672F-1821-7E7F-76B2A3030182'); //4DF10E06-6CDB-42A8-140E-D5F1D709A5CA
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
                <WalletPageTitle title={<IntlMessages id="my_account.ListReferralServiceType" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="StackingHistory statusbtn-comm">
                    <MUIDataTable
                        columns={columns}
                        options={options}
                        data={
                            Data.map((lst, key) => {
                                return [
                                    key + 1,
                                    lst.ServiceTypeName,
                                    <span className="date">{changeDateFormat(lst.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>,
                                    <Fragment>
                                        <Badge color={lst.Status ? "success" : "danger"}>{lst.Status ? <IntlMessages id="sidebar.active" /> : <IntlMessages id="sidebar.inactive" />}</Badge>
                                    </Fragment>,
                                    <div className="list-action">
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check edit curd operation
                                        <a
                                            href="javascript:void(0)"
                                            className="ml-3"
                                            onClick={(e) => this.showComponent('UpdateReferralServiceType', this.checkAndGetMenuAccessDetail('222122D7-672F-1821-7E7F-76B2A3030182'), lst.Id)}
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
const mapStateToProps = ({ ReferralServiceTypeReducer, drawerclose,authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { referralServiceTypeData, activeReferralServiceTypeData, inActiceReferralServiceTypeData, loading } = ReferralServiceTypeReducer;
    return { referralServiceTypeData, activeReferralServiceTypeData, inActiceReferralServiceTypeData, loading, drawerclose, menuLoading, menu_rights };
}

export default connect(mapStateToProps, {
    getReferralServiceTypeData,
    inactiveServiceType,
    activeServiceType,
    getServiceTypeById,
    getMenuPermissionByID
})(ListReferralServiceType);