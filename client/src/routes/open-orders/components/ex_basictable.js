import React, { Fragment } from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Badge } from "reactstrap";

// intl messages
import IntlMessages from "Util/IntlMessages";

import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

const ExBasictable = ({ title, data, columns, options }) => {
  return (
    <Fragment>
      <JbsCollapsibleCard
        heading={<IntlMessages id={title} />}
        reloadable
        fullBlock
      >
        <div className="table-responsive">
          <Table>
            <TableHead>
              <TableRow>
                {columns &&
                  columns.forEach(label => (
                    <TableCell key={Math.random()}>
                      {<IntlMessages id={`sidebar.ex_${label}`} />}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <Fragment>
                {columns &&
                  data.map(
                    (list, key) =>
                      key < 10 && (
                        <TableRow key={Math.random()}>
                          <TableCell>{list[0]}</TableCell>
                          <TableCell>{list[1]}</TableCell>
                          <TableCell>{list[2]}</TableCell>
                          <TableCell>{list[3]}</TableCell>
                          <TableCell>{list[4]}</TableCell>
                          <TableCell>{list[5]}</TableCell>
                          <TableCell>{list[6]}</TableCell>
                          <TableCell>
                            <Badge
                              color={
                                list[7] === "cancelled" ? "danger" : "success"
                              }
                              className="badge-pill"
                            >
                              {list[7]}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                  )}
              </Fragment>
            </TableBody>
          </Table>
        </div>
      </JbsCollapsibleCard>
    </Fragment>
  );
};

ExBasictable.defaultProps = {
  title: "",
  data: [],
  columns: [],
  options: []
};

export default ExBasictable;
