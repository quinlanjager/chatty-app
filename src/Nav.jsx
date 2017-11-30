import React, {Component} from 'react';

class Nav extends Component {
  render(){
   return(
     <nav className="navbar">
      <a href="/" className="navbar-brand">Chatty</a>
      <p className='navbar-users-online'>{this.props.usersOnline} users online</p>
    </nav>
  	);
  }
}

export default Nav;
