import React, { Component } from 'react';
import Nav from './Nav.jsx';
import Messages from './Messages.jsx';
import ChatBar from './ChatBar.jsx'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: {name: 'Bob'}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        {
          id:1,
          username: 'Bob',
          content: 'Has anyone seen my marbles?',
        },
        {
          id:2,
          username: 'Anonymous',
          content: 'No, I think you lost them. You lost your marbles Bob. You lost them for good.'
        }
      ]
    }
  }
  render() {
    return (
    <section>
      <Nav />
      <Messages messages={ this.state.messages }/>
      <ChatBar currentUser = { this.state.currentUser }/>
    </section>
    )
  }
}
export default App;
