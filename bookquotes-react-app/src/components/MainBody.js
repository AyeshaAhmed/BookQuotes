import React, { Component } from 'react';
import '../styles/MainBody.css';
import NavBar from './NavBar';

class MainBody extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }
    

    render() {
        return (
            <div className="main-body">
                <NavBar searchResults={this.props.searchResults}/>
            </div>
        );
    }
}

export default MainBody;