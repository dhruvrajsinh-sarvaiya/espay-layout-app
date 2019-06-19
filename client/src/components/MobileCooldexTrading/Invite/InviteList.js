import React, { Component } from 'react';

// import scroll bar
import { Scrollbars } from "react-custom-scrollbars";

// intl messages
import IntlMessages from "Util/IntlMessages";

export default class InviteList extends Component {
  render() {
    return (
      <div>
          {/* <Scrollbars
                className="jbs-scroll"
                autoHeight
                autoHeightMin={this.props.autoHeightMin}
                autoHeightMax={this.props.autoHeightMax}
                autoHide
            > */}
               <IntlMessages id="trading.newTrading.invite.text" />
        {/* </Scrollbars> */}
      </div>
    )
  }
}
