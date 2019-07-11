/**
 * Landingpage Widget
 */
import React, { Component } from "react";

export default class bannerwidget extends Component {
  render() {
    return (
      <header>
        <div className="banner row no-margin">
          <div className="container content">
            <h1>Exchange The World</h1>
            <div className="links">
              <p>
                <a href="">Create Account</a>
                <span className="line" />
                Already Registered? <a href="">Login</a>
              </p>
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div className="banner-images">
                  <a href="#">
                    <img
                      src={require("Assets/img/banner/1.png")}
                      alt="banner1"
                    />
                  </a>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div className="banner-images">
                  <a href="#">
                    <img
                      src={require("Assets/img/banner/2.png")}
                      alt="banner"
                    />
                  </a>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div className="banner-images">
                  <a href="#">
                    <img
                      src={require("Assets/img/banner/3.png")}
                      alt="banner"
                    />
                  </a>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div className="banner-images">
                  <a href="#">
                    <img
                      src={require("Assets/img/banner/4.png")}
                      alt="banner"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sticky row no-margin">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <p>
                  <a href="#">
                    <span> Lists Red Pulse (RPX)</span>
                    <i>(01-12)</i>
                  </a>
                </p>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <p>
                  <a href="#">
                    <span> Lists Red Pulse (RPX)</span>
                    <i>(01-12)</i>
                  </a>
                </p>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <p>
                  <a href="#">
                    <span> Lists Red Pulse (RPX)</span>
                    <i>(01-12)</i>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
