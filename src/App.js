import React, { Component } from 'react';
import ChatApp from './ChatApp';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>The Ajťák Personal Shopping Studio</h1>
          <h2>Powered by Twilio Conversations</h2>
        </header>
        <ChatApp />
      </div>
    );
  }
}

export default App;
