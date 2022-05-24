import React from "react";
import { CSSGrid, measureItems, makeResponsive } from 'react-stonecutter';

const QuoteGrid = (props) => {
    
    const Grid = makeResponsive(measureItems(CSSGrid), {
        maxWidth: 1920,
        minPadding: 100
    });

    return (
        <Grid
            className="quote-grid"
            component="ul"
            gutterWidth={5}
            gutterHeight={70}
            columnWidth={350}
            duration={800}
        >
            {props.gridItems}
        </Grid>
    );
}

export default QuoteGrid;