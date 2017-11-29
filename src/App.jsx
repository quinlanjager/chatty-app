import React, { Component } from 'react';
import uuidv1 from 'uuid/v1';
import Nav from './Nav.jsx';
import Messages from './Messages.jsx';
import ChatBar from './ChatBar.jsx'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: {name: 'Bob'}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    }
    this.socket = null;
    this.sendMessage = this.sendMessage.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
  }

  // Handles sending a message to the server
  sendMessage(content){
    const message = (typeof content === 'object') ? content :
      {
        id: uuidv1(),
        username: this.state.currentUser.name || 'Anonymous',
        content
      };
    this.socket.send(JSON.stringify(message));
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
    this.socket.addEventListener('message', (event) => {
      const { data } = event;
      const messages = this.state.messages.concat(JSON.parse(data));
      this.setState({ messages });
    });
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
