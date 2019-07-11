import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import AppConfig from 'Constants/AppConfig';
import ReactHtmlParser from "react-html-parser";

// code added by devang parekh for handle signalr connection
const signalR = require("@aspnet/signalr");
const signalRURL = AppConfig.signalRURL
//end

export default class Maintainance extends Component {

  // code added by devang parekh for handle remove undermaintenance call from signalr (18-3-2019)
  constructor(props) {
    super(props)
    this.state = {
      hubConnection: new signalR.HubConnectionBuilder().withUrl(signalRURL).configureLogging(signalR.LogLevel.None).build(),
      isSiteUnderMaintenance: false
    }
  }

  // invoke before Compoent render
  componentWillMount() {

    this.state.hubConnection.start().then(() => {
      this.setState({ hubConnection: this.state.hubConnection });

      // code added by devang parekh for handling site under maintenance (18-3-2019)
      this.state.hubConnection.on("ReceiveEnvironmentMode", (environmentDetail) => {

        try {

          environmentDetail = JSON.parse(environmentDetail);

          if (typeof environmentDetail.Data !== 'undefined' && environmentDetail.Data !== '') {

            if (typeof environmentDetail.Data.MsgCode !== 'undefined' && parseInt(environmentDetail.Data.MsgCode) === 6062) { // MsgCode => 6062 : under maintance, 6063 : for live 
              this.setState({ isSiteUnderMaintenance: true });
            } else {
              this.setState({ isSiteUnderMaintenance: false });
            }
          }

        } catch (error) { }

        setTimeout(function () {
          window.location.href = '/';
        }, 5000)

      });
      //end
    });

    this.state.hubConnection.onclose(e => {
      this.state.hubConnection.start().then(() => {
        this.setState({ hubConnection: this.state.hubConnection });
      });
    });

  }
  // end
  render() {
    return (
      <QueueAnim type="bottom" duration={2000}>
        <div className="error-wrapper" key="1">
          <AppBar position="static" className="session-header">
            <Toolbar>
              <div className="container">
                <div className="d-flex justify-content-between">
                  <div className="session-logo">
                    <Link to="/">
                      <img src={require('Assets/img/cool_dex_one.png')} alt="session-logo" className="img-fluid" width="110" height="35" />
                    </Link>
                  </div>
                </div>
              </div>
            </Toolbar>
          </AppBar>
          <div className="session-inner-wrapper">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-9 mx-auto">
                <div className="error-body text-center">
                  <h2 className="bold mb-0"><i className="zmdi zmdi-alert-triangle"></i></h2>
                  <div>{ReactHtmlParser(AppConfig.maintenance_message)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </QueueAnim>
    );
  }
}
