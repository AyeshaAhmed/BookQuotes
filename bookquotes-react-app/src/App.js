import React, { Component } from 'react';
import './styles/App.css';
import MainHeader from './components/MainHeader';
import MainBody from './components/MainBody';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuotes: [],
    }
  }
  handleCallback = (headerSearchResult) => {
    this.setState({ searchQuotes: headerSearchResult });
  }
  render() {
    return (
      <div className="App">
        <MainHeader parentCallback={this.handleCallback} />
        <MainBody searchResults={this.state.searchQuotes} />
      </div>
    );
  }
}

export default App;
