/**
 * CreatedBy : Kevin Ladani
 * Date :08/10/2018
 */
/**
 * Trade Summary
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";

// redux action
import { listTopLosers } from "Actions";

import { Progress } from "reactstrap";
// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

class TopLosersWdgt extends Component {
  componentWillMount() {
    this.props.listTopLosers();
  }

  render() {
    const data = this.props.topLosersList;
    var warning = "warning";
    return (
      <div>
        <div className="topgainersmain">
          <JbsCollapsibleCard>
            <h3 className="text-center pt-10 pb-10">
              {<IntlMessages id="sidebar.topLosers" />}
            </h3>
            {data.map((item, i) => {
              return [
                <div className="row mt-10 mb-10" key={i}>
                  <div className="col-md-3 offset-md-2 offset-sm-0 col-sm-12 mt-5">
                    {item.name}
                  </div>
                  <div className="col-md-3 col-sm-12">
                    <Progress
                      color={warning}
                      className="w-200"
                      value={item.value}
                    />
                  </div>
                  <div className="col-md-1 col-sm-12">{item.value}</div>
                  <div className="col-md-1 col-sm-12">
                    <IconButton className="text-white toparrow">
                      <i className="material-icons">chevron_right</i>
                    </IconButton>
                  </div>
                </div>
              ];
            })}
          </JbsCollapsibleCard>
        </div>
      </div>
    );
  }
}
// map state to props
const mapStateToProps = ({ topLosers }) => {
  var response = {
    topLosersList: topLosers.topLosersData,
    loading: topLosers.loading
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    listTopLosers
  }
)(TopLosersWdgt);
