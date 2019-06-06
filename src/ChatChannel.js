import React, { Component } from 'react';
import './Chat.css';
import MessageBubble from './MessageBubble'

class ChatChannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
        newMessage: '',
        channelProxy: props.channelProxy,
        messages: [],
        loadingState: 'initializing',
        boundChannels: new Set()
    };
  }

  loadMessagesFor = (thisChannel) => {
    if (this.state.channelProxy === thisChannel) {
        thisChannel.getMessages()
            .then(messagePaginator => {
                if (this.state.channelProxy === thisChannel) {
                    console.log("Messages loaded!!!");
                    this.setState({ messages: messagePaginator.items, loadingState: 'ready' });
                }
            })
            .catch(err => {
                console.error("Couldn't fetch messages IMPLEMENT RETRY", err);
                this.setState({ loadingState: "failed" });
            });
    }
  };

  componentDidMount = () => {
      if (this.state.channelProxy) {
        this.loadMessagesFor(this.state.channelProxy);

        if (!this.state.boundChannels.has(this.state.channelProxy)) {
            let newChannel = this.state.channelProxy;
            newChannel.on('messageAdded', m => this.messageAdded(m, newChannel));
            this.setState({boundChannels: new Set([...this.state.boundChannels, newChannel])});
        }
      }
  }

  componentDidUpdate = (oldProps, oldState) => {
    if (this.state.channelProxy !== oldState.channelProxy) {
        this.loadMessagesFor(this.state.channelProxy);

        if (!this.state.boundChannels.has(this.state.channelProxy)) {
            let newChannel = this.state.channelProxy;
            newChannel.on('messageAdded', m => this.messageAdded(m, newChannel));
            this.setState({boundChannels: new Set([...this.state.boundChannels, newChannel])});
        }
    }
  }

  static getDerivedStateFromProps(newProps, oldState) {
    let logic = (oldState.loadingState === 'initializing') || oldState.channelProxy !== newProps.channelProxy;
    console.log("xxx", oldState.channelProxy, newProps.channelProxy, logic);
    if (logic) {
      return { loadingState: 'loading messages', channelProxy: newProps.channelProxy };
    } else {
      return null;
    }
  }

  messageAdded = (message, targetChannel) => {
    if (targetChannel === this.state.channelProxy)
        this.setState((prevState, props) => ({
            messages: [...prevState.messages, message]
        }));
  };

  onMessageChanged = event => {
    this.setState({ newMessage: event.target.value });
  };

  sendMessage = event => {
    event.preventDefault();
    const message = this.state.newMessage;
    this.setState({ newMessage: '' });
    this.state.channelProxy.sendMessage(message);
  };
  
  render = () => {
    return (
        <div id="OpenChannel">
            <ul id="messages">
                { this.state.messages.map(m => {
                    if (m.author === this.props.myIdentity)
                        return <MessageBubble key={m.index} direction="outgoing" message={m} />
                    else
                        return <MessageBubble key={m.index} direction="incoming" message={m} />
                  })
                }
            </ul>
            <form onSubmit={this.sendMessage}>
                <label htmlFor="message">Message: </label>
                <input
                    type="text"
                    name="message"
                    id="message"
                    disabled={this.state.loadingState !== 'ready'}
                    onChange={this.onMessageChanged}
                    value={this.state.newMessage}
                />
                <button>Send</button>
            </form>
        </div>
    );
  }
}

export default ChatChannel;