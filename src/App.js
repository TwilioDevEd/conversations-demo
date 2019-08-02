import React, { Component } from 'react';
import ChatApp from './ChatApp';
import './assets/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return <ChatApp />
  }
}

export default App;
