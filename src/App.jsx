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
  // after mounting
  componentDidMount() {
    console.log('componentDidMount <App />');
    setTimeout(() => {
      console.log('Simulating incoming message');
      // Add a new message to the list of messages in the data store
      const newMessage = {id: 3, username: 'Michelle', content: 'Hello there!'};
      const messages = this.state.messages.concat(newMessage); // concat used because we can't directly change the state once it's been set.
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({messages: messages});
    }, 3000);
  }
}
export default App;
