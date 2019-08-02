import React from 'react';
import { Layout, Menu } from "antd";
import { Client as ChatClient } from 'twilio-chat';

import './Chat.css';
import './assets/ChatChannelSection.scss';

import ChatChannel from './ChatChannel';
import LoginPage from "./LoginPage";
import { ChannelsList } from "./ChannelsList";

const { Content, Sider, Header } = Layout;

class ChatApp extends React.Component {
  constructor(props) {
    super(props);

    const name = localStorage.getItem('name') || '';
    const loggedIn = name !== '';

    this.state = {
      name,
      loggedIn,
      token: null,
      statusString: null,
      chatReady: false,
      channels: [],
      selectedChannelSid: null,
      newMessage: ''
    };
    this.channelName = 'general';
  }

  componentWillMount = () => {
    if (this.state.loggedIn) {
      this.getToken();
      this.setState({statusString: 'Fetching credentials…'});
    }
  };

  logIn = (name) => {
    if (name !== '') {
      localStorage.setItem('name', name);
      this.setState({ name, loggedIn: true }, this.getToken);
    }
  };

  logOut = event => {
    if (event) {
      event.preventDefault();
    }
    this.setState({
      name: '',
      loggedIn: false,
      token: '',
      chatReady: false,
      messages: [],
      newMessage: '',
      channels: []
    });
    localStorage.removeItem('name');
    this.chatClient.shutdown();
    this.channel = null;
  };

  getToken = () => {
    fetch(`/token/${this.state.name}`, {
      method: 'POST'
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ token: data.token }, this.initChat);
      });
  };

  initChat = async () => {
    window.chatClient = ChatClient;
    this.chatClient = await ChatClient.create(this.state.token);
    this.setState({statusString: 'Connecting to Twilio…'});

    this.chatClient.on('connectionStateChanged', (state) => {
      if (state === 'connecting') this.setState({statusString: 'Connecting to Twilio…'});
      if (state === 'connected') { this.setState({statusString: 'You are connected.'}) }
      if (state === 'disconnecting') this.setState({statusString: 'Disconnecting from Twilio…', chatReady: false});
      if (state === 'disconnected') this.setState({statusString: 'Disconnected.', chatReady: false});
      if (state === 'denied') this.setState({statusString: 'Failed to connect.', chatReady: false});
    });
    this.chatClient.on('channelJoined', channel => {
      this.setState({channels: [...this.state.channels, channel]})
    });
    this.chatClient.on('channelLeft', thisChannel => {
      this.setState({channels: [...this.state.channels.filter(it => it !== thisChannel)]});
    })
  };

  messagesLoaded = messagePage => {
    this.setState({ messages: messagePage.items });
  };

    render() {
        const { channels, selectedChannelSid } = this.state;
        const selectedChannel = channels.find(it => it.sid === selectedChannelSid);

        let channelContent;
        if (selectedChannel) {
            channelContent = <ChatChannel channelProxy={selectedChannel} myIdentity={this.state.name}/>;
        } else {
            channelContent = <h4>{this.state.statusString}</h4>
        }

        if (this.state.loggedIn) {
            return (
                <div className="chat-window-wrapper">
                    <Layout className="chat-window-container">
                        <Sider
                            theme={"light"}
                            width={350}
                        >
                            <ChannelsList
                                channels={channels}
                                selectedChannelSid={selectedChannelSid}
                                onChannelClick={(item) => {
                                    this.setState({ selectedChannelSid: item.sid })
                                }}
                            />
                        </Sider>
                        <Content>
                            <Layout className="chat-channel-section">
                                <Header>
                                    <Menu
                                        theme="dark"
                                        mode="horizontal"
                                        style={{ lineHeight: '64px' }}
                                    >
                                        <Menu.Item
                                            key="1"
                                            onClick={() => this.logOut()}
                                        >
                                            Log Out
                                        </Menu.Item>
                                    </Menu>
                                </Header>
                                <Content
                                    style={{ backgroundColor: 'white' }}
                                >
                                    <div id="SelectedChannel">
                                        {channelContent}
                                    </div>
                                </Content>
                            </Layout>
                        </Content>
                    </Layout>
                </div>
            );
        }

        return <LoginPage onSubmit={this.logIn}/>
    }
}

export default ChatApp;
