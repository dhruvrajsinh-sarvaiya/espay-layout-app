/* 
    Developer : Vishva shah
    Date : 18-04-2019
    File Comment : Profit & loss report
*/
import React, { Component, Fragment } from 'react';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { connect } from 'react-redux';
import { changeDateFormat } from "Helpers/helpers";
import IntlMessages from 'Util/IntlMessages';
import Select from "react-select";
import { Table } from 'reactstrap';
import { Card } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'reactstrap';
import AppConfig from 'Constants/AppConfig';
import Pagination from 'react-js-pagination';
import {
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
import {
  getProgitLossList
} from 'Actions/MarginTrading';
import {
  getCurrency,
} from "Actions/Withdraw";
import { getPairList } from "Actions/Trade";
const transtyle = {
  fontSize: "14px"
}
// initial state
const initState = {
  PageNo: 1,
  PageSize: AppConfig.totalRecordDisplayInList,
  TotalCount: 0,
  WalletTypeObj: null,
  WalletTypeId: '',
  type: '',
  PairID: '',
  pairList: [],
  showReset: false,
  collapse: false,
  DetailedData: {},
  start_row: 1,
}
class ProfitLossReport extends Component {
  constructor(props) {
    super(props);
    this.state = initState;
    this.handleChange = this.handleChange.bind(this);
  }
// pagination handle change event
handlePageChange = pageNumber => {
  ProfitLossReport.PageNo = pageNumber - 1;
  ProfitLossReport.PageSize = this.state.PageSize;
  this.setState({ PageNo: pageNumber });
  this.props.getProgitLossList(ProfitLossReport);
};
  // apply filter
  applyFilter = () => {
    if (this.state.WalletTypeId !== '' || this.state.PairID !== '') {
      this.props.getProgitLossList({
        WalletTypeId: this.state.WalletTypeId,
        PageNo: this.state.PageNo - 1,
        PageSize: this.state.PageSize,
        PairID: this.state.PairID,
      });
      this.setState({ showReset: true });
    }
  };

  //clear filter
  clearFilter() {
    this.setState(initState);
    this.props.getProgitLossList({
      PageNo: this.state.PageNo-1,
      PageSize: this.state.PageSize,
    });
    this.setState({
      WalletTypeObj: null,
      WalletTypeId: '',
      PairID: '',
      pairList: [],
    });
  }
  /* on chane handler select search */
  onChangeSelectCurrency(e) {
    this.setState({ WalletTypeId: e.label, WalletTypeObj: { label: e.label } });
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  componentWillMount() {
    this.setState({ PageNo: 1 });
    this.props.getCurrency();
    this.props.getProgitLossList({
      PageNo: this.state.PageNo - 1,
      PageSize: this.state.PageSize,
    });
  }
  componentDidMount() {
    this.props.getPairList({})
    
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.pairList.length) {
      this.setState({
        pairList: nextProps.pairList
      })
    }
    if (this.state.TotalCount != nextProps.TotalCount) {
      this.setState({ TotalCount: nextProps.TotalCount });
    }
  }
  //On collapse project description
  OnCollapseProject(item) {
    this.setState({
      DetailedData: item,
      collapse: !this.state.collapse
    });
  }

  render() {
    const { intl, loading } = this.props;
    const { profitLossList } = this.props;
    var pairs = []
    if (this.state.pairList.length) {
      this.state.pairList.map(value => {
        value.PairList.map(info => {
          pairs.push(info)
        })
      })
    }
    if (profitLossList.length === 0) {
			this.state.start_row = 0;
		} else {
			this.state.start_row = 1;
		}
    return (
      <div className={this.props.darkMode ? 'DepositWithdrawHistory-darkmode tbl_overflow_auto' : 'DepositWithdrawHistory tbl_overflow_auto'}>
        {loading && <JbsSectionLoader />}
        <JbsCollapsibleCard>
          <div className="top-filter row">
            <FormGroup className="col-md-2 col-sm-4">
              <Label for="WalletTypeId">{intl.formatMessage({ id: "trading.holdingorder.label.currency" })}</Label>
              <Select
                options={this.props.currencies.map((wallet, key) => ({
                  label: wallet.SMSCode,
                  value: wallet.WalletTypeID,
                }))}
                onChange={e => this.onChangeSelectCurrency(e)}
                value={this.state.WalletTypeObj}
                placeholder={intl.formatMessage({ id: "widgets.search" })}
              />
            </FormGroup>
            <FormGroup className="col-md-2 col-sm-4">
              <Label for="Select-1">{<IntlMessages id="sidebar.transactionHistory.filterLabel.currencyPair" />}</Label>
              <div className="app-selectbox-sm">
                <Input type="select" name="PairID" value={this.state.PairID} id="Select-1" onChange={this.handleChange}>
                  <IntlMessages id="transactioncharge.report.filter.option.label.select">
                    {(labelSelect) =>
                      <option value="">{labelSelect}</option>
                    }
                  </IntlMessages>

                  {pairs.map((currency, key) =>
                    <option key={key} value={currency.PairId}>{currency.PairName}</option>
                  )}

                </Input>
              </div>
            </FormGroup>
            <FormGroup className="col-md-2 col-sm-4">
                <div className="btn_area">
                  <Button color="primary" className={"border-0 rounded-0 perverbtn" + ((this.state.WalletTypeId !== '' || this.state.PairID !== '') ? "" : "disabled")} onClick={(e) => this.applyFilter(e)}>{intl.formatMessage({ id: "widgets.apply" })}</Button>
                    {this.state.showReset && <Button className="ml-15 border-0 btn-danger rounded-0" onClick={(e) => this.clearFilter()}>{intl.formatMessage({ id: "button.clear" })}</Button>}
                </div>
            </FormGroup>
          </div>
        </JbsCollapsibleCard>

        {this.props.loading && <JbsSectionLoader />}
        <JbsCollapsibleCard>
        <Card>
          <Table className="mb-0" responsive>
            <thead>
              <tr>
                <th width="13%">
                  {intl.formatMessage({ id: "table.Id" })}

                </th>
                <th width="13%">
                  {intl.formatMessage({ id: "table.ProfitAmount" })}

                </th>
                <th width="13%">
                  {intl.formatMessage({ id: "table.AvgLandingBuy" })}

                </th>
                <th width="13%">
                  {intl.formatMessage({ id: "table.AvgLandingSell" })}

                </th>
                <th width="13%">
                  {intl.formatMessage({ id: "wallet.SettledQty" })}

                </th>
                <th width="13%">
                  {intl.formatMessage({ id: "table.CreatedDate" })}
                </th>
                <th width="13%">
                  {intl.formatMessage({ id: "widgets.action" })}
                </th>
              </tr>
            </thead>
            <tbody>
              {profitLossList.length > 0 ? (
                profitLossList.map((item, key) => (
                  <ProfitLossCollaps key={key} profitLossList={item} onLoad={this.state.onLoad} intl={intl} />
                ))
                ) : (
                  <tr className="text-center">
                    <td colSpan={8}>
                      <IntlMessages id="wallet.emptyTable" />
                    </td>
                  </tr>
                )}
            </tbody>
          </Table>
        </Card>
        </JbsCollapsibleCard>
        {this.state.TotalCount > AppConfig.totalRecordDisplayInList && (
							<Row>
								<Col md={5} className="mt-20" />
								<Col md={4} className="text-right">
									<div id="pagination_div">
										<Pagination
											className="pagination"
											activePage={this.state.PageNo}
											itemsCountPerPage={this.state.PageSize}
											totalItemsCount={this.state.TotalCount}
											pageRangeDisplayed={5}
											onChange={this.handlePageChange}
											prevPageText="<"
											nextPageText=">"
											firstPageText="<<"
											lastPageText=">>"
										/>
									</div>
								</Col>
								<Col md={3} className="text-right mt-20">
									<span>
										{this.state.PageNo > 1
											? this.state.start_row +
											  this.state.PageSize * (this.state.PageNo - 1) +
											  ' - ' +
											  (this.state.PageSize * this.state.PageNo > this.state.TotalCount
													? this.state.TotalCount
													: this.state.PageSize * this.state.PageNo)
											: this.state.start_row +
											  ' - ' +
											  (this.state.PageSize * this.state.PageNo > this.state.TotalCount
													? this.state.TotalCount
													: this.state.PageSize * this.state.PageNo)}{' '}
										of {this.state.TotalCount} Records
									</span>
								</Col>
							</Row>
						  )}
      </div>
      
    )
  }
}

class ProfitLossCollaps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false
    };
  }

  //On collapse project description
  OnCollapseProject() {
    this.setState({
      collapse: !this.state.collapse
    });
  }
  
  componentWillUnmount() {
    this.setState({
      collapse: false
    })
  }
  //redner for collapsible data
  render() {
    const { profitLossList, intl } = this.props;
    const { collapse } = this.state;
    return (
      <Fragment >
        <tr>
          <td align="middle" style={transtyle}>{profitLossList.ID}</td>
          <td align="middle" style={transtyle}>{parseFloat(profitLossList.ProfitAmount).toFixed(8)}</td>
          <td align="middle" style={transtyle}>{parseFloat(profitLossList.AvgLandingBuy).toFixed(8)}</td>
          <td align="middle" style={transtyle}>{parseFloat(profitLossList.AvgLandingSell).toFixed(8)}</td>
          <td align="middle" style={transtyle}>{profitLossList.SettledQty}</td>
          <td align="middle" style={transtyle}>{changeDateFormat(profitLossList.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</td>
          <td align="middle" style={transtyle}><div className="list-action">
            <a
              href="javascript:void(0)"
              onClick={() => this.OnCollapseProject()}
            >
              {collapse ? <i className="zmdi zmdi-chevron-up dropdown-icon mx-4" /> : <i className="zmdi zmdi-chevron-down dropdown-icon mx-4" />}
            </a>
          </div>
          </td>
        </tr>
        {collapse && (
          <Fragment>
            <tr>
              <td colSpan={8}>
                <Table hover className="mb-0 tradetable">
                  <thead>
                    <tr>
                      <th width="25%">
                        {intl.formatMessage({ id: "tradeSummary.filterLabel.trnNo" })}
                      </th>
                      <th width="25%">
                        {intl.formatMessage({ id: "sidebar.transactionHistory.tableHeading.pair" })}
                      </th>
                      <th width="25%">
                        {intl.formatMessage({ id: "tradesummary.tradeSummaryColumn.orderType" })}
                      </th>
                      <th width="25%">
                        {intl.formatMessage({ id: "wallet.Qty" })}
                      </th>
                      <th width="25%">
                        {intl.formatMessage({ id: "wallet.BidPrice" })}
                      </th>
                      <th width="25%">
                        {intl.formatMessage({ id: "wallet.LandingPrice" })}
                      </th>
                      <th width="25%">
                        {intl.formatMessage({ id: "sidebar.colTrnDate" })}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {profitLossList.DetailedData.map((info, i) => {
                      return [
                        <tr key={i} className="tradeexpansion">
                          <td align="middle" style={transtyle}>{info.TrnNo}</td>
                          <td align="middle" style={transtyle}>{info.PairName}</td>
                          <td align="middle" style={transtyle}>{info.OrderType}</td>
                          <td align="middle" style={transtyle}>{info.Qty}</td>
                          <td align="middle" style={transtyle}>{parseFloat(info.BidPrice).toFixed(8)}</td>
                          <td align="middle" style={transtyle}>{parseFloat(info.LandingPrice).toFixed(8)}</td>
                          <td align="middle" style={transtyle}>{changeDateFormat(info.TrnDate, 'YYYY-MM-DD HH:mm:ss', false)}</td>
                        </tr>
                      ];
                    })}
                  </tbody>
                </Table>
              </td>
            </tr>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
// map state to props
const mapStateToProps = ({ ProfitLossReducer, withdrawApp, tradePairList }) => {
  const { profitLossList, loading, TotalCount } = ProfitLossReducer;
  const { currencies } = withdrawApp;
  const { pairList } = tradePairList;
  return { profitLossList, loading, TotalCount, currencies, pairList };
};
export default connect(mapStateToProps, {
  getCurrency,
  getProgitLossList,
  getPairList
})(injectIntl(ProfitLossReport));