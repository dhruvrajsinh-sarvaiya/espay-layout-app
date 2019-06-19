import React, { Component } from "react";

export default class Card1 extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
      click: false
    };
    this.onClickCard = this.onClickCard.bind(this);
  }
  onClickCard(value) {
    this.setState({
      value: value
    });
    this.props.callbackFromParent(value, this.state.click);
  }
  render() {
    // console.log("state A", this.state.value);
    return (
      <div className="common-card">
        <ul className="list-inline d-flex align-content-center">
          {this.props.data.map((item, key) => {
            return [
              <li className="list-inline-item col" key={key}>
                <a href="#" onClick={value => this.onClickCard(item.type)}>
                  <h2>{item.value}</h2>
                  <h6>{item.type}</h6>
                  <h4>
                    <i className="ti-pencil-alt" />
                  </h4>
                </a>
              </li>
            ];
          })}
        </ul>
      </div>
    );
  }
}
