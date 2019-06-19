
/**
 * Added By Devang Parekh 
 * This route for handle pair Configuration component
 */

import React, { Component } from "react";

import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

import IntlMessages from "Util/IntlMessages";

import ApiConfAddGenComponent from "Components/ApiConfAddGen";

export default class PairConfiguration extends Component {
  
  render() {
    return (
      <div className="data-table-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.apiConfAddGen.title" />}
          match={this.props.match}
        />

        <ApiConfAddGenComponent
          title={<IntlMessages id="sidebar.apiConfAddGen.title" />}          
        />
      </div>
    );
  }
}
