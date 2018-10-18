import React, { Component } from 'react';
import ChatApp from './ChatApp';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <h1>Twilio Messaging Sessions!</h1>
        </header>
        <ChatApp />
      </div>
    );
  }
}

export default App;
