// Component for Display My Orders History By:Tejas Date : 13/9/2018

import React, { Fragment } from "react";
import { Table } from "reactstrap";

// intl messages
import IntlMessages from "Util/IntlMessages";

// import Action
import { getActiveMyOpenOrderList, doCancelOrder } from "Actions/Trade";

// import Component For Scroll
import { Scrollbars } from "react-custom-scrollbars";

// import loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// import  Modal For Place Orders
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

import { Alert } from 'reactstrap';

// import connect function
import { connect } from "react-redux";

//components for my24h order
class My24HOrder extends React.Component {
  constructor() {
    super();
    this.state = {
      activeMyOpenOrder: [], // Store My OPen Orders Data
      modal: false, // Defines Whether Modal Is displayed Or Not
      modalInfo: 0,
      sectionReload: false,
      showLoader: true
    };
    // bind function with (THIS) Object
    this.openModal = this.openModal.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
  }

  //Open Modal Dialog
  openModal(index) {
    this.setState({ modalInfo: index, modal: true });
  }

  // handle close and Close Dialog
  handleClose() {
    this.setState({ modal: false });
  }

  // Process For Cancel Orders
  cancelOrder(total) {
    // Set State for Section reload or not
    this.setState({ sectionReload: true });

    const currrentOrder = [];

    // Iterate Active my OPen ordes and add to current Order
    if (this.state.activeMyOpenOrder) {
      this.state.activeMyOpenOrder.map((value, key) => {
        return [key > this.state.modalInfo ? "" : currrentOrder.push(value)];
      });
    }

    // Call action for do cancel Order
    this.props.doCancelOrder({ Order: currrentOrder });
  }

  // This will invoke After component render
  componentDidMount() {
    //Call Action(Function) My Open order List
    const pair = this.props.firstCurrency + "_" + this.props.secondCurrency;
    this.props.getActiveMyOpenOrderList({ Pair: pair });
  }

  // This will Invoke when component will recieve Props or when props changed
  componentWillReceiveProps(nextprops) {
    if (nextprops.activeMyOpenOrder && nextprops.activeMyOpenOrder !== null) {
      // set Active My Open Order list if gets from API only
      this.setState({
        activeMyOpenOrder: nextprops.activeMyOpenOrder,
        showLoader: false
      });
    }
  }

  // Render Component for Active My Open Order
  render() {
    
    // Iterate Array and store in a variable
    const activeMyOpenData = [];
    if (this.state.activeMyOpenOrder) {
      this.state.activeMyOpenOrder.map(value => {
        if (value.pair === this.props.currencyPair) {
          activeMyOpenData.push(value);
        }
      });
    }

    // Display Component
    return (
      <Fragment>
        <Scrollbars
          className="jbs-scroll"
          autoHeight
          autoHeightMin={180}
          autoHeightMax={200}
          autoHide
        >
          <div
            className="table-responsive-design p-10"
            style={{ width: "100%" }}
          >
            {/* display loader if its true */}
            {this.props.loading && <JbsSectionLoader />}
            {/* Display Table as per my 24h Data*/}
            <Table className="table m-0 p-0">
              <thead>
                <tr className="bg-light">
                  <th>
                    {" "}
                    {<IntlMessages id="trading.activeorders.label.pair" />}
                  </th>
                  <th className="numeric">
                    {" "}
                    {<IntlMessages id="trading.activeorders.label.type" />}
                  </th>
                  <th className="numeric">
                    {" "}
                    {<IntlMessages id="trading.activeorders.label.price" />}
                  </th>
                  <th className="numeric">
                    {" "}
                    {<IntlMessages id="trading.activeorders.label.amount" />}
                  </th>
                  <th className="numeric">
                    {" "}
                    {<IntlMessages id="trading.activeorders.label.date" />}
                  </th>
                </tr>
              </thead>

              <tbody>
                {activeMyOpenData.length ? (
                  activeMyOpenData.map((value, key) => (
                    <tr
                      style={{ cursor: "pointer" }}
                      key={key}
                      onClick={() => this.openModal(key)}
                    >
                      <td>{this.props.firstCurrency + "/" + this.props.secondCurreny}</td>
                      <td
                        className={
                          value.type == "Buy" ? "text-success" : "text-danger"
                        }
                      >
                        {value.type}
                      </td>
                      <td>{parseFloat(value.price).toFixed(8)} {value.delivery_Currency}</td>
                      <td>{parseFloat(value.amount).toFixed(8)} {value.delivery_Currency}</td>
                      <td>{value.trnDate.replace('T', ' ')}</td>
                    </tr>
                  ))
                ) : (
                    <tr>
                      <td colSpan="5">
                        <Alert color="danger" className="text-center fs-32">
                          <IntlMessages id="trading.activeorders.label.nodata" />
                        </Alert>
                      </td>
                    </tr>
                  )}
              </tbody>
            </Table>

            {/*Display Modal/Dialog if User press for cancel Orders request*/}
            <Modal isOpen={this.state.modal}>
              <ModalHeader>
                {<IntlMessages id="trading.activeordes.cancelorder.title" />} (
                {this.props.currencyPair})
              </ModalHeader>
              {this.state.sectionReload && <JbsSectionLoader />}
              <ModalBody>
                <Table className="table m-0 p-0">
                  <tbody>
                    {activeMyOpenData.length ? (
                      activeMyOpenData.map(
                        (value, key) =>
                          key === this.state.modalInfo ? (
                            <tr key={key}>
                              <td>{this.props.firstCurrency + "/" + this.props.secondCurreny}</td>
                              <td
                                className={
                                  value.type == "Buy" ? "text-success" : "text-danger"
                                }
                              >
                                {value.type}
                              </td>
                              <td>{parseFloat(value.price).toFixed(8)} {value.delivery_Currency}</td>
                              <td>{parseFloat(value.amount).toFixed(8)} {value.delivery_Currency}</td>
                              <td>{value.trnDate.replace('T', ' ')}</td>
                            </tr>
                          ) : (
                              ""
                            )
                      )
                    ) : (
                        <tr>
                          <td colSpan="5">
                            <Alert color="danger" className="text-center fs-32">
                              <IntlMessages id="trading.activeorders.label.nodata" />
                            </Alert>
                          </td>
                        </tr>
                      )}
                  </tbody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="raised"
                  color="primary"
                  className="text-white"
                  onClick={() => this.cancelOrder(activeMyOpenData)}
                >
                  <span>
                    <IntlMessages id="trading.activeordes.cancelorder.button.cancelorder" />
                  </span>
                </Button>
                <Button
                  variant="raised"
                  onClick={() => this.handleClose()}
                  className="btn-danger text-white"
                >
                  <span>
                    <IntlMessages id="button.cancel" />
                  </span>
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        </Scrollbars>
      </Fragment>
    );
  }
}

// Set Props when actions are dispatch
const mapStateToProps = state => ({
  activeMyOpenOrder: state.activeMyOpenOrder.activeOpenMyOrder,
  loading: state.activeMyOpenOrder.loading
});

// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    getActiveMyOpenOrderList,
    doCancelOrder
  }
)(My24HOrder);
