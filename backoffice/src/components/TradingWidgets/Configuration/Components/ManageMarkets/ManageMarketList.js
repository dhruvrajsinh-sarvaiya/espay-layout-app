// component for display manage market list By Tejas
import React, { Component, Fragment } from "react";

// used for connect store
import { connect } from "react-redux";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
// display notification for success or failure
import { NotificationManager } from "react-notifications";

//import button 
import MatButton from "@material-ui/core/Button";

//Action for get market list
import {
  getMarketList,
  updateMarketList
} from "Actions/ManageMarkets";

// import for get currency list
import { getLedgerCurrencyList } from "Actions/TradingReport";

// Used for display mui data table
import MUIDataTable from "mui-datatables";

// used for section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

// used for drawer
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

// used for display add and update form
import AddMarketData from './AddMarketList';
import UpdateMarketData from './UpdateMarket';


import { Col } from 'reactstrap';

import AppConfig from 'Constants/AppConfig';

// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';

import Switch from 'react-toggle-switch';
//Action methods..
import {
  getMenuPermissionByID
} from 'Actions/MyAccount';




// class for market list
class ManageMarketList extends Component {

  // constructor and define default state
  constructor(props) {
    super(props);
    this.state = {
      marketList: [],
      currencyList: [],
      open: false,
      addData: false,
      editDetails: [],
      editData: false,
      componentName: '',
      //adde by parth andhariya
      ConfigurationShowCard: props.ConfigurationShowCard,
      Page_Size: AppConfig.totalRecordDisplayInList,
      updateData: false,
      notificationFlag: true,
      menudetail: [],
    };
  }
  componentWillMount() {
    this.props.getMenuPermissionByID(this.props.ConfigurationShowCard === 1 ? '8549613C-6D6B-0279-24B4-3203DA8945A8' : 'B75E9652-68DE-822E-1C4E-9E9356E4725C'); // get Trading menu permission
  }
  // invoke when component is about to get props
  componentWillReceiveProps(nextprops) {

    // display success or error message when clla api for update
    if (nextprops.updateMarketList && nextprops.updateError.length == 0 && this.state.updateData) {

      NotificationManager.success(<IntlMessages id="market.update.currency.success" />);

      this.setState({
        updateData: false,
      })
      this.props.getMarketList({});

    } else if (nextprops.updateError.length !== 0 && nextprops.updateError.ReturnCode !== 0 && this.state.updateData) {
      NotificationManager.error(<IntlMessages
        id={`error.trading.transaction.${nextprops.updateError.ErrorCode}`} />);
      this.setState({
        updateData: false,
      })
    }

    if (nextprops.drawerclose.bit === 1 && nextprops.drawerclose.Drawersclose.open3 === false) {
      this.setState({
        open: false,
      })
    }
    // set market list data if success 
    if (nextprops.marketList.length !== 0 && nextprops.error.length == 0) {
      this.setState({
        marketList: nextprops.marketList,
      })
    } else if (nextprops.error.length !== 0 && nextprops.error.ReturnCode !== 0) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);
      this.setState({
        marketList: [],
      })
    }

    // set state for currency list
    if (nextprops.currencyList) {
      this.setState({
        currencyList: nextprops.currencyList
      });
    }
    /* update menu details if not set */
    if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
      if (nextprops.menu_rights.ReturnCode === 0) {

        //code change by jayshreeba gohil (13-6-2019) for handle arbitrage configuration detail
        var reqObject = {};
        if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
          reqObject.IsArbitrage = this.props.IsArbitrage;
        }
        this.props.getMarketList(reqObject);
        //end 
        //adde by parth andhariya
        if (this.state.ConfigurationShowCard === 1) {
          this.props.getMarketList({ IsMargin: 1 });
        } else {
          this.props.getMarketList({});
        }
        this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
      } else if (nextprops.menu_rights.ReturnCode !== 0) {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        this.props.drawerClose();
      }
      this.setState({ notificationFlag: false });
    }
  }

  // used for show component and set component name
  showComponent = (componentName, menuDetail) => {
    // check permission go on next page or not
    if (menuDetail) {
      this.setState({
        componentName: componentName,
        open: !this.state.open,
      });
    }
  }

  // toggle drawer 
  toggleDrawer = () => {
    this.setState({
      open: !this.state.open,
      componentName: ''
    })
  }

  // set handleChange Event for Switch button
  handleChange = name => event => {
    this.setState({ IsSelected: event.target.checked });
  };

  // close all drawer
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
      addData: false,
      editData: false
    });
  }

  // get data for market list
  // componentDidMount() {
  //   //adde by parth andhariya
  //   if (this.state.ConfigurationShowCard === 1) {
  //     this.props.getMarketList({ IsMargin: 1 });
  //   } else {
  //     this.props.getMarketList({});
  //   }
  // }

  // open drawer for add market data form
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

  // open drawer for Update market data form
  onEditData = (selectedData, menuDetail) => {
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

  //  create request and call api for update record
  updateCurrencyData = (event, selectedData, menuDetail) => {

    // check permission go on next page or not
    if (menuDetail) {
      const data = {
        CurrencyName: selectedData.CurrencyName,
        Status: selectedData.Status == "Active" ? parseInt(0) : parseInt(1),
        ServiceID: selectedData.ServiceID,
        ID: selectedData.ID
      };

      this.setState({
        updateData: true
      })

      this.props.updateMarketList(data);
    } else {
      NotificationManager.error(<IntlMessages id={"error.permission"} />);
    }

  };
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
  // render the component
  render() {

    const { drawerClose } = this.props;
    const { ConfigurationShowCard } = this.state;

    //added by jayshrreeba gohil for Arbitrage BreadCrumbdata (14/06/2019)
    const data = this.props;
    // console.log("newdata", data);

    if (data.IsArbitrage != undefined && data.IsArbitrage == 1) {

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
          title: <IntlMessages id="lable.ArbitragePairConfiguration"/>,
          link: '',
          index: 0
        },
        {
          title: <IntlMessages id="sidebar.ManageMarketList" />,
          link: '',
          index: 1
        }
      ];
    } else {
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
          title: <IntlMessages id="sidebar.ManageMarketList" />,
          link: '',
          index: 2
        }
      ];
    }

    var menuPermissionDetail = this.checkAndGetMenuAccessDetail(ConfigurationShowCard === 1 ? 'B1810547-2C10-4C1D-6CA5-263BAF8E2B07' : '8B793242-783C-9C1E-2FD2-7CF8EC0E0142'); //8B793242-783C-9C1E-2FD2-7CF8EC0E0142  && margin_GUID B1810547-2C10-4C1D-6CA5-263BAF8E2B07
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }

    // defines columns name 
    const columns = [
      {
        name: "#",
        options: { sort: false, filter: false }
      },
      {
        name: <IntlMessages id="manageMarkets.list.form.label.currency" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="manageMarkets.list.form.label.code" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="manageMarkets.list.form.label.status" />,
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
      rowsPerPageOptions: AppConfig.rowsPerPageOptions,
      customToolbar: () => {

        if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
          return (
            <MatButton
              variant="raised"
              className="btn-primary text-white"
              onClick={() => {
                this.onAddData(this.checkAndGetMenuAccessDetail(ConfigurationShowCard === 1 ? 'B1810547-2C10-4C1D-6CA5-263BAF8E2B07' : '8B793242-783C-9C1E-2FD2-7CF8EC0E0142').HasChild); // 599E46F4-134F-6A4E-7EB0-9602D27FA72B  && margin_GUID 57EAAA01-9E86-4D9F-72AB-8276721807DB
                this.showComponent('AddMarketData', this.checkAndGetMenuAccessDetail(ConfigurationShowCard === 1 ? 'B1810547-2C10-4C1D-6CA5-263BAF8E2B07' : '8B793242-783C-9C1E-2FD2-7CF8EC0E0142').HasChild); // 599E46F4-134F-6A4E-7EB0-9602D27FA72B  && margin_GUID 57EAAA01-9E86-4D9F-72AB-8276721807DB
              }}
            >
              <IntlMessages id="exchangefeedConfig.pairConfiguration.button.add" />
            </MatButton>
          );

        } else {
          return false;
        }

      }
    };

    // returns the component
    return (
      <div className="mb-10 jbs-page-content">

        {/* {added by jayshreeba gohil (14/06/2019)} */}
        {data.IsArbitrage != undefined && data.IsArbitrage == 1 ? <WalletPageTitle title={<IntlMessages id= "sidebar.ManageMarketTitle" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} /> : <WalletPageTitle title={<IntlMessages id= "sidebar.ManageMarket"/>} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />}


        {/* <WalletPageTitle title={<IntlMessages id= "lable.ArbitragePairConfigurationList" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} /> */}
        {(this.props.loading || this.props.updateLoading || this.props.menuLoading) && <JbsSectionLoader />}
        <MUIDataTable
          title={this.props.title}
          data={this.state.marketList.length !== 0 && this.state.marketList.map((marketData, key) => {
            return [
              key + 1,
              marketData.CurrencyDesc,
              marketData.CurrencyName,
              <Fragment>
                <Switch
                  on={marketData.Status === "Active" ? true : false}
                  onClick={(event) => this.updateCurrencyData(event, marketData, this.checkAndGetMenuAccessDetail(ConfigurationShowCard === 1 ? 'B1810547-2C10-4C1D-6CA5-263BAF8E2B07' : '8B793242-783C-9C1E-2FD2-7CF8EC0E0142').HasChild)}

                />
              </Fragment>
            ];
          })}
          columns={columns}
          options={options}
        />
        <Drawer
          width="30%"
          handler={false}
          open={this.state.open}
          // onMaskClick={this.toggleDrawer}
          className="drawer2 half_drawer"
          level=".drawer0"
          placement="right"
          levelMove={100}
        >
          {this.state.addData &&
            <AddMarketData {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} ConfigurationShowCard={ConfigurationShowCard} />
          }

          {this.state.editData && this.state.editDetails &&
            <UpdateMarketData {...this.props} selectedData={this.state.editDetails} drawerClose={this.toggleDrawer} closeAll={this.closeAll} ConfigurationShowCard={ConfigurationShowCard} />
          }

        </Drawer>
      </div>
    )
  }

}

const mapStateToProps = ({ manageMarkets, tradingledger, drawerclose, authTokenRdcer }) => {
  const { marketList, error, loading, updateLoading, updateError } = manageMarkets;
  const { menuLoading, menu_rights } = authTokenRdcer;
  const { currencyList } = tradingledger;
  if (drawerclose.bit === 1) {
    setTimeout(function () {
      drawerclose.bit = 2
    }, 1000);
  }
  return { marketList, error, loading, currencyList, drawerclose, updateLoading, updateError, menuLoading, menu_rights };
};

// export this component with action methods and props
export default connect(
  mapStateToProps,
  {
    getMarketList,
    getLedgerCurrencyList,
    updateMarketList,
    getMenuPermissionByID

  }
)(ManageMarketList);
