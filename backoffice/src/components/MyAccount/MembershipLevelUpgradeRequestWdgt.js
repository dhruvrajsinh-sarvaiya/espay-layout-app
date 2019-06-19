/**
 * CreatedBy : Kevin Ladani
 * Date :10/05/2018
 */
/**
 * List Membership Level Upgrade Request
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import { FormGroup, Input, Label, div } from "reactstrap";
// redux action
import {
  listMembershipLevelUpgradeRequest,
  getrequestStatusApproved,
  getrequestStatusDisapproved,
  getrequestStatusInReview
} from "Actions/MyAccount";

// intl messages
import IntlMessages from "Util/IntlMessages";
import MatButton from "@material-ui/core/Button";

//Validation
const validateMembershipLevelUpgradeRequest = require("../../validation/MyAccount/membership_level_upgrade_request");

//Columns Object
const columns = [
  {
    name: <IntlMessages id="myaccount.membershipLevelUpgradeColumn.id" />,
    options: {
      filter: false,
      sort: true
    }
  },
  {
    name: <IntlMessages id="myaccount.membershipLevelUpgradeColumn.name" />,
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: <IntlMessages id="myaccount.membershipLevelUpgradeColumn.email" />,
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: <IntlMessages id="myaccount.membershipLevelUpgradeColumn.exchange" />,
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: (
      <IntlMessages id="myaccount.membershipLevelUpgradeColumn.currentLevel" />
    ),
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: (
      <IntlMessages id="myaccount.membershipLevelUpgradeColumn.upgradeTo" />
    ),
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: (
      <IntlMessages id="myaccount.membershipLevelUpgradeColumn.requestDate" />
    ),
    options: {
      filter: false,
      sort: false
    }
  },
  {
    name: (
      <IntlMessages id="myaccount.membershipLevelUpgradeColumn.requestStatus" />
    ),
    options: {
      filter: false,
      sort: false
    }
  }
];

const options = {
  filterType: "select",
  responsive: "scroll",
  selectableRows: true
};

class MembershipLevelUpgradeRequestWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: "",
      errors: "",
      selectedUser: null // selected user to perform operations
    };
    this.handleChange = this.handleChange.bind(this);
    this.onMembershipLevelChange = this.onMembershipLevelChange.bind(this);
  }

  /**
   * On Submit onMembershipLevelChange
   */
  onMembershipLevelChange() {
    const { requestStatus, selectedUser } = this.state;
    const { errors, isValid } = validateMembershipLevelUpgradeRequest(
      this.state
    );
    this.setState({ errors: errors });
    if (isValid) {
      if (requestStatus === "Approved") {
        this.props.getrequestStatusApproved({ requestStatus });
      }
      if (requestStatus === "Disapproved") {
        this.props.getrequestStatusDisapproved({ requestStatus, selectedUser });
      }
      if (requestStatus === "InReview") {
        this.props.getrequestStatusInReview({ requestStatus, selectedUser });
      }
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  componentWillMount() {
    this.props.listMembershipLevelUpgradeRequest();
  }

  render() {
    const { errors, requestStatus } = this.state;
    const data = this.props.userList;

    return (
      <div>
        <div>
          <FormGroup className="text-right" row>
            <Label
              for="requestStatus"
              className="pt-10 control-label col-md-4 offset-md-3"
            >
              {
                <IntlMessages id="my_account.membershipLevelUpgrade.requestStatus" />
              }
            </Label>
            <div className="col-md-3">
              <Input
                type="select"
                name="requestStatus"
                className="mb-10"
                value={requestStatus}
                id="requestStatus"
                onChange={this.handleChange}
              >
                <option value="">Please Select</option>
                <option value="Approved">Approved</option>
                <option value="Disapproved">Disapproved</option>
                <option value="InReview">InReview</option>
              </Input>
              {errors.requestStatus && (
                <span className="text-danger text-right">
                  <IntlMessages id={errors.requestStatus} />
                </span>
              )}
            </div>
            <div className="col-md-2">
              <MatButton
                variant="raised"
                className="btn-success mr-10 mb-10 text-white"
                onClick={this.onMembershipLevelChange}
              >
                {<IntlMessages id="my_account.membershipLevelUpgrade.go" />}
              </MatButton>
            </div>
          </FormGroup>
        </div>
        <div className="StackingHistory">
        <MUIDataTable
          title={"Membership Level Upgrade Request List"}
          columns={columns}
          data={data.map((item, key) => {
            return [
              item.id,
              item.name,
              item.email,
              item.exchange,
              item.currentLevel,
              item.upgradeTo,
              item.requestDate,
              item.requestStatus
            ];
          })}
          options={options}
        />
        </div>
      </div>
    );
  }
}
// map state to props
const mapStateToProps = ({ membershipUpgrade }) => {
  var response = {
    userList: membershipUpgrade.membershipLevelUpgradeRequestList,
    loading: membershipUpgrade.loading
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    listMembershipLevelUpgradeRequest,
    getrequestStatusApproved,
    getrequestStatusDisapproved,
    getrequestStatusInReview
  }
)(MembershipLevelUpgradeRequestWdgt);
