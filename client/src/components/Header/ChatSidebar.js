import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button, Input, } from "reactstrap";
import Clientimge from '../../assets/img/user-profile.png'
import { isScriptTag } from "Helpers/helpers";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import React, { Component } from 'react';

class ChatSidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            chatList: [],
            isUserBlocked: this.props.isUserBlocked,
            ChatHistoryData: []
        };
    }

    componentWillUnmount() {
        this.isActive = 0;
    }

    componentWillMount = () => {

        this.isActive = 1;

        this.props.chatHubConnection.invoke('GetChatHistory').then().catch(err => console.error(err));

        this.props.chatHubConnection.on('RecieveChatHistory', (receivedMessage) => {
            try {

                if (this.isActive === 1) {

                    receivedMessage = JSON.parse(receivedMessage);
                    var localChatList = [];
                    if (receivedMessage.Data && receivedMessage.Data.length) {
                        receivedMessage.Data.map((user, key) => {

                            localChatList.push({ user: user.Name, chatData: user.Message });
                        });
                    }

                    this.setState({ chatList: localChatList });

                }

            } catch (e) {

            }

        });

    };

    componentDidMount = () => {

        this.props.chatHubConnection.on('ReceiveMessage', (userName, receivedMessage) => {

            if (this.isActive === 1) {

                var chatList = this.state.chatList;
                chatList.push({ user: userName, chatData: receivedMessage });

                this.setState({ chatList: chatList });

            }

        });

    };

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.isUserBlocked !== 'undefined') {
            this.setState({ isUserBlocked: nextProps.isUserBlocked })
        }
    }

    sendMessage = () => {
        if (typeof (this.state.message) != 'undefined' && !isScriptTag(this.state.message) && this.state.message !== '') {
            if (this.state.isUserBlocked === false) {
                this.props.chatHubConnection.invoke('SendMessage', this.state.message).then().catch(err => console.error(err));
            } else {
                NotificationManager.error("You are blocked.");
            }
        }
        this.setState({ message: '' });

    };

    validateMessage = event => {

        this.setState({ message: event.target.value });
    };

    _handleKeyPress = e => {
        if (e.key === 'Enter') {
            this.sendMessage();
        }
    }

    render() {
        return (
            <div className="chat-sidebar jbs-customizer">
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                            Chat
                </Typography>
                    </Toolbar>
                </AppBar>

                <List>
                    <div className="row">
                        <div className="chatscrollmain">
                            {this.state.chatList.map((user, key) => (
                                <ListItem key={key} button style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <img className="chatclientimg" src={Clientimge} />
                                    <ListItemText
                                        primary={user.user}
                                        secondary={user.chatData}
                                    />
                                </ListItem>
                            ))}
                        </div>
                    </div>
                </List>

                <div className="clientchatwindow">
                    <div className="row">
                        <div className="col-sm-8 col-md-8 col-lg-8 ml-10 pr-0">
                            {this.state.isUserBlocked === false ?

                                <IntlMessages id="chat.sendMessage">
                                    {(sendMessage) =>
                                        <Input type="text" name="message" id="message" placeholder={sendMessage} value={this.state.message}
                                            onChange={this.validateMessage}
                                            disabled={this.state.isUserBlocked}
                                            onKeyPress={this._handleKeyPress} />
                                    }
                                </IntlMessages>
                                :
                                <IntlMessages id="chat.blockUser">
                                    {(blockUser) =>
                                        <Input type="text" name="message" id="message" placeholder={blockUser} value={this.state.message}
                                            onChange={this.validateMessage}
                                            disabled={this.state.isUserBlocked} />
                                    }
                                </IntlMessages>
                            }
                        </div>
                        <div className="col-sm-3 col-md-3 col-lg-3 pl-0 pr-0">
                            <IntlMessages id="chat.send">
                                {(send) =>
                                    <Button
                                        value={send}
                                        onClick={this.sendMessage}
                                        disabled={this.state.isUserBlocked}
                                        type="submit"
                                    >
                                        {send}
                                    </Button>
                                }
                            </IntlMessages>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

//export default Chat;

export default ChatSidebar;
