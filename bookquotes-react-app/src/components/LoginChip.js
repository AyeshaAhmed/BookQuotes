import React from "react";
import { Chip, Box, Typography, Modal, TextField, Button } from '@mui/material';
import request from 'superagent';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    // height: '50%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const LoginChip = (props) => {
    const isUser = props.userName !== null && props.userName !== undefined && props.userName.length > 0;
    const chipText = isUser ? props.userName : 'Sign In';

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [userId, setUserId] = React.useState('');
    const [userIdErr, setUserIdErr] = React.useState('');
    const [passphrase, setPassphrase] = React.useState('');
    const [passphraseErr, setPassphraseErr] = React.useState('');
    const [loginMessage, setMessage] = React.useState('');
    const handleUserName = (e) => {
        const reg = /^([^($!@%#^&*)(+=|}{}?><,.:;"'~`_\]\[\-)]*)$/;
        if (reg.test(e.target.value)) {
            this.setState({ ...this.state.userInput, username: e.currentTarget.value })
        } else {
            setUserId(e.target.value);
        }
    }
    const handlePassword = (e) => {
        setPassphrase(e.target.value);
    }
    const handleLogin = (e) => {
        e.preventDefault();
        // props.handleUserId();
    }

    const callQuotesAPI = (userName) => {
        request
            .get("https://7cdlx16y58.execute-api.us-east-2.amazonaws.com/prod/quotes")
            .query(userName !== null ? { userId: userName } : null)
            .set('content-type', 'application/json')
            .then((res) => {
                if (userName !== null) {
                    // setUserData(res.body.quotes);
                } else {
                    // setRecentData(res.body.quotes);
                }
            });
    }

    return (
        <div>
            <Chip label={chipText} variant="outlined" onClick={handleOpen} gutterBottom />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Please sign in below.
                    </Typography>
                    <span>&nbsp;</span>
                    <TextField
                        id="outlined-basic-userName"
                        variant="outlined"
                        fullWidth
                        label="Username"
                        onChange={handleUserName}
                        helperText={'No special charaters.'}
                    />
                    <span>&nbsp;</span>
                    <TextField
                        id="outlined-basic-passphrase"
                        variant="outlined"
                        fullWidth
                        label="Passcode"
                        onChange={handlePassword}
                        helperText={'No special charaters.'}
                    />
                    <div><span>&nbsp;</span></div>
                    <Button onClick={handleLogin} variant="contained">Login/Sign Up</Button>
                    <div><span>&nbsp;</span></div>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} >
                        {loginMessage}
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}

export default LoginChip;