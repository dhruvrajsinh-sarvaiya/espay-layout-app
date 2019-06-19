import React, { Component } from "react";

//Components
import Tradefilter from "./components/trade_filter";
import Tradedadata from "./components/trade_datatable";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";
import CloseButton from '@material-ui/core/Button';
const buttonSizeSmall = {
  maxHeight: '28px',
  minHeight: '28px',
  maxWidth: '28px',
  fontSize: '1rem'
}

export default class index extends Component {
  render() {
    const { drawerClose } = this.props;
    return (
      <div>
        <div className="m-20 page-title d-flex justify-content-between align-items-center">
          <div className="page-title-wrap">
            <h2><IntlMessages id="sidebar.trade-summary" /></h2>
          </div>
          <div className="page-title-wrap">
            <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
            <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
          </div>
        </div>

        {/* <PageTitleBar
          title={<IntlMessages id="sidebar.trade-summary" />}
          match={this.props.match}
        /> */}
        {/* <Tradefilter /> */}
        <Tradedadata />
      </div>
    );
  }
}
