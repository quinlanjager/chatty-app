import React, { Component } from 'react';
import Nav from './Nav.jsx';
import Messages from './Messages.jsx';
import ChatBar from './ChatBar.jsx'

class App extends Component {
  render() {
    return (
    <section>
      <Nav />
      <Messages />
      <ChatBar />
    </section>
    )
  }
}
export default App;
