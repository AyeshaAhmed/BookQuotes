import React from "react";
import TextField from "@mui/material/TextField";

const QuoteSearch = (props) => {
    return (
        <div className="quote-search-area">
            <form onSubmit={props.searchQuotes} action="">
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    fullWidth
                    label="Search for a quote or hashtag..."
                    onChange={props.handleSearch}
                    helperText={props.notification}
                />
            </form>
        </div>
    );
}

export default QuoteSearch;