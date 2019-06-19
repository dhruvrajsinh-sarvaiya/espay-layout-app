// Component For Trnsaction Charge Report By Tejas Date : 5/10/2018

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { Form, Label, Input,Row,Col } from "reactstrap";
import Button from "@material-ui/core/Button";

import log4javascript from "log4javascript";

import { getTransactionCharge } from "Actions/TransactionCharge";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs card box
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";

import MUIDataTable from "mui-datatables";

// define Open Orders component
class TransactionCharge extends Component {
  // make default state values on load
  constructor(props) {
    super();
    this.state = {
      start_date: "",
      end_date: "",
      pair: "all",
      type: "",
      onLoad: 0
    };
  }

  // call Transaction Charge list on load
  componentDidMount() {
    this.props.getTransactionCharge(this.state);

    //in debug mode replace line 4 with line 3.
    //window.myLogger = log4javascript.getDefaultLogger();
    var token =
      "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVhIjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NDsgcnY6NjIuMCkgR2Vja28vMjAxMDAxMDEgRmlyZWZveC82Mi4wIiwiYnJvd3NlciI6eyJuYW1lIjoiRmlyZWZveCIsInZlcnNpb24iOiI2Mi4wIiwibWFqb3IiOiI2MiJ9LCJlbmdpbmUiOnsibmFtZSI6IkdlY2tvIiwidmVyc2lvbiI6IjYyLjAifSwib3MiOnsibmFtZSI6IldpbmRvd3MiLCJ2ZXJzaW9uIjoiMTAifSwiZGV2aWNlIjp7fSwiY3B1Ijp7ImFyY2hpdGVjdHVyZSI6ImFtZDY0In19LCJpYXQiOjE1Mzg0NzQzNTAsImV4cCI6MTUzODQ3Nzk1MH0.koeuMpryYz7NrsdJw7GoDxPKzkZnwhFSojKwfxfiOCc";

    var Logger = log4javascript.getLogger();
    //headers.append('Authorization', token);
    var ajaxAppender = new log4javascript.AjaxAppender(
      "http://172.20.65.111:5000/api/private/v1/getLogs/addFrontErrorLog"
    );
    ajaxAppender.addHeader("Authorization", token);

    // var layout = new log4javascript.JsonLayout(true, false);
    // ajaxAppender.setLayout(layout);
    ajaxAppender.setBatchSize(10); // send in batches of 10
    ajaxAppender.setSendAllOnUnload(); // send all remaining messages on window.beforeunload()
    Logger.addAppender(ajaxAppender);

    //Sending error message to server
    //LOgger.error({error:"there are error in front"});

    //Sending info log to server
    //LOgger.info("test info");
    //report all user console errors
    onerror = (message, url, lineNumber) => {
      var errorMsg =
        "Console error- " + url + " : " + lineNumber + ": " + message;
      Logger.error(errorMsg);

      return true;
    };
  }

  componentWillUnmount() {
    //console.log('componentWillUnmount');
  }

  // apply button used to call Transaction Charge
  onApply = event => {
    event.preventDefault();

    this.props.getTransactionCharge(this.state);
  };

  // used to handle change event of every input field and set values in states
  handleChangeType = event => {
    this.setState({ type: event.target.value });
  };

  // used to handle change event of every input field and set values in states
  handleChangeFromDate = event => {
    this.setState({ start_date: event.target.value });
  };

  // used to handle change event of every input field and set values in states
  handleChangeToDate = event => {
    this.setState({ end_date: event.target.value });
  };

  // used to handle change event of every input field and set values in states
  handleChangeCurrency = event => {
    this.setState({ pair: event.target.value });
  };

  render() {
    const data = this.props.transactionChargeReport;

    // define options for data tables
    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false
    };

    // define columns for data tables
    const columns = [
      {
        name: (
          <IntlMessages
            id={"transactioncharge.report.table.column.label.datetime"}
          />
        )
      },
      {
        name: (
          <IntlMessages
            id={"transactioncharge.report.table.column.label.pair"}
          />
        )
      },
      {
        name: (
          <IntlMessages
            id={"transactioncharge.report.table.column.label.transactiontype"}
          />
        )
      },
      {
        name: (
          <IntlMessages
            id={"transactioncharge.report.table.column.label.transactionamount"}
          />
        )
      },
      {
        name: (
          <IntlMessages
            id={"transactioncharge.report.table.column.label.transactionfees"}
          />
        )
      },
      {
        name: (
          <IntlMessages
            id={"transactioncharge.report.table.column.label.feesCollect"}
          />
        )
      }
    ];

    return (
      <Fragment>
        {/* { this.state.sectionReload &&
					<JbsSectionLoader />
				} */}
        <div className="charts-widgets-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.transactioncharge.list" />}
            match={this.props.match}
          />
          <div className="Transaction-charge-report">
          <JbsCollapsibleCard heading="">
            <Row>
							<Col md={12}>
                <div className="top-filter clearfix  transaction-search">
                  <Form name="frm_search" className="mb-10">
                  <Row>
                    <Col md={2}>
                      <Label for="startDate1">
                        {
                          <IntlMessages id="transactioncharge.report.filter.label.fromdate" />
                        }
                      </Label>
                      <Input
                        type="date"
                        name="start_date"
                        value={this.state.start_date}
                        id="startDate1"
                        placeholder="dd/mm/yyyy"
                        onChange={this.handleChangeFromDate}
                      />
                    </Col>
                    <Col md={2}>
                      <Label for="endDate1">
                        {
                          <IntlMessages id="transactioncharge.report.filter.label.todate" />
                        }
                      </Label>
                      <Input
                        type="date"
                        name="end_date"
                        value={this.state.end_date}
                        id="endDate1"
                        placeholder="dd/mm/yyyy"
                        onChange={this.handleChangeToDate}
                      />
                    </Col>
                    <Col md={3}>
                      <Label for="Select-2">
                        {
                          <IntlMessages id="transactioncharge.report.filter.label.type" />
                        }
                      </Label>
                      <div className="app-selectbox-sm">
                        <Input
                          type="select"
                          name="type"
                          value={this.state.type}
                          id="Select-2"
                          onChange={this.handleChangeType}
                        >
                          <option value="">
                            {
                              <IntlMessages id="transactioncharge.report.filter.option.label.select" />
                            }
                          </option>
                          <option value="buy">
                            {
                              <IntlMessages id="transactioncharge.report.filter.option.label.buy" />
                            }
                          </option>
                          <option value="sell">
                            {
                              <IntlMessages id="transactioncharge.report.filter.option.label.sell" />
                            }
                          </option>
                          <option value="withdraw">
                            {
                              <IntlMessages id="transactioncharge.report.filter.option.label.withdraw" />
                            }
                          </option>
                        </Input>
                      </div>
                    </Col>
                    <Col md={3}>
                      <Label for="Select-1">
                        {
                          <IntlMessages id="transactioncharge.report.filter.label.currencypair" />
                        }
                      </Label>
                      <div className="app-selectbox-sm">
                        <Input
                          type="select"
                          name="pair"
                          value={this.state.pair}
                          id="Select-1"
                          onChange={this.handleChangeCurrency}
                        >
                          <option value="all">All</option>
                          <option value="atcc_btc">ATCC_BTC</option>
                          <option value="ltc_btc">LTC_BTC</option>
                          <option value="xrp_atcc">XRP_ATCC</option>
                        </Input>
                      </div>
                    </Col>
                    <Col md={2}>
                      <Label className="d-block">&nbsp;</Label>
                      <Button
                        onClick={event => {
                          this.onApply(event);
                        }}
                        color="primary"
                        variant="raised"
                        className="mr-10 text-white"
                      >
                        <IntlMessages id="transactioncharge.report.filter.button.apply" />
                      </Button>
                    </Col>
                    </Row>
                  </Form>
                </div>
              </Col>
            </Row>
            </JbsCollapsibleCard>
          <div className={this.props.darkMode ? 'transaction-history-detail-darkmode':'transaction-history-detail'}>
            <MUIDataTable
              title={<IntlMessages id="transactioncharge.report.label.title" />}
              data={data.map(item => {
                return [
                  item.datetime,
                  item.pair,
                  item.transactiontype,
                  item.transamount,
                  item.transfees,
                  item.feescollected
                ];
              })}
              columns={columns}
              options={options}
            />
          </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

//export default TransactionCharge;
// map states to props when changed in states from reducer
// const mapStateToProps = state => ({
//   transactionCharge: state.transactionCharge.transactionCharge,
//   darkMode : state.settings.darkMode
// });

const mapStateToProps = ({ transactionCharge , settings }) => {
	const { darkMode } = settings;
	const { transactionChargeReport, loading } = transactionCharge;
	return { transactionChargeReport, loading , darkMode }
}

// export this component with action methods and props
export default connect(
  mapStateToProps,
  { getTransactionCharge }
)(TransactionCharge);
