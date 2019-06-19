/**
 * Notification Component
 */
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { Badge } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from "react-router-dom";

// api
import api from 'Api';

// intl messages
import IntlMessages from 'Util/IntlMessages';

class Notifications extends Component {

  state = {
		notifications: null,
		newsList: [],
		totalcount:0
  }

  componentDidMount() {
		//this.getNotifications();
	}
	
	onreadall() {
    this.setState({ totalcount:0});
	}
	
	componentWillMount() {
		//console.log("=========================Notification");
		this.props.hubConnection.on('RecieveNews', (newsData) => {
			//console.log("newsdata",newsData,(new Date()));
			var oldNewsData = this.state.newsList;
			
			try {
				
				newsData = JSON.parse(newsData);
				
				if(typeof newsData.Data !== 'undefined' && newsData.Data !== '') {
					
					newsData.Data = JSON.parse(newsData.Data);
					oldNewsData.push(newsData.Data.locale[localStorage.getItem('locale')]);
					this.setState({newsList : oldNewsData, totalcount:this.state.totalcount+1})
					//console.log("totalcount1",totalcount);
				}
				
			} catch(error) {
				//console.log("error while parsing");
			}
      
		});

		this.props.hubConnection.on('RecieveAnnouncement', (newsData) => {
			//console.log("RecieveAnnouncement",newsData,(new Date()));
			var oldNewsData = this.state.newsList;
			
			try {
				
				newsData = JSON.parse(newsData);
				
				if(typeof newsData.Data !== 'undefined' && newsData.Data !== '') {
					
					newsData.Data = JSON.parse(newsData.Data);
					oldNewsData.push(newsData.Data.locale[localStorage.getItem('locale')]);
					this.setState({newsList : oldNewsData,totalcount:this.state.totalcount+1})
					//console.log("totalcount2",totalcount);
				}
				
			} catch(error) {
				//console.log("error while parsing");
			}
      
		});
	}

  // get notifications
  getNotifications() {
    api.get('notifications.js')
      .then((response) => {
        this.setState({ notifications: response.data });
      })
      .catch(error => {
        //console.log(error);
      })
  }

  render() {
		const { notifications,totalcount } = this.state;
		//console.log(this.state.newsList);
		var dateFormat = require('dateformat');
    return (
      <UncontrolledDropdown nav className="list-inline-item notification-dropdown">
        <DropdownToggle nav className="p-0">
          <Tooltip title="Notifications" placement="bottom" disableFocusListener={true}>
            <IconButton className="" aria-label="bell" onClick={() => this.onreadall()}>
              <i className="zmdi zmdi-notifications-active"></i>
              <Badge color="danger" className="badge-xs badge-top-right jbs-notify">{totalcount}</Badge>
            </IconButton>
          </Tooltip>
        </DropdownToggle>
        <DropdownMenu right>
		  		<div className="dropdown-content">
					<div className="dropdown-top d-flex justify-content-between rounded-top bg-primary">
						<span className="text-white font-weight-bold">
							<IntlMessages id="widgets.recentNotifications" />
						</span>
						{/* <Badge color="warning">1 NEW</Badge> */}
					</div>
          		<Scrollbars className="jbs-scroll" autoHeight autoHeightMin={100} autoHeightMax={280}>
						<ul className="list-unstyled dropdown-list">
						{this.state.newsList && this.state.newsList.map((notification, key) => (
							<li key={key}>
								<div className="media">
								{/* <div className="mr-10">
									<img src={notification.userAvatar} alt="user profile" className="media-object rounded-circle" width="50" height="50" />
								</div> */}
								<div className="media-body pt-5">
									<div className="d-flex justify-content-between">
										<h5 className="mb-5 text-primary">{notification.title}</h5>
										<span className="text-muted fs-12">{dateFormat(notification.date_created, "longDate")}</span>
									</div> 
									{/* <span className="text-muted fs-12 d-block">{notification.notification}</span> */}
									{/* <Button className="btn-xs mr-10">
										<i className="zmdi zmdi-mail-reply mr-2"></i> <IntlMessages id="button.reply" />
									</Button>
									<Button className="btn-xs">
										<i className="zmdi zmdi-thumb-up mr-2"></i> <IntlMessages id="button.like" />
									</Button> */}
								</div>
								</div>
							</li>
						))}
						</ul>
					</Scrollbars>
				</div>
          	<div className="dropdown-foot p-2 bg-white rounded-bottom">
					<Button
						component={Link}
						to="/app/pages/news"
						variant="raised"
						color="primary"
						className="mr-10 btn-xs bg-primary"
					>
						<IntlMessages id="button.viewAll" />
					</Button>
				</div>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}

export default Notifications;
