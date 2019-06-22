import React, { Component } from 'react';
import { Platform } from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

function prepareForBridge(message) {
  //Replaces the singlequote character with symbol we can fix on the other side.
  return JSON.stringify(message).replace(/'/g, '__@@__');
}

export default class Survey extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    actions: PropTypes.object,
    data: PropTypes.object.isRequired,
    errorMessage: PropTypes.string,
    surveyJSON: PropTypes.object.isRequired,
    title: PropTypes.string,
    onSurveyComplete: PropTypes.func,
    surveyResponseDateString: PropTypes.string.isRequired //Pass in existing response data if you want survey to show existing data.
  }

  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.onBridgeMessage = this.onBridgeMessage.bind(this);
    this.webviewbridge = React.createRef();
  }

  onLoad() {
    try {
      //Replace \n with <br/> to keep survey library happy:
      var surveyString1 = JSON.stringify(this.props.surveyJSON).split('\\n').join('<br/>');
      var surveyObj = JSON.parse(surveyString1);

      //Load response data for specified survey date if it exists:
      var surveyResponseObj = this.getResponseForDate(this.props.surveyResponseDateString);

      if (this.webviewbridge !== undefined) {
        this.webviewbridge.sendToBridge(
          prepareForBridge({ action: 'LOAD', survey: surveyObj, surveydata: surveyResponseObj })
        );
      }
    } catch (error) {}
  }

  onBridgeMessage(msg) {
    const message = JSON.parse(msg);
    if (message.action && message.action === 'COMPLETESURVEY') {
      var singleSurveyMap = {};
      singleSurveyMap[this.props.title] = [message.surveydata];
      message.surveydata.CompletionDate = moment().toISOString();

      if (!message.surveydata.DataDate) {
        message.surveydata.DataDate = message.surveydata.CompletionDate;
      }
      this.props.onSurveyComplete(message.surveydata);
      // alert("React Native got your data! Do something with it!"+JSON.stringify(message.surveydata));
      //TODO: Exercise left to the reader :) 
    }
  }

  //Get saved survey response from user data if it exists already and survey versions are the same.
  getResponseForDate(dateString) {
    //TODO: If you want the survey to start auto filled out, a SurveyJS JSON response can be placed here.
    return {};
  }


  render() {
    return (
      <WebViewBridge ref={cmp => this.webviewbridge = cmp}
        style={{ flex: 1, height: 500, justifyContent: 'center' }}
        allowFileAccessFromFileURLs={true}
        source={{ uri: Platform.OS === 'android' ? 'file:///android_asset/Survey/survey.html' : './survey/survey.html' }}
        scalesPageToFit={false}
        originWhitelist={['*']}
        scrollEnabled
        javaScriptEnabled
        onLoad={this.onLoad}
        onBridgeMessage={this.onBridgeMessage}
      />
    );
  }
}
