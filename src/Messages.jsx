import React, { Component } from 'react';
import Message from './Message.jsx';


class Messages extends Component {
  render () {
    return(
      <main className="messages">
        <Message />
      </main>
    );
  }
};

export default Messages;
