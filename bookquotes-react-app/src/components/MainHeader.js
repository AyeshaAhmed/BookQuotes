import React, { Component } from 'react';
import longLogo from '../assets/BookQuotesLong.PNG';
import '../styles/MainHeader.css';
import QuoteSearch from './QuoteSearch';

class MainHeader extends Component {
    render() {
        return (
            <header className="main-header">
                <img src={longLogo} className="bq-main-logo" alt="logo" />
                <QuoteSearch />
            </header>
        );
    }
}

export default MainHeader;