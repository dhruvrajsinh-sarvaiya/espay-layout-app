import React, { Component } from 'react';
import {Container , Row , Col,Card} from 'reactstrap';
import Slider from "react-slick";

const quotes = [
	{
		id: 1,
		author: 'John Doe',
		avatar: require('Assets/avatars/user-1.jpg'),
		date: 'Yesterday',
        body: 'Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others. I thought back to my own angry youth, when I could easily use words to justify violent thoughts which might have become violent actions.Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others. ',
        reatstar : require("../../../assets/image/retingstar.png"),
	},
	{
		id: 2,
		author: 'Shelby Caldwell',
		avatar: require('Assets/avatars/user-2.jpg'),
		date: '10 min ago',
        body: 'Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others. I thought back to my own angry youth, when I could easily use words to justify violent thoughts which might have become violent actions.Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others. ',
        reatstar : require("../../../assets/image/retingstar.png"),
	},
	{
		id: 3,
		author: 'Beau Salinas',
		avatar: require('Assets/avatars/user-3.jpg'),
		date: 'Yesterday',
        body: 'Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others. I thought back to my own angry youth, when I could easily use words to justify violent thoughts which might have become violent actions. Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others.',
        reatstar : require("../../../assets/image/retingstar.png"),
	},
	{
		id: 4,
		author: 'Kelsey Beck',
		avatar: require('Assets/avatars/user-3.jpg'),
		date: 'Yesterday',
        body: 'Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others. I thought back to my own angry youth, when I could easily use words to justify violent thoughts which might have become violent actions.Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others. ',
        reatstar : require("../../../assets/image/retingstar.png"),
	}
]
export default class testimonial extends Component {
  render() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false
    };
    return (
      <div className="testimonialbg">
        <Container>
            <Row>
                <div className="testititle">
                Trusted and recommended 
                </div>
            </Row>
        </Container>
        <Container>
            <Row className="pb-50">
                <Col sm={{size:8, offset:2}}>
                <Card className="testimonialsbox">
                    <Slider {...settings}>
                        {quotes && quotes.map((quote, key) => (
                            <div key={key} >
                                <div className="d-flex mb-25 align-items-center">
                                    <div className="user-img mr-25">
                                        <img src={quote.avatar} alt="reviewer profile" className="d-inline-block img-fluid rounded-circle" width="60" height="60" />
                                    </div>
                                    <div>
                                        <h5 className="mb-0">{quote.author}</h5>
                                        <span className="fs-12">{quote.date}</span>
                                    </div>
                                </div>
                                <p className="mb-20 text-justify">{quote.body}</p>
                                <img className="ratingimg" src={quote.reatstar} />
                            </div>
                        ))}
                    </Slider>
                    </Card>
                </Col>
            </Row>
        </Container>
      </div>
    )
  }
}
