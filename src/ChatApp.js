import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout, List, Menu, Typography } from "antd";
import {Client as ChatClient} from 'twilio-chat';
import ChatChannel from './ChatChannel';
import chatChannelsItemStyles from './ChatChannelsItem.module.scss';
import './Chat.css';
import LoginPage from "./LoginPage";
import { joinClassNames } from "./utils/class-name";

const { Content, Sider, Header } = Layout;
const { Text } = Typography;

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
      localStorage.setItem('name', this.state.name);
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
    let loginOrChat;
    const { channels, selectedChannelSid } = this.state;
    const selectedChannel = channels.find(it => it.sid === selectedChannelSid);

    let channelContent;
    if (selectedChannel) {
      channelContent = <ChatChannel channelProxy={selectedChannel} myIdentity={this.state.name}/>;
    } else {
      channelContent = <h4>{this.state.statusString}</h4>
    }

    if (this.state.loggedIn) {
      loginOrChat = (
          <div id="ChatWindow" className="container" style={{height: "100%"}}>
            <Layout style={{height: "100%"}}>
              <Content>
                <Layout style={{height: "100%", background: "#fefefe"}}>
                  <Sider
                      theme={"light"}
                      width={350}
                  >
                    <List
                        bordered={true}
                        style={{ height: "100%" }}
                        loading={this.state.channels.length === 0}
                        header={"Open Conversations"}
                        dataSource={this.state.channels}
                        renderItem={item => {
                            const activeChannel = item.sid === selectedChannelSid;
                            const channelItemClassName = joinClassNames([
                                chatChannelsItemStyles['channel-item'],
                              activeChannel && chatChannelsItemStyles['channel-item--active']
                            ]);

                            return (
                                <List.Item
                                    key={item.sid}
                                    onClick={() => this.setState({ selectedChannelSid: item.sid })}
                                    className={channelItemClassName}
                                >
                                    <Text
                                        strong
                                        className={chatChannelsItemStyles['channel-item-text']}
                                    >
                                        {item.friendlyName}
                                    </Text>
                                </List.Item>
                            )
                        }}
                    />
                  </Sider>
                  <Content>
                    <Layout style={{height: "100%"}}>
                      <Header>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            style={{ lineHeight: '64px' }}
                        >
                          <Menu.Item key="1"
                                     onClick={() => this.logOut()}
                          >
                            Log Out
                          </Menu.Item>
                        </Menu>
                      </Header>
                      <Content>
                        <div id="SelectedChannel">
                          {channelContent}
                        </div>
                      </Content>
                    </Layout>
                  </Content>
                </Layout>
              </Content>
            </Layout>
          </div>
      );
    } else {
      loginOrChat = <LoginPage onSubmit={this.logIn}/>
    }

    return (
      <div style={{height: "100%"}}>
        {loginOrChat}
      </div>
    );
  }
}

export default ChatApp;
