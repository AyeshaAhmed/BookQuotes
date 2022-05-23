import React from "react";
import TextField from "@mui/material/TextField";

const QuoteSearch = () => {
    return (
        <div className="quote-search-area">
            <form action="">
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    fullWidth
                    label="Search for a quote or hashtag..."
                    // onChange={props}
                />
            </form>
        </div>
    );
}

export default QuoteSearch;