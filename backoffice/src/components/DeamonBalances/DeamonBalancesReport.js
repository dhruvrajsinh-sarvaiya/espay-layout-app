import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import { getDeamonBalances } from "Actions/DeamonBalances";
import { connect } from "react-redux";
import NotFoundTable from "../NotFoundTable/notFoundTable";
import { Input, FormGroup, Label } from "reactstrap";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import MatButton from "@material-ui/core/Button";

class DeamonBalancesReport extends Component {
  state = {
    exchange: ""
  };
  onChangeExchange(key, value) {
    this.setState({ [key]: value });
    this.props.getDeamonBalances(this.state);
  }
  getExchangeData(e) {
    this.props.getDeamonBalances(this.state);
  }
  componentWillMount() {
    this.props.getDeamonBalances(this.state);
  }
  render() {
    const columns = [
      {
        name: <IntlMessages id="table.id" />,
        options: { sort: true, filter: false }
      },
      {
        name: <IntlMessages id="table.lable" />,
        options: { sort: true }
      },
      {
        name: <IntlMessages id="table.deamonIp" />,
        options: { sort: true, filter: false }
      },
      {
        name: <IntlMessages id="table.address" />,
        options: { sort: true }
      },
      {
        name: <IntlMessages id="table.balance" />,
        options: { sort: true }
      }
    ];
    const options = {
      responsive: "scroll",
      selectableRows: false,
      download: false,
      viewColumns: false,
      filter: false,
      print: false
    };
    return (
      <div>
        <JbsCollapsibleCard>
          <div className="row">
            <div className="col-md-12">
              <div className="top-filter clearfix">
                <FormGroup>
                  <Label>
                    <IntlMessages id="lable.exchange" />
                  </Label>
                  <Input
                    type="select"
                    name="exchange"
                    value={this.state.exchange}
                    onChange={e =>
                      this.onChangeExchange("exchange", e.target.value)
                    }
                  >
                    <option value="">Please Select</option>
                    <option value="paroExchange">Paro Exchange</option>
                    <option value="ohoCash">OHO Cash</option>
                  </Input>
                </FormGroup>
                <FormGroup className="mb-5">
                  <Label className="d-block">&nbsp;</Label>
                  <MatButton
                    variant="raised"
                    className="btn-primary mr-10 mb-10 text-white"
                    onClick={e => this.getExchangeData(e)}
                  >
                    <IntlMessages id="widgets.apply" />
                  </MatButton>
                </FormGroup>
              </div>
            </div>
          </div>
        </JbsCollapsibleCard>
        <div className="StackingHistory">
          {this.props.Loading && <JbsSectionLoader />}
          {this.props.deamonBalanceReportData.length !== 0 ? (
            <MUIDataTable
              title={this.props.title}
              data={this.props.deamonBalanceReportData.map(item => {
                return [
                  item.id,
                  item.lable,
                  item.deamonIp,
                  item.address,
                  item.balance
                ];
              })}
              columns={columns}
              options={options}
            />
          ) : (
            <NotFoundTable title={this.props.title} columns={columns} />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ demonBalance }) => {
  const { deamonBalanceReportData, Loading } = demonBalance;
  return { deamonBalanceReportData, Loading };
};

export default connect(
  mapStateToProps,
  {
    getDeamonBalances
  }
)(DeamonBalancesReport);
