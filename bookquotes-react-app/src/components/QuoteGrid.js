import React from "react";
import { CSSGrid, measureItems, makeResponsive } from 'react-stonecutter';
import data from '../assets/DummyList.json';
import { Card, CardContent, Typography, CardActionArea } from "@mui/material";

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
                        <Card variant="outlined" key={datum.id}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography paragraph>
                                        {datum.text}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>

                        </Card>
                    </li>
                ))}
            </Grid>
        </div>
    );
}

export default QuoteGrid;