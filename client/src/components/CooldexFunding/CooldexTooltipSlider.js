import React, { Component } from 'react';
import {Row, Col } from 'reactstrap';
import ReactTooltip from 'react-tooltip';
import { Link } from "react-router-dom";

export default class CooldexTooltipSlider extends Component {
  render() {
    return (
      <div className="tooltipslidermain">
          <Row>
              <Col md={12}>
                <div className="tooltipslider">
                    <Link to="" data-tip data-for='global'> </Link>
                    <Link to="" data-tip data-for='global1'> </Link>
                    <Link to="" data-tip data-for='global1'> </Link>
                    <Link to="" data-tip data-for='global1'> </Link>
                    <Link to="" data-tip data-for='global1'> </Link>
                    <Link to="" data-tip data-for='global1'> </Link>
                    <Link to="" data-tip data-for='global1'> </Link>
                    <Link to="" data-tip data-for='global1'> </Link>
                </div>
                <div className="">
                    <ReactTooltip id='global' aria-haspopup='true' role='example'>
                        <p>October 7 to 13</p>
                        <ul>
                            <li>
                                <p>Invested</p>
                                <p>2,000,000,00</p>
                            </li>
                            <li>
                                <p>Profit</p>
                                <span>+21.05%</span>
                            </li>
                            <li><span>-13.5%</span></li>
                        </ul>
                    </ReactTooltip>
                    <ReactTooltip id='global1' aria-haspopup='true' role='example'>
                        <p>TManish tooltip</p>
                        <p>You can put every thing here</p>
                        <ul>
                            <li>Word</li>
                            <li>Chart</li>
                            <li>Else</li>
                        </ul>
                    </ReactTooltip>
                </div>
              </Col>
          </Row>
      </div>
    )
  }
}
