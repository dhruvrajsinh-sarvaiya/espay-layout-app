/**
 * Login History Simple Table
 */
import React, { Component, Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

//Import Referral Friends Actions...
import { loginHistoryList } from "Actions/MyAccount";

class LoginHistorySimpleTable extends Component {
  componentWillMount() {
    this.props.loginHistoryList();
  }

  render() {
    const data = this.props.list;
    return (
      <div className="table-wrapper">
        <JbsCollapsibleCard heading="" fullBlock>
          <div className="table-responsive">
            <Table>
              <TableHead>
                <TableRow className="bg-secondary">
                  <TableCell>
                    <IntlMessages id="sidebar.colDate" />
                  </TableCell>
                  <TableCell>
                    <IntlMessages id="sidebar.colIpAddress" />
                  </TableCell>
                  <TableCell>
                    <IntlMessages id="sidebar.colLocation" />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <Fragment>
                  {data &&
                    data.map((list, key) => (
                      <TableRow hover key={Math.random}>
                        <TableCell>{list[0]}</TableCell>
                        <TableCell>{list[1]}</TableCell>
                        <TableCell>{list[2]}</TableCell>
                      </TableRow>
                    ))}
                </Fragment>
              </TableBody>
            </Table>
          </div>
        </JbsCollapsibleCard>
      </div>
    );
  }
}

const mapStateToProps = ({ loginHistoryRdcer }) => {
  const { list, loading } = loginHistoryRdcer;
  return { list, loading };
};

export default connect(
  mapStateToProps,
  {
    loginHistoryList
  }
)(LoginHistorySimpleTable);
