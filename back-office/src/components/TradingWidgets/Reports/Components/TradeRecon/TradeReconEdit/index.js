// Component For TradeRecon Edit By Tejas Date : 8/10/2018

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { Input } from "reactstrap";

import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import MatButton from "@material-ui/core/Button";
import CloseButton from '@material-ui/core/Button';
const buttonSizeSmall = {
  maxHeight: '28px',
  minHeight: '28px',
  maxWidth: '28px',
  fontSize: '1rem'
}
// Import For Call Store
import { getActiveOrders, doSettleOrder } from "Actions/TradeRecon";

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";

import MUIDataTable from "mui-datatables";

// define Trade Recon Action component
class ActionTradeRecon extends Component {
  // make default state values on load
  constructor(props) {
    super();
    this.state = {
      start_date: "",
      end_date: "",
      onLoad: 0,
      activeOrders: [],
      searchData: [],
      displaySearch: false,
      settleOrder: [],
      open: false,
      confirm: false,
      settleData: []
    };
  }

  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
    });
  }


  // Usd For Dialog BOx Success Button
  handleSuccess = () => {
    this.setState({
      open: false,
      confirm: true
    });
    this.props.doSettleOrder(this.state.settleData);
  };

  // Used for handle Close Operation
  handleClose = () => {
    this.setState({
      open: false,
      confirm: false
    });
  };

  // Search List By Tejas
  onSearchList = (event, value) => {
    const searchText = event.target.value;
    var searchData = [];
    if (searchText !== "") {
      if (this.state.activeOrders.length) {
        this.state.activeOrders.map(values => {
          if (values.Price.toString().indexOf(searchText) !== -1) {
            searchData.push(values);
          }
        });
      }
      this.setState({ displaySearch: true, searchData: searchData });
    } else {
      this.setState({ displaySearch: false, searchData: [] });
    }
  };

  // Render When Compoent recieve Props
  componentWillReceiveProps(nextprops) {
    if (nextprops.activeOrders) {
      this.setState({
        activeOrders: nextprops.activeOrders
      });
    }
  }

  // clear search data
  clearSearchPair = () => {
    this.setState({ searchText: "", searchPair: [], displayPair: false });
  };

  // used to handle change event of Dates Dropdown
  handleChangeFromDate = event => {
    this.setState({ start_date: event.target.value });
  };

  // used to handle change event of Dates Dropdown
  handleChangeToDate = event => {
    this.setState({ end_date: event.target.value });
  };

  // Apply Animation For Dialog box
  Transition(props) {
    return <Slide direction="up" {...props} />;
  }

  // render when component will render
  componentDidMount() {
    const Pair = this.props.Pair;
    var type = '';
    if (this.props.TradeType == 'BUY') {
      type = 'SELL'
    } else if (this.props.TradeType == 'SELL') {
      type = 'BUY'
    }

    this.props.getActiveOrders({ Pair: Pair, Status: 95, Trade: type });
  }

  // used for handle settle order for store in a state
  settleOrder = value => {
    if (value) {
      this.setState({
        open: true,
        settleData: value
      });
    }
  };

  render() {
    var info = this.props.editData;
    // define options for data tables
    const options = {
      responsive: "stacked",
      selectableRows: false
    };

    // define options for data tables
    const searchOptions = {
      responsive: "stacked",
      selectableRows: true,
      customToolbar: () => { },
      customToolbarSelect: selectedRows => (
        <CustomToolbarSelect
          settleData={this.settleOrder}
          selectedRows={selectedRows}
          ActiveOrdersList={this.state.searchData}
        />
      )
    };

    // define columns for data tables
    const columns = [
      {
        name: <IntlMessages id={"traderecon.list.column.label.pair"} />
      },
      {
        name: <IntlMessages id={"traderecon.list.column.label.rate"} />
      },
      {
        name: <IntlMessages id={"traderecon.list.column.label.amount"} />
      }
    ];
    const { drawerClose } = this.props;
    return (
      <Fragment>
        <div className="mb-10  charts-widgets-wrapper">
          <div className="m-20 page-title d-flex justify-content-between align-items-center">
            <div className="page-title-wrap">
              <h2>{<IntlMessages id="traderecon.newpage.label.title" />}</h2>
            </div>
            <div className="page-title-wrap">
              <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
              <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
            </div>
          </div>
          {info !== null && info !== undefined ? (
            <MUIDataTable
              title={<IntlMessages id="sidebar.tradeReconAction" />}
              data={info.map(item => {
                return [item.PairName, item.Price, item.Amount];
              })}

              columns={columns}
              options={options}
            />
          ) : (
              ""
            )}

          <div className="col-md-3 col-sm-3 col-lg-3">
            <p className="fs-14 mt-10 p-10">
              <Input
                type="text"
                value={this.state.searchText}
                name="search"
                id="search"
                placeholder="Search"
                onChange={this.onSearchList}
              />
            </p>
          </div>

          <div>
            {this.state.searchData.length && this.state.displaySearch ? (
              <MUIDataTable
                title={<IntlMessages id="sidebar.tradeReconAction" />}
                data={this.state.searchData.map(item => {
                  return [item.PairName, item.Price, item.Amount];
                })}
                columns={columns}
                options={searchOptions}
              />
            ) : (
                ""
              )}
          </div>
        </div>

        <Dialog
          open={this.state.open}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            <IntlMessages id="traderecon.list.dialog.label.title" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <IntlMessages id="traderecon.list.dialog.label.text" />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <MatButton
              variant="raised"
              className="btn-danger text-white"
              onClick={this.handleClose}
            >
              <IntlMessages id="traderecon.dialogbox.button.no" />
            </MatButton>

            <MatButton
              variant="raised"
              className="btn-success text-white"
              onClick={this.handleSuccess}
            >
              <IntlMessages id="traderecon.dialogbox.button.yes" />
            </MatButton>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

// Component For Handle Custom toolbar select
class CustomToolbarSelect extends Component {
  settleOrders = () => {
    var value = [];
    if (this.props.selectedRows.data.length) {
      this.props.selectedRows.data.map(data => {
        value.push(this.props.ActiveOrdersList[data.index]);
      });
    }
    this.props.settleData(value);
  };

  render() {
    return (
      <div className={"mt-20 mr-20"}>
        <Tooltip
          title={<IntlMessages id="sidebar.traderecon.tooltip.settle" />}
        >
          <a href="javascript:void(0)" onClick={() => this.settleOrders()}>
            <i className="ti-settings font-2x" />
          </a>
        </Tooltip>
      </div>
    );
  }
}

//export default ActionTradeRecon;
// map states to props when changed in states from reducer
const mapStateToProps = state => ({
  activeOrders: state.tradeRecon.activeOrders
});

// export this component with action methods and props
export default connect(
  mapStateToProps,
  { getActiveOrders, doSettleOrder }
)(ActionTradeRecon);
