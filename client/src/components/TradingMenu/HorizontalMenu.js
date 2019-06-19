/**
 * Trading Menu
 */
import React, { Component } from "react";

import navLinks from "./NavLinks";

import NavMenuItem from "./NavMenuItem";
import InviteFriend from 'Components/InviteFriend';
class TradingMenu extends Component {
 
  render() {     
    
    return (
      <div className={this.props.classnames && this.props.classnames}>
        <ul className="list-unstyled nav">
          {navLinks.Tradingmenu.map((menu, key) => (
            <NavMenuItem menu={menu} key={key} />
          ))}
        </ul>
        {/* <div style ={{'zIndex': '1'}}><InviteFriend /></div> */}
        {/* <ul className="list-unstyled nav">
                     <li className="nav-item">
                        <a href="javascript:void(0);" className="nav-link">
                            <i className="zmdi zmdi-assignment-check"></i>
                            <span className="menu-title">Pages</span>
                        </a>
                        <ul className="list-unstyled sub-menu">
                            {navLinks.Pages.map((menu, key) => (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                />
                            ))}
                        </ul>
                    </li>
                </ul> */}
      </div>
    );
  }
}

export default TradingMenu;
