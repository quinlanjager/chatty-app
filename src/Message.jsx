import React, { Component } from 'react';

class Message extends Component {
  render(){
    const { style, file, content, time_posted, username} = this.props.message;
    return (
      // Check if it is a user message, notification, or file.
      <div className="message">
        { this.props.type === 'message-content' && <span className="message-username" style={style}>{ username }</span>}
        { file
          ? <img className='message-image' src={content} />
          : <span className={this.props.type}>{content}</span>}
      </div>
    );
  }
}

export default Message;
