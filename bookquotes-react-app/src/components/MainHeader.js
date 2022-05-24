import React, { Component } from 'react';
import longLogo from '../assets/BookQuotesLong.PNG';
import '../styles/MainHeader.css';
import QuoteSearch from './QuoteSearch';
const Typesense = require('typesense');

class MainHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quotes: [],
            searchField: '',
            helperText: ''
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
                this.setState({ helperText: data.hits.length + " search results found" })
                this.props.parentCallback(data.hits);
            })
    }

    render() {
        return (
            <header className="main-header">
                <img src={longLogo} className="bq-main-logo" alt="logo" />
                <QuoteSearch handleSearch={this.handleSearch} searchQuotes={this.searchQuotes} notification={this.state.helperText} />
            </header>
        );
    }
}

export default MainHeader;