import React, { Component } from "react";
import { FormGroup, Label, Input, Badge } from "reactstrap";
import NotFoundTable from "../NotFoundTable/notFoundTable";
import IntlMessages from "Util/IntlMessages";
import { connect } from "react-redux";
import { getTransactionRetryReport } from "Actions/TransactionRetry";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

import MUIDataTable from "mui-datatables";
import MatButton from "@material-ui/core/Button";

class TansactionRetry extends Component {
  state = {
    startDate: "",
    endDate: ""
  };
  componentWillMount() {
    let today = new Date();
    today =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    this.setState({
      startDate: today,
      endDate: today
    });
  }
  componentDidMount() {
    this.props.getTransactionRetryReport(this.state);
  }
  onChangeDate(e, key) {
    e.preventDefault();
    this.setState({ [key]: e.target.value });
  }

  getHistoryData(e) {
    e.preventDefault();
    this.props.getTransactionRetryReport(this.state);
  }
  render() {
    const columns = [
      {
        name: <IntlMessages id="lable.id" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.date" />,
        options: { sort: true, filter: false }
      },
      {
        name: <IntlMessages id="table.perticuler" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.username" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.amount" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.trnType" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.serPro" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.status" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.trnNo" />,
        options: { sort: true, filter: true }
      }
    ];
    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false
    };

    return (
      <div className="StackingHistory">
        <JbsCollapsibleCard>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="top-filter clearfix mb-10">
                <FormGroup className="col-sm-2">
                  <Label for="startDate">
                    <IntlMessages id="widgets.startDate" />
                  </Label>
                  <Input
                    type="date"
                    name="date"
                    id="startDate"
                    placeholder="dd/mm/yyyy"
                    value={this.state.startDate}
                    onChange={e => this.onChangeDate(e, "startDate")}
                  />
                </FormGroup>
                <FormGroup className="col-sm-2">
                  <Label for="endDate">
                    <IntlMessages id="widgets.endDate" />
                  </Label>
                  <Input
                    type="date"
                    name="date"
                    id="endDate"
                    placeholder="dd/mm/yyyy"
                    value={this.state.endDate}
                    onChange={e => this.onChangeDate(e, "endDate")}
                  />
                </FormGroup>
                <FormGroup className="mb-5 col-sm-1">
                  <Label className="d-block">&nbsp;</Label>
                  <MatButton
                    variant="raised"
                    className="btn-primary text-white"
                    onClick={e => this.getHistoryData(e)}
                  >
                    <IntlMessages id="widgets.apply" />
                  </MatButton>
                </FormGroup>
              </div>
            </div>
          </div>
        </JbsCollapsibleCard>
        {this.props.Loading && <JbsSectionLoader />}
        {this.props.transactionRetryData.length !== 0 ? (
          <MUIDataTable
            data={this.props.transactionRetryData.map(item => {
              return [
                item.id,
                item.date,
                item.perticuler,
                item.user,
                item.amount,
                item.trnType,
                item.serpro,
                item.status,
                item.trnno
              ];
            })}
            columns={columns}
            options={options}
          />
        ) : (
          <NotFoundTable title={this.props.title} columns={columns} />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ transactionRetry }) => {
  const { transactionRetryData, Loading } = transactionRetry;
  return { transactionRetryData, Loading };
};

export default connect(
  mapStateToProps,
  {
    getTransactionRetryReport
  }
)(TansactionRetry);
