import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

import { NotificationManager } from "react-notifications";
import MatButton from "@material-ui/core/Button";

import $ from 'jquery';

//Action Import for Payment Method  Report Add And Update
import {
  getMarketList

} from "Actions/ManageMarkets";

import { getLedgerCurrencyList } from "Actions/TradingReport";

import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

import Tooltip from "@material-ui/core/Tooltip";

import AddMarketData from './AddMarketList';
import UpdateMarketData from './UpdateMarket';

const components = {
  AddMarketData: AddMarketData,
  UpdateMarketData: UpdateMarketData
};

import CloseButton from '@material-ui/core/Button';
const buttonSizeSmall = {
  maxHeight: '28px',
  minHeight: '28px',
  maxWidth: '28px',
  fontSize: '1rem'
}
//BreadCrumbData
const BreadCrumbData = [
  {
      title: <IntlMessages id="sidebar.app" />,
      link : '',
      index:0
  },
  {
      title : <IntlMessages id="sidebar.dashboard" />,
      link : '',
      index:0
  },
  {
      title : <IntlMessages id="sidebar.trading" />,
      link : '',
      index:2
  },
  {
      title : <IntlMessages id="card.list.title.configuration" />,
      link : '',
      index:1
  },
  {
      title : <IntlMessages id="sidebar.manageMarkets" />,
      link : '',
      index:0
  }
];

import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

class ManageMarketList extends Component {
  constructor() {
    super();
    this.state = {
      marketList: [],
      currencyList: [],
      open: false,
      addData: false,
      editDetails: [],
      editData: false,
      componentName:''
    };
  }

  componentWillReceiveProps(nextprops) {

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

    if (nextprops.pairList) {
      this.setState({
        currencyList: nextprops.pairList
      });
    }

  }

  showComponent = (componentName) => {
    this.setState({
      componentName: componentName,
      open: !this.state.open,
    });
  }

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open,
      componentName:''
    })
  }


  closeAll = () => {
    //this.props.closeAll();
    this.setState({
      open: false,
      addData: false,
      editData: false
    });
  }

  componentDidMount() {
    this.props.getMarketList({});
    //this.props.getTradePairs({});
  }

  onAddData = () => {
    this.setState({
      addData: true,
      editData: false,
    })
  }

  onEditData = (selectedData) => {

    this.setState({
      editData: true,
      editDetails: selectedData,
      addData: false,
    })
  }

  render() {
    const { drawerClose,closeAll } = this.props;

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
      },
      {
        name: <IntlMessages id="manageMarkets.list.form.label.action" />,
        options: { sort: true, filter: true }
      }
    ];

    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      selectableRows: false,
      print: false,
      search: false,
      download: false,
      viewColumns: false,
      filter: false,
      customToolbar: () => {
        return (
          <MatButton
            variant="raised"
            className="btn-primary text-white"
            onClick={() => {
              this.onAddData();
              this.showComponent('AddMarketData');
            }}
          >
            <IntlMessages id="exchangefeedConfig.pairConfiguration.button.add" />
          </MatButton>
        );
      }
    };

    return (
      <div className="mb-10">
        {this.props.loading && <JbsSectionLoader />}
        <div className="m-20 page-title d-flex justify-content-between align-items-center">
          <div className="page-title-wrap">
            <h2><IntlMessages id="sidebar.manageMarkets" /></h2>
            <Breadcrumb className="tour-step-7 p-0" tag="nav">
                        {BreadCrumbData.length > 0 &&
                            BreadCrumbData.map((list,index) => {
                                 return <BreadcrumbItem active={BreadCrumbData.length === index + 1} tag={BreadCrumbData.length === index + 1 ? "span" : "a"} key={index} href="javascript:void(0)" onClick={list.index && list.index==1 ? drawerClose :closeAll}>{list.title}</BreadcrumbItem>
                                //return <BreadcrumbItem active={BreadCrumbData.length === index + 1} tag={BreadCrumbData.length === index + 1 ? "span" : "a"} key={index} href={BreadCrumbData.length=== index + 1 ? "" : "javascript:void(0)"}  onClick={ () =>{list.index && list.index==1 ? drawerClose : BreadCrumbData.length === index + 1 ? '':closeAll}}>{list.title}</BreadcrumbItem>
                            })                        
                        }
                    </Breadcrumb>
          </div>
          <div className="page-title-wrap bredscrum-top-btn">          
            <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
            <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>            
          </div>
        </div>
        {/* <PageTitleBar
          title={<IntlMessages id="sidebar.manageMarkets" />}
          match={this.props.match}
        /> */}
        <div className="">          
            <MUIDataTable
              title={this.props.title}
              data={this.state.marketList.length !== 0 && this.state.marketList.map((marketData, key) => {
                return [
                  key + 1,
                  marketData.CurrencyDesc,
                  marketData.CurrencyName,
                  <Fragment>
                    {marketData.Status == "Active" &&
                      <span
                        style={{ float: "left" }}
                        className={`badge badge-xs badge-success position-relative`}
                      >
                        &nbsp;
                  </span>
                    }

                    {marketData.Status == "InActive" &&
                      <span
                        style={{ float: "left" }}
                        className={`badge badge-xs badge-danger position-relative`}
                      >
                        &nbsp;
                  </span>
                    }


                    <div className="status pl-30">{marketData.Status}</div>
                  </Fragment>,
                  <Fragment>
                    <div className="list-action">
                      <Tooltip
                        title={<IntlMessages id="manageMarkets.tooltip.update" />}
                        disableFocusListener disableTouchListener
                      >
                        <a
                          href="javascript:void(0)"
                          className="mr-10"
                          onClick={(event) => {
                            this.onEditData(marketData)
                            this.showComponent('UpdateMarketData');
                          }}
                        >
                          <i className="ti-pencil" />
                        </a>
                      </Tooltip>
                      {/* <Tooltip
                        title={<IntlMessages id="manageMarkets.tooltip.delete" />}
                      >
                        <a
                          href="javascript:void(0)"
                          className="mr-10"
                          onClick={event =>
                            this.deleteMarketList(event, marketData)
                          }
                        >
                          <i className="ti-close" />
                        </a>
                      </Tooltip> */}
                    </div>
                  </Fragment>
                ];
              })}
              columns={columns}
              options={options}
            />          
        </div>
        <Drawer
          width="30%"
          handler={false}
          open={this.state.open}
          onMaskClick={this.toggleDrawer}
          className="drawer2"
          level=".drawer1"
          placement="right"
          levelMove={100}
        >
          {this.state.addData &&
            <AddMarketData {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
          }

          {(this.state.editData && this.state.editDetails) &&
            <UpdateMarketData {...this.props} selectedData={this.state.editDetails} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
          }
          {/* {(this.state.editData && this.state.componentName != '') && dynamicComponent( this.state.editData,this.state.componentName, this.props, this.toggleDrawer, this.closeAll)} */}
        </Drawer>
      </div>
    )
  }



}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
  marketList: state.manageMarkets.marketList,
  loading: state.manageMarkets.loading,
  error: state.manageMarkets.error,
  pairList: state.tradingledger.currencyList,
});

export default connect(
  mapStateToProps,
  {
    getMarketList,
    getLedgerCurrencyList
  }
)(ManageMarketList);
