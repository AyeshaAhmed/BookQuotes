import React from "react";
import { Card, CardContent, Typography, CardActionArea, CardActions, IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';

const GridQuoteTile = (props) => {

    return (
        <Card variant="outlined" key={props.quoteData.postId} className="quote-info">
            <CardActionArea>
                <CardContent className="grid-text">
                    <Typography gutterBottom>
                        {props.quoteData.quoteText}
                    </Typography>
                    <Typography sx={{ fontSize: 10 }} color="text.secondary">
                        Tags: {props.quoteData.tags}<br />
                        Book: {props.quoteData.bookName}<br />
                        Author: {props.quoteData.authorName}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions className="grid-like">
                <IconButton aria-label="add to favorites" size="small">
                    <FavoriteIcon sx={{ height: 20, width: 20 }} />
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default GridQuoteTile;