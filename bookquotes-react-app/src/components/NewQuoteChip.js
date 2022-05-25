import React from "react";
import { Chip } from '@mui/material';

const NewQuoteChip = (props) => {
    const handleClick = (e) => {console.log('click q');}
    return (
        <Chip label="New Quote" variant="outlined" onClick={handleClick} />
    );    
}

export default NewQuoteChip;