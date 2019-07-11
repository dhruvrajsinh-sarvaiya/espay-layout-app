import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import MatButton from "@material-ui/core/Button";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import IntlMessages from "Util/IntlMessages";
import NotFoundTable from "../../NotFoundTable/notFoundTable";
import Tooltip from "@material-ui/core/Tooltip";
//Action Import for Payment Method  Report Add And Update
import {
  getPairConfigurationList,
} from "Actions/PairConfiguration";
import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import AddPairConfiguration from './AddPairConfiguration';
import EditPairConfiguration from './UpdatePairConfiguration';
import AppConfig from 'Constants/AppConfig';
import { injectIntl } from 'react-intl';
import classnames from "classnames";
//Action methods..
import {
  getMenuPermissionByID
} from 'Actions/MyAccount';


class PairConfigurationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pairConfigurationList: [],
      open: false,
      addData: false,
      editDetails: [],
      editData: false,
      componentName: '',
      Page_Size: AppConfig.totalRecordDisplayInList,
      notificationFlag: true,
      menudetail: [],
    };
  }

  componentWillMount() {
    this.props.getMenuPermissionByID(this.props.ConfigurationShowCard === 1 ? '90A8B59F-801C-1A41-04C8-E3547F5C6959' : '76ED8B0A-34E5-6E7D-4D52-C9F590A76255'); // get Trading menu permission
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.pairConfigurationList.length !== 0 && nextProps.error.length == 0) {
      this.setState({
        pairConfigurationList: nextProps.pairConfigurationList,
      })
    } else if (nextProps.error.length !== 0 && nextProps.error.ReturnCode !== 0) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextProps.error.ErrorCode}`} />);
      this.setState({
        pairConfigurationList: [],
      })
    }
    /* update menu details if not set */
    if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
      if (nextProps.menu_rights.ReturnCode === 0) {


        //added by parth andhariya 
        if (this.props.ConfigurationShowCard === 1) {
          this.props.getPairConfigurationList({ IsMargin: 1 });
        } else {
          this.props.getPairConfigurationList({});
        }
        //code change by jayshreeba gohil (13-6-2019) for handle Coin arbitrage configuration detail
        var reqObject = {};
        if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
          reqObject.IsArbitrage = this.props.IsArbitrage;
        }
        this.props.getPairConfigurationList(reqObject);
        //end

        this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
      } else if (nextProps.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        this.props.drawerClose();
      }
      this.setState({ notificationFlag: false });
    }
  }

  showComponent = (componentName, menuDetail) => {

    // check permission go on next page or not
    if (menuDetail) {
      this.setState({
        componentName: componentName,
        open: this.state.open ? false : true,
      });
    } else {
      NotificationManager.error(<IntlMessages id={"error.permission"} />);
    }

  }

  toggleDrawer = () => {
    this.setState({
      open: this.state.open ? false : true,
      componentName: '',
      addData: false,
      editData: false,
    })
  }


  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
      addData: false,
      editData: false,
      componentName: ''
    });
  }

  onAddData = (menuDetail) => {

    // check permission go on next page or not
    if (menuDetail) {
      this.setState({
        addData: true,
        editData: false,
      })
    } else {
      NotificationManager.error(<IntlMessages id={"error.permission"} />);
    }

  }

  onEditPairConfiguration = (selectedData, menuDetail) => {

    // check permission go on next page or not
    if (menuDetail) {
      this.setState({
        editData: true,
        editDetails: selectedData,
        addData: false,
      })
    } else {
      NotificationManager.error(<IntlMessages id={"error.permission"} />);
    }

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
    const { pairConfigurationList } = this.state;
    const { ConfigurationShowCard } = this.props;
    const { drawerClose } = this.props;

    var menuPermissionDetail = this.checkAndGetMenuAccessDetail(this.props.ConfigurationShowCard ? "CDC06EAB-8843-588B-51AA-973A36482116" : 'CAE8A211-9051-492B-03D2-D2E342FD8F24'); //CAE8A211-9051-492B-03D2-D2E342FD8F24 && MarginGUID CDC06EAB-8843-588B-51AA-973A36482116
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }

    //added by jayshrreeba gohil for Arbitrage BreadCrumbdata (14/06/2019)
    const data = this.props;
    var BreadCrumbData = [];
    if (data.IsArbitrage != undefined && data.IsArbitrage == 1) {

       BreadCrumbData = [
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
          title: <IntlMessages id="lable.ArbitragePairConfiguration" />,
          link: '',
          index: 0
        },
        {
          title: <IntlMessages id="lable.ArbitragePairConfigurationList" />,
          link: '',
          index: 1
        }
      ];
    } else {
       BreadCrumbData = [
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
          title: this.props.ConfigurationShowCard === 1 ? <IntlMessages id="sidebar.marginTrading" /> : <IntlMessages id="sidebar.trading" />,
          link: '',
          index: 0
        },
        {
          title: <IntlMessages id="card.list.title.configuration" />,
          link: '',
          index: 1
        },
        {
          title: <IntlMessages id="sidebar.pairConfiguration.title" />,
          link: '',
          index: 2
        }
      ];
    }
    const columns = [
      {
        name: "#",
        options: { sort: false, filter: false }
      },
      {
        name: (
          <IntlMessages id="sidebar.pairConfiguration.list.lable.marketName" />
        ),
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="sidebar.colCurrencypair" />,
        options: { sort: true, filter: true }
      },
      {
        name: (
          <IntlMessages id="sidebar.pairConfiguration.list.lable.defaultRate" />
        ),
        options: { sort: true, filter: true }
      },
      {
        name: (
          <IntlMessages id="sidebar.pairConfiguration.list.lable.buyquentity" />
        ),
        options: { sort: true, filter: true }
      },
      {
        name: (
          <IntlMessages id="sidebar.pairConfiguration.list.lable.sellquentity" />
        ),
        options: { sort: true, filter: true }
      },
      {
        name: (
          <IntlMessages id="sidebar.pairConfiguration.list.lable.buyprice" />
        ),
        options: { sort: true, filter: true }
      },

      {
        name: (
          <IntlMessages id="sidebar.pairConfiguration.list.lable.sellprice" />
        ),
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="sidebar.pairConfiguration.list.lable.status" />,
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
        name: <IntlMessages id="sidebar.pairConfiguration.list.lable.action" />,
        options: { sort: false, filter: false }
      }
    ];

    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false,
      print: false,
      download: false,
      viewColumns: false,
      filter: false,
      rowsPerPage: this.state.Page_Size,
      rowsPerPageOptions: AppConfig.rowsPerPageOptions,
      search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
      customToolbar: () => {

        if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation

          return (
            <MatButton
              variant="raised"
              className="btn-primary text-white"
              onClick={() => {
                this.onAddData(this.checkAndGetMenuAccessDetail(ConfigurationShowCard ? "CDC06EAB-8843-588B-51AA-973A36482116" : 'CAE8A211-9051-492B-03D2-D2E342FD8F24').HasChild); // 71EF0D4C-3378-4BBD-3A77-BA5AB68C6693  && MarginGUID 515C74FF-16DC-2941-35EB-2B7737A072D2
                this.showComponent('AddPairConfiguration', this.checkAndGetMenuAccessDetail(ConfigurationShowCard ? "CDC06EAB-8843-588B-51AA-973A36482116" : 'CAE8A211-9051-492B-03D2-D2E342FD8F24').HasChild); // 71EF0D4C-3378-4BBD-3A77-BA5AB68C6693   &&   MarginGUID 515C74FF-16DC-2941-35EB-2B7737A072D2
              }}
            >

              <IntlMessages id="sidebar.pairConfiguration.button.add" />
            </MatButton>
          );

        } else {
          return false;
        }

      },
      customToolbarSelect: selectedRows => (
        <CustomToolbarSelect
          selectedRows={selectedRows}
          deletePairConfigurationForm={this.props.deletePairConfigurationForm}
          pairConfigurationList={pairConfigurationList}
        />
      )
    };
    return (
      <div>
        {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
        {/* {added by jayshreeba gohil (14/06/2019)} */}
        {data.IsArbitrage != undefined && data.IsArbitrage == 1 && <WalletPageTitle title={<IntlMessages id="lable.ArbitragePairConfiguration" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />}
         {pairConfigurationList.length !== 0 ? (
          <MUIDataTable
            title={this.props.title}
            data={pairConfigurationList.map((pairDetail, key) => {
              return [
                key + 1,
                pairDetail.MarketName,
                pairDetail.PairName,
                pairDetail.CurrentRate ? parseFloat(pairDetail.CurrentRate).toFixed(8) : 0,
                pairDetail.BuyMinQty + "-" + pairDetail.BuyMaxQty,
                pairDetail.SellMinQty + "-" + pairDetail.SellMaxQty,
                (pairDetail.BuyMinPrice ? parseFloat(pairDetail.BuyMinPrice).toFixed(8) : 0) + "-" + (pairDetail.BuyMaxPrice ? parseFloat(pairDetail.BuyMaxPrice).toFixed(8) : 0),
                (pairDetail.SellMinPrice ? parseFloat(pairDetail.SellMinPrice).toFixed(8) : 0) + "-" + (pairDetail.SellMaxPrice ? parseFloat(pairDetail.SellMaxPrice).toFixed(8) : 0),
                pairDetail.StatusText === "Active" ? this.props.intl.formatMessage({ id: "wallet.Active" }) : this.props.intl.formatMessage({ id: "wallet.Inactive" }),

                menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 ? // check edit curd operation ?
                  <Fragment>
                    <div className="list-action">
                      <Tooltip
                        title={
                          <IntlMessages id="sidebar.pairConfiguration.button.update" />
                        }
                        disableFocusListener disableTouchListener
                      >
                        <a
                          href="javascript:void(0)"
                          className="mr-10"
                          onClick={() => {
                            this.onEditPairConfiguration(pairDetail, this.checkAndGetMenuAccessDetail(ConfigurationShowCard ? "CDC06EAB-8843-588B-51AA-973A36482116" : 'CAE8A211-9051-492B-03D2-D2E342FD8F24').HasChild); // 1E00CB45-A3E9-28E7-2974-898235D98609   && MarginGUID  8306126C-6ECC-262F-5F16-25BC630150FC
                            this.showComponent('EditPairConfiguration', this.checkAndGetMenuAccessDetail(ConfigurationShowCard ? "CDC06EAB-8843-588B-51AA-973A36482116" : 'CAE8A211-9051-492B-03D2-D2E342FD8F24').HasChild); // 1E00CB45-A3E9-28E7-2974-898235D98609   && MarginGUID  8306126C-6ECC-262F-5F16-25BC630150FC
                          }}
                        >
                          <i className="ti-pencil" />
                        </a>
                      </Tooltip>
                    </div>
                  </Fragment> : '-'

              ];
            })}
            columns={columns}
            options={options}
          />
        ) : (
            <NotFoundTable title={this.props.title} columns={columns} />
          )}
        <Drawer
          width="70%"
          handler={false}
          open={this.state.open}
          className="drawer2 half_drawer"
          level=".drawer1"
          placement="right"
          levelMove={100}
        >
          {this.state.addData &&
            <AddPairConfiguration {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} ConfigurationShowCard={ConfigurationShowCard} />
          }

          {this.state.editData && this.state.editDetails &&
            <EditPairConfiguration {...this.props} selectedData={this.state.editDetails} drawerClose={this.toggleDrawer} closeAll={this.closeAll} ConfigurationShowCard={ConfigurationShowCard} />
          }
         
        </Drawer>

      </div>
    )
  }
}

const mapStateToProps = ({ pairConfiguration, authTokenRdcer }) => {
  var responce = {
    pairConfigurationList: pairConfiguration.pairConfigurationList,
    loading: pairConfiguration.loading,
    error: pairConfiguration.error,
    menuLoading: authTokenRdcer.menuLoading,
    menu_rights: authTokenRdcer.menu_rights,
  };

  return responce;
};

export default connect(
  mapStateToProps,
  {
    getPairConfigurationList,
    getMenuPermissionByID
  }
)(injectIntl(PairConfigurationList));