import React, { Component } from 'react';

class Message extends Component {
  render(){
    const { type, style } = this.props;
    return (
      // Check if it is a user message.
      <div className="message">
        { type === 'message-content'
        && <span className="message-username" style={style}>{ this.props.username }</span>}
        <span className={type}>{ this.props.content }</span>
      </div>
    );
  }
}

export default Message;
