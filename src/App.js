import React, { Component } from 'react';
import ConversationsApp from './ConversationsApp';
import './assets/App.css';
import 'antd/dist/antd.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return <ConversationsApp />
  }
}

export default App;
