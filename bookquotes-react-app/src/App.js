import React, { Component } from 'react';
import './styles/App.css';
import MainHeader from './components/MainHeader';
import MainBody from './components/MainBody';

class App extends Component {
  render() {
    return (
      <div className="App">
        <MainHeader />
        <MainBody />
      </div>
    );
  }
}

export default App;
