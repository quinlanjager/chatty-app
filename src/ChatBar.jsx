import React, { Component } from 'react';

class ChatBar extends Component {
  constructor(props){
    super(props)
    this.handleMessageSending = this.handleMessageSending.bind(this);
  }

  // checks for enter press and blurs the element. Then focuses next sibiling.
  makeBlur(event){
    if(event.key === 'Enter'){
      event.target.blur();
      event.target.nextSibling.focus();
    }
  }

  handleMessageSending(event){
    if(event.key === 'Enter'){
      if(!event.target.value){
        return;
      }
      this.props.sendMessage(event.target.value);
      event.target.value = '';
    }
  }

  render () {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder="Your Name (Optional)" onKeyPress={ this.makeBlur } onBlur={ this.props.changeUsername } defaultValue={ this.props.currentUser } />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onChange={ this.handleChangeContent } onKeyPress={ this.handleMessageSending }/>
      </footer>
    );
  }
}

export default ChatBar;
