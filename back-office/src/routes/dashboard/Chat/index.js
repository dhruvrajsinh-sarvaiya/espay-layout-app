/* 
    Createdby : Dhara gajera
    CreatedDate : 24-12-2018
    Description : Chat 
*/
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import ChatDashboard from "Components/Chat/ChatDashboard";

// Component for chat dashboard
class Chat extends Component {
    render() {
        const { match } = this.props;
        return (
            <div className="wallet-dashboard-wrapper">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.Chat" />}
                    match={match}
                />
                <ChatDashboard {...this.props}/>
            </div>
        );
    }
}
export default Chat;