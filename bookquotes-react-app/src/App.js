import React, { Component } from 'react';
import './styles/App.css';
import MainHeader from './components/MainHeader';
import MainBody from './components/MainBody';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuotes: [],
      userId: ''
    }
  }
  handleCallback = (headerSearchResult) => {
    this.setState({ searchQuotes: headerSearchResult });
  }
  handleSignIn = (userName) => {
    this.setState({ userId: userName });
  }
  render() {
    return (
      <div className="App">
        <MainHeader parentCallback={this.handleCallback} userName={this.state.userId} signInHandler={this.handleSignIn}/>
        <MainBody searchResults={this.state.searchQuotes} userName={this.state.userId}/>
      </div>
    );
  }
}

export default App;
