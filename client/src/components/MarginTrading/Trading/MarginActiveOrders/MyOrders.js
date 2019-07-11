// Component for Display Open Orders History By:devang parekh Date : 20/3/2019

import React from "react";
import { Table, Row, Col, Card } from 'reactstrap';

// intl messages
import IntlMessages from "Util/IntlMessages";

//import scroll bar
import { Scrollbars } from "react-custom-scrollbars";

//import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

class MyOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeOpenOrder: typeof this.props.currentRecentOrders !== 'undefined' ? this.props.currentRecentOrders : [],
      showLoader: true,
      socketData: [],
      displayOtherPairs: this.props.hasOwnProperty('displayOtherPairs') ? this.props.displayOtherPairs : false,
    };
  }

  // Used To Set State Data From Props
  componentWillReceiveProps(nextprops) {

    if (nextprops.hasOwnProperty('displayOtherPairs') && (nextprops.displayOtherPairs === false || nextprops.displayOtherPairs === true)) {
      this.setState({ displayOtherPairs: nextprops.displayOtherPairs })
    }

    // code for active order process when response comes
    if (nextprops.currentRecentOrders) {

      // set Active My Open Order list if gets from API only
      this.setState({
        activeOpenOrder: nextprops.currentRecentOrders,
        showLoader: false
      });

    }
    // end

  }

  // Render Component for Active Open Order
  render() {

    const activeOpenOrder = [];
    if (this.state.activeOpenOrder) {
      this.state.activeOpenOrder.map(value => {
        if (this.state.displayOtherPairs) {
          if (value.PairName == this.props.currencyPair) {
            activeOpenOrder.push(value);
          }
        } else {
          activeOpenOrder.push(value);
        }
      });
    }

    //Added by salim dt:07/02/2019
    const { customClass } = this.props;

    return (
      <Card className={customClass}>
        <div className="table-responsive-design">
          {this.props.loading && <JbsSectionLoader />}
          <Table className="m-0 p-0">
            <thead>
              <tr className="bg-light">
                <th>{<IntlMessages id="trading.activeorders.label.pair" />}</th>
                <th className="numeric">
                  {<IntlMessages id="trading.activeorders.label.type" />}
                </th>
                <th>
                  {<IntlMessages id="trading.activeorders.label.orderType" />}
                </th>
                <th className="numeric">
                  {<IntlMessages id="trading.activeorders.label.price" />}
                </th>
                <th className="numeric">
                  {<IntlMessages id="tradesummary.tradeSummaryColumn.amount" />}
                </th>
                <th className="numeric">
                  {<IntlMessages id="sidebar.settleAmount" />}
                </th>
                <th className="numeric">
                  {<IntlMessages id="trading.activeorders.label.status" />}
                </th>
                <th>{<IntlMessages id="trading.activeorders.label.date" />}</th>
              </tr>
            </thead>
          </Table>

          <Scrollbars
            className="jbs-scroll"
            autoHeight
            autoHeightMin={220}
            autoHeightMax={220}
            autoHide
          >
            <Table className="table m-0 p-0">
              <tbody>
                {activeOpenOrder.length !== 0 ?
                  activeOpenOrder.map((value, key) => {
                    return <tr key={key}>
                      <td className="text-center">{value.PairName !== null ? value.PairName.replace('_', '/') : ''}</td>
                      <td
                        className={
                          value.Type == "BUY" ? "text-success text-center" : "text-danger text-center"
                        }
                      >
                        {value.Type == "BUY" ? <IntlMessages id="sidebar.openOrders.filterLabel.type.buy" /> :
                          <IntlMessages id="sidebar.openOrders.filterLabel.type.sell" />}
                      </td>
                      <td className="text-center">
                        {value.OrderType === 'LIMIT' ? <IntlMessages id="trading.placeorder.label.limit" /> : ""}
                        {value.OrderType === 'MARKET' ? <IntlMessages id="trading.placeorder.label.market" /> : ""}
                        {value.OrderType === 'STOP_Limit' ? <IntlMessages id="trading.placeorder.label.stoplimit" /> : ""}
                        {value.OrderType === 'SPOT' ? <IntlMessages id="trading.placeorder.label.spot" /> : ""}
                      </td>

                      <td className="text-center">{value.Price === 0 ? <IntlMessages id="trading.placeorder.label.market" /> : parseFloat(value.Price).toFixed(8)}</td>
                      <td className="text-center">{value.Qty}</td>
                      <td className="text-center">{value.SettledQty}</td>
                      <td className="text-center">
                        {value.StatusCode === 1 && <span className="badge badge-success w-40" style={{ fontSize: '12px' }}>{<IntlMessages id="myorders.response.status.1" />}</span>}
                        {value.StatusCode === 4 && <span className="badge badge-info w-40" style={{ fontSize: '12px' }}>{<IntlMessages id="myorders.response.status.4" />}</span>}
                        {value.StatusCode === 2 && <span className="badge badge-danger w-40" style={{ fontSize: '12px' }}>{<IntlMessages id="myorders.response.status.2" />}</span>}
                        {value.StatusCode === 3 && <span className="badge badge-danger w-40" style={{ fontSize: '12px' }}>{<IntlMessages id="myorders.response.status.3" />}</span>}
                        {value.StatusCode === 5 && <span className="badge badge-danger w-40" style={{ fontSize: '12px' }}>{<IntlMessages id="myorders.response.status.5" />}</span>}
                        {value.StatusCode === 6 && <span className="badge badge-danger w-40" style={{ fontSize: '12px' }}>{<IntlMessages id="myorders.response.status.6" />}</span>}

                      </td>
                      <td className="text-center">{value.DateTime.replace('T', ' ').split('.')[0]}</td>
                    </tr>
                  })
                  :
                  <tr>
                    <td>
                      <Row className="justify-content-center m-0">
                        <Col className="text-center m-0" sm={12}>
                          <span>
                            <i className="zmdi zmdi-view-list-alt" style={{ fontSize: "80px" }}></i><br />
                          </span>
                        </Col>

                        <Col className="text-center text-danger m-0 fs-32" sm={12} style={{ fontSize: "18px" }} >
                          <IntlMessages id="trading.activeorders.label.nodata" />
                        </Col>
                      </Row>
                    </td>
                  </tr>
                }
              </tbody>
            </Table>
          </Scrollbars>
        </div>
      </Card>

    );
  }
}

//Added by salim dt:07/02/2019
MyOrders.defaultProps = {
  isHidePair: true,
  isShowHeader: true,
  customClass: 'cooldexopenorder',
  title: <IntlMessages id="trading.newTrading.openhistory.text" />
}

// connect action with store for dispatch
export default MyOrders;
