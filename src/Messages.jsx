import React, { Component } from 'react';
import Message from './Message.jsx';


class Messages extends Component {
  render () {
    const allMessages = this.props.messages.map((message) => {
      const type = message.type === 'NOTIFICATION' ? 'message-system' : 'message-content';
      return (<Message
        key={message.id}
        message={message}
        type={type}
      />);
    });
    return(
      <main className="messages">
        { allMessages }
      </main>
    );
  }
};

export default Messages;
