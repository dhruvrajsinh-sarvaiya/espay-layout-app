import React, { Component } from 'react';
import tokenvalueimg from 'Assets/image/path_90.png';

// intl messages
import IntlMessages from "Util/IntlMessages";

export default class TokenValue extends Component {
  render() {
    return (
      <div>
          <h3><IntlMessages id="trading.newTrading.tokenvalue.text" /></h3>
          <ul>
              <li>555.11</li>
              <li>+0.49</li>
          </ul>
          <img className="img-fluid" src={tokenvalueimg} alt="Token Value" title="Token Value" />
      </div>
    )
  }
}
