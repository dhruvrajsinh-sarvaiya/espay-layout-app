/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 18-09-2018
    UpdatedDate : 18-10-2018
    Description : List Of News
*/
import React, { Component,Fragment } from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { Badge } from 'reactstrap';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
// intl messages
import IntlMessages from 'Util/IntlMessages';

import {getNews} from 'Actions/News';
import {connect} from 'react-redux';

import {
  Route,
  Link
} from 'react-router-dom'

class NewsList extends Component{
    
    constructor(props) {
      super(props);
      this.state = {
        newslist: []
      };
    }

	  componentWillMount() {
		  this.props.getNews();
    }

    componentWillReceiveProps(nextProps) {
      if(typeof nextProps.newslist!='undefined')
      {
        this.setState({
            newslist: nextProps.newslist,
        });
      }
    }

    render(){
      const newslist =this.state.newslist;
      var dateFormat = require('dateformat');
      return (
            <Fragment>
                  {newslist && newslist.map((headline,key) => {
                    if (headline && headline.locale && typeof headline.locale[localStorage.getItem('locale')]!='undefined' && typeof headline.locale[localStorage.getItem('locale')].content!='undefined') {
                      return (
                    <ExpansionPanel key={key} className="mb-15 panel">
                      <ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-chevron-down"></i>} className="m-0 panel-heading demo">
                        <Typography className="text-primary">{headline && headline.locale && headline.locale[localStorage.getItem('locale')] && headline.locale[localStorage.getItem('locale')].title}</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <div className="d-block">
                          <p>{dateFormat(headline.date_modified, "isoDate")}</p>
                         
                            {ReactHtmlParser(headline && headline.locale && headline.locale[localStorage.getItem('locale')] && headline.locale[localStorage.getItem('locale')].content)}
                        </div>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  );
                }
              })}
            </Fragment>
      )
    }
}

const mapStateToProps = ({news}) => {
	const { newslist } = news;
  return { newslist}
}

export default connect(mapStateToProps, {getNews
})(NewsList);
