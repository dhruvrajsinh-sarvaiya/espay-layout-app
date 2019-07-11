/* 
    Developer : Nishant Vadgama
    Date : 22-09-2018
    File Comment : Convert token root componet
*/
import React, { Component } from "react";
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
// import component for Page Title
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import ConvertToken from "Components/ConvertToken/ConvertToken";
import ConvertHistory from "Components/ConvertToken/ConvertHistory";

// Create Class For Display convert token
class ConvertTokenIndex extends Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <div className="Deposit">
          <PageTitleBar
            title={<IntlMessages id="wallet.CTPageTitle" />}
            match={match}
          />
          <div className="row">
            <ConvertToken />
            <ConvertHistory />
          </div>
        </div>
      </div>
    );
  }
}

export default ConvertTokenIndex;
