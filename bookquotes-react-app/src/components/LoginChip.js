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

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {setOpen(true); setMessage('')};
    const handleClose = () => setOpen(false);
    const [userId, setUserId] = React.useState('');
    const [userIdErr, setUserIdErr] = React.useState(false);
    const [loginMessage, setMessage] = React.useState('');
    
    const handleUserName = (e) => {
        const reg = /^[a-z0-9]+$/i;
        if (!reg.test(e.target.value)) {
            setUserIdErr(true);
        } else {
            setUserIdErr(false);
            setUserId(e.target.value);
        }
    }
    
    const handleLogin = (e) => {
        e.preventDefault();
        callUserAPI(userId);
    }

    const callUserAPI = (userName) => {
        request
            .get(props.apiUrl + "user")
            .query({ userId: userName })
            .set('content-type', 'application/json')
            .then((res) => {
                setMessage(res.body.newUser ? 'Howdy new user!' : 'Welcome back pal!');
                props.handleUserId(res.body.userId);
            });
    }

    return (
        <div>
            <Chip label={'Sign In'} variant="outlined" onClick={handleOpen} />
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
                        error={userIdErr}
                        onChange={handleUserName}
                        helperText={'No special charaters.'}
                    />
                    <div><span>&nbsp;</span></div>
                    <Button onClick={handleLogin} disabled={userIdErr} variant="contained">Login / Sign Up</Button>
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