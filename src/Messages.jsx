import React, { Component } from 'react';
import Message from './Message.jsx';


class Messages extends Component {
  render () {
    const allMessages = this.props.messages.map((message) => {
      const type = message.type === 'NOTIFICATION' ? 'message-system' : 'message-content';
      return (<Message
        key={ message.id }
        username={ message.username }
        content={ message.content }
        type={type}
        style={message.style}
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
