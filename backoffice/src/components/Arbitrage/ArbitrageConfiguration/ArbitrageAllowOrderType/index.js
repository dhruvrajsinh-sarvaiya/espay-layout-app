// component for display arbitrage exchange manager list By Devang parekh (11-6-2019)
/**
 * LIMIT = 1,
    MARKET = 2,//No price , take from statestic table
    SPOT = 3,//No price , take from statestic table
    STOP_Limit = 4,//take extra para
    //buy at a specific price or lower when that event occurs.
    //sell at a specific price or higher when that event occurs.
    STOP = 5
 */

// import necessary components from react
import React, { Component, Fragment } from "react";
// display mui data table
import MUIDataTable from "mui-datatables";
// display tool tip 
import Tooltip from "@material-ui/core/Tooltip";
// used for loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// used for get exchange configuration list
import {
    getExchangeConfigurationList,
    changeArbitrageOrderType
} from "Actions/Arbitrage/ExchangeConfiguration";
// used for connect
import { connect } from "react-redux";
// intl messages
import IntlMessages from "Util/IntlMessages";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import { NotificationManager } from "react-notifications";
import classnames from "classnames";
import { injectIntl } from 'react-intl';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter,Col,FormGroup } from 'reactstrap';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';



// class for exchange configuration list
class ArbitrageAllowOrderType extends Component {

    // constructor that defines default state
    constructor(props) {
        super(props);
        this.state = {
            exchangeConfigurationApiList: [],
            open: false,
            componentName: '',
            Page_Size: AppConfig.totalRecordDisplayInList,
            menudetail: [],
            notificationFlag: true,
            modelData: {},
            isModelShow: false
        };
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('DCA0F116-3954-9A72-0320-4945AA9E8FCD'); // get wallet menu permission
    }

    // invoke when component is about to get props
    componentWillReceiveProps(nextprops) {

        // set state for arbitrage exchange list
        if (nextprops.exchangeConfigurationApiList) {
            this.setState({
                exchangeConfigurationApiList: nextprops.exchangeConfigurationApiList
            })
        }

        if (nextprops.drawerclose.bit === 1 && nextprops.drawerclose.Drawersclose.open3 === false) {
            this.setState({
                open: false,
            })
        }

        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            
            if (nextprops.menu_rights.ReturnCode === 0) {
                this.props.getExchangeConfigurationList({});
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        
        if(nextprops.changeOrderTypeData !== undefined && nextprops.changeOrderTypeData.ReturnCode !== undefined && nextprops.changeOrderTypeData.ReturnCode === 0) {
            NotificationManager.success(<IntlMessages id={"sidebar.orderTypeChangeSuccess"} />);   
            this.props.getExchangeConfigurationList({});   
        } else if(nextprops.changeOrderTypeData !== undefined && nextprops.changeOrderTypeData.ReturnCode !== undefined && nextprops.changeOrderTypeData.ReturnCode) {
            NotificationManager.error(<IntlMessages id={"apiWalletErrCode.500"} />);
        }

    }

    // close drawer and set default state
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            componentName: ''
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

    openModel(orderTypeDetail) {

        var IsLimit=false,IsMarket=false,IsSpot=false,IsStopLimit=false;

        orderTypeDetail.OrderType.map((item) => {
            if(item.OrderType === 1 && item.Status === 1) {
                IsLimit=true;
            } else if(item.OrderType === 2 && item.Status === 1) {
                IsMarket=true;
            } else if(item.OrderType === 3 && item.Status === 1) {
                IsSpot=true;
            } else if(item.OrderType === 4 && item.Status === 1) {
                IsStopLimit=true;
            }
        });

        this.setState({ modelData: orderTypeDetail, isModelShow: true,
            IsLimit:IsLimit,IsMarket:IsMarket,IsSpot:IsSpot,IsStopLimit:IsStopLimit });

    }

    onClick = () => {
        this.setState({ open: !this.state.open })
    }

    closeModel() {
        this.setState({ isModelShow: false, modelData : {} });
    }

    // Handle Checkbox for display Limit Data
    handleChangeLimit = event => {
        this.setState({ IsLimit: !this.state.IsLimit });
    };

    // Handle Checkbox for display IsMarket Data
    handleChangeMarket = event => {
        this.setState({ IsMarket: !this.state.IsMarket });
    };

    // Handle Checkbox for display IsSpot Data
    handleChangeSpot = event => {
        this.setState({ IsSpot: !this.state.IsSpot });
    };

    // Handle Checkbox for display BaseCurrency Data
    handleChangeStopLimit = event => {
        this.setState({ IsStopLimit: !this.state.IsStopLimit });
    };

    changeArbitrageAllowOrderType() {

        if(this.state.modelData) {

            var requestObject = this.state.modelData;
            requestObject.OrderType = [];
                        
            requestObject.OrderType.push({
                OrderType: 1,
                ProviderDetailID: this.state.modelData.Id,
                Status: this.state.IsLimit ? 1 : 0
            });
            
            requestObject.OrderType.push({
                OrderType: 2,
                ProviderDetailID: this.state.modelData.Id,
                Status: this.state.IsMarket ? 1 : 0
            });
        
            requestObject.OrderType.push({
                OrderType: 3,
                ProviderDetailID: this.state.modelData.Id,
                Status: this.state.IsSpot ? 1 : 0
            });
        
            requestObject.OrderType.push({
                OrderType: 4,
                ProviderDetailID: this.state.modelData.Id,
                Status: this.state.IsStopLimit ? 1 : 0
            });
            
            this.closeModel();
            this.props.changeArbitrageOrderType(requestObject);

        }

    }

    // render the component
    render() {
        const { drawerClose } = this.props;

        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('62378DDC-65EB-7F6E-3532-2CC11F2E83FB'); //62378DDC-65EB-7F6E-3532-2CC11F2E83FB
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        //added by jayshreeba Gohil for Arbitrage Breadcrumns (14/06/2019)
        const data = this.props;
        // console.log("newdata", data);
 
         if (data.IsArbitrage != undefined && data.IsArbitrage == "1") {
 
             var BreadCrumbData = [
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
                    title: <IntlMessages id="sidebar.Arbitrage" />,
                    link: '',
                    index: 0
                },
                {
                    title: <IntlMessages id="lable.ArbitrageExchangeConfiguration" />,
                    link: '',
                    index: 0
                },
                {
                    title: <IntlMessages id= "sidebar.ArbitrageallowOrderTypeList" />,
                    link: '',
                    index: 1
                },];
         }else {
 
             var BreadCrumbData = [
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
                     title: <IntlMessages id="sidebar.trading" />,
                     link: '',
                     index: 0
                 },
                 {
                     title: <IntlMessages id="card.list.title.configuration" />,
                     link: '',
                     index: 1
                 },
                 {
                     title: <IntlMessages id="sidebar.providerConfiguration" />,
                     link: '',
                     index: 2
                 }];}
 

        // define columns for table heading
        const columns = [
            {
                name: <IntlMessages id="contactus.title.id" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="liquidityprovider.list.column.label.apiname" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="wallet.orderType" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="liquidityprovider.list.column.label.status" />,
                options: {
                    sort: false,
                    filter: false,
                    customBodyRender: (value) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === this.props.intl.formatMessage({ id: "wallet.Inactive" })),
                                "badge badge-success": (value === this.props.intl.formatMessage({ id: "wallet.Active" }))
                            })} >
                                {value}
                            </span>
                        );
                    }
                }
            },
            {
                name: <IntlMessages id="liquidityprovider.list.column.label.action" />,
                options: { sort: true, filter: true }
            }
        ];

        // set options for table 
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            download: false,
            viewColumns: false,
            filter: false,
            rowsPerPage: this.state.Page_Size,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions
        };

        // returns the component
        return (
            <div className="table-wrapper jbs-page-content">
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                {/* {added by jayshreeba Gohil For Arbitrage Breadcrumns (14/06/2019)} */}
                {data.IsArbitrage=="1" ?<WalletPageTitle  title={<IntlMessages id="sidebar.ArbitrageallowOrderTypeTitle"/>} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />:<WalletPageTitle  title={<IntlMessages id="sidebar.allowOrderType" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />}
                
                {/* <WalletPageTitle title={<IntlMessages id="sidebar.allowOrderType" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} /> */}
                {/* <Col md={12}> */}                <div className="StackingHistory">
                    <MUIDataTable
                        title={this.props.title}
                        data={this.state.exchangeConfigurationApiList.length !== 0 && this.state.exchangeConfigurationApiList.map((item, key) => {
                            
                            var orderType = [];
                            item.OrderType.map((orderTypeDetail) => {
                                if(orderTypeDetail.OrderType === 1 && orderTypeDetail.Status === 1) {
                                    orderType.push(this.props.intl.formatMessage({id:"trading.placeorder.buttonTab.limit"}));
                                }
                                if(orderTypeDetail.OrderType === 2 && orderTypeDetail.Status === 1) {
                                    orderType.push(this.props.intl.formatMessage({id:"trading.placeorder.buttonTab.market"}));
                                }
                                if(orderTypeDetail.OrderType === 3 && orderTypeDetail.Status === 1) {
                                    orderType.push(this.props.intl.formatMessage({id:"trading.placeorder.buttonTab.spot"}));
                                }
                                if(orderTypeDetail.OrderType === 4 && orderTypeDetail.Status === 1) {
                                    orderType.push(this.props.intl.formatMessage({id:"trading.placeorder.buttonTab.stoplimit"}));
                                }
                            });
                            
                            return [
                                key + 1,
                                item.Name,
                                //item.Trntype,
                                orderType.length ? orderType.join(', ') : '-',
                                item.Status === 1 ? this.props.intl.formatMessage({ id: "wallet.Active" }) : item.Status === 0 ? this.props.intl.formatMessage({ id: "wallet.Inactive" }) : this.props.intl.formatMessage({ id: "wallet.Disable" }),
                                menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 ? // check edit curd operation ?
                                    <Fragment>
                                        <div className="list-action">
                                            <Tooltip
                                                title={
                                                    <IntlMessages id="liquidityprovider.tooltip.update" />
                                                }
                                                disableFocusListener disableTouchListener
                                            >
                                                <a
                                                    href="javascript:void(0)"
                                                    className="mr-10"
                                                    onClick={() => this.openModel(item)}
                                                >
                                                    <i className="ti-pencil" />
                                                </a>
                                            </Tooltip>
                                        </div>
                                    </Fragment>
                                    : '-'
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
                <Modal isOpen={this.state.isModelShow} className="watch_model modal-dialog-centered" toggle={() => this.closeModel()}>
                    <ModalHeader>{<IntlMessages id="sidebar.allowOrderType" />} {this.state.modelData.Name}</ModalHeader>
                    <ModalBody>
                        <FormGroup row>
                            
                                <Col md={3} sm={6} xs={12}>
                                    <FormControlLabel className="coincheckbox"
                                        control={
                                            <Checkbox
                                                checked={this.state.IsLimit}
                                                onChange={this.handleChangeLimit}
                                                //disabled={(this.state.ConfigurationShowCard === 1 ? this.state.menuDetail["1AFAFE20-0D14-23F8-635C-AC4DBF1A592C"].AccessRight === "11E6E7B0" : this.state.menuDetail["D9DA5710-8F27-49F1-3CBE-C26ACEF045F2"].AccessRight === "11E6E7B0") ? true : false}
                                                icon={<CheckBoxOutlineBlankIcon />}
                                                checkedIcon={<CheckBoxIcon />}
                                            />
                                        }
                                        label={<IntlMessages id="trading.placeorder.buttonTab.limit" />}
                                    />
                                </Col>
                            
                                <Col md={3} sm={6} xs={12}>
                                    <FormControlLabel className="coincheckbox"
                                        control={
                                            <Checkbox
                                                checked={this.state.IsMarket}
                                                onChange={this.handleChangeMarket}
                                                //disabled={(this.state.ConfigurationShowCard === 1 ? this.state.menuDetail["E5174176-4233-7803-5E64-B3359E9D5062"].AccessRight === "11E6E7B0" : this.state.menuDetail["5C6FA0C5-70E9-2697-2AFC-FCEF27990D2A"].AccessRight === "11E6E7B0") ? true : false}
                                                icon={<CheckBoxOutlineBlankIcon />}
                                                checkedIcon={<CheckBoxIcon />}
                                            />
                                        }
                                        label={<IntlMessages id="trading.placeorder.buttonTab.market" />}
                                    />
                                </Col>
                            
                                <Col md={3} sm={6} xs={12}>
                                    <FormControlLabel className="coincheckbox"
                                        control={
                                            <Checkbox
                                                checked={this.state.IsSpot}
                                                onChange={this.handleChangeSpot}
                                                //disabled={(this.state.ConfigurationShowCard === 1 ? this.state.menuDetail["549650A4-4501-0CB9-826D-8315BD833CA1"].AccessRight === "11E6E7B0" : this.state.menuDetail["25601E34-6F65-6ACB-5E89-8B577D4526FB"].AccessRight === "11E6E7B0") ? true : false}
                                                icon={<CheckBoxOutlineBlankIcon />}
                                                checkedIcon={<CheckBoxIcon />}
                                            />
                                        }
                                        label={<IntlMessages id="trade.summary.option.ordertype.spot" />}
                                    />
                                </Col>
                            
                                <Col md={3} sm={6} xs={12}>
                                    <FormControlLabel className="coincheckbox"
                                        control={
                                            <Checkbox
                                                checked={this.state.IsStopLimit}
                                                onChange={this.handleChangeStopLimit}
                                                //disabled={(this.state.ConfigurationShowCard === 1 ? this.state.menuDetail["B39D0072-8FA7-0BA4-2F35-4152320D8530"].AccessRight === "11E6E7B0" : this.state.menuDetail["5E89CF45-0398-0F59-405D-8D60688662B9"].AccessRight === "11E6E7B0") ? true : false}
                                                icon={<CheckBoxOutlineBlankIcon />}
                                                checkedIcon={<CheckBoxIcon />}
                                            />
                                        }
                                        label={<IntlMessages id="trading.placeorder.buttonTab.stoplimit" />}
                                    />
                                </Col>
                            
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="raised" className="perverbtn" onClick={() => this.changeArbitrageAllowOrderType()}><IntlMessages id="button.save" /></Button>
                        <Button variant="raised" color="danger" onClick={() => this.closeModel()}><IntlMessages id="button.cancel" /></Button>
                    </ModalFooter>
                </Modal>
                {/* </Col> */}
            </div>
        )
    }
}

const mapStateToProps = ({ arbitrageExchangeConfiguration, drawerclose, authTokenRdcer }) => {

    const { exchangeConfigurationApiList, loading, changeOrderTypeData } = arbitrageExchangeConfiguration;
    const { menuLoading, menu_rights } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }

    return { exchangeConfigurationApiList, loading, drawerclose, menuLoading, menu_rights, changeOrderTypeData };

};

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getExchangeConfigurationList,
        getMenuPermissionByID,
        changeArbitrageOrderType
    }
)(injectIntl(ArbitrageAllowOrderType));

