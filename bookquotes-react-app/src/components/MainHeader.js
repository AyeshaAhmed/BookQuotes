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
            isLoggedIn: false,
            apiUrl: this.props.apiUrl,
            user: '',
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
            });
    }

    handleUserId = (res) => {
        const isUser = res !== null && res !== undefined && res.length > 0 ? true : false;
        this.setState({ isLoggedIn: isUser, user: res });
        this.props.signInHandler(res);
    }

    render() {
        return (
            <header className="main-header">
                <img src={longLogo} className="bq-main-logo" alt="logo" />
                <QuoteSearch handleSearch={this.handleSearch} searchQuotes={this.searchQuotes} notification={this.state.helperText} />
                <div className="header-actions">
                    {this.state.isLoggedIn ? 
                    <NewQuoteChip apiUrl={this.props.apiUrl} userName={this.state.user}/> 
                    : 
                    <LoginChip apiUrl={this.props.apiUrl} handleUserId={this.handleUserId} />
                    }
                </div>
            </header>
        );
    }
}

export default MainHeader;