import React from "react";

const QuoteTile = (id, text) => {
    return (
        <li key={id}>{text}</li>
    );    
}

export default QuoteTile;