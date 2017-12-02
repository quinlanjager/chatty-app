import React, { Component } from 'react';
import uuidv1 from 'uuid/v1';
import Nav from './Nav.jsx';
import Messages from './Messages.jsx';
import ChatBar from './ChatBar.jsx'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: {name: '', id: null}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      usersOnline: 0,
    }
    this.socket = null;
    this.sendMessage = this.sendMessage.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.postNotification = this.postNotification.bind(this);
  }

  // Handles sending a message to the server
  sendMessage(content){
    const message = {
      id: uuidv1(),
      type: 'MESSAGE',
      username: this.state.currentUser.name || 'Anonymous',
      content
    };
    this.socket.send(JSON.stringify(message));
  }

  // generic function for sending notification messages.
  postNotification(content){
    const notification = {
      id: uuidv1(),
      type: 'NOTIFICATION',
      username: this.state.currentUser.name,
      content
    }
    this.socket.send(JSON.stringify(notification));
  }

  // handles changing the username
  changeUsername(event){
    const name = event.target.value;
    if(name !== this.state.currentUser.name && name !== ''){
      const content = `${this.state.currentUser.name ? this.state.currentUser.name : 'Anonymous'} has changed their name to ${name}`
      this.setState({currentUser: {name, id: this.state.currentUser.id}}, () => {
        // send notification to server after state has updated.
        this.postNotification(content);
      });
    }
  }

  // after mounting (read: rendering)
  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:8000');
    this.socket.addEventListener('message', ({data}) => {
      const parsedData = JSON.parse(data);
      // update users online
      if(parsedData.type === 'USER_TALLY'){
        const {usersOnline} = parsedData;
        this.setState({usersOnline});
        return;
      }
      // set current user's id
      if(parsedData.type === 'ID_ASSIGN'){
        const {id} = parsedData;
        const currentUser = {
          name: this.state.currentUser.name,
          id: id,
        };
        this.setState({currentUser});
        return;
      }
      // handle chat messages
      const messages = this.state.messages.concat(parsedData);
      this.setState({ messages });
    });
  }

  render() {
    return (
    <section>
      <Nav usersOnline={this.state.usersOnline}/>
      <Messages messages={this.state.messages} />
      <ChatBar
        currentUser={this.state.currentUser.name}
        changeUsername={this.changeUsername}
        sendMessage={this.sendMessage}
      />
    </section>
    )
  }
}
export default App;
