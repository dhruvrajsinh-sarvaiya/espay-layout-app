/**
 * List Roles Wdgt
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//DataTable
import MUIDataTable from "mui-datatables";

//intl messages
import IntlMessages from "Util/IntlMessages";

//Actions
import { userRoles } from "Actions/MyAccount";
import { Badge } from "reactstrap";

//Columns Object
const columns = [
  {
    name: (
      <h4>
        <IntlMessages id="sidebar.colHash" />
      </h4>
    ),
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: (
      <h4>
        <IntlMessages id="sidebar.colName" />
      </h4>
    ),
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: (
      <h4>
        <IntlMessages id="sidebar.colEmail" />
      </h4>
    ),
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: (
      <h4>
        <IntlMessages id="sidebar.colProfile" />
      </h4>
    ),
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: (
      <h4>
        <IntlMessages id="sidebar.colStatus" />
      </h4>
    ),
    options: {
      filter: true,
      sort: true
    }
  }
];

const options = {
  filterType: "select",
  responsive: "scroll",
  selectableRows: false
};

class ListRoleUsersWdgt extends Component {
  constructor(props) {
    super();
  }

  componentWillMount() {
    let roleId = this.props.match.params.id;
    roleId = roleId !== "" ? roleId : 0;
    this.props.userRoles(roleId);
  }

  render() {
    const { list, showTitle } = this.props;
    return (
      <Fragment>
        <div className="StackingHistory">
        <MUIDataTable
          title={showTitle ? <IntlMessages id="sidebar.roleUsers" /> : ""}
          columns={columns}
          data={list.map((lst, key) => {
            return [
              lst.id,
              lst.name,
              lst.email,
              lst.profile,
              <Fragment>
                {lst.status === 1 ? (
                  <Badge color="success">Active</Badge>
                ) : (
                  <Badge color="danger">Deactive</Badge>
                )}
              </Fragment>
            ];
          })}
          options={options}
        />
        </div>
      </Fragment>
    );
  }
}

ListRoleUsersWdgt.defaultProps = {
  showTitle: true
};

const mapStateToProps = ({ userRolesRdcer }) => {
  const { list, loading } = userRolesRdcer;
  return { list, loading };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      userRoles
    }
  )(ListRoleUsersWdgt)
);
