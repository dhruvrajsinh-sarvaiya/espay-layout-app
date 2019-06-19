import React, { Component } from 'react'
import {
    Card ,
    CardImg ,
    Container , Row , Col
  } from 'reactstrap';
import Slider from "react-slick";

const newsData = [
    {
        Img:require("Assets/img/sponser.png"),
    },
    {
        Img:require("Assets/img/sponser.png"),
     },
     {
        Img:require("Assets/img/sponser.png"),
     },
     {
        Img:require("Assets/img/sponser.png"),
     },
     {
        Img:require("Assets/img/sponser.png"),
     }
 ]

export default class section9 extends Component {
    
    state = {
        settings2: undefined
     }

     componentDidMount() {
        this.setState({
           settings2: this.settings2
        })
     }
 
 
    render() {

        const settings2 = {
            slidesToShow: 3,
            slidesToScroll: 1,
            dots: false,
            autoplay: true,
            speed: 2000,
            infinite: true,
            cssEase: "linear",
            focusOnSelect: true,
            ref: (slider) => (this.settings2 = slider),
            asNavFor: this.state.settings1,
            rtl: false,
            adaptiveHeight: true,
            responsive: [
               {
                  breakpoint: 1200,
                  settings: {
                     slidesToShow: 3,
                     slidesToScroll: 1,
                  }
               },
               {
                  breakpoint: 991,
                  settings: {
                     slidesToShow: 4,
                     slidesToScroll: 1,
                  }
               },
               {
                breakpoint: 768,
                settings: {
                   slidesToShow: 1,
                   slidesToScroll: 1,
                }
             }
            ]
         };

    return (
        <div className="sponser">
        <Container>

            <Row>
              <Col sm={12}>
                <h2>Cryptorio Invenstors</h2>
              </Col>
            </Row>

            <Slider {...settings2} className="slider-btn-wrap">
               {newsData && newsData.map((news, key) => (
                    <div key={news.id} className="slider-btn my-2">
                        <Row className="bg-space">
                        <div className="col-sm-2" />
                                <div className="col-sm-7">
                                    <CardImg src={news.Img} className="img-fluid ripple-effect" alt="All Sponser's Logo" />
                                </div>
                        <div className="col-sm-3" />
                        </Row>
                    </div>
               ))}
            </Slider>

      </Container>
    </div>
    )
  }
}