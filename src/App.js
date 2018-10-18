import React, { Component } from 'react';
import ChatApp from './ChatApp';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { numberInstructionClass: 'hidden'}
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1 onClick={() => this.setState(() => ({numberInstructionClass: ''}))}>Omnichannel Group Chat</h1>
          <h2 className={this.state.numberInstructionClass}>Send a text to +1 (415) 853-1089</h2>
        </header>
        <ChatApp />
      </div>
    );
  }
}

export default App;
