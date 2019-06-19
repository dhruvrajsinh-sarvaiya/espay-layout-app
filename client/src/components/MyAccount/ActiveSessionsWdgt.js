
import React, { Component, Fragment } from "react";

import { Row, Col } from "reactstrap";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

export default class ActiveSessions extends Component {
  render() {
    const activesessionlist = [
      { activesessionlistTime: "9/10/18", IpAddress: "123.201.19.121" },
      { activesessionlistTime: "25/9/18", IpAddress: "1.22.229.115" },
      { activesessionlistTime: "8/10/18", IpAddress: "123.201.19.121" },
      { activesessionlistTime: "11/10/18", IpAddress: "1.22.229.115" }
    ];
    return (
      <div>
        {/* <div className="tabformtitle">
          <span>Active Sessions</span>
          <p>
            Access and manage all the concurrent active signed in sessions for
            your account.
          </p>
        </div>
        <Row>
          <Col md={{ size: 3, offset: 9 }}>
            <Link
              to=""
              className="btn btn-primary text-white text-center mb-30"
            >
              Close all other sessions
            </Link>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <JbsCollapsibleCard>
              <div className="table-responsive">
                <Table>
                  <TableHead>
                    <TableRow hover>
                      <TableCell>Started Time</TableCell>
                      <TableCell>Connected From IP Address</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <Fragment>
                      {activesessionlist &&
                        activesessionlist.map((employee, key) => (
                          <TableRow hover key={key}>
                            <TableCell>{employee.activesessionlistTime}</TableCell>
                            <TableCell>{employee.IpAddress}</TableCell>

                            <TableCell>
                              <IconButton
                                className="text-danger"
                                aria-label="Add an alarm"
                              >
                                <i className="zmdi zmdi-close" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </Fragment>
                  </TableBody>
                </Table>
              </div>
            </JbsCollapsibleCard>
          </Col>
        </Row> */}
      </div>
    );
  }
}
