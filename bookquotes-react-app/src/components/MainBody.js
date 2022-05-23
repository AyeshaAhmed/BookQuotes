import React, { Component } from 'react';
import '../styles/MainBody.css';
import NavBar from './NavBar';
import QuoteGrid from './QuoteGrid';

class MainBody extends Component {
    render() {
        return (
            <div className="main-body">
                <NavBar />
                <QuoteGrid />
            </div>
        );
    }
}

export default MainBody;