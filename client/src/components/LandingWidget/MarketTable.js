/**
 * Landingpage Widget
 */
import React, { Component, Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// For Basic Table
let id = 0;

function createData(Pair, LastPrice, Change, High, Low, Volume) {
  id += 1;
  return { id, Pair, LastPrice, Change, High, Low, Volume };
}

const data = [
  createData("ETH/BTC", 0.086583, -1.87, 0.088899, 0.086131, 9349.2428319),
  createData("ETH/BTC", 0.086583, -1.87, 0.088899, 0.086131, 9349.2428319),
  createData("ETH/BTC", 0.086583, -1.87, 0.088899, 0.086131, 9349.2428319),
  createData("ETH/BTC", 0.086583, -1.87, 0.088899, 0.086131, 9349.2428319),
  createData("ETH/BTC", 0.086583, -1.87, 0.088899, 0.086131, 9349.2428319)
];

class markettable extends Component {
  render() {
    return (
      <div className="page-container">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="home-data-table">
                <nav className="nav-justified">
                  <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <a
                      className="nav-item nav-link"
                      id="nav-fav-tab"
                      data-toggle="tab"
                      href="#nav-fav"
                      role="tab"
                      aria-controls="nav-fav"
                      aria-selected="true"
                    >
                      <i className="zmdi zmdi-star" /> Favorites
                    </a>
                    <a
                      className="nav-item nav-link"
                      id="nav-bnb-tab"
                      data-toggle="tab"
                      href="#nav-bnb"
                      role="tab"
                      aria-controls="nav-bnb"
                      aria-selected="false"
                    >
                      BNB Markets
                    </a>
                    <a
                      className="nav-item nav-link active"
                      id="nav-btc-tab"
                      data-toggle="tab"
                      href="#nav-btc"
                      role="tab"
                      aria-controls="nav-btc"
                      aria-selected="true"
                    >
                      BTC Markets
                    </a>
                    <a
                      className="nav-item nav-link"
                      id="nav-eth-tab"
                      data-toggle="tab"
                      href="#nav-eth"
                      role="tab"
                      aria-controls="nav-eth"
                      aria-selected="false"
                    >
                      ETH Markets
                    </a>
                    <a
                      className="nav-item nav-link"
                      id="nav-usdt-tab"
                      data-toggle="tab"
                      href="#nav-usdt"
                      role="tab"
                      aria-controls="nav-usdt"
                      aria-selected="false"
                    >
                      USDT Markets
                    </a>
                  </div>
                </nav>
                <div className="table-wrapper">
                  <JbsCollapsibleCard fullBlock>
                    <div className="table-responsive">
                      <Table>
                        <TableHead>
                          <TableRow hover>
                            <TableCell>Pair</TableCell>
                            <TableCell numeric>Last Price</TableCell>
                            <TableCell numeric>24h Change</TableCell>
                            <TableCell numeric>24h High</TableCell>
                            <TableCell numeric>24h Low</TableCell>
                            <TableCell numeric>24h Volume</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <Fragment>
                            {data.map(n => {
                              return (
                                <TableRow hover key={n.id}>
                                  <TableCell>{n.Pair}</TableCell>
                                  <TableCell numeric>{n.LastPrice}</TableCell>
                                  <TableCell numeric>{n.Change}</TableCell>
                                  <TableCell numeric>{n.High}</TableCell>
                                  <TableCell numeric>{n.Low}</TableCell>
                                  <TableCell numeric>{n.Volume}</TableCell>
                                </TableRow>
                              );
                            })}
                          </Fragment>
                        </TableBody>
                      </Table>
                    </div>
                  </JbsCollapsibleCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default markettable;
