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
import { listTopGainers } from "Actions";

import { Progress } from "reactstrap";
// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

class TopGainersWdgt extends Component {
  componentWillMount() {
    this.props.listTopGainers();
  }

  render() {
    const data = this.props.topGainersList;
    var success = "success";
    return (
      <div>
        <div className="topgainersmain">
          <JbsCollapsibleCard>
            <h3 className="text-center pt-10 pb-10">
              {<IntlMessages id="sidebar.topGainers" />}
            </h3>
            {data.map((item, i) => {
              return [
                <div className="row mt-10 mb-10" key={i}>
                  <div className="col-md-3 offset-md-2 offset-sm-0 col-sm-12 mt-5">
                    {item.name}
                  </div>
                  <div className="col-md-3 col-sm-12">
                    <Progress
                      color={success}
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
const mapStateToProps = ({ topGainers }) => {
  var response = {
    topGainersList: topGainers.topGainersData,
    loading: topGainers.loading
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    listTopGainers
  }
)(TopGainersWdgt);
