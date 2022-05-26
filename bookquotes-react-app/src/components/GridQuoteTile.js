import React from "react";
import { Card, CardContent, Typography, CardActionArea, CardActions, IconButton, ImageListItem, Link } from "@mui/material";
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
                            <Link href={quote.bookData} target="_blank">Book: {quote.bookName}</Link>
                            <br />
                            <Link href={quote.authorData} target="_blank">Author: {quote.authorName}</Link>
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions className="grid-like" position="bottom" actionposition="right">
                    <form onClick={props.isMarked ? (e) => {e.preventDefault(); props.handleRemoveBookmark(quote.postId);} 
                    : (e) => {e.preventDefault(); props.handleAddBookmark(quote.postId);}} action="">
                        <IconButton
                            size="small"
                            sx={{ color: 'gray' }}
                            aria-label={`star ${quote.postId}`}
                        >
                            <FavoriteBorderIcon sx={{ height: 20, width: 20 }} />
                        </IconButton>
                    </form>
                </CardActions>
            </Card>
        </ImageListItem>
    );
}

export default GridQuoteTile;