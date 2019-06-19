/**
 * Added By Devang parekh
 * Component is used to pair configuration
 * pair configuration page contain add, update delete and multi delete option in list
 *
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
import NotFoundTable from "Components/NotFoundTable/notFoundTable";

//Action Import for Payment Method  Report Add And Update
import {
    getMarketCapList,
    editMarketCapDetail
} from "Actions/Trading";

import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';


class MarketCap extends Component {
    state = {
        marketCapList: [],
        loader: false,
        isList: 1,
        componentName: '',
        //added by parth andhariya
        ConfigurationShowCard: this.props.ConfigurationShowCard,
        Page_Size: AppConfig.totalRecordDisplayInList,
        notificationFlag: true,
        menudetail: [],
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({
                open: false,
            })
        }
        if (nextProps.marketCapList && nextProps.marketCapList.length !== 0 && this.state.isList === 1) {
            this.setState({ marketCapList: nextProps.marketCapList, loader: false, isList: 0 })
        } else if (nextProps.marketCapList && nextProps.marketCapList.length === 0) {
            this.setState({ marketCapList: [], loader: false })
        }
        if (nextProps.editMarketCap && nextProps.editMarketCap.length !== 0) {
            NotificationManager.success("Successfully Added..!")
            //added by parth andhariya
            if (this.state.ConfigurationShowCard === 1) {
                this.props.getMarketCapList({ IsMargin: 1 });
            } else {
                this.props.getMarketCapList({});
            }
            this.setState({ loader: false })
        } else if (nextProps.editMarketCap && nextProps.editMarketCap.length === 0) {
            NotificationManager.error("Error Occured..!")
            this.setState({ loader: false })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ loader: true });
                //added by parth andhariya
                if (this.state.ConfigurationShowCard === 1) {
                    this.props.getMarketCapList({ IsMargin: 1 });
                } else {
                    this.props.getMarketCapList({});
                }
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.ConfigurationShowCard === 1 ? '47456F94-412A-A683-4882-E045DE4946AF' : '7F2B5457-6EC4-116E-7561-9F8CC3A8A277'); // get Trading menu permission
        // this.setState({ loader: true });
        // //added by parth andhariya
        // if (this.state.ConfigurationShowCard === 1) {
        //     this.props.getMarketCapList({ IsMargin: 1 });
        // } else {
        //     this.props.getMarketCapList({});
        // }
    }

    closeAll = () => {
        this.setState({
            open: false,
            addData: false,
            editData: false
        });
    }

    updateList(rows, accessPermission) {
        if (accessPermission !== -1) {
            var makeRequest = [];
            if (rows.data && rows.data.length) {
                var marketCapList = this.state.marketCapList;
                marketCapList.map((row, key) => {
                    marketCapList[key].IsMarketTicker = 0;
                });
                rows.data.map((row, key) => {
                    var newData = marketCapList[row.index];
                    newData.IsMarketTicker = 1;
                    marketCapList[row.index].IsMarketTicker = 1;
                    makeRequest.push(newData)
                })
                this.setState({ loader: true, marketCapList: marketCapList });
                //added by parth andhariya
                if (this.state.ConfigurationShowCard === 1) {
                    this.props.editMarketCapDetail({ Request: makeRequest, IsMargin: 1 });
                } else {
                    this.props.editMarketCapDetail({ Request: makeRequest });
                }
            }
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }

    }
    // end
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
                title: this.state.ConfigurationShowCard === 1 ? <IntlMessages id="sidebar.marginTrading" /> : <IntlMessages id="sidebar.trading" />,
                link: '',
                index: 0
            },
            {
                title: <IntlMessages id="card.list.title.configuration" />,
                link: '',
                index: 1
            },
            {
                title: <IntlMessages id="sidebar.marketCap.title" />,
                link: '',
                index: 2
            }
        ];
        const { drawerClose, closeAll } = this.props;
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail(this.state.ConfigurationShowCard === 1 ? '48A8E378-5D2F-6370-A685-7F72880F6D92' : 'B66F8C6A-2B2A-A494-2BF3-5254CE555FE8'); //B66F8C6A-2B2A-A494-2BF3-5254CE555FE8  && margin_GUID 48A8E378-5D2F-6370-A685-7F72880F6D92
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        const {
            marketCapList,
            loader
        } = this.state;

        var selectedRows = [];
        marketCapList.map((pairDetail, key) => {
            if (pairDetail.IsMarketTicker === 1)
                selectedRows.push(key);
        })

        const columns = [
            {
                name: "#",
                options: { sort: false, filter: false }
            },
            {
                name: (
                    <IntlMessages id="sidebar.pairConfiguration.list.lable.pair" />
                ),
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="sidebar.pairConfiguration.list.lable.status" />,
                options: { sort: true, filter: true }
            },

        ];

        const options = {
            rowsSelected: selectedRows,
            rowsPerPage: this.state.Page_Size,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            responsive: "scroll",
            selectableRows: true,
            viewColumns: false,
            filter: false,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            customToolbarSelect: selectedRows => {
                if (menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1) { // check edit curd operation
                    return (
                        <Button
                            variant="raised"
                            color="primary"
                            className="text-white market-cap-save-btn"
                            onClick={() => this.updateList(selectedRows, menuPermissionDetail.CrudOption.indexOf('0BB7ACAC'))}
                        >
                            <IntlMessages id="sidebar.marketCap.button.save" />
                        </Button>
                    );
                } else {
                    return false;
                }
            }
        };

        return (
            <div className="jbs-page-content">
                {loader && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="sidebar.marketCap.title" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={closeAll} />
                <div className="StackingHistory">
                    {marketCapList.length !== 0 ? (
                        <MUIDataTable
                            title={this.props.title}
                            data={marketCapList.map((pairDetail, key) => {
                                return [
                                    key + 1,
                                    pairDetail.PairName,
                                    pairDetail.IsMarketTicker === 1 ? <IntlMessages id="sidebar.marketCap.active" /> : <IntlMessages id="sidebar.marketCap.inActive" />
                                ];
                            })}
                            columns={columns}
                            options={options}
                        />
                    ) : (
                            <NotFoundTable title={this.props.title} columns={columns} />
                        )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ marketCap, drawerclose, authTokenRdcer }) => {
    const { editMarketCap, marketCapList, loading } = marketCap;
    const { menuLoading, menu_rights } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { editMarketCap, marketCapList, loading, drawerclose, menuLoading, menu_rights };
};

export default connect(
    mapStateToProps,
    {
        getMarketCapList,
        editMarketCapDetail,
        getMenuPermissionByID
    }
)(MarketCap);
