import React from 'react';
import NameBox from './NameBox.js';
import {Client as ChatClient} from 'twilio-chat';
import ChatChannel from './ChatChannel';
import './Chat.css';
import { BrowserRouter as Router, NavLink, Route, Redirect } from 'react-router-dom';

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

  onNameChanged = event => {
    this.setState({ name: event.target.value });
  };

  logIn = event => {
    event.preventDefault();
    if (this.state.name !== '') {
      localStorage.setItem('name', this.state.name);
      this.setState({ loggedIn: true }, this.getToken);
    }
  };

  logOut = event => {
    event.preventDefault();
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
        <div id="ChatWindow" className="container">
          <div>
            <Router>
              <div className="row">
                <div id="Channels" className="col-sm-4">
                  <h3>Open Conversations</h3>
                  { this.state.channels.map(channel => (
                        <NavLink key={channel.sid}
                                 to={`/channels/${channel.sid}`}
                                 className="list-group-item list-group-item-action"
                                 activeClassName="active">
                          {channel.sid}
                        </NavLink>
                  ))}
                </div>
              
                <div id="SelectedChannel" className="col-lg">
                  <Route path="/channels/:selected_channel" render={({match}) => {
                    let selectedChannelSid = match.params.selected_channel;
                    let selectedChannel = this.state.channels.find(it => it.sid === selectedChannelSid);
                    if (selectedChannel)
                      return (
                        <ChatChannel channelProxy={selectedChannel} 
                                    myIdentity={this.state.name} />
                      );
                    else
                      return (
                        <Redirect to="/channels" />
                      )
                  }} />

                  <Route exact path="/" render={(match) => <h4>{this.state.statusString}</h4> } />
                </div>
              </div>
            </Router>
          </div>
          <br /><br />
          <form onSubmit={this.logOut}>
          <button>Log out</button>
          </form>
        </div>
      );
    } else {
      loginOrChat = (
        <div>
          <NameBox
            name={this.state.name}
            onNameChanged={this.onNameChanged}
            logIn={this.logIn}
          />
        </div>
      );
    }

    return (
      <div>
        {loginOrChat}
      </div>
    );
  }
}

export default ChatApp;
