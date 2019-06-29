/**
 * Trading Menu
 */
import React, { Component } from "react";

import navLinks from "./NavLinks";

import NavMenuItem from "./NavMenuItem";

class HorizontalMenu extends Component {

  render() {

    return (
      <div className={this.props.classnames}>
        <ul className="list-unstyled nav">
          {navLinks.Tradingmenu.map((menu, key) => (
            <NavMenuItem menu={menu} key={key} />
          ))}
        </ul>
      </div>
    );
  }
}

export default HorizontalMenu;
