import React from "react";
import MUIDataTable from "mui-datatables";
import { FormGroup, Label, Input, Row, Col, Table } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import NotFoundTable from "../NotFoundTable/notFoundTable";
import { connect } from "react-redux";
import { getEarningLedgerReport } from "Actions/EarningLedger";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Button from "@material-ui/core/Button";
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";

const buttonSizeSmall = {
  maxHeight: "28px",
  minHeight: "28px",
  maxWidth: "28px",
  fontSize: "1rem"
};

class EarningLedger extends React.Component {
  state = {
    selectedData: null,
    openViewEarningLedgerDialog: false,
    startDate: "",
    endDate: "",
    type: ""
  };

  closeAll = () => {
    this.props.closeAll();
    this.setState({
      openViewEarningLedgerDialog: false
    });
  };

  toggleDrawer = () => {
    this.setState({
      openViewEarningLedgerDialog: !this.state.openViewEarningLedgerDialog,
    });
  };

  viewEarningLedgerDetail = (data) => {
    this.setState({ openViewEarningLedgerDialog: !this.state.openViewEarningLedgerDialog, selectedData: data });
  }
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
    const { startDate, endDate, type } = this.state;
    this.props.getEarningLedgerReport({ startDate, endDate, type });
  }
  onChange(e, key) {
    const { startDate, endDate, type } = this.state;
    e.preventDefault();
    this.setState({ [key]: e.target.value });
    this.props.getEarningLedgerReport({ startDate, endDate, type });
  }
  getHistoryData(e) {
    const { startDate, endDate, type } = this.state;
    this.props.getEarningLedgerReport({ startDate, endDate, type });
  }
  render() {
    const columns = [
      {
        name: <IntlMessages id="table.id" />,
        options: { sort: true, filter: false }
      },
      {
        name: <IntlMessages id="table.username" />,
        options: { sort: true, filter: false }
      },
      {
        name: <IntlMessages id="table.type" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.balance" />,
        options: { sort: true, filter: false }
      },
      {
        name: <IntlMessages id="table.earning" />,
        options: { sort: true, filter: false }
      },
      {
        name: <IntlMessages id="table.date" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.action" />,
        options: { sort: false, filter: false }
      }
    ];
    const options = {
      responsive: "scroll",
      selectableRows: false,
      download: false,
      viewColumns: false,
      print: false,
      filter: false
    };
    return (
      <div>
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
                    onChange={e => this.onChange(e, "startDate")}
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
                    onChange={e => this.onChange(e, "endDate")}
                  />
                </FormGroup>

                <FormGroup className="mb-5 col-sm-2">
                  <Label>
                    <IntlMessages id="widgets.type" />
                  </Label>
                  <div className="app-selectbox-sm">
                    <Input
                      type="select"
                      name="select"
                      value={this.state.type}
                      onChange={e => this.onChange(e, "type")}
                    >
                      <option>Buy</option>
                      <option>Sell</option>
                    </Input>
                  </div>
                </FormGroup>

                <FormGroup className="mb-5 col-sm-1">
                  <Label className="d-block">&nbsp;</Label>
                  <Button
                    variant="raised"
                    className="btn-primary text-white mr-10"
                    onClick={e => this.getHistoryData(e)}
                  >
                    <IntlMessages id="widgets.apply" />
                  </Button>
                </FormGroup>

                <FormGroup className="col-sm-5">
                  <Label className="d-none">&nbsp;</Label>
                </FormGroup>
              </div>
            </div>
          </div>
        </JbsCollapsibleCard>
        <div className="StackingHistory">
          {this.props.Loading && <JbsSectionLoader />}
          {this.props.earningLedgerReportData.length !== 0 ? (
            <MUIDataTable
              data={this.props.earningLedgerReportData.map(item => {
                return [
                  item.id,
                  item.username,
                  item.type,
                  item.balance,
                  item.earning,
                  item.date,
                  <div className="list-action">
                    <a
                      className="mr-10"
                      href="javascript:void(0)"
                      onClick={() => this.viewEarningLedgerDetail(item)}
                    >
                      <i className="ti-eye" />
                    </a>
                  </div>
                ];
              })}
              columns={columns}
              options={options}
            />
          ) : (
              <NotFoundTable title={this.props.title} columns={columns} />
            )}
        </div>
        <Drawer
          width="50%"
          handler={false}
          open={this.state.openViewEarningLedgerDialog}
          onMaskClick={this.viewEarningLedgerDetail}
          level=".drawer3"
          className="drawer4"
          placement="right"
        >
          <JbsCollapsibleCard>
            <div className="page-title d-flex justify-content-between align-items-center">
              <h2>
                <span>{<IntlMessages id="sidebar.earningLedger" />}</span>
              </h2>
              <div className="page-title-wrap">
                <Button
                  className="btn-warning text-white mr-10 mb-10"
                  style={buttonSizeSmall}
                  variant="fab"
                  mini
                  onClick={this.toggleDrawer}
                >
                  <i className="zmdi zmdi-mail-reply" />
                </Button>
                <Button
                  className="btn-info text-white mr-10 mb-10"
                  style={buttonSizeSmall}
                  variant="fab"
                  mini
                  onClick={this.closeAll}
                >
                  <i className="zmdi zmdi-home" />
                </Button>
              </div>
            </div>
            {this.state.selectedData !== null && (
              <div className="mx-auto">
                <Table bordered>
                  <thead>
                    <tr>
                      <th>
                        <IntlMessages id="lable.trndate" />
                      </th>
                      <th>
                        <IntlMessages id="lable.perticuler" />
                      </th>
                      <th>
                        <IntlMessages id="lable.credit" />
                      </th>
                      <th>
                        <IntlMessages id="lable.commission" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.selectedData.detail.map((item, i) => {
                      return [
                        <tr key={i}>
                          <td key={i}>{item.trnDate}</td>
                          <td key={i}>{item.perticulers}</td>
                          <td key={i}>{item.credit}</td>
                          <td key={i}>{item.commission}</td>
                        </tr>
                      ];
                    })}
                    <tr>
                      <td />
                      <td
                        style={{
                          textAlign: "right"
                        }}
                      >
                        <IntlMessages id="lable.total" />
                      </td>
                      <td>9</td>
                      <td>10</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            )}
          </JbsCollapsibleCard>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = ({ earningLedger }) => {
  const { earningLedgerReportData, Loading } = earningLedger;
  return { earningLedgerReportData, Loading };
};

export default connect(
  mapStateToProps,
  {
    getEarningLedgerReport
  }
)(EarningLedger);
