/**
 * List SLA Configuration
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//intl messages
import IntlMessages from "Util/IntlMessages";
import { Table, Collapse } from "reactstrap";
import IconButton from "@material-ui/core/IconButton";

//Actions
import { slaConfigurationList } from "Actions/MyAccount";
import { Badge } from "reactstrap";

const SLAStatus = ({ status_id }) => {
  var htmlStatus = "";
  if (status_id === 1) {
    htmlStatus = (
      <Badge color="success">
        <IntlMessages id="sidebar.active" />
      </Badge>
    );
  } else {
    htmlStatus = (
      <Badge color="danger">
        <IntlMessages id="sidebar.deactive" />
      </Badge>
    );
  }

  return htmlStatus;
};

class ListSLAItemWdgt extends Component {
  constructor(props) {
    super();
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

  render() {
    const { data } = this.props;
    const { collapse } = this.state;
    return (
      <Fragment>
        <tr>
          <td>{data.name}</td>
          <td>{data.execute_on}</td>
          <td>{data.created_dt}</td>
          <td>
            <SLAStatus status_id={data.status} />
          </td>
          <td>
            <IconButton onClick={() => this.OnCollapseProject()}>
              {collapse ? (
                <i className="material-icons">visibility_off</i>
              ) : (
                <i className="material-icons">visibility</i>
              )}
            </IconButton>
            <IconButton
              onClick={e =>
                this.props.history.push({
                  pathname: "/app/my-account/edit-sla-configuration",
                  state: { id: data.id }
                })
              }
            >
              <i className="material-icons">create</i>
            </IconButton>
            <IconButton
              onClick={e =>
                this.props.history.push({
                  pathname: "/app/my-account/delete-sla-configuration",
                  state: { id: data.id }
                })
              }
            >
              <i className="material-icons">delete</i>
            </IconButton>
          </td>
        </tr>
        {collapse && (
          <tr>
            <td colSpan="4">
              <Collapse isOpen={collapse}>
                <div className="p-10">
                  <h6>
                    <IntlMessages id="widgets.description" />
                  </h6>
                  <p>{data.description}</p>
                </div>
              </Collapse>
            </td>
          </tr>
        )}
      </Fragment>
    );
  }
}

class ListSLAWdgt extends Component {
  componentWillMount() {
    this.props.slaConfigurationList();
  }
  render() {
    const { list } = this.props;
    return (
      <div className="project-managemnet-wrapper card">
      <div className="StackingHistory">
        <Table hover className="mb-0" responsive>
          <thead>
            <tr>
              <th width="40%">
                <IntlMessages id="sidebar.colName" />
              </th>
              <th width="15%">
                <IntlMessages id="sidebar.colExecuteOn" />
              </th>
              <th width="15%">
                <IntlMessages id="sidebar.colCreatedDt" />
              </th>
              <th width="15%">
                <IntlMessages id="sidebar.colStatus" />
              </th>
              <th width="15%">
                <IntlMessages id="sidebar.colAction" />
              </th>
            </tr>
          </thead>
          <tbody>
            {list &&
              list.map((data, key) => (
                <ListSLAItemWdgt
                  history={this.props.history}
                  key={key}
                  data={data}
                />
              ))}
          </tbody>
        </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ slaRdcer }) => {
  const { list, loading } = slaRdcer;
  return { list, loading };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      slaConfigurationList
    }
  )(ListSLAWdgt)
);
