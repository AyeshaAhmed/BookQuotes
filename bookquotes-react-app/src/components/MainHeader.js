import React, { Component } from 'react';
import longLogo from '../assets/BookQuotesLong.PNG';
import '../styles/MainHeader.css';
import QuoteSearch from './QuoteSearch';
import NewQuoteChip from './NewQuoteChip';
import LoginChip from './LoginChip';

const Typesense = require('typesense');

class MainHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchField: '',
            helperText: '',
            loginId: this.props.userName,
            isLoggedIn: false
        }
    }

    client = new Typesense.Client({
        'nodes': [{
            'host': 'sulxzkojgi4ecawdp-1.a1.typesense.net',
            'port': '443',
            'protocol': 'https'
        }],
        'apiKey': 'qc8GUCEwZufBdjA8ntja4VIJy8WnUUR3',
        'connectionTimeoutSeconds': 2
    });

    handleSearch = (e) => {
        this.setState({ searchField: e.target.value, helperText: '' })
    }

    searchQuotes = (e) => {
        e.preventDefault();
        this.client.collections('quotes').documents()
            .search({ 'q': this.state.searchField, 'query_by': 'quoteText,tags,authorName,bookName' })
            .then(data => {
                let tempList = [];
                this.setState({ helperText: data.hits.length + " search results found" })
                data.hits.map((hit) => (tempList = [...tempList, hit.document]));
                this.props.parentCallback(tempList);
            })
    }

    handleUserId = (e) => {
        e.preventDefault();
        const res = e.target.value;
        let isUser = res !== null && res !== undefined && res.length > 0 ? true : false;
        console.log(res);
        this.setState({ loginId: res, isLoggedIn: isUser });
        this.props.signInHandler(res);
    }

    render() {
        return (
            <header className="main-header">
                <img src={longLogo} className="bq-main-logo" alt="logo" />
                <QuoteSearch handleSearch={this.handleSearch} searchQuotes={this.searchQuotes} notification={this.state.helperText} />
                {this.state.isLoggedIn ?
                    <div className="header-actions">
                        <NewQuoteChip userName={this.state.loginId}/>
                        <LoginChip handleLogin={this.handleUserId} userName={this.state.loginId}/>
                    </div>
                    :
                    <div className="header-actions">
                        <LoginChip handleLogin={this.handleUserId} userName={this.state.loginId}/>
                    </div>
                }
            </header>
        );
    }
}

export default MainHeader;