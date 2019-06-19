/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 17-09-2018
    UpdatedDate : 30-10-2018
    Description : Component For Coin List
*/
import React, { Component, Fragment } from "react";
import { Table } from "reactstrap";

// intl messages
import IntlMessages from 'Util/IntlMessages';

import { getCoinlist } from 'Actions/Coinlist';
import { connect } from 'react-redux';

import{ Link } from 'react-router-dom'
// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// jbs section loader
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import AppConfig from 'Constants/AppConfig';
class CoinList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      coinlist: [],
      loading: true
    };
  }

  componentWillMount() {
    this.props.getCoinlist();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.coindata.statusCode == 200) {
      this.setState({
        coinlist: nextProps.coindata.Response,
        loading: nextProps.loading
      });
    }
  }

  render() {
    const Coinlist = this.state.coinlist;
    const loading = this.state.loading;
    var dateFormat = require('dateformat');
    return (
      <Fragment>
        <div className="coin-list-table">
          <JbsCollapsibleCard customClasses="py-0">
            <div className="table-responsive">
              <div className="unseen">
                <Table hover bordered striped>
                  <thead>
                    <tr className="bg-primary text-white">
                      <th><IntlMessages id="coinlist.table.th.name" /></th>
                      <th><IntlMessages id="coinlist.table.th.code" /></th>
                      <th><IntlMessages id="coinlist.table.th.issuedate" /></th>
                      <th><IntlMessages id="coinlist.table.th.CirculatingSupply" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Coinlist &&
                      Coinlist.map((coinlist, key) => (
                        <tr key={key}>
                          <td>
                            <img
                              alt="coin list"
                              src={AppConfig.coinlistImageurl + '/' + coinlist.SMSCode + '.png'}
                              height="20" width="20" className="mr-15"
                              /* load default image if not found */
                              onError={(e) => {
                                e.target.src = require(`Assets/icon/default.png`) // default img
                              }}
                            />
                            <Link
                              to={{
                                pathname: "/app/pages/coin-info",
                                state: { data: coinlist }
                              }}
                            >
                              {coinlist.Name}
                            </Link></td>
                          <td>{coinlist.SMSCode}</td>
                          <td>{dateFormat(coinlist.IssueDate, "longDate")}</td>
                          <td>{coinlist.CirculatingSupply}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </div>
            {loading && <JbsSectionLoader />}
          </JbsCollapsibleCard>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ coinlist }) => {
  var response = {
    coindata: coinlist.data,
    loading: coinlist.loading,
  };
  return response
}

export default connect(mapStateToProps, {
  getCoinlist
})(CoinList);
