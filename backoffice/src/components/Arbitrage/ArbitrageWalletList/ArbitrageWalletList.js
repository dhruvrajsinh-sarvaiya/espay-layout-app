/* 
    Developer : Vishva shah
    File Comment : Arbitrage wallet component
    Date : 17-06-2019
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import IntlMessages from "Util/IntlMessages";
import Button from '@material-ui/core/Button';
import MUIDataTable from "mui-datatables";
import classnames from "classnames";
import {
    getArbitrageWalletList,
} from "Actions/Arbitrage/ArbitrageProviderWallet";
import { injectIntl } from 'react-intl';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from "react-notifications";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { ListArbitrageCurrency } from 'Actions/Arbitrage/ArbitrageCurrencyConfiguration';
import { listServiceProvider } from 'Actions/ServiceProvider';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
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
        title: <IntlMessages id="arbitrage.Providerwallets" />,
        link: '',
        index: 1
    },
];
const initialState = {
    componentName: "",
    showError: false,
    showSuccess: false,
    open: false,
    rowDetails: {},
    menudetail: [],
    notification: true,
    WalletTypeID: '',
    Status : "",
    showReset:false,
    SerProId:"",
    Data:[],
}

class ArbitrageProviderWallet extends Component {
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
    // component will mount actions
    componentWillMount() {
        this.props.getMenuPermissionByID('FAD08B8B-1DE9-38AA-4EF8-73C135432B59'); // get arbitrage menu permission
    }
    //will receive props 
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {     
                this.props.getArbitrageWalletList({});
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
    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    // apply filter
	applyFilter() {
		if (this.state.WalletTypeID !== '' || this.state.SerProId !== "" || this.state.Status !== "") {
			this.props.getArbitrageWalletList({
				ServiceProviderId :this.state.SerProId,
                WalletTypeId: this.state.WalletTypeID,
                Status: this.state.Status,
			});
			this.setState({ showReset: true,});
		}
	}
	//reset filter
	clearFilter() {
		this.setState({ ...initialState, menudetail: this.state.menudetail},() =>this.props.getArbitrageWalletList({}));
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
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('E8084D62-87FA-36A6-7D0F-4B02D1345E3F'); //E8084D62-87FA-36A6-7D0F-4B02D1345E3F
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const intl = this.props.intl;
        const { drawerClose, arbitrageWalletList } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "wallet.lblSr" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "table.walletId" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "lable.WalletTypeName"}),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "table.balance" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "table.OutBoundBalance" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "table.InBoundBalance" }),
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "emailAPIManager.label.SerproName" }),
                options: {
                    filter: true,
                    sort: true
                }
            },
            {
                name: intl.formatMessage({ id: "sidebar.Status" }),
                options: {
                    sort: true,
                    filter: false,
                    customBodyRender: (value) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === 9),
                                "badge badge-success": (value === 1),
                            })}
                        >
                            {this.props.intl.formatMessage({
                                id: "arbitrage.ProviderWallet." + value,
                            })}
                            </span>
                        );
                    }
                }
            },
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
            filter: false,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
        };
        return (
            <div className="jbs-page-content">
            {(this.props.menuLoading || this.props.loading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="arbitrage.Providerwallets" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && (
					<JbsCollapsibleCard>
						<div className="top-filter">
							<Form className="tradefrm row">
								<FormGroup className="col-md-2 col-sm-4">
                                    <Label for="SerProId"><IntlMessages id="liquidityprovider.list.option.label.serviceprovider" /></Label>
                                    <Input type="select" name="SerProId" id="SerProId" value={this.state.SerProId} onChange={(e) => this.onChangeHandler(e)}>
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
										onChange={e => this.onChangeHandler(e)}
									>
										<option value="">{intl.formatMessage({ id: 'wallet.errCurrency' })}</option>
										{this.props.ArbitrageCurrencyList.length &&
											this.props.ArbitrageCurrencyList.map((type, index) => (
												<option key={index} value={type.CoinName}>
													{type.CoinName}
												</option>
											))}
									</Input>
								</FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-1"><IntlMessages id="widgets.status" /></Label>
                                        <Input type="select" name="Status" id="Status" value={this.state.Status} onChange={(e) => this.onChangeHandler(e)}>
                                            <option value="">{intl.formatMessage({ id: "wallet.errStatus" })}</option>
                                            <option value="1">{intl.formatMessage({ id: "wallet.Enable" })}</option>
                                            <option value="9">{intl.formatMessage({ id: "wallet.Disable" })}</option>
                                        </Input>
                                    </FormGroup>
								<FormGroup className="col-md-2 col-sm-4">
									<div className="btn_area">
										<Button
											color="primary"
											variant="raised"
											className="text-white"
											onClick={() => this.applyFilter()}
											disabled={(this.state.WalletTypeID !== '' || this.state.SerProId !== "" || this.state.Status !== "") ? false : true}
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
                        data={arbitrageWalletList.map((item, index) => {
                            return [
                                index + 1,
                                item.AccWalletID,
                                item.WalletName,
                                item.Balance.toFixed(8),
                                item.OutBoundBalance.toFixed(8),
                                item.InBoundBalance.toFixed(8),
                                item.SerProIdName,
                                item.Status
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

const mapStateToProps = ({ ProviderWalletReducer,authTokenRdcer,ArbitrageCurrencyConfiguration,ServiceProviderReducer}) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { arbitrageWalletList, loading, errors } = ProviderWalletReducer;
    const { ArbitrageCurrencyList } = ArbitrageCurrencyConfiguration;
    const { listServiceProviderData} = ServiceProviderReducer;
    return { arbitrageWalletList, loading, errors ,menuLoading,menu_rights,ArbitrageCurrencyList,listServiceProviderData};
};
export default connect(mapStateToProps, {
    getArbitrageWalletList,
    ListArbitrageCurrency,
    getMenuPermissionByID,
    listServiceProvider
})(injectIntl(ArbitrageProviderWallet));