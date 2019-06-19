/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 20-09-2018
    UpdatedDate : 20-09-2018
    Description : Announcement Widget
*/
import React, { Component, Fragment } from "react";
import { Badge } from "reactstrap";
// intl messages
import IntlMessages from "Util/IntlMessages";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";
import { getAnnoucements } from "Actions/Announcement";
import { connect } from "react-redux";

import { Route, Link } from "react-router-dom";

class Announcement extends Component {
  constructor(props) {
    super(props);
    // default ui local state
    this.state = {
      annoucements: []
    };
  }

  componentWillMount() {
    this.props.getAnnoucements();
  }

  componentWillReceiveProps(nextProps) {
    if(typeof nextProps.annoucements!='undefined')
      {
        this.setState({
          annoucements: nextProps.annoucements
        });
      }
  }

  render() {
    const annoucements = this.state.annoucements;
    var dateFormat = require("dateformat");

    return (
      <Fragment>
          {annoucements &&
            annoucements.map((headline, key) => {
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
    );
  }
}

const mapStateToProps = ({ annoucement }) => {
  const { annoucements } = annoucement;
  return { annoucements };
};

export default connect(
  mapStateToProps,
  {
    getAnnoucements
  }
)(Announcement);
