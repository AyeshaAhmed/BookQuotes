import React, { Component } from 'react';
import './styles/App.css';
import MainHeader from './components/MainHeader';
import MainBody from './components/MainBody';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiUrl: 'https://24owrfah24.execute-api.us-east-2.amazonaws.com/production/',
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
        <MainHeader apiUrl={this.state.apiUrl} parentCallback={this.handleCallback} signInHandler={this.handleSignIn}/>
        <MainBody apiUrl={this.state.apiUrl} searchResults={this.state.searchQuotes} userName={this.state.userId}/>
      </div>
    );
  }
}

export default App;
