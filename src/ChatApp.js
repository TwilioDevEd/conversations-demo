import React from 'react';
import {Client as ChatClient} from 'twilio-chat';
import ChatChannel from './ChatChannel';
import './Chat.css';
import { BrowserRouter as Router, NavLink, Route, Redirect } from 'react-router-dom';
import LoginPage from "./LoginPage";
import {Layout, List, Menu} from "antd";
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
      selectedChannel: null,
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
    var loginOrChat;

    if (this.state.loggedIn) {
      loginOrChat = (
          <div id="ChatWindow" className="container" style={{height: "100%"}}>
            <Router>
              <Layout style={{height: "100%"}}>
                <Content>
                  <Layout style={{height: "100%", background: "#fefefe"}}>
                    <Sider
                        theme={"light"}
                        width={350}
                    >
                      <List
                          bordered={true}
                          style={{height: "100%"}}
                          loading={this.state.channels.length === 0}
                          header={"Open Conversations"}
                          dataSource={this.state.channels}
                          renderItem={item => {
                            return (
                              <List.Item key={item.sid}>
                                <NavLink to={`/channels/${item.sid}`}>{item.sid}</NavLink>
                              </List.Item>
                            );
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
                            <Route path="/channels/:selected_channel"
                                   render={({match}) => {
                                     let selectedChannelSid = match.params.selected_channel;
                                     let selectedChannel = this.state.channels.find(
                                         it => it.sid === selectedChannelSid);
                                     if (selectedChannel) {
                                       return (
                                           <ChatChannel channelProxy={selectedChannel}
                                                        myIdentity={this.state.name}/>
                                       );
                                     } else {
                                       return (
                                           <Redirect to="/channels"/>
                                       )
                                     }
                                   }}/>

                            <Route exact path="/" render={(match) =>
                                <h4>{this.state.statusString}</h4>}/>
                          </div>
                        </Content>
                      </Layout>
                    </Content>
                  </Layout>
                </Content>
              </Layout>
            </Router>
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
