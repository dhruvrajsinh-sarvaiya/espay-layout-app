/**
 * List Roles Wdgt
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

//DataTable
import MUIDataTable from "mui-datatables";

//intl messages
import IntlMessages from "Util/IntlMessages";

//Actions
import { roles } from "Actions/MyAccount";
import MatButton from "@material-ui/core/Button";
//Columns Object
const columns = [
  {
    name: <IntlMessages id="sidebar.colHash" />,
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: <IntlMessages id="sidebar.colRoles" />,
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: <IntlMessages id="sidebar.colAction" />,
    options: {
      filter: false,
      sort: false
    }
  }
];

const options = {
  filterType: "select",
  responsive: "scroll",
  selectableRows: false,
  customToolbar: () => {
    return (
      <MatButton
        component={Link}
        to="/app/my-account/add-roles"
        variant="raised"
        className="btn-primary text-white"
      >
        <IntlMessages id="sidebar.btnAddNewRole" />
      </MatButton>
    );
  }
};

class ListRolesWdgt extends Component {
  constructor(props) {
    super();
  }

  componentWillMount() {
    this.props.roles();
  }

  render() {
    const { list } = this.props;
    return (
      <Fragment>
        <div className="StackingHistory">
        <MUIDataTable
          title={<IntlMessages id="sidebar.btnAddNewRole" />}
          columns={columns}
          data={list.map((lst, key) => {
            return [
              lst.id,
              lst.name,
              <Fragment>
                <div className="list-action">
                  <Link
                    className="mr-10"
                    to={"/app/my-account/edit-roles:" + lst.id}
                  >
                    <i className="ti-pencil" />
                  </Link>
                  <Link
                    className="mr-10"
                    to={{
                      pathname: "/app/my-account/delete-roles",
                      state: { name: "manager", id: lst.id }
                    }}
                  >
                    <i className="ti-close" />
                  </Link>
                </div>
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

const mapStateToProps = ({ rolesRdcer }) => {
  const { list, loading } = rolesRdcer;
  return { list, loading };
};

export default connect(
  mapStateToProps,
  {
    roles
  }
)(ListRolesWdgt);
