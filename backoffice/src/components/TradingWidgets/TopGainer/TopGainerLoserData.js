import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { NotificationManager } from "react-notifications";

//Action Import for get Topgainers And losers data
import { getTopGainersLosersData } from "Actions/Trade";

import AppConfig from 'Constants/AppConfig';

import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

import CloseButton from '@material-ui/core/Button';

// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';

// import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}


class AllDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topGainersLosers: [],
            open: false,
            //added by parth andhariya
            marginTradingBit: props.state.marginTradingBit,
            Page_Size: AppConfig.totalRecordDisplayInList,
            notificationFlag: true,
            menudetail: [],
        };
    }
    componentWillMount() {
        if (this.props.state.TopLoserBit) {
            this.props.getMenuPermissionByID(this.props.state.marginTradingBit === 1 ? 'C3BE46EF-05DC-4B51-6CC5-5CEC9CB23EE1' : '28DADF99-3CA6-98EA-2CFB-7FF5E8630317'); // get Trading menu permission
        } else {
            this.props.getMenuPermissionByID(this.props.state.marginTradingBit === 1 ? '2A6715B8-6FB9-1FDF-9822-60BD999B2244' : '6A32294E-78EB-75BA-0507-537851461ABD'); // get Trading menu permission
        }
    }
    componentWillReceiveProps(nextprops) {

        if (nextprops.topGainersLosers.length !== 0 && nextprops.error.length == 0) {
            this.setState({
                topGainersLosers: nextprops.topGainersLosers,
            })
        }
        //  else if (nextprops.error.length !== 0 && nextprops.error.ReturnCode !== 0) {
        //     NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);
        //     this.setState({
        //         topGainersLosers: [],
        //     })
        // }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                //added by parth andhariya
                if (this.state.marginTradingBit === 1) {
                    this.props.getTopGainersLosersData({ IsMargin: 1 });
                } else {
                    this.props.getTopGainersLosersData({});
                }
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
    }

    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
        });
    }

    closeAll = () => {
        //this.props.closeAll();
        this.setState({
            open: false
        });
    }

    // componentDidMount() {
    //     //added by parth andhariya
    //     if (this.state.marginTradingBit === 1) {
    //         this.props.getTopGainersLosersData({ IsMargin: 1 });
    //     } else {
    //         this.props.getTopGainersLosersData({});
    //     }
    // }
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
                title: this.props.state.marginTradingBit === 1 ? <IntlMessages id="sidebar.marginTrading" /> : <IntlMessages id="sidebar.trading" />,
                link: '',
                index: 0
            },
            {
                title: <IntlMessages id="trading.topgainerslosers.label.title" />,
                link: '',
                index: 1
            }
        ];
        const { drawerClose, closeAll } = this.props;
        // const { menuDetail } = this.props.state;
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail(this.state.marginTradingBit === 1 ? ('18EF8BDA-7061-9443-64BE-D20954DB59B1' || '8068ACAA-45C4-035B-47ED-F8EB4B9A4E3B') : ('6A32294E-78EB-75BA-0507-537851461ABD' || '10BCFD68-34DD-1B93-4B2D-7F32E4C3A00B')); //3EA5320A-531C-07B9-1C3D-E4FCDD59131E  && margin_GUID 3C655E15-6A4C-7B41-50C4-4D03E2AB5A85
        // var menuPermissionDetail = { Utility: [], CurdOption: [] };
        // if (menuDetail.GUID !== undefined) {
        // menuPermissionDetail = checkAndGetMenuAccessDetail(menuDetail.GUID);//getting object detail for checking permissions
        // }

        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        const columns = [
            {
                name: <IntlMessages id="exchangefeedConfig.list.column.label.pair" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="trading.admin.markets.label.lastprice" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="trade.summary.trade.volume" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="trading.topgainerslosers.label.changeper" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="trading.topgainerslosers.label.changeval" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="widgets.high" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="widgets.low" />,
                options: { sort: true, filter: true }
            }
        ];

        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            rowsPerPage: this.state.Page_Size,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            download: false,
            viewColumns: false,
            filter: false,
            sort: true
        };

        return (
            <div className="mb-10 jbs-page-content">
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="trading.topgainerslosers.label.title" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={closeAll} />
                {/* <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="trading.topgainerslosers.label.title" /></h2>
                        <Breadcrumb className="tour-step-7 p-0" tag="nav">
                            {BreadCrumbData.length > 0 &&
                                BreadCrumbData.map((list, index) => {
                                    return <BreadcrumbItem active={BreadCrumbData.length === index + 1} tag={BreadCrumbData.length === index + 1 ? "span" : "a"} key={index} href="javascript:void(0)" onClick={list.index && list.index == 1 ? drawerClose : closeAll}>{list.title}</BreadcrumbItem>
                                })
                            }
                        </Breadcrumb>
                    </div>
                    <div className="page-title-wrap  bredscrum-top-btn">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div> */}

                <div className="StackingHistory">

                    <MUIDataTable
                        // title={<IntlMessages id="trading.topgainers.label.title" />}
                        data={this.state.topGainersLosers.length !== 0 && this.state.topGainersLosers.map((topGainer, key) => {
                            return [
                                topGainer.PairName,
                                parseFloat(topGainer.LTP).toFixed(8),
                                parseFloat(topGainer.Volume).toFixed(8),
                                parseFloat(topGainer.ChangePer).toFixed(8),
                                parseFloat(topGainer.ChangeValue).toFixed(8),
                                parseFloat(topGainer.High).toFixed(8),
                                parseFloat(topGainer.Low).toFixed(8),
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

// map states to props when changed in states from reducer
const mapStateToProps = ({ topGainers, authTokenRdcer }) => {
    const error = topGainers.errorGainers;
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { topGainersLosers, loading } = topGainers;
    return { topGainersLosers, loading, error, menuLoading, menu_rights };
}

export default connect(
    mapStateToProps,
    {
        getTopGainersLosersData,
        getMenuPermissionByID
    }
)(AllDetail);
