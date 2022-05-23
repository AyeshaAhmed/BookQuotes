import React from "react";
import { CSSGrid, measureItems, makeResponsive } from 'react-stonecutter';
import data from '../assets/DummyList.json';

const Grid = makeResponsive(measureItems(CSSGrid), {
    maxWidth: 1920,
    minPadding: 100
});

const QuoteGrid = () => {

    return (
        <div className="grid-area">
            <Grid
                className="quote-grid"
                component="ul"
                gutterWidth={5}
                gutterHeight={5}
                columnWidth={300}
                duration={800}
            >
                {data.map((datum) => (
                    <li className="grid-item" key={datum.id}>
                        <button className="item-btn" key={datum.id}>
                            {datum.text}
                        </button>
                    </li>

                ))}
            </Grid>
        </div>
    );
}

export default QuoteGrid;