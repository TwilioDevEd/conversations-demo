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
          <h1>The Sessions Chat Demo</h1>
        </header>
        <ChatApp />
      </div>
    );
  }
}

export default App;
