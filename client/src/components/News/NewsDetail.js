/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 21-09-2018
    UpdatedDate : 21-09-2018
    Description : News Detail Page
*/

import React, { Component } from "react";
//import { push } from 'react-router-redux';

import { getNewsDetail } from "Actions/News";
import { connect } from "react-redux";

class NewsDetail extends Component {
  constructor(props) {
    super(props);

    // default ui local state
    this.state = {
      newsdetail: {}
    };
  }

  componentWillMount() {
    var id = window.location.href.split("/")[
      window.location.href.split("/").length - 1
    ];
    this.props.getNewsDetail(id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      newsdetail: nextProps.newsdetail
    });
  }

  render() {
    const newsdetail = this.state.newsdetail;
    return (
      <div>
        <h2 className="heading">{newsdetail.title}</h2>
        <span className="" />
        <p>{newsdetail.description}</p>
      </div>
    );
  }
}

//export default News;

const mapStateToProps = ({ news }) => {
  const { newsdetail } = news;
  return { newsdetail };
};

export default connect(
  mapStateToProps,
  { getNewsDetail }
)(NewsDetail);
