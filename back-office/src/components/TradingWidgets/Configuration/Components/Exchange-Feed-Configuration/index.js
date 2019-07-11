// Component For Display Exchange Feed Configuraion  By Tejas Date : 15/2/2019
import React, { Component, Fragment } from "react";

// import Mui Data table for display data as a table 
import MUIDataTable from "mui-datatables";

// display tool tip
import Tooltip from "@material-ui/core/Tooltip";

// Material UI Button
import MatButton from "@material-ui/core/Button";

// Section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// Import For Connect Store
import { connect } from "react-redux";

// Function for get Configuration List : Tejas
import {
  getExchangeFeedConfigList,
} from "Actions/ExchangeFeedConfig";

// intl messages
import IntlMessages from "Util/IntlMessages";

// Import drawer 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { Col } from "reactstrap";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
// import component for add and update 
import AddExchangeFeedConfig from './AddExchangeFeedConfig';
import UpdateExchangeFeedConfig from './UpdateExchangeFeedConfig';

import AppConfig from 'Constants/AppConfig';

import { NotificationManager } from "react-notifications";
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
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
    title: <IntlMessages id="sidebar.Exchange-Feed-Configuration" />,
    link: '',
    index: 2
  }
];

// Class For Exchange feed List
class ExchangeFeed extends Component {

  // constructor for define default state
  constructor(props) {
    super(props);
    this.state = {
      exchangeFeedList: [],
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
    this.props.getMenuPermissionByID('B93AD266-9399-38C4-7EFD-DC4DC11105E1'); // get wallet menu permission
  }

  // invoke when component will receive props
  componentWillReceiveProps(nextprops) {
    if (nextprops.exchangeFeedList && nextprops.exchangeFeedList.length > 0) {
      this.setState({
        exchangeFeedList: nextprops.exchangeFeedList
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
        this.props.getExchangeFeedConfigList();
        this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
      } else if (nextprops.menu_rights.ReturnCode !== 0) {
        this.setState({ notificationFlag: false });
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
        this.props.drawerClose();
      }
    }
  }

  // invoke when user click for add new data
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

  // invoke when user click for edit data
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

  // Open or close Component for add and update Or drawer
  showComponent = (componentName, menuDetail) => {
    // check permission go on next page or not
    if (menuDetail) {
      this.setState({
        componentName: componentName,
        open: this.state.open ? false : true,
      });
    }
  }

  // Close or Open drawer
  toggleDrawer = () => {
    this.setState({
      open: this.state.open ? false : true,
      componentName: '',
      addData: false,
      editData: false
    })
  }

  // close the drawer
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
      addData: false,
      editData: false,
      componentName: '',
    });
  }

  // Invoke After Render Function
  // componentDidMount() {
  //   this.props.getExchangeFeedConfigList();
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
  // Render the Component
  render() {

    const { drawerClose } = this.props;

    var menuPermissionDetail = this.checkAndGetMenuAccessDetail('4FF05BEE-4F04-5E2A-2A1B-C0D22E8443B7'); //4FF05BEE-4F04-5E2A-2A1B-C0D22E8443B7
    if (!menuPermissionDetail) {
      menuPermissionDetail = { Utility: [], CrudOption: [] }
    }

    // set Columns for table heading
    const columns = [
      {
        name: <IntlMessages id="table.ChargeTypeID" />
      },
      {
        name: <IntlMessages id="exchangefeed.title.methodname" />
      },
      {
        name: <IntlMessages id="Tradingsummarylpwise.orderType.limit" />
      },
      {
        name: <IntlMessages id="wallet.limitType" />
      },
      {
        name: <IntlMessages id="exchangefeed.title.size" />
      },
      {
        name: <IntlMessages id="exchangefeed.title.maxRoundCount" />
      },
      {
        name: <IntlMessages id="widgets.status" />,
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <span
                className={classnames({
                  "badge badge-danger": value === 0,
                  "badge badge-success": value === 1,
                })}
              >
                {this.props.intl.formatMessage({
                  id: "wallet.historyStatus." + value,
                })}
              </span>
            );
          },
        },
      },
      {
        name: <IntlMessages id="sidebar.colActions" />
      },
    ];

    // set option for table
    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false,
      print: false,
      search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
      sort: false,
      download: false,
      viewColumns: false,
      filter: false,
      rowsPerPage: this.state.Page_Size,

      // add button in MUI data table
      customToolbar: () => {

        if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
          return (
            <MatButton
              variant="raised"
              className="btn-primary text-white"
              onClick={() => {
                this.onAddData(this.checkAndGetMenuAccessDetail('4FF05BEE-4F04-5E2A-2A1B-C0D22E8443B7').HasChild); //C7CCD6F4-1B82-498B-4B94-465B881D6AB1
                this.showComponent('AddExchangeFeedConfig', this.checkAndGetMenuAccessDetail('4FF05BEE-4F04-5E2A-2A1B-C0D22E8443B7').HasChild); //C7CCD6F4-1B82-498B-4B94-465B881D6AB1
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
      <div className="table-wrapper jbs-page-content">
        {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
        <WalletPageTitle title={<IntlMessages id="sidebar.Exchange-Feed-Configuration" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
        <Col md={12}>
          <MUIDataTable
            title={this.props.title}
            data={this.state.exchangeFeedList.length !== 0 && this.state.exchangeFeedList.map((item, key) => {

              return [
                item.Id,
                item.MethodName,
                item.MinLimit + "-" + item.MaxLimit,
                item.LimitDesc ? item.LimitDesc : "-",
                item.MinSize + "-" + item.MaxSize,
                item.MaxRecordCount,
                item.Status,
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
                            this.onEditData(item, this.checkAndGetMenuAccessDetail('4FF05BEE-4F04-5E2A-2A1B-C0D22E8443B7').HasChild); // 71C3325A-4CEA-29EB-8554-1313691172F7
                            this.showComponent('UpdateExchangeFeedConfig', this.checkAndGetMenuAccessDetail('4FF05BEE-4F04-5E2A-2A1B-C0D22E8443B7').HasChild); // 71C3325A-4CEA-29EB-8554-1313691172F7
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

        </Col>

        <Drawer
          width="40%"
          handler={false}
          open={this.state.open}
          // onMaskClick={this.toggleDrawer}
          className="drawer2 half_drawer"
          level=".drawer1"
          placement="right"
          levelMove={100}
        >
          {this.state.addData &&
            <AddExchangeFeedConfig {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
          }

          {this.state.editData && this.state.editDetails &&
            <UpdateExchangeFeedConfig {...this.props} selectedData={this.state.editDetails} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
          }

        </Drawer>
      </div >
    );
  }
}

const mapStateToProps = ({ exchangeFeed, drawerclose, authTokenRdcer }) => {
  const { exchangeFeedList, loading } = exchangeFeed;
  const { menuLoading, menu_rights } = authTokenRdcer;
  if (drawerclose.bit === 1) {
    setTimeout(function () {
      drawerclose.bit = 2
    }, 1000);
  }
  return { exchangeFeedList, loading, drawerclose, menuLoading, menu_rights };
};

// export this component with action methods and props
export default connect(
  mapStateToProps,
  {
    getExchangeFeedConfigList,
    getMenuPermissionByID
  }
)(injectIntl(ExchangeFeed));
