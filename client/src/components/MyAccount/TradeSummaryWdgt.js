/**
 * CreatedBy : Kevin Ladani
 * Date :08/10/2018
 */
/**
 * Trade Summary
 */
import React, { Component } from "react";
import { connect } from "react-redux";

import { Table } from "reactstrap";

// redux action
import { listTradeSummary } from "Actions";

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

//Columns Object
const columns = [
  {
    name: <IntlMessages id="myaccount.tradeSummaryColumn.id" />
  },
  {
    name: <IntlMessages id="myaccount.tradeSummaryColumn.exchange" />
  },
  {
    name: <IntlMessages id="myaccount.tradeSummaryColumn.date" />
  },
  {
    name: <IntlMessages id="myaccount.tradeSummaryColumn.scripName" />
  },
  {
    name: <IntlMessages id="myaccount.tradeSummaryColumn.buyQty" />
  },
  {
    name: <IntlMessages id="myaccount.tradeSummaryColumn.buyRate" />
  },
  {
    name: <IntlMessages id="myaccount.tradeSummaryColumn.buyTotal" />
  },
  {
    name: <IntlMessages id="myaccount.tradeSummaryColumn.sellQty" />
  },
  {
    name: <IntlMessages id="myaccount.tradeSummaryColumn.sellRate" />
  },
  {
    name: <IntlMessages id="myaccount.tradeSummaryColumn.sellTotal" />
  },
  {
    name: <IntlMessages id="myaccount.tradeSummaryColumn.netQty" />
  },
  {
    name: <IntlMessages id="myaccount.tradeSummaryColumn.netTotal" />
  }
];

class MembershipLevelProfileWdgt extends Component {
  componentWillMount() {
    this.props.listTradeSummary();
  }

  render() {
    const data = this.props.tradeSummaryList;
    return (
      <div className="responsive-table-wrapper">
        <JbsCollapsibleCard heading="Trade Summary">
          <div className="table-responsive">
            <div className="unseen">
              <Table hover bordered striped>
                <thead>
                  <tr className="bg-primary text-white">
                    {columns.map((item, i) => {
                      return [<th key={i}>{item.name}</th>];
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, i) => {
                    return [
                      <tr key={i}>
                        <td>{item.id}</td>
                        <td>{item.exchange}</td>
                        <td>{item.date}</td>
                        <td>{item.scripName}</td>
                        <td>{item.buyQty}</td>
                        <td>{item.buyRate}</td>
                        <td>{item.buyTotal}</td>
                        <td>{item.sellQty}</td>
                        <td>{item.sellRate}</td>
                        <td>{item.sellTotal}</td>
                        <td>{item.netQty}</td>
                        <td>{item.netTotal}</td>
                      </tr>
                    ];
                  })}
                </tbody>
              </Table>
              {/* <h4>Total={total}</h4>    */}
            </div>
          </div>
        </JbsCollapsibleCard>
      </div>
    );
  }
}
// map state to props
const mapStateToProps = ({ tradeSummary }) => {
  var response = {
    tradeSummaryList: tradeSummary.tradeSummaryData,
    loading: tradeSummary.loading
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    listTradeSummary
  }
)(MembershipLevelProfileWdgt);
