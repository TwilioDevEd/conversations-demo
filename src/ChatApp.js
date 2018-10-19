import React from 'react';
import NameBox from './NameBox.js';
import Chat from '@twilio/twilio-chat';
import ChatChannel from './ChatChannel';
import './Chat.css';
import { BrowserRouter as Router, NavLink, Route } from 'react-router-dom';

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
      newMessage: ''
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

  initChat = () => {
    this.chatClient = new Chat(this.state.token, {logLevel: "info"});
    this.setState({statusString: 'Connecting to Twilio…'});
    this.chatClient.initialize().then(() => {console.log("Initialized."); this.clientInitiated()});
  };

  clientInitiated = () => {
    console.log("Initiated!");
    this.setState({ statusString: 'Loading Conversations…', chatReady: true }, () => {
      console.log("State changed!");
      this.chatClient.on('channelJoined', channel => {
          console.log("Channel joined!!!!");
          this.setState({channels: [...this.state.channels, channel]})});
      this.chatClient.getSubscribedChannels()
        .then((channel_paginator) => {
          this.setState({ channels: channel_paginator.items, statusString: `Welcome, ${this.state.name}!`});
        })
        .catch("While fetching channels…", console.error);
    });
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
                <div id="Channels" className="col-sm">
                  <h3>Open Sessions</h3>
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
                    console.log(this.state.channels.find(it => it.sid === selectedChannelSid));
                    return (
                      <ChatChannel channelProxy={this.state.channels.find(it => it.sid === selectedChannelSid)} 
                                   myIdentity={this.state.name} />
                    );
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
