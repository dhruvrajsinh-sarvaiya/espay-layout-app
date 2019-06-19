/* 
    Developer : Vishva shah
    File Comment : Arbitrage Address component
    Date : 12-06-2019
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import IntlMessages from "Util/IntlMessages";
import Button from '@material-ui/core/Button';
import MUIDataTable from "mui-datatables";
import Drawer from "rc-drawer";
import classnames from "classnames";
import {
    getArbitrageAddressList,
} from "Actions/Arbitrage/ArbitrageProviderAddress";
import AddArbitrageAddress from "./AddArbitrageAddress";
import UpdateArbitrageAddress from "./UpdateArbitrageAddress";
import { injectIntl } from 'react-intl';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from "react-notifications";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import validator from "validator";
import { ListArbitrageCurrency } from 'Actions/Arbitrage/ArbitrageCurrencyConfiguration';
import { listServiceProvider } from 'Actions/ServiceProvider';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const components = {
    AddArbitrageAddress: AddArbitrageAddress,
    UpdateArbitrageAddress: UpdateArbitrageAddress,
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, rowDetails,IsArbitrage) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        rowDetails,
        IsArbitrage
    });
};
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
        title: <IntlMessages id="sidebar.Arbitrage" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="lable.ArbitrageAddress" />,
        link: '',
        index: 1
    },
];
const initialState = {
    componentName: "",
    showError: false,
    showSuccess: false,
    responseMessage: "",
    open: false,
    rowDetails: {},
    menudetail: [],
    notification: true,
    WalletTypeID: '',
    Address: "",
    showReset:false,
    SerProId:"",
    Data:[],
}

class ArbitrageAddress extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = initialState;
    }
    //drawer close all event
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    };
    //toggle drawer
    toggleDrawer = () => {
        this.setState({
            open: false,
        });
    }
    //show component
    showComponent = (componentName, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                open: true,
                rowDetails: {},
                componentName: componentName,
            });
        } 
        else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    //Edit item
    Edit = (item, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                open: true, 
                rowDetails: item,
                componentName: "UpdateArbitrageAddress",
            });
        } 
        else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    // component will mount actions
    componentWillMount() {
        this.props.getMenuPermissionByID('74055FA7-6CC8-8282-71F4-988E95340D12'); // get arbitrage menu permission
    }
    //will receive props 
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {     
                this.props.getArbitrageAddressList({});
                this.props.ListArbitrageCurrency({});
                var reqObject = {};
                if(this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                    reqObject.IsArbitrage = this.props.IsArbitrage;
                }
                this.props.listServiceProvider(reqObject);
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        if (nextProps.listServiceProviderData.hasOwnProperty("ReturnCode") && nextProps.listServiceProviderData.ReturnCode === 0 && nextProps.listServiceProviderData !== "undefine") {
            this.setState({
                Data: nextProps.listServiceProviderData.Response
            })
        }
    }
    onChangeHandlerwallet(e) {
    if (e.target.name === "Address") {
        if (validator.isAlphanumeric(e.target.value) || e.target.value === "") {
            this.setState({ [e.target.name]: e.target.value });
        }
    } else {
        this.setState({ [e.target.name]: e.target.value });
        }
    }
    // apply filter
	applyFilter() {
		if (this.state.WalletTypeID !== '' || this.state.SerProId !== "" || this.state.Address !== "") {
			this.props.getArbitrageAddressList({
				ServiceProviderId :this.state.SerProId,
                WalletTypeId: this.state.WalletTypeID,
                Address: this.state.Address,
			});
			this.setState({ showReset: true,});
		}
	}
	//reset filter
	clearFilter() {
		this.setState({ ...initialState, menudetail: this.state.menudetail},() =>this.props.getArbitrageAddressList({}));
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('29068824-19DF-1316-3626-675C80E21F09'); //29068824-19DF-1316-3626-675C80E21F09
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const { drawerClose, arbitrageAddressList } = this.props;
        const columns = [
            { name: intl.formatMessage({ id: "wallet.lblSr" }), options: { sort: true, filter: false } },
            { name: intl.formatMessage({ id: "my_account.currency" }), options: { sort: true, filter: true } },
            { name: intl.formatMessage({ id: "emailAPIManager.label.SerproName" }), options: { sort: true, filter: true } },
            { name: intl.formatMessage({ id: "components.address" }), options: { sort: true, filter: true } },
            { name: intl.formatMessage({ id: "arbitrage.IsDefaultAddress" }), options: { sort: true, filter: false } },
            { name: intl.formatMessage({ id: "table.action" }), options: { sort: false, filter: false } },
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            filter: menuPermissionDetail.Utility.indexOf('18736530') !== -1, //for check filter permission
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customToolbar: () => {
                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <Button
                            variant="raised"
                            className="btn-primary text-white mt-5"
                            onClick={() => this.showComponent("AddArbitrageAddress",this.checkAndGetMenuAccessDetail('29068824-19DF-1316-3626-675C80E21F09').HasChild
                        )}
                        > 
                            <IntlMessages id="button.addNew" />
                        </Button>
                    );
                } else {
                    return false;
                }
            }
        };
        return (
            <div className="jbs-page-content">
            {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="lable.ArbitrageAddress" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && (
					<JbsCollapsibleCard>
						<div className="top-filter">
							<Form className="tradefrm row">
								<FormGroup className="col-md-2 col-sm-4">
                                    <Label for="SerProId"><IntlMessages id="liquidityprovider.list.option.label.serviceprovider" /></Label>
                                    <Input type="select" name="SerProId" id="SerProId" value={this.state.SerProId} onChange={(e) => this.onChangeHandlerwallet(e)}>
                                        <option value="">{intl.formatMessage({ id: "sidebar.apiConfAddGen.apiProvider.selectProvider" })}</option>
                                        {this.state.Data.length && this.state.Data.map((item, key) => (
                                            <option value={item.Id} key={key}>{item.ProviderName}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
								<FormGroup className="col-md-2 col-sm-4">
									<Label for="WalletTypeID">
										<IntlMessages id="my_account.currency" />
									</Label>
									<Input
										type="select"
										name="WalletTypeID"
										id="WalletTypeID"
										value={this.state.WalletTypeID}
										onChange={e => this.onChangeHandlerwallet(e)}
									>
										<option value="">{intl.formatMessage({ id: 'wallet.errCurrency' })}</option>
										{this.props.ArbitrageCurrencyList.length &&
											this.props.ArbitrageCurrencyList.map((type, index) => (
												<option key={index} value={type.Id}>
													{type.CoinName}
												</option>
											))}
									</Input>
								</FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Address"><IntlMessages id="wallet.Address" /></Label>
                                        <Input type="text" name="Address" id="Address" placeholder={intl.formatMessage({ id: "wallet.Address" })} value={this.state.Address} onChange={(e) => this.onChangeHandlerwallet(e)} maxLength={50} />
                                </FormGroup>
								<FormGroup className="col-md-2 col-sm-4">
									<div className="btn_area">
										<Button
											color="primary"
											variant="raised"
											className="text-white"
											onClick={() => this.applyFilter()}
											disabled={(this.state.WalletTypeID !== '' || this.state.SerProId !== "" || this.state.Address !== "") ? false : true}
										>
											<IntlMessages id="widgets.apply" />
										</Button>
										{this.state.showReset && (
											<Button
												className="btn-danger text-white ml-10"
												onClick={e => this.clearFilter()}
											>
												<IntlMessages id="bugreport.list.dialog.button.clear" />
											</Button>
										)}
									</div>
								</FormGroup>
							</Form>
						</div>
					</JbsCollapsibleCard>
				)}
                <div className="StackingHistory">
                    {this.props.loading && <JbsSectionLoader />}
                    <MUIDataTable
                        data={arbitrageAddressList.map((item, index) => {
                            return [
                                index + 1,
                                item.WalletTypeName,
                                item.ServiceProviderName,
                                item.Address,
                                item.IsDefaultAddress === 0 ? <IntlMessages id="sidebar.no"/> : <IntlMessages id="sidebar.yes"/> ,
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.Edit(item,this.checkAndGetMenuAccessDetail('29068824-19DF-1316-3626-675C80E21F09').HasChild
                                            )}
                                        >
                                            <i className="ti-pencil" />
                                        </a>
                                    }
                                </div>
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
                <Drawer
                    width="40%"
                    handler={false}
                    open={this.state.open}
                    className="drawer2 half_drawer"
                    level=".drawer0"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.componentName !== "" &&
                        dynamicComponent(
                            this.state.componentName,
                            this.props,
                            this.toggleDrawer,
                            this.closeAll,
                            this.state.rowDetails,
                            this.props.IsArbitrage
                            // this.state.menuDetail
                        )}
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = ({ ArbitrageAddressReducer,authTokenRdcer,ArbitrageCurrencyConfiguration,ServiceProviderReducer}) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { arbitrageAddressList, loading, errors } = ArbitrageAddressReducer;
    const { ArbitrageCurrencyList } = ArbitrageCurrencyConfiguration;
    const { listServiceProviderData} = ServiceProviderReducer;
    return { arbitrageAddressList, loading, errors ,menuLoading,menu_rights,ArbitrageCurrencyList,listServiceProviderData};
};

export default connect(mapStateToProps, {
    getArbitrageAddressList,
    ListArbitrageCurrency,
    getMenuPermissionByID,
    listServiceProvider
})(injectIntl(ArbitrageAddress));