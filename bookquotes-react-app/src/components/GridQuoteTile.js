import React from "react";
import { Card, CardContent, Typography, CardActionArea, CardActions, IconButton, ImageListItem } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const GridQuoteTile = (props) => {
    const quote = props.quoteData;
    return (
        <ImageListItem className="grid-item">
            <Card variant="outlined" className="quote-info">
                <CardActionArea>
                    <CardContent className="grid-text">
                        <Typography gutterBottom>{quote.quoteText}</Typography>
                        <Typography sx={{ fontSize: 10 }} color="text.secondary">
                            Tags: {quote.tags}
                            <br />
                            Book: {quote.bookName}
                            <br />
                            Author: {quote.authorName}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions className="grid-like" position="bottom" actionposition="right">
                    <IconButton
                        size="small"
                        sx={{ color: 'gray' }}
                        aria-label={`star ${quote.postId}`}
                    >
                        <FavoriteBorderIcon sx={{ height: 20, width: 20 }} />
                    </IconButton>
                </CardActions>
            </Card>
        </ImageListItem>
    );
}

export default GridQuoteTile;