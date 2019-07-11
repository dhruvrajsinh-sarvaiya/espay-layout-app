import React from "react";
import MUIDataTable from "mui-datatables";
import { FormGroup, Label, Input } from "reactstrap";
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
import NotFoundTable from "../NotFoundTable/notFoundTable";
import { getTransferINOUT } from "Actions/TransferINAndOUT";
import { connect } from "react-redux";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import MatButton from "@material-ui/core/Button";

class TransferInAndOut extends React.Component {
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
    this.props.getTransferINOUT(this.state);
  }
  onChangeDate(e, key) {
    e.preventDefault();
    this.setState({ [key]: e.target.value });
  }

  getHistoryData(e) {
    e.preventDefault();
    this.props.getTransferINOUT(this.state);
  }
  render() {
    const columns = [
      {
        name: <IntlMessages id="lable.id" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.username" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.fromAddress" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.toAddress" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.type" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.confirmation" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.date" />,
        options: { sort: true, filter: false }
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
            <div className="col-md-12">
              <div className="top-filter clearfix mb-5">
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
                    className="btn-primary text-white mr-10"
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
        {this.props.transferInOutData.length !== 0 ? (
          <MUIDataTable
            data={this.props.transferInOutData.map(item => {
              return [
                item.id,
                item.user,
                item.fromAddress,
                item.toAddress,
                item.type,
                item.confirmation,
                item.date
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

const mapStateToProps = ({ trnsferInOut }) => {
  const { transferInOutData, Loading } = trnsferInOut;
  return { transferInOutData, Loading };
};

export default connect(
  mapStateToProps,
  {
    getTransferINOUT
  }
)(TransferInAndOut);
