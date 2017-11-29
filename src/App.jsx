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
    this.socket = null;
    this.sendMessage = this.sendMessage.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
  }
  // Handles sending a message
  sendMessage(content){
    const message = (typeof content === 'object') ? content :
      {
        id: this.state.messages.length + 1,
        username: this.state.currentUser.name || 'Anonymous',
        content
      };
    // returns a new array with the message
    const messages = this.state.messages.concat(message);
    this.socket.send(message.content);
    this.setState({ messages });
  }
  // handles changing the username
  changeUsername(event){
    const name = event.target.value;
    this.setState({
      currentUser: {name}
    });
  }
  // after mounting (read: rendering)
  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:8000');
  }
  render() {
    return (
    <section>
      <Nav />
      <Messages messages={ this.state.messages } />
      <ChatBar
        currentUser={this.state.currentUser.name}
        changeUsername={ this.changeUsername }
        sendMessage={ this.sendMessage }
      />
    </section>
    )
  }
}
export default App;
