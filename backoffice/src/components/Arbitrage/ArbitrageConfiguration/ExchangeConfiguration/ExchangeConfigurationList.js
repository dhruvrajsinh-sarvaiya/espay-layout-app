// component for display arbitrage exchange manager list By Devang parekh (11-6-2019)

// import necessary components from react
import React, { Component, Fragment } from "react";
// display mui data table
import MUIDataTable from "mui-datatables";
// display tool tip 
import Tooltip from "@material-ui/core/Tooltip";
// import button
import MatButton from "@material-ui/core/Button";
// used for loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// used for drawer
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
// used for get exchange configuration list
import {
  getExchangeConfigurationList,
} from "Actions/Arbitrage/ExchangeConfiguration";
// used for connect
import { connect } from "react-redux";
// intl messages
import IntlMessages from "Util/IntlMessages";
// used for component for drawer
import AddExchangeConfiguration from './AddExchangeConfiguration';
import UpdateExchangeConfiguration from './UpdateExchangeConfiguration';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import { NotificationManager } from "react-notifications";
import { Col } from 'reactstrap';
import classnames from "classnames";
import { injectIntl } from 'react-intl';
//Action methods..
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
    title: <IntlMessages id="sidebar.Arbitrage" />,
    link: '',
    index: 0
  },
  {
    title: <IntlMessages id="sidebar.exchangeConfiguration" />,
    link: '',
    index: 1
  }
];

// class for exchange configuration list
class ExchangeConfigurationList extends Component {

  // constructor that defines default state
  constructor(props) {
    super(props);
    this.state = {
      exchangeConfigurationApiList: [],
      open: false,
      addData: false,
      editData: false,
      editDetails: [],
      componentName: '',
      Page_Size: AppConfig.totalRecordDisplayInList,
      menudetail: [],
      notificationFlag: true,
    };
  }

  componentWillMount() {
    this.props.getMenuPermissionByID('DCA0F116-3954-9A72-0320-4945AA9E8FCD'); // get wallet menu permission
  }
  
  // invoke when component is about to get props
  componentWillReceiveProps(nextprops) {
    //console.log("nextprops.exchangeConfigurationApiList",nextprops.exchangeConfigurationApiList);
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
  }

  // open drawer for add list
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

  // open drawer for edit data and set selected data
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

  // import for show component and set component name
  showComponent = (componentName, menuDetail) => {
    // check permission go on next page or not
    if (menuDetail) {
      this.setState({
        componentName: componentName,
        open: !this.state.open,
      });
    }
  }

  // used for toggle drawer
  toggleDrawer = () => {
    this.setState({
      open: !this.state.open,
      componentName: '',
      addData: false,
      editData: false,
    })
  }

  // close drawer and set default state
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
      addData: false,
      editData: false,
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
  // render the component
  render() {
    const { drawerClose } = this.props;

    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('62378DDC-65EB-7F6E-3532-2CC11F2E83FB'); //62378DDC-65EB-7F6E-3532-2CC11F2E83FB
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }

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
        name: <IntlMessages id="liquidityprovider.list.column.label.type" />,
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
      rowsPerPageOptions: AppConfig.rowsPerPageOptions,
      customToolbar: () => {
        if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
          return (
            <MatButton
              variant="raised"
              className="btn-primary text-white"
              onClick={() => {
                this.onAddData(this.checkAndGetMenuAccessDetail('62378DDC-65EB-7F6E-3532-2CC11F2E83FB').HasChild); // 1A971625-6681-3891-4F55-E36CEFF62A7D
                this.showComponent('AddExchangeConfiguration', this.checkAndGetMenuAccessDetail('62378DDC-65EB-7F6E-3532-2CC11F2E83FB').HasChild); // 1A971625-6681-3891-4F55-E36CEFF62A7D
              }}
            >
              <IntlMessages id="liquidityprovider.list.button.add" />
            </MatButton>
          );
        } else {
          return false;
        }
      }
    };

    // returns the component
    return (
      <div className="table-wrapper jbs-page-content">
        {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
        <WalletPageTitle title={<IntlMessages id="sidebar.exchangeConfiguration" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
        {/* <Col md={12}> */}                <div className="StackingHistory">
          <MUIDataTable
            title={this.props.title}
            data={this.state.exchangeConfigurationApiList.length !== 0 && this.state.exchangeConfigurationApiList.map((item, key) => {
              return [
                key + 1,
                item.Name,
                item.Trntype,
                //item.StatusText === "Active" ? this.props.intl.formatMessage({ id: "wallet.Active" }) : this.props.intl.formatMessage({ id: "wallet.Inactive" }),
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
                          onClick={(event) => {
                            this.onEditData(item, this.checkAndGetMenuAccessDetail('62378DDC-65EB-7F6E-3532-2CC11F2E83FB').HasChild) // 83588D52-5394-4AF9-1340-260CC3CC98C4
                            this.showComponent('UpdateExchangeConfiguration', this.checkAndGetMenuAccessDetail('62378DDC-65EB-7F6E-3532-2CC11F2E83FB').HasChild); // 83588D52-5394-4AF9-1340-260CC3CC98C4
                          }}
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
        {/* </Col> */}
        <Drawer
          width="70%"
          handler={false}
          open={this.state.open}
          // onMaskClick={this.toggleDrawer}
          className="drawer2 drawer1 half_drawer"
          level=".drawer1"
          placement="right"
          levelMove={100}
        >
          {this.state.addData &&
            <AddExchangeConfiguration {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
          }
          {this.state.editData && this.state.editDetails &&
            <UpdateExchangeConfiguration {...this.props} selectedData={this.state.editDetails} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
          }
        </Drawer>
      </div>
    )
  }
}

const mapStateToProps = ({ arbitrageExchangeConfiguration, drawerclose, authTokenRdcer }) => {
  const { exchangeConfigurationApiList, loading } = arbitrageExchangeConfiguration;
  const { menuLoading, menu_rights } = authTokenRdcer;
  if (drawerclose.bit === 1) {
    setTimeout(function () {
      drawerclose.bit = 2
    }, 1000);
  }
  return { exchangeConfigurationApiList, loading, drawerclose, menuLoading, menu_rights };
};

// export this component with action methods and props
export default connect(
  mapStateToProps,
  {
    getExchangeConfigurationList,
    getMenuPermissionByID
  }
)(injectIntl(ExchangeConfigurationList));

