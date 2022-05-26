import React from "react";
import { Chip, Box, Typography, Modal, TextField, Button } from '@mui/material';
import request from 'superagent';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    // height: '50%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const NewQuoteChip = (props) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
        setQuoteText('');
        setQuoteErr(false);
        setTagText('');
        setTagErr(false);
        setSearchText('');
        setShowList(false);
        setResultData([]);
        setSelectedIndex('0');
        setIsBookSelected(false);
        setSelectedBook(null);
        setSubmitMessage('');
    };
    const handleClose = () => setOpen(false);

    const [quoteText, setQuoteText] = React.useState('');
    const [isQuoteErr, setQuoteErr] = React.useState(false);
    const handleQuoteText = (e) => {
        const reg = /^[a-zA-Z0-9 !#$%&)(,._\-?:]{3,1000}$/g;
        if (!reg.test(e.target.value)) {
            setQuoteErr(true);
        } else {
            setQuoteErr(false);
            setQuoteText(e.target.value);
        }
    }

    const [tagText, setTagText] = React.useState('');
    const [isTagErr, setTagErr] = React.useState(false);
    const handleTagText = (e) => {
        const reg = /^[a-zA-Z0-9 !#$%&)(,._\-?:]{3,30}$/g;
        if (!reg.test(e.target.value)) {
            setTagErr(true);
        } else {
            setTagErr(false);
            setTagText(e.target.value);
        }
    }

    const [searchText, setSearchText] = React.useState('');
    const handleSearchText = (e) => {
        setSearchText(e.target.value);
    }

    const [showList, setShowList] = React.useState(false);
    const [resultData, setResultData] = React.useState([]);
    const searchQuotes = (e) => {
        e.preventDefault();
        request
            .get("https://www.googleapis.com/books/v1/volumes")
            .query({ q: 'intitle:' + searchText })
            .then((res) => {
                console.log(res);
                setResultData(res.body.items);
                setShowList(true);
            });
    }

    const [selectedIndex, setSelectedIndex] = React.useState('0');
    const [isBookSelected, setIsBookSelected] = React.useState(false);
    const [selectedBook, setSelectedBook] = React.useState(null);
    const handleBookSelect = (event, book) => {
        // console.log(book.volumeInfo.title);
        setSelectedIndex(book.id);
        setSelectedBook(book);
        setIsBookSelected(true);
    }

    let resultList = resultData.map((item) => (
        <ListItem key={item.id} component="div" disablePadding>
            <ListItemButton onClick={(event) => handleBookSelect(event, item)} selected={selectedIndex === item.id}>
                <ListItemText primary={item.volumeInfo.title} />
            </ListItemButton>
        </ListItem>
    ));

    const [submitMessage, setSubmitMessage] = React.useState('');
    const handleSubmitQuote = () => {
        if (quoteText.length < 3 || tagText.length < 3) {
            setSubmitMessage('Please enter more quote and tag text then submit again');
        } else {
            setSubmitMessage('');
            callQuoteApi();
        }
    }

    const callQuoteApi = () => {
        let bookAuthors = '';
        let numAuthors = selectedBook.volumeInfo.authors.length;
        selectedBook.volumeInfo.authors.forEach(author => {
            numAuthors--;
            bookAuthors = bookAuthors + author + (numAuthors > 0 ? ', ' : '');
        });
        request
            .post(props.apiUrl + "quote")
            .send({
                userId: props.userName,
                quoteText: quoteText,
                tags: tagText,
                postId: '',
                createdDate: '',
                numBookmarks: 0,
                bookName: selectedBook.volumeInfo.title,
                bookData: selectedBook.volumeInfo.previewLink,
                authorName: bookAuthors,
                authorData: 'https://www.google.com/search?tbm=bks&q=inauthor:' + bookAuthors
            })
            .set('content-type', 'application/json')
            .then((res) => {
                setSubmitMessage(res.body.Item.postId ? 'Quote Submited!' : 'Please try again');
            });
    }

    return (
        <div>
            <Chip label="New Quote" variant="outlined" onClick={handleOpen} />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create a New Quote!
                    </Typography>
                    <span>&nbsp;</span>
                    <TextField
                        id="outlined-multi-text"
                        placeholder="Placeholder"
                        multiline
                        fullWidth
                        label="Quote Text"
                        error={isQuoteErr}
                        onChange={handleQuoteText}
                        helperText={'Some special charaters are not allowed.'}
                    />
                    <span>&nbsp;</span>
                    <TextField
                        id="outlined-basic-tag"
                        variant="outlined"
                        fullWidth
                        label="#Hashtags"
                        error={isTagErr}
                        onChange={handleTagText}
                        helperText={'Some special charaters are not allowed.'}
                    />
                    <span>&nbsp;</span>
                    <form onSubmit={searchQuotes} action="">
                        <TextField
                            id="outlined-basic-book-search"
                            variant="outlined"
                            fullWidth
                            label="Search for a book..."
                            type="search"
                            onChange={handleSearchText}
                        />
                    </form>
                    {showList &&
                        <List sx={{
                            width: '100%',
                            maxWidth: 550,
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: 100
                        }}
                        >
                            {resultList}
                        </List>
                    }
                    <div><span>&nbsp;</span></div>
                    <Button onClick={handleSubmitQuote} disabled={isQuoteErr || isTagErr || !isBookSelected} variant="contained">Submit Quote</Button>
                    <div><span>&nbsp;</span></div>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} >
                        {submitMessage}
                    </Typography>
                </Box>
            </Modal>
        </div>

    );
}

export default NewQuoteChip;