/* 
    Createdby : Jayesh pathak
    Updateby : Jayesh pathak
    CreatedDate : 17-12-2018
    UpdatedDate : 17-12-2018
    Description : Surveys List
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Alert } from "reactstrap";

import MUIDataTable from "mui-datatables";

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// jbs section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//Import List page Actions...
import { getSurveyResultsById } from "Actions/Surveys";
import { DashboardPageTitle } from '../DashboardPageTitle';

//BreadCrumbData
const BreadCrumbData = [
  {
    title: <IntlMessages id="sidebar.app" />,
    link: '',
    index: 0
  },
  {
    title: <IntlMessages id="sidebar.dashboard" />,
    link: '',
    index: 0
  },
  {
    title: <IntlMessages id="sidebar.cms" />,
    link: '',
    index: 2
  },
  {
    title: <IntlMessages id="sidebar.surveys" />,
    link: '',
    index: 1
  },
  {
    title: <IntlMessages id="sidebar.surveyResults" />,
    link: '',
    index: 0
  }
];

class SurveyResults extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false, // loading activity
      surveylist: [],
      allresults: [],
      alllists: [],
      errors: {},
      err_msg: "",
      err_alert: true,
      menudetail: [],
      Pflag: true,
    };
    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss() {
    let err = delete this.state.errors['message'];
    this.setState({ err_alert: false, errors: err });
  }

  componentWillMount() {
    let SurveyId = this.props.surveydata._id;
    if (SurveyId != '') {
      this.props.getSurveyResultsById(SurveyId);
    } else {
      this.props.drawerClose();
    }
  }

  componentWillReceiveProps(nextProps) {

    if (typeof nextProps.surveydata != 'undefined' && typeof nextProps.surveydata.json != 'undefined') {

      let allres = [{
        name: <IntlMessages id="surveys.title.surveyId" />,
        caption: "surveyId",
        options: { sort: true, filter: false }
      }, {
        name: <IntlMessages id="surveys.title.userId" />,
        caption: "userId",
        options: { sort: true, filter: false }
      }, {
        name: <IntlMessages id="sidebar.date_modified" />,
        caption: "date_modified",
        options: { sort: true, filter: false }  // Added by Jayesh 22-01-2019
      }];

      let allpages = JSON.parse(nextProps.surveydata.json);

      allpages.pages.forEach(apages => {
        let allelements = apages.elements;
        allelements.forEach(aelements => {
          allres.push({
            name: aelements.name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }),
            caption: aelements.name,
            options: { sort: true, filter: false }
          });

        });
      });
      this.setState({
        allresults: allres
      });
    }

    if (typeof nextProps.surveyresultsdetail != 'undefined' && nextProps.surveyresultsdetail.responseCode === 0) {
      let alllistsdata = [];

      nextProps.surveyresultsdetail.data.forEach(surveydata => {

        let innerObj = {};
        innerObj["surveyId"] = surveydata.surveyId;
        innerObj["userId"] = surveydata.userId;
        innerObj["date_modified"] = new Date(surveydata.date_modified).toLocaleString(); // Added by Jayesh 22-01-2019

        this.state.allresults.forEach(allresultsdata => {
          Object.keys(surveydata.json).forEach(function (key) {

            if (innerObj.hasOwnProperty(allresultsdata.caption))
              innerObj[key] = surveydata.json[key];
            else
              innerObj[allresultsdata.caption] = "";

          });
        });
        alllistsdata.push(innerObj);
      });

      this.setState({
        surveylist: nextProps.surveyresultsdetail.data,
        alllists: alllistsdata,
        loading: false
      });
    }

    if (typeof nextProps.data != 'undefined' && (nextProps.data.responseCode === 9 || nextProps.data.responseCode === 1)) {
      if (typeof nextProps.data.errors.message != 'undefined' && nextProps.data.errors.message != '') {
        this.setState({ err_alert: true });
      }
      this.setState({
        errors: nextProps.data.errors
      });
    }

  }

  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
    });
  }

  render() {
    const { loading, err_alert, errors, allresults, alllists } = this.state;
    const { drawerClose } = this.props;
    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false,
      print: false,
      download: false,
      resizableColumns: false,
      viewColumns: false,
      filter: false,
      rowsPerPageOptions: [10, 25, 50, 100],
    };

    return (
      <Fragment>
        <div className="jbs-page-content">
          <DashboardPageTitle title={<IntlMessages id="sidebar.surveyResults" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
          {errors.message && <div className="alert_area">
            <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}><IntlMessages id={errors.message} /></Alert>
          </div>}
          <JbsCollapsibleCard fullBlock>
            <div className="StackingHistory">
              <MUIDataTable
                data={
                  alllists &&
                  alllists.map(results => {
                    var returnArrayDetail = [];
                    allresults.forEach(element => {
                      if (results.hasOwnProperty(element.caption))
                        returnArrayDetail.push(results[element.caption]);
                      else
                        returnArrayDetail.push("");
                    });
                    return returnArrayDetail;
                  })
                }
                columns={allresults}
                options={options}
              />
              {(loading || this.props.menuLoading) && <JbsSectionLoader />}
            </div>
          </JbsCollapsibleCard>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ surveysReducer }) => {
  const { data, loading, surveyresultsdetail } = surveysReducer;
  return { data, loading, surveyresultsdetail };
};

export default withRouter(connect(
  mapStateToProps,
  {
    getSurveyResultsById
  }
)(SurveyResults));