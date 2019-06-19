/* 
    Developer : Nishant Vadgama
    Date : 01-10-2018
    File Comment : Decentralize Address Generation root component
*/
import React, { Component } from "react";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import AdddressGenerationProcess from "Components/DecentAddGen/DecentAddGen";

class DecentAddressGeneration extends Component {
  render() {
    return (
      <div className="DecentAddressGeneration">
        <PageTitleBar
          title={<IntlMessages id="wallet.DecentAddGenMenu" />}
          match={this.props.match}
        />
        <AdddressGenerationProcess />
      </div>
    );
  }
}

export default DecentAddressGeneration;
